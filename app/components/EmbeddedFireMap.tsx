'use client';

import { useState } from 'react';

interface EmbeddedFireMapProps {
  onFireSelect?: (data: any) => void;
}

export default function EmbeddedFireMap({ onFireSelect }: EmbeddedFireMapProps) {
  const [mapType, setMapType] = useState<'arcgis' | 'mapbox'>('arcgis');

  // ArcGIS Cal Fire Public Information Map
  const arcgisUrl = "https://calfire-forestry.maps.arcgis.com/apps/webappviewer/index.html?id=395380c393414c8aad80eb4cc7252b05";
  
  // Alternative: USGS Wildfire Activity Map
  const usgsUrl = "https://wildfire.usgs.gov/viewer/";
  
  // Alternative: InciWeb embedded map
  const inciwebUrl = "https://inciweb.wildfire.gov/";

  // Mapbox Studio public style with fire data (you can create your own style in Mapbox Studio)
  const mapboxStudioUrl = "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#8/37.5/-119.5";

  return (
    <div className="h-full w-full flex flex-col">
      {/* Map Type Selector */}
      <div className="bg-white border-b p-2 flex gap-2">
        <button
          onClick={() => setMapType('arcgis')}
          className={`px-4 py-2 rounded ${
            mapType === 'arcgis' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          CAL FIRE Official Map
        </button>
        <button
          onClick={() => setMapType('mapbox')}
          className={`px-4 py-2 rounded ${
            mapType === 'mapbox' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Satellite View
        </button>
      </div>

      {/* Embedded Map */}
      <div className="flex-1 relative">
        {mapType === 'arcgis' ? (
          <iframe
            src={arcgisUrl}
            className="w-full h-full border-0"
            title="CAL FIRE Public Information Map"
            allow="geolocation"
            loading="lazy"
          />
        ) : (
          <iframe
            src={mapboxStudioUrl}
            className="w-full h-full border-0"
            title="Mapbox Fire Map"
            allow="geolocation"
            loading="lazy"
          />
        )}
        
        {/* Optional overlay for custom controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => window.open(mapType === 'arcgis' ? arcgisUrl : mapboxStudioUrl, '_blank')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Full Screen
          </button>
        </div>
      </div>
    </div>
  );
}