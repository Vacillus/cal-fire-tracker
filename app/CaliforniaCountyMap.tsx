'use client';

import { useState, useMemo } from 'react';

// Realistic California county boundaries - simplified but maintaining actual shape
const californiaCounties = [
  // Northern Counties
  { 
    name: 'Del Norte', 
    path: 'M 45 65 L 75 62 L 78 85 L 50 88 Z',
    lat: 41.74, lng: -124.0, region: 'north'
  },
  { 
    name: 'Siskiyou', 
    path: 'M 75 62 L 145 60 L 148 82 L 78 85 Z',
    lat: 41.59, lng: -122.5, region: 'north'
  },
  { 
    name: 'Modoc', 
    path: 'M 145 60 L 210 58 L 215 80 L 148 82 Z',
    lat: 41.5, lng: -120.5, region: 'north'
  },
  { 
    name: 'Humboldt', 
    path: 'M 40 88 L 78 85 L 85 145 L 55 150 L 42 125 Z',
    lat: 40.7, lng: -124.0, region: 'north'
  },
  { 
    name: 'Trinity', 
    path: 'M 78 85 L 108 83 L 115 140 L 85 145 Z',
    lat: 40.7, lng: -123.0, region: 'north'
  },
  { 
    name: 'Shasta', 
    path: 'M 108 83 L 165 80 L 170 135 L 115 140 Z',
    lat: 40.7, lng: -122.0, region: 'north'
  },
  { 
    name: 'Lassen', 
    path: 'M 165 80 L 215 78 L 220 130 L 170 135 Z',
    lat: 40.5, lng: -120.5, region: 'north'
  },
  { 
    name: 'Tehama', 
    path: 'M 85 145 L 115 140 L 118 175 L 88 180 Z',
    lat: 40.1, lng: -122.2, region: 'north'
  },
  { 
    name: 'Plumas', 
    path: 'M 170 135 L 220 130 L 225 175 L 175 180 L 170 135 Z',
    lat: 40.0, lng: -121.0, region: 'north'
  },
  { 
    name: 'Butte', 
    path: 'M 115 140 L 170 135 L 175 180 L 118 175 Z',
    lat: 39.7, lng: -121.6, region: 'north'
  },
  { 
    name: 'Sierra', 
    path: 'M 175 180 L 205 178 L 208 200 L 178 205 Z',
    lat: 39.5, lng: -120.5, region: 'north'
  },
  { 
    name: 'Nevada', 
    path: 'M 205 178 L 235 175 L 238 198 L 208 200 Z',
    lat: 39.3, lng: -120.8, region: 'north'
  },
  { 
    name: 'Mendocino', 
    path: 'M 35 150 L 85 145 L 88 180 L 92 215 L 45 220 L 38 185 Z',
    lat: 39.5, lng: -123.4, region: 'north'
  },
  { 
    name: 'Glenn', 
    path: 'M 88 180 L 118 175 L 120 210 L 92 215 Z',
    lat: 39.6, lng: -122.4, region: 'north'
  },
  
  // Bay Area Counties
  { 
    name: 'Lake', 
    path: 'M 45 220 L 92 215 L 95 250 L 50 255 Z',
    lat: 39.0, lng: -122.8, region: 'bay'
  },
  { 
    name: 'Colusa', 
    path: 'M 92 215 L 120 210 L 123 245 L 95 250 Z',
    lat: 39.2, lng: -122.0, region: 'central'
  },
  { 
    name: 'Sutter', 
    path: 'M 120 210 L 145 208 L 148 242 L 123 245 Z',
    lat: 39.0, lng: -121.7, region: 'central'
  },
  { 
    name: 'Yuba', 
    path: 'M 145 208 L 175 205 L 178 240 L 148 242 Z',
    lat: 39.2, lng: -121.3, region: 'central'
  },
  { 
    name: 'Placer', 
    path: 'M 175 205 L 210 200 L 215 238 L 178 240 Z',
    lat: 39.0, lng: -120.8, region: 'central'
  },
  { 
    name: 'El Dorado', 
    path: 'M 210 200 L 245 195 L 250 235 L 215 238 Z',
    lat: 38.8, lng: -120.5, region: 'central'
  },
  { 
    name: 'Sonoma', 
    path: 'M 40 255 L 95 250 L 98 290 L 45 295 Z',
    lat: 38.5, lng: -122.9, region: 'bay'
  },
  { 
    name: 'Napa', 
    path: 'M 95 250 L 115 248 L 118 288 L 98 290 Z',
    lat: 38.5, lng: -122.4, region: 'bay'
  },
  { 
    name: 'Yolo', 
    path: 'M 115 248 L 148 245 L 150 285 L 118 288 Z',
    lat: 38.7, lng: -121.9, region: 'central'
  },
  { 
    name: 'Sacramento', 
    path: 'M 148 245 L 180 242 L 183 282 L 150 285 Z',
    lat: 38.5, lng: -121.4, region: 'central'
  },
  { 
    name: 'Amador', 
    path: 'M 180 242 L 210 238 L 213 280 L 183 282 Z',
    lat: 38.4, lng: -120.7, region: 'central'
  },
  { 
    name: 'Alpine', 
    path: 'M 245 235 L 270 230 L 275 270 L 250 275 L 245 235 Z',
    lat: 38.6, lng: -119.8, region: 'central'
  },
  { 
    name: 'Marin', 
    path: 'M 42 295 L 75 292 L 70 315 L 48 310 Z',
    lat: 38.0, lng: -122.7, region: 'bay'
  },
  { 
    name: 'Solano', 
    path: 'M 75 292 L 118 288 L 120 310 L 75 315 Z',
    lat: 38.3, lng: -122.2, region: 'bay'
  },
  { 
    name: 'Contra Costa', 
    path: 'M 118 288 L 150 285 L 152 315 L 120 310 Z',
    lat: 37.9, lng: -122.0, region: 'bay'
  },
  { 
    name: 'San Francisco', 
    path: 'M 48 310 L 60 308 L 58 322 L 45 320 Z',
    lat: 37.77, lng: -122.42, region: 'bay'
  },
  { 
    name: 'San Mateo', 
    path: 'M 45 320 L 75 315 L 78 345 L 48 350 Z',
    lat: 37.5, lng: -122.3, region: 'bay'
  },
  { 
    name: 'Alameda', 
    path: 'M 75 315 L 120 310 L 122 340 L 78 345 Z',
    lat: 37.6, lng: -121.9, region: 'bay'
  },
  { 
    name: 'San Joaquin', 
    path: 'M 150 285 L 183 282 L 185 315 L 152 315 Z',
    lat: 37.9, lng: -121.3, region: 'central'
  },
  { 
    name: 'Stanislaus', 
    path: 'M 122 340 L 185 335 L 188 365 L 125 370 Z',
    lat: 37.5, lng: -121.0, region: 'central'
  },
  { 
    name: 'Santa Clara', 
    path: 'M 78 345 L 122 340 L 125 370 L 82 375 Z',
    lat: 37.3, lng: -121.9, region: 'bay'
  },
  { 
    name: 'Santa Cruz', 
    path: 'M 48 350 L 82 345 L 85 380 L 52 385 Z',
    lat: 37.0, lng: -122.0, region: 'bay'
  },
  { 
    name: 'Calaveras', 
    path: 'M 183 282 L 213 280 L 215 312 L 185 315 Z',
    lat: 38.2, lng: -120.5, region: 'central'
  },
  { 
    name: 'Tuolumne', 
    path: 'M 213 280 L 250 275 L 255 310 L 215 312 Z',
    lat: 37.9, lng: -120.0, region: 'central'
  },
  { 
    name: 'Mono', 
    path: 'M 270 270 L 295 265 L 300 340 L 275 345 L 270 270 Z',
    lat: 38.0, lng: -119.0, region: 'central'
  },
  { 
    name: 'Mariposa', 
    path: 'M 215 312 L 255 310 L 258 345 L 218 348 Z',
    lat: 37.5, lng: -120.0, region: 'central'
  },
  { 
    name: 'Merced', 
    path: 'M 125 370 L 188 365 L 190 395 L 128 400 Z',
    lat: 37.3, lng: -120.5, region: 'central'
  },
  { 
    name: 'Madera', 
    path: 'M 188 365 L 230 362 L 233 395 L 190 395 Z',
    lat: 37.2, lng: -119.8, region: 'central'
  },
  { 
    name: 'Fresno', 
    path: 'M 190 395 L 260 390 L 265 440 L 195 445 L 190 395 Z',
    lat: 36.7, lng: -119.8, region: 'central'
  },
  { 
    name: 'Inyo', 
    path: 'M 275 345 L 300 340 L 305 450 L 280 455 L 275 345 Z',
    lat: 36.8, lng: -118.2, region: 'central'
  },
  { 
    name: 'Monterey', 
    path: 'M 52 385 L 128 380 L 135 450 L 60 455 L 52 385 Z',
    lat: 36.2, lng: -121.3, region: 'central'
  },
  { 
    name: 'San Benito', 
    path: 'M 82 375 L 125 370 L 128 400 L 85 405 Z',
    lat: 36.5, lng: -121.0, region: 'central'
  },
  { 
    name: 'Kings', 
    path: 'M 128 400 L 190 395 L 192 425 L 132 430 Z',
    lat: 36.0, lng: -119.8, region: 'central'
  },
  { 
    name: 'Tulare', 
    path: 'M 195 445 L 265 440 L 270 480 L 200 485 L 195 445 Z',
    lat: 36.2, lng: -119.0, region: 'central'
  },
  
  // Southern Counties
  { 
    name: 'San Luis Obispo', 
    path: 'M 60 455 L 135 450 L 145 510 L 70 515 L 60 455 Z',
    lat: 35.3, lng: -120.4, region: 'south'
  },
  { 
    name: 'Kern', 
    path: 'M 135 450 L 265 445 L 270 510 L 145 510 L 135 450 Z',
    lat: 35.3, lng: -118.7, region: 'south'
  },
  { 
    name: 'San Bernardino', 
    path: 'M 270 480 L 340 475 L 345 550 L 275 555 L 270 480 Z',
    lat: 34.8, lng: -116.2, region: 'south'
  },
  { 
    name: 'Santa Barbara', 
    path: 'M 70 515 L 145 510 L 148 540 L 75 545 Z',
    lat: 34.7, lng: -120.0, region: 'south'
  },
  { 
    name: 'Ventura', 
    path: 'M 145 510 L 195 508 L 198 540 L 148 540 Z',
    lat: 34.4, lng: -119.0, region: 'south'
  },
  { 
    name: 'Los Angeles', 
    path: 'M 148 540 L 225 535 L 230 580 L 155 585 L 148 540 Z',
    lat: 34.0, lng: -118.2, region: 'south'
  },
  { 
    name: 'Riverside', 
    path: 'M 230 535 L 275 532 L 280 590 L 235 593 L 230 535 Z',
    lat: 33.7, lng: -116.2, region: 'south'
  },
  { 
    name: 'Orange', 
    path: 'M 155 585 L 195 582 L 200 610 L 160 613 Z',
    lat: 33.7, lng: -117.8, region: 'south'
  },
  { 
    name: 'San Diego', 
    path: 'M 160 613 L 235 610 L 240 670 L 165 675 L 160 613 Z',
    lat: 32.7, lng: -117.0, region: 'south'
  },
  { 
    name: 'Imperial', 
    path: 'M 235 593 L 280 590 L 285 670 L 240 670 L 235 593 Z',
    lat: 32.8, lng: -115.5, region: 'south'
  }
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

  // Transform coordinates - California roughly spans lat 32.5-42, lng -124 to -114
  const transformLat = (lat: number) => {
    return 700 - ((lat - 32.5) * 65);
  };

  const transformLng = (lng: number) => {
    return ((lng + 124) * 35) + 40;
  };

  // Filter fires based on search
  const filteredFires = useMemo(() => {
    if (!searchQuery) return fireData;
    
    const query = searchQuery.toLowerCase();
    return fireData.filter(fire => 
      fire.county.toLowerCase().includes(query) ||
      fire.name.toLowerCase().includes(query) ||
      fire.city?.toLowerCase().includes(query)
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

  // California outline path - more realistic shape
  const californiaOutline = `
    M 45 65 
    L 210 58 
    L 215 80 
    L 220 130 
    L 225 175 
    L 235 175 
    L 238 198 
    L 245 195 
    L 270 230 
    L 295 265 
    L 300 340 
    L 305 450 
    L 340 475 
    L 345 550 
    L 285 670 
    L 165 675 
    L 160 613 
    L 155 585 
    L 148 540 
    L 75 545 
    L 70 515 
    L 60 455 
    L 52 385 
    L 48 350 
    L 45 320 
    L 48 310 
    L 42 295 
    L 40 255 
    L 45 220 
    L 38 185 
    L 35 150 
    L 42 125 
    L 40 88 
    Z
  `;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Search Bar */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
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
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>Active Fires: {fireData.filter(f => f.status === 'Active').length}</span>
            <span>•</span>
            <span>Total Acres: {(fireData.reduce((sum, f) => sum + f.acres, 0) / 1000).toFixed(0)}K</span>
            <span>•</span>
            <span>Counties Affected: {Object.keys(firesPerCounty).length}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative p-4">
        <svg 
          viewBox="0 0 380 720" 
          className="w-full h-full max-h-full mx-auto"
          style={{ maxWidth: '800px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="380" height="720" fill="#f0f9ff" />
          
          {/* California outline for context */}
          <path
            d={californiaOutline}
            fill="none"
            stroke="#1e40af"
            strokeWidth="2"
            opacity="0.3"
          />
          
          {/* County paths */}
          <g id="counties">
            {californiaCounties.map((county) => {
              const fireCount = firesPerCounty[county.name] || 0;
              const isHovered = hoveredCounty === county.name;
              const isSelected = selectedCounty === county.name;
              const hasSearchMatch = searchQuery && (
                county.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                filteredFires.some(f => f.county === county.name)
              );
              
              return (
                <g key={county.name} id={`county-${county.name.replace(/\s+/g, '-')}`}>
                  <path
                    d={county.path}
                    fill={
                      fireCount > 2 ? 'rgba(239, 68, 68, 0.3)' :
                      fireCount > 0 ? 'rgba(251, 146, 60, 0.25)' :
                      hasSearchMatch ? 'rgba(147, 51, 234, 0.15)' :
                      'rgba(229, 231, 235, 0.4)'
                    }
                    stroke={
                      isSelected ? '#dc2626' :
                      isHovered ? '#2563eb' :
                      '#6b7280'
                    }
                    strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
                    opacity={searchQuery && !hasSearchMatch ? 0.3 : 1}
                    className="cursor-pointer transition-all duration-200 hover:stroke-2"
                    onMouseEnter={() => setHoveredCounty(county.name)}
                    onMouseLeave={() => setHoveredCounty(null)}
                    onClick={() => setSelectedCounty(county.name)}
                  >
                    <title>{county.name} County{fireCount > 0 ? ` - ${fireCount} fire(s)` : ''}</title>
                  </path>
                  {(isHovered || fireCount > 0 || isSelected) && (
                    <text
                      x={county.path.match(/M\s*(\d+)/)?.[1] || '0'}
                      y={county.path.match(/M\s*\d+\s+(\d+)/)?.[1] || '0'}
                      className="pointer-events-none select-none"
                      fontSize="9"
                      fill={fireCount > 0 ? '#991b1b' : '#374151'}
                      fontWeight={fireCount > 0 ? 'bold' : 'normal'}
                      textAnchor="middle"
                      dx="15"
                      dy="15"
                    >
                      {county.name}
                      {fireCount > 0 && ` (${fireCount})`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Cities markers */}
          <g id="cities">
            {majorCities.map((city) => {
              const x = transformLng(city.lng);
              const y = transformLat(city.lat);
              
              return (
                <g key={city.name}>
                  <circle
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#4b5563"
                    opacity="0.5"
                  />
                  {searchQuery && city.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                    <text
                      x={x}
                      y={y - 5}
                      fontSize="8"
                      fill="#1f2937"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {city.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Fire overlays */}
          <g id="fires">
            {filteredFires.map((fire) => {
              const x = transformLng(fire.lng);
              const y = transformLat(fire.lat);
              const radius = Math.min(Math.sqrt(fire.acres / 1000) * 2, 20);
              const isActive = fire.status === 'Active';
              
              return (
                <g 
                  key={fire.id}
                  className="cursor-pointer"
                  onClick={() => onFireSelect?.(fire)}
                >
                  {/* Pulsing rings for active fires */}
                  {isActive && (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          from={radius}
                          to={radius * 2}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          from={radius}
                          to={radius * 1.5}
                          dur="2s"
                          begin="1s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.4"
                          to="0"
                          dur="2s"
                          begin="1s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </>
                  )}
                  
                  {/* Main fire dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={
                      isActive ? 'rgba(220, 38, 38, 0.7)' :
                      fire.containment === 100 ? 'rgba(34, 197, 94, 0.6)' :
                      'rgba(251, 146, 60, 0.6)'
                    }
                    className="hover:opacity-100 transition-opacity"
                    opacity={isActive ? 0.8 : 0.6}
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
                    x={x}
                    y={y - radius - 4}
                    fontSize="8"
                    fill="#7f1d1d"
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
          <g transform="translate(10, 640)">
            <rect x="0" y="0" width="110" height="65" fill="white" opacity="0.95" rx="4" stroke="#e5e7eb" />
            <text x="5" y="12" fontSize="10" fontWeight="bold" fill="#374151">Legend</text>
            
            <circle cx="10" cy="25" r="4" fill="rgba(220, 38, 38, 0.7)" />
            <text x="18" y="28" fontSize="9" fill="#374151">Active Fire</text>
            
            <circle cx="10" cy="38" r="4" fill="rgba(251, 146, 60, 0.6)" />
            <text x="18" y="41" fontSize="9" fill="#374151">Contained</text>
            
            <circle cx="10" cy="51" r="4" fill="rgba(34, 197, 94, 0.6)" />
            <text x="18" y="54" fontSize="9" fill="#374151">Controlled</text>
          </g>
        </svg>
      </div>
    </div>
  );
}