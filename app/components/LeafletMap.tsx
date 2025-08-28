'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  onFireSelect?: (fireData: any) => void;
}

interface County {
  type: string;
  properties: {
    NAME: string;
    STATE_NAME: string;
  };
  geometry: any;
}

interface Fire {
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: string;
  geometry?: any;
}

const mockFireData: Fire[] = [
  {
    name: 'Park Fire',
    county: 'Butte',
    lat: 39.8056,
    lng: -121.6219,
    acres: 429603,
    containment: 100,
    status: 'Controlled'
  },
  {
    name: 'Vista Fire',
    county: 'San Bernardino',
    lat: 34.32,
    lng: -117.48,
    acres: 2920,
    containment: 77,
    status: 'Active'
  },
  {
    name: 'Alexander Fire',
    county: 'Riverside',
    lat: 33.55,
    lng: -116.85,
    acres: 5400,
    containment: 85,
    status: 'Active'
  },
  {
    name: 'Creek Fire',
    county: 'Fresno',
    lat: 37.2,
    lng: -119.3,
    acres: 15000,
    containment: 45,
    status: 'Active'
  },
  {
    name: 'Glass Fire',
    county: 'Napa',
    lat: 38.5,
    lng: -122.4,
    acres: 3200,
    containment: 60,
    status: 'Active'
  },
  {
    name: 'Pine Ridge Fire',
    county: 'Los Angeles',
    lat: 34.3,
    lng: -118.1,
    acres: 8500,
    containment: 30,
    status: 'Active'
  },
  {
    name: 'Valley Fire',
    county: 'San Diego',
    lat: 32.8,
    lng: -116.8,
    acres: 4500,
    containment: 55,
    status: 'Active'
  }
];

function MapEvents({ onFireSelect, counties, fires }: { 
  onFireSelect?: (fireData: any) => void; 
  counties: County[];
  fires: Fire[];
}) {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e: any) => {
      const { lat, lng } = e.latlng;
      
      // Find the county that was clicked
      const clickedCounty = counties.find(county => {
        if (county.geometry.type === 'Polygon') {
          return L.polygon(county.geometry.coordinates[0]).getBounds().contains([lat, lng]);
        }
        return false;
      });
      
      if (clickedCounty && onFireSelect) {
        const countyFires = fires.filter(fire => 
          fire.county.toLowerCase() === clickedCounty.properties.NAME.toLowerCase()
        );
        
        onFireSelect({
          county: clickedCounty.properties.NAME,
          fires: countyFires
        });
      }
    };
    
    map.on('click', handleClick);
    return () => map.off('click', handleClick);
  }, [map, onFireSelect, counties, fires]);
  
  return null;
}

export default function LeafletMap({ onFireSelect }: LeafletMapProps) {
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load California counties data
    const loadCountiesData = async () => {
      try {
        // Using a simplified California counties GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/california_counties.geojson');
        if (!response.ok) {
          throw new Error('Failed to load counties data');
        }
        const data = await response.json();
        setCounties(data.features || []);
      } catch (err) {
        console.error('Error loading counties:', err);
        setError('Failed to load county boundaries');
      }
    };
    
    loadCountiesData();
  }, []);

  const countyStyle = (feature: any) => ({
    fillColor: '#ffffff',
    weight: 1,
    opacity: 0.5,
    color: '#666666',
    fillOpacity: 0.1
  });

  const fireMarkers = mockFireData.map((fire, index) => (
    <div key={index} style={{ position: 'absolute', left: 0, top: 0, zIndex: 1000 }}>
      {/* Fire markers will be handled by a custom component */}
    </div>
  ));

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Map Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[36.7783, -119.4179]}
        zoom={6}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        scrollWheelZoom={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {counties.length > 0 && (
          <GeoJSON
            data={{ type: 'FeatureCollection', features: counties }}
            style={countyStyle}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`${feature.properties.NAME} County - Click to view fires`);
              layer.on('click', () => {
                setSelectedCounty(feature.properties.NAME);
                if (onFireSelect) {
                  const countyFires = mockFireData.filter(fire => 
                    fire.county.toLowerCase() === feature.properties.NAME.toLowerCase()
                  );
                  onFireSelect({
                    county: feature.properties.NAME,
                    fires: countyFires
                  });
                }
              });
            }}
          />
        )}
        
        <MapEvents onFireSelect={onFireSelect} counties={counties} fires={mockFireData} />
      </MapContainer>
      
      {selectedCounty && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
          <p className="text-sm font-semibold">Selected: {selectedCounty} County</p>
        </div>
      )}
    </div>
  );
}