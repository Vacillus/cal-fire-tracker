'use client';

import { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css';

interface CalFireMapProps {
  onFireSelect?: (fireData: any) => void;
}

export default function CalFireMap({ onFireSelect }: CalFireMapProps) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: 'topo-vector'
    });

    const mapView = new MapView({
      container: mapDiv.current,
      map: map,
      center: [-119.4179, 36.7783], // California center
      zoom: 6,
      ui: {
        components: ['zoom', 'compass', 'attribution']
      },
      constraints: {
        minZoom: 5,
        maxZoom: 18,
        rotationEnabled: false
      },
      navigation: {
        mouseWheelZoomEnabled: true,
        browserTouchPanEnabled: true
      }
    });

    // California counties layer
    const countiesLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0',
      definitionExpression: "STATE_NAME = 'California'",
      outFields: ['*'],
      popupTemplate: {
        title: '{NAME} County',
        content: 'Click to view fire information'
      },
      renderer: {
        type: 'simple',
        symbol: new SimpleFillSymbol({
          color: [255, 255, 255, 0.1],
          outline: new SimpleLineSymbol({
            color: [50, 50, 50, 0.5],
            width: 1
          })
        })
      } as any
    });

    // CAL FIRE active fires layer
    const firePerimeterLayer = new FeatureLayer({
      url: 'https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/California_Fire_Perimeters_all/FeatureServer/0',
      outFields: ['*'],
      definitionExpression: "YEAR_ >= 2024",
      renderer: {
        type: 'simple',
        symbol: new SimpleFillSymbol({
          color: [255, 0, 0, 0.3],
          outline: new SimpleLineSymbol({
            color: [255, 0, 0, 0.8],
            width: 2,
            style: 'solid'
          })
        })
      } as any,
      opacity: 0.7
    });

    // Highlight layer for selected features
    const highlightLayer = new GraphicsLayer();

    map.add(countiesLayer);
    map.add(firePerimeterLayer);
    map.add(highlightLayer);

    // Handle county clicks
    mapView.on('click', async (event) => {
      try {
        const response = await mapView.hitTest(event);
        
        // Clear previous highlights
        highlightLayer.removeAll();
        
        const countyResult = response.results.find(
          (r: any) => r.graphic.layer === countiesLayer
        );

        if (countyResult) {
          const county = (countyResult as any).graphic;
          const countyName = county.attributes.NAME;
          
          setSelectedCounty(countyName);

          // Highlight selected county
          const highlightGraphic = new Graphic({
            geometry: county.geometry,
            symbol: new SimpleFillSymbol({
              color: [0, 100, 255, 0.2],
              outline: new SimpleLineSymbol({
                color: [0, 100, 255, 0.8],
                width: 3
              })
            })
          });
          
          highlightLayer.add(highlightGraphic);

          // Query fires within this county
          const fireQuery = firePerimeterLayer.createQuery();
          fireQuery.geometry = county.geometry;
          fireQuery.spatialRelationship = 'intersects';
          fireQuery.returnGeometry = true;
          fireQuery.outFields = ['*'];

          const fireResults = await firePerimeterLayer.queryFeatures(fireQuery);
          
          if (onFireSelect) {
            onFireSelect({
              county: countyName,
              fires: fireResults.features.map((f: any) => ({
                name: f.attributes.FIRE_NAME || 'Unknown',
                acres: f.attributes.GIS_ACRES || 0,
                startDate: f.attributes.ALARM_DATE,
                containment: f.attributes.CONT_PER || 0,
                cause: f.attributes.CAUSE || 'Unknown'
              }))
            });
          }
        }
      } catch (error) {
        console.error('Error handling map click:', error);
      }
    });

    setView(mapView);

    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, [onFireSelect]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapDiv} 
        className="w-full h-full min-h-[400px] md:min-h-[600px]" 
        style={{ touchAction: 'none' }}
      />
      {selectedCounty && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
          <p className="text-sm font-semibold">Selected: {selectedCounty} County</p>
        </div>
      )}
    </div>
  );
}