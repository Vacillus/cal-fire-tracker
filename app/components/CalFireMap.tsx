'use client';

import { useEffect, useRef, useState } from 'react';

interface CalFireMapProps {
  onFireSelect?: (fireData: any) => void;
}

interface County {
  name: string;
  lat: number;
  lng: number;
  fires: number;
}

const californiaCounties: County[] = [
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, fires: 3 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611, fires: 2 },
  { name: 'Orange', lat: 33.7175, lng: -117.8311, fires: 1 },
  { name: 'Riverside', lat: 33.7537, lng: -116.3019, fires: 4 },
  { name: 'San Bernardino', lat: 34.4764, lng: -117.3089, fires: 2 },
  { name: 'Ventura', lat: 34.3754, lng: -119.0392, fires: 1 },
  { name: 'Fresno', lat: 36.7378, lng: -119.7871, fires: 3 },
  { name: 'Sacramento', lat: 38.5816, lng: -121.4944, fires: 1 },
  { name: 'Alameda', lat: 37.6017, lng: -121.7195, fires: 0 },
  { name: 'Santa Clara', lat: 37.3541, lng: -121.9552, fires: 1 },
  { name: 'Contra Costa', lat: 37.9161, lng: -121.9364, fires: 0 },
  { name: 'Kern', lat: 35.3733, lng: -119.0187, fires: 2 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, fires: 0 },
  { name: 'Tulare', lat: 36.2077, lng: -118.8397, fires: 1 },
  { name: 'Santa Barbara', lat: 34.4208, lng: -119.6982, fires: 2 },
  { name: 'Sonoma', lat: 38.5780, lng: -122.9888, fires: 1 },
  { name: 'Placer', lat: 39.0840, lng: -120.7537, fires: 0 },
  { name: 'Butte', lat: 39.6558, lng: -121.6078, fires: 5 },
  { name: 'Napa', lat: 38.5025, lng: -122.2654, fires: 2 },
  { name: 'Shasta', lat: 40.7751, lng: -122.4514, fires: 3 }
];

export default function CalFireMap({ onFireSelect }: CalFireMapProps) {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCountyClick = (county: County) => {
    setSelectedCounty(county);
    if (onFireSelect && county.fires > 0) {
      // Simulate fire data for the county
      onFireSelect({
        county: county.name,
        fires: Array.from({ length: county.fires }, (_, i) => ({
          name: `${county.name} Fire ${i + 1}`,
          acres: Math.floor(Math.random() * 10000) + 500,
          startDate: '2024-11-01',
          containment: Math.floor(Math.random() * 100),
          cause: 'Under Investigation'
        }))
      });
    }
  };

  const getCountyColor = (fires: number) => {
    if (fires === 0) return 'bg-green-100 hover:bg-green-200 border-green-300';
    if (fires <= 2) return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300';
    if (fires <= 4) return 'bg-orange-100 hover:bg-orange-200 border-orange-300';
    return 'bg-red-100 hover:bg-red-200 border-red-300';
  };

  const getFireIcon = (fires: number) => {
    if (fires === 0) return '✅';
    if (fires <= 2) return '🟡';
    if (fires <= 4) return '🟠';
    return '🔥';
  };

  if (!mapLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading California Fire Map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-auto">
      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
        <h3 className="text-lg font-semibold text-gray-800">California Counties</h3>
        <p className="text-sm text-gray-600">Click counties to view fire information</p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
        <h4 className="text-sm font-semibold mb-2">Fire Activity</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>No Active Fires</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟡</span>
            <span>1-2 Fires</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟠</span>
            <span>3-4 Fires</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span>5+ Fires</span>
          </div>
        </div>
      </div>

      {/* Selected County Info */}
      {selectedCounty && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-sm">
          <h4 className="font-semibold text-gray-800">{selectedCounty.name} County</h4>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Active Fires: <span className="font-medium text-red-600">{selectedCounty.fires}</span></p>
            <p>Coordinates: {selectedCounty.lat.toFixed(4)}, {selectedCounty.lng.toFixed(4)}</p>
            {selectedCounty.fires > 0 && (
              <p className="text-orange-600 mt-2">⚠️ Click sidebar for detailed fire information</p>
            )}
          </div>
        </div>
      )}

      {/* County Grid */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-full content-start">
        {californiaCounties.map((county) => (
          <button
            key={county.name}
            onClick={() => handleCountyClick(county)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-200 
              ${getCountyColor(county.fires)}
              ${selectedCounty?.name === county.name ? 'ring-2 ring-blue-500 transform scale-105' : ''}
            `}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{getFireIcon(county.fires)}</div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">
                {county.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {county.fires} fires
              </div>
            </div>
            
            {county.fires > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {county.fires}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Interactive Elements */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white p-2 rounded">
        Interactive County Map • Click to explore
      </div>
    </div>
  );
}