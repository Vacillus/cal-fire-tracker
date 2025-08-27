'use client';

import { useState, useMemo } from 'react';

// Simplified California counties with boundaries
const californiaCounties = [
  // Northern California
  { name: 'Del Norte', path: 'M 50 30 L 80 30 L 80 60 L 50 60 Z', region: 'north', lat: 41.74, lng: -124.0 },
  { name: 'Siskiyou', path: 'M 80 30 L 150 30 L 150 60 L 80 60 Z', region: 'north', lat: 41.59, lng: -122.5 },
  { name: 'Modoc', path: 'M 150 30 L 200 30 L 200 60 L 150 60 Z', region: 'north', lat: 41.5, lng: -120.5 },
  { name: 'Humboldt', path: 'M 50 60 L 100 60 L 100 110 L 50 110 Z', region: 'north', lat: 40.7, lng: -124.0 },
  { name: 'Trinity', path: 'M 100 60 L 130 60 L 130 110 L 100 110 Z', region: 'north', lat: 40.7, lng: -123.0 },
  { name: 'Shasta', path: 'M 130 60 L 180 60 L 180 110 L 130 110 Z', region: 'north', lat: 40.7, lng: -122.0 },
  { name: 'Lassen', path: 'M 180 60 L 220 60 L 220 110 L 180 110 Z', region: 'north', lat: 40.5, lng: -120.5 },
  { name: 'Tehama', path: 'M 100 110 L 150 110 L 150 140 L 100 140 Z', region: 'north', lat: 40.1, lng: -122.2 },
  { name: 'Plumas', path: 'M 150 110 L 200 110 L 200 140 L 150 140 Z', region: 'north', lat: 40.0, lng: -121.0 },
  { name: 'Mendocino', path: 'M 50 110 L 100 110 L 100 160 L 50 160 Z', region: 'north', lat: 39.5, lng: -123.4 },
  { name: 'Glenn', path: 'M 100 140 L 130 140 L 130 170 L 100 170 Z', region: 'north', lat: 39.6, lng: -122.4 },
  { name: 'Butte', path: 'M 130 140 L 170 140 L 170 170 L 130 170 Z', region: 'north', lat: 39.7, lng: -121.6 },
  { name: 'Sierra', path: 'M 170 140 L 200 140 L 200 170 L 170 170 Z', region: 'north', lat: 39.5, lng: -120.5 },
  { name: 'Nevada', path: 'M 200 140 L 230 140 L 230 170 L 200 170 Z', region: 'north', lat: 39.3, lng: -120.8 },
  
  // Bay Area and Central
  { name: 'Lake', path: 'M 70 160 L 100 160 L 100 190 L 70 190 Z', region: 'bay', lat: 39.0, lng: -122.8 },
  { name: 'Colusa', path: 'M 100 170 L 130 170 L 130 200 L 100 200 Z', region: 'central', lat: 39.2, lng: -122.0 },
  { name: 'Sutter', path: 'M 130 170 L 150 170 L 150 200 L 130 200 Z', region: 'central', lat: 39.0, lng: -121.7 },
  { name: 'Yuba', path: 'M 150 170 L 170 170 L 170 200 L 150 200 Z', region: 'central', lat: 39.2, lng: -121.3 },
  { name: 'Placer', path: 'M 170 170 L 210 170 L 210 200 L 170 200 Z', region: 'central', lat: 39.0, lng: -120.8 },
  { name: 'El Dorado', path: 'M 210 170 L 250 170 L 250 200 L 210 200 Z', region: 'central', lat: 38.8, lng: -120.5 },
  { name: 'Sonoma', path: 'M 50 190 L 90 190 L 90 230 L 50 230 Z', region: 'bay', lat: 38.5, lng: -122.9 },
  { name: 'Napa', path: 'M 90 190 L 110 190 L 110 230 L 90 230 Z', region: 'bay', lat: 38.5, lng: -122.4 },
  { name: 'Yolo', path: 'M 110 200 L 140 200 L 140 230 L 110 230 Z', region: 'central', lat: 38.7, lng: -121.9 },
  { name: 'Sacramento', path: 'M 140 200 L 180 200 L 180 230 L 140 230 Z', region: 'central', lat: 38.5, lng: -121.4 },
  { name: 'Amador', path: 'M 180 200 L 210 200 L 210 230 L 180 230 Z', region: 'central', lat: 38.4, lng: -120.7 },
  { name: 'Alpine', path: 'M 210 200 L 240 200 L 240 230 L 210 230 Z', region: 'central', lat: 38.6, lng: -119.8 },
  { name: 'Marin', path: 'M 50 230 L 80 230 L 80 250 L 50 250 Z', region: 'bay', lat: 38.0, lng: -122.7 },
  { name: 'Solano', path: 'M 80 230 L 120 230 L 120 250 L 80 250 Z', region: 'bay', lat: 38.3, lng: -122.2 },
  { name: 'Contra Costa', path: 'M 120 230 L 150 230 L 150 260 L 120 260 Z', region: 'bay', lat: 37.9, lng: -122.0 },
  { name: 'San Joaquin', path: 'M 150 230 L 180 230 L 180 260 L 150 260 Z', region: 'central', lat: 37.9, lng: -121.3 },
  { name: 'Calaveras', path: 'M 180 230 L 210 230 L 210 260 L 180 260 Z', region: 'central', lat: 38.2, lng: -120.5 },
  { name: 'Tuolumne', path: 'M 210 230 L 250 230 L 250 260 L 210 260 Z', region: 'central', lat: 37.9, lng: -120.0 },
  { name: 'Mono', path: 'M 250 230 L 280 230 L 280 280 L 250 280 Z', region: 'central', lat: 38.0, lng: -119.0 },
  { name: 'San Francisco', path: 'M 60 250 L 80 250 L 80 270 L 60 270 Z', region: 'bay', lat: 37.77, lng: -122.42 },
  { name: 'San Mateo', path: 'M 60 270 L 90 270 L 90 300 L 60 300 Z', region: 'bay', lat: 37.5, lng: -122.3 },
  { name: 'Alameda', path: 'M 90 260 L 130 260 L 130 300 L 90 300 Z', region: 'bay', lat: 37.6, lng: -121.9 },
  { name: 'Stanislaus', path: 'M 130 260 L 170 260 L 170 300 L 130 300 Z', region: 'central', lat: 37.5, lng: -121.0 },
  { name: 'Mariposa', path: 'M 170 260 L 210 260 L 210 300 L 170 300 Z', region: 'central', lat: 37.5, lng: -120.0 },
  { name: 'Madera', path: 'M 210 260 L 250 260 L 250 300 L 210 300 Z', region: 'central', lat: 37.2, lng: -119.8 },
  { name: 'Santa Cruz', path: 'M 60 300 L 100 300 L 100 330 L 60 330 Z', region: 'bay', lat: 37.0, lng: -122.0 },
  { name: 'Santa Clara', path: 'M 100 300 L 140 300 L 140 340 L 100 340 Z', region: 'bay', lat: 37.3, lng: -121.9 },
  { name: 'Merced', path: 'M 140 300 L 180 300 L 180 340 L 140 340 Z', region: 'central', lat: 37.3, lng: -120.5 },
  { name: 'Fresno', path: 'M 180 300 L 250 300 L 250 360 L 180 360 Z', region: 'central', lat: 36.7, lng: -119.8 },
  { name: 'Inyo', path: 'M 250 280 L 290 280 L 290 360 L 250 360 Z', region: 'central', lat: 36.8, lng: -118.2 },
  { name: 'Monterey', path: 'M 60 330 L 120 330 L 120 390 L 60 390 Z', region: 'central', lat: 36.2, lng: -121.3 },
  { name: 'San Benito', path: 'M 120 340 L 160 340 L 160 380 L 120 380 Z', region: 'central', lat: 36.5, lng: -121.0 },
  { name: 'Kings', path: 'M 160 340 L 200 340 L 200 380 L 160 380 Z', region: 'central', lat: 36.0, lng: -119.8 },
  { name: 'Tulare', path: 'M 200 360 L 250 360 L 250 400 L 200 400 Z', region: 'central', lat: 36.2, lng: -119.0 },
  
  // Southern California
  { name: 'San Luis Obispo', path: 'M 80 390 L 140 390 L 140 440 L 80 440 Z', region: 'south', lat: 35.3, lng: -120.4 },
  { name: 'Kern', path: 'M 140 380 L 220 380 L 220 440 L 140 440 Z', region: 'south', lat: 35.3, lng: -118.7 },
  { name: 'San Bernardino', path: 'M 220 380 L 300 380 L 300 460 L 220 460 Z', region: 'south', lat: 34.8, lng: -116.2 },
  { name: 'Santa Barbara', path: 'M 80 440 L 140 440 L 140 480 L 80 480 Z', region: 'south', lat: 34.7, lng: -120.0 },
  { name: 'Ventura', path: 'M 140 440 L 180 440 L 180 480 L 140 480 Z', region: 'south', lat: 34.4, lng: -119.0 },
  { name: 'Los Angeles', path: 'M 180 440 L 240 440 L 240 500 L 180 500 Z', region: 'south', lat: 34.0, lng: -118.2 },
  { name: 'Riverside', path: 'M 240 460 L 300 460 L 300 520 L 240 520 Z', region: 'south', lat: 33.7, lng: -116.2 },
  { name: 'Orange', path: 'M 200 500 L 240 500 L 240 530 L 200 530 Z', region: 'south', lat: 33.7, lng: -117.8 },
  { name: 'San Diego', path: 'M 200 530 L 280 530 L 280 600 L 200 600 Z', region: 'south', lat: 32.7, lng: -117.0 },
  { name: 'Imperial', path: 'M 280 520 L 320 520 L 320 600 L 280 600 Z', region: 'south', lat: 32.8, lng: -115.5 }
];

// Major cities for reference
const majorCities = [
  { name: 'San Francisco', county: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Los Angeles', county: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'San Diego', county: 'San Diego', lat: 32.7157, lng: -117.1611 },
  { name: 'San Jose', county: 'Santa Clara', lat: 37.3382, lng: -121.8863 },
  { name: 'Sacramento', county: 'Sacramento', lat: 38.5816, lng: -121.4944 },
  { name: 'Fresno', county: 'Fresno', lat: 36.7378, lng: -119.7871 },
  { name: 'Oakland', county: 'Alameda', lat: 37.8044, lng: -122.2712 },
  { name: 'Bakersfield', county: 'Kern', lat: 35.3733, lng: -119.0187 },
  { name: 'Anaheim', county: 'Orange', lat: 33.8366, lng: -117.9143 },
  { name: 'Riverside', county: 'Riverside', lat: 33.9806, lng: -117.3755 },
  { name: 'Stockton', county: 'San Joaquin', lat: 37.9577, lng: -121.2908 },
  { name: 'Chula Vista', county: 'San Diego', lat: 32.6401, lng: -117.0842 },
  { name: 'Fremont', county: 'Alameda', lat: 37.5485, lng: -121.9886 },
  { name: 'Irvine', county: 'Orange', lat: 33.6846, lng: -117.8265 },
  { name: 'Modesto', county: 'Stanislaus', lat: 37.6391, lng: -120.9969 },
  { name: 'Oxnard', county: 'Ventura', lat: 34.1975, lng: -119.1771 },
  { name: 'Fontana', county: 'San Bernardino', lat: 34.0922, lng: -117.4350 },
  { name: 'Moreno Valley', county: 'Riverside', lat: 33.9425, lng: -117.2297 },
  { name: 'Huntington Beach', county: 'Orange', lat: 33.6595, lng: -117.9988 },
  { name: 'Santa Rosa', county: 'Sonoma', lat: 38.4404, lng: -122.7141 }
];

interface FireData {
  id: string;
  name: string;
  county: string;
  city?: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  timestamp: string;
  personnel: number;
  structures_threatened: number;
  evacuation_orders: boolean;
  started_date?: string;
  cause?: string;
}

interface CaliforniaMapProps {
  fireData: FireData[];
  onFireSelect?: (fire: FireData) => void;
}

export default function CaliforniaCountyMap({ fireData, onFireSelect }: CaliforniaMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  // Transform coordinates to SVG viewBox
  const transformLat = (lat: number) => {
    // California spans roughly from lat 32.5 to 42
    return 630 - ((lat - 32.5) * 60);
  };

  const transformLng = (lng: number) => {
    // California spans roughly from lng -124 to -114
    return ((lng + 124) * 32) + 50;
  };

  // Filter fires based on search query
  const filteredFires = useMemo(() => {
    if (!searchQuery) return fireData;
    
    const query = searchQuery.toLowerCase();
    return fireData.filter(fire => 
      fire.county.toLowerCase().includes(query) ||
      fire.name.toLowerCase().includes(query) ||
      fire.city?.toLowerCase().includes(query) ||
      majorCities.some(city => 
        city.name.toLowerCase().includes(query) && 
        city.county === fire.county
      )
    );
  }, [fireData, searchQuery]);

  // Get fires per county
  const firesPerCounty = useMemo(() => {
    const counts: { [key: string]: number } = {};
    fireData.forEach(fire => {
      counts[fire.county] = (counts[fire.county] || 0) + 1;
    });
    return counts;
  }, [fireData]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-md">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search by county, city, or fire name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg 
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="max-w-2xl mx-auto mt-2 flex gap-4 text-sm text-gray-600">
          <span>Active Fires: {fireData.filter(f => f.status === 'Active').length}</span>
          <span>•</span>
          <span>Total Acres: {(fireData.reduce((sum, f) => sum + f.acres, 0) / 1000).toFixed(0)}K</span>
          <span>•</span>
          <span>Counties Affected: {Object.keys(firesPerCounty).length}</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <svg 
          viewBox="0 0 350 630" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="350" height="630" fill="#f9fafb" />
          
          {/* County boundaries */}
          <g className="counties">
            {californiaCounties.map((county) => {
              const fireCount = firesPerCounty[county.name] || 0;
              const isHovered = hoveredCounty === county.name;
              const isSelected = selectedCounty === county.name;
              const hasSearchMatch = searchQuery && (
                county.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                filteredFires.some(f => f.county === county.name)
              );
              
              return (
                <g key={county.name}>
                  <path
                    d={county.path}
                    fill={
                      fireCount > 0 
                        ? fireCount > 2 ? '#fca5a5' : '#fed7aa'
                        : hasSearchMatch ? '#ddd6fe' : '#e5e7eb'
                    }
                    stroke={isSelected ? '#dc2626' : '#9ca3af'}
                    strokeWidth={isSelected ? 2 : 1}
                    opacity={searchQuery && !hasSearchMatch ? 0.3 : 1}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredCounty(county.name)}
                    onMouseLeave={() => setHoveredCounty(null)}
                    onClick={() => setSelectedCounty(county.name)}
                  />
                  {(isHovered || fireCount > 0) && (
                    <text
                      x={parseInt(county.path.match(/M (\d+)/)?.[1] || '0') + 20}
                      y={parseInt(county.path.match(/M \d+ (\d+)/)?.[1] || '0') + 20}
                      className="pointer-events-none"
                      fontSize="10"
                      fill="#374151"
                      fontWeight={fireCount > 0 ? 'bold' : 'normal'}
                    >
                      {county.name}
                      {fireCount > 0 && ` (${fireCount})`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Cities */}
          <g className="cities">
            {majorCities.map((city) => (
              <g key={city.name}>
                <circle
                  cx={transformLng(city.lng)}
                  cy={transformLat(city.lat)}
                  r="2"
                  fill="#6b7280"
                  opacity="0.6"
                />
                {searchQuery && city.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <text
                    x={transformLng(city.lng) + 5}
                    y={transformLat(city.lat) - 5}
                    fontSize="9"
                    fill="#374151"
                    className="pointer-events-none"
                  >
                    {city.name}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Fire locations */}
          <g className="fires">
            {filteredFires.map((fire) => {
              const radius = Math.min(Math.sqrt(fire.acres / 500), 15);
              const isActive = fire.status === 'Active';
              
              return (
                <g 
                  key={fire.id}
                  className="cursor-pointer"
                  onClick={() => onFireSelect?.(fire)}
                >
                  {/* Pulsing animation for active fires */}
                  {isActive && (
                    <>
                      <circle
                        cx={transformLng(fire.lng)}
                        cy={transformLat(fire.lat)}
                        r={radius}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        opacity="0.6"
                        className="animate-ping"
                      />
                      <circle
                        cx={transformLng(fire.lng)}
                        cy={transformLat(fire.lat)}
                        r={radius * 1.5}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1"
                        opacity="0.3"
                        className="animate-pulse"
                      />
                    </>
                  )}
                  
                  {/* Main fire circle */}
                  <circle
                    cx={transformLng(fire.lng)}
                    cy={transformLat(fire.lat)}
                    r={radius}
                    fill={isActive ? '#dc2626' : fire.containment === 100 ? '#16a34a' : '#f59e0b'}
                    opacity="0.7"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <title>
                      {fire.name} - {fire.county} County
                      {'\n'}Status: {fire.status}
                      {'\n'}Acres: {fire.acres.toLocaleString()}
                      {'\n'}Containment: {fire.containment}%
                    </title>
                  </circle>
                  
                  {/* Fire label */}
                  <text
                    x={transformLng(fire.lng)}
                    y={transformLat(fire.lat) - radius - 3}
                    fontSize="9"
                    fill="#1f2937"
                    textAnchor="middle"
                    className="pointer-events-none font-semibold"
                    stroke="white"
                    strokeWidth="2"
                    paintOrder="stroke"
                  >
                    {fire.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Legend */}
          <g className="legend" transform="translate(10, 550)">
            <rect x="0" y="0" width="120" height="70" fill="white" opacity="0.9" rx="5" />
            <text x="5" y="15" fontSize="11" fontWeight="bold" fill="#374151">Legend</text>
            
            <circle cx="15" cy="30" r="5" fill="#dc2626" opacity="0.7" />
            <text x="25" y="33" fontSize="10" fill="#374151">Active Fire</text>
            
            <circle cx="15" cy="45" r="5" fill="#f59e0b" opacity="0.7" />
            <text x="25" y="48" fontSize="10" fill="#374151">Contained</text>
            
            <circle cx="15" cy="60" r="5" fill="#16a34a" opacity="0.7" />
            <text x="25" y="63" fontSize="10" fill="#374151">Controlled</text>
          </g>
        </svg>
      </div>
    </div>
  );
}