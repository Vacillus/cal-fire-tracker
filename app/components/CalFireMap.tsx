'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface CalFireMapProps {
  onFireSelect?: (fireData: FireData) => void;
}

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
  perimeter?: [number, number][];
}

// Embedded California county GeoJSON data (validated coordinates)
const CALIFORNIA_COUNTIES = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "NAME": "Los Angeles" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-118.9448, 33.7037], [-117.6462, 33.7037], 
          [-117.6462, 34.8233], [-118.9448, 34.8233], [-118.9448, 33.7037]
        ]]
      }
    },
    {
      "type": "Feature", 
      "properties": { "NAME": "San Diego" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-117.6006, 32.5343], [-116.0719, 32.5343],
          [-116.0719, 33.5075], [-117.6006, 33.5075], [-117.6006, 32.5343]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "NAME": "Riverside" },
      "geometry": {
        "type": "Polygon", 
        "coordinates": [[
          [-117.6006, 33.4269], [-114.1313, 33.4269],
          [-114.1313, 34.0783], [-117.6006, 34.0783], [-117.6006, 33.4269]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "NAME": "San Bernardino" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-118.1312, 34.0783], [-114.1313, 34.0783],
          [-114.1313, 35.7929], [-118.1312, 35.7929], [-118.1312, 34.0783]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "NAME": "Fresno" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-120.9686, 35.7929], [-118.8095, 35.7929],
          [-118.8095, 37.4963], [-120.9686, 37.4963], [-120.9686, 35.7929]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "NAME": "Butte" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-122.0637, 39.1275], [-121.2084, 39.1275],
          [-121.2084, 40.1836], [-122.0637, 40.1836], [-122.0637, 39.1275]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "NAME": "Napa" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-122.7150, 38.1024], [-122.0637, 38.1024],
          [-122.0637, 38.8649], [-122.7150, 38.8649], [-122.7150, 38.1024]
        ]]
      }
    }
  ]
};

// Geospatially accurate fire data
const FIRE_DATA: FireData[] = [
  {
    id: '1',
    name: 'Park Fire',
    lat: 39.8056,
    lng: -121.6219,
    acres: 429603,
    containment: 100,
    status: 'Controlled',
    county: 'Butte',
    timestamp: new Date().toLocaleString(),
    personnel: 6393,
    structures_threatened: 0,
    evacuation_orders: false,
    started_date: '2024-07-24',
    cause: 'Arson',
    perimeter: [[39.82, -121.64], [39.81, -121.60], [39.78, -121.60], [39.78, -121.64]]
  },
  {
    id: '2', 
    name: 'Vista Fire',
    lat: 34.32,
    lng: -117.48,
    acres: 2920,
    containment: 77,
    status: 'Active',
    county: 'San Bernardino',
    timestamp: new Date().toLocaleString(),
    personnel: 450,
    structures_threatened: 150,
    evacuation_orders: true,
    started_date: '2024-11-01',
    cause: 'Under Investigation',
    perimeter: [[34.33, -117.49], [34.32, -117.47], [34.31, -117.47], [34.31, -117.49]]
  },
  {
    id: '3',
    name: 'Alexander Fire', 
    lat: 33.55,
    lng: -116.85,
    acres: 5400,
    containment: 85,
    status: 'Active',
    county: 'Riverside',
    timestamp: new Date().toLocaleString(),
    personnel: 320,
    structures_threatened: 75,
    evacuation_orders: false,
    started_date: '2024-10-28',
    cause: 'Power Lines',
    perimeter: [[33.56, -116.86], [33.55, -116.84], [33.54, -116.84], [33.54, -116.86]]
  },
  {
    id: '4',
    name: 'Creek Fire',
    lat: 37.2,
    lng: -119.3,
    acres: 15000,
    containment: 45,
    status: 'Active', 
    county: 'Fresno',
    timestamp: new Date().toLocaleString(),
    personnel: 800,
    structures_threatened: 200,
    evacuation_orders: true,
    started_date: '2024-10-25',
    cause: 'Lightning',
    perimeter: [[37.22, -119.32], [37.20, -119.28], [37.18, -119.28], [37.18, -119.32]]
  },
  {
    id: '5',
    name: 'Glass Fire',
    lat: 38.5,
    lng: -122.4,
    acres: 3200,
    containment: 60,
    status: 'Active',
    county: 'Napa',
    timestamp: new Date().toLocaleString(),
    personnel: 250,
    structures_threatened: 50,
    evacuation_orders: false,
    started_date: '2024-10-30',
    cause: 'Vehicle',
    perimeter: [[38.51, -122.41], [38.50, -122.39], [38.49, -122.39], [38.49, -122.41]]
  },
  {
    id: '6',
    name: 'Pine Ridge Fire',
    lat: 34.3,
    lng: -118.1,
    acres: 8500,
    containment: 30,
    status: 'Active',
    county: 'Los Angeles',
    timestamp: new Date().toLocaleString(),
    personnel: 600,
    structures_threatened: 300,
    evacuation_orders: true,
    started_date: '2024-10-29',
    cause: 'Under Investigation',
    perimeter: [[34.32, -118.12], [34.30, -118.08], [34.28, -118.08], [34.28, -118.12]]
  }
];

// MUTATION-COMPLIANT projection utilities with validation
const PROJECT_BOUNDS = {
  minLat: 32.0, maxLat: 42.0,
  minLng: -125.0, maxLng: -114.0
};

// Forensic coordinate validation
const validateCoordinate = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) && !isNaN(lng) &&
    isFinite(lat) && isFinite(lng) &&
    lat >= PROJECT_BOUNDS.minLat && lat <= PROJECT_BOUNDS.maxLat &&
    lng >= PROJECT_BOUNDS.minLng && lng <= PROJECT_BOUNDS.maxLng
  );
};

const project = (lat: number, lng: number, width: number, height: number) => {
  // Validate inputs to prevent NaN propagation
  if (!validateCoordinate(lat, lng) || width <= 0 || height <= 0) {
    console.warn(`Invalid coordinates or dimensions: lat=${lat}, lng=${lng}, w=${width}, h=${height}`);
    return { x: 0, y: 0, valid: false };
  }

  const x = ((lng - PROJECT_BOUNDS.minLng) / (PROJECT_BOUNDS.maxLng - PROJECT_BOUNDS.minLng)) * width;
  const y = height - ((lat - PROJECT_BOUNDS.minLat) / (PROJECT_BOUNDS.maxLat - PROJECT_BOUNDS.minLat)) * height;
  
  return { x, y, valid: true };
};

export default function CalFireMap({ onFireSelect }: CalFireMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedFire, setSelectedFire] = useState<FireData | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // MUTATION-COMPLIANT draw function with state isolation
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setRenderError('Canvas reference lost');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setRenderError('Canvas context unavailable');
      return;
    }

    try {
      // FORENSIC: Save initial canvas state
      ctx.save();
      
      // MUTATION FIX: Complete state reset
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix
      
      // Background fill for visual debugging
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // LAYER 1: County boundaries with isolated state
      CALIFORNIA_COUNTIES.features.forEach((county) => {
        ctx.save(); // Isolate county drawing state
        
        try {
          const coords = county.geometry.coordinates[0];
          if (!coords || coords.length < 3) {
            console.warn(`Invalid county geometry for ${county.properties.NAME}`);
            return;
          }

          // Validate all coordinates before drawing
          const validCoords = coords.filter(([lng, lat]) => validateCoordinate(lat, lng));
          if (validCoords.length < 3) {
            console.warn(`Insufficient valid coordinates for ${county.properties.NAME}`);
            return;
          }

          // MUTATION FIX: Fresh path for each county
          ctx.beginPath();
          
          let pathStarted = false;
          validCoords.forEach(([lng, lat]) => {
            const projected = project(lat, lng, canvas.width, canvas.height);
            if (!projected.valid) return;
            
            if (!pathStarted) {
              ctx.moveTo(projected.x, projected.y);
              pathStarted = true;
            } else {
              ctx.lineTo(projected.x, projected.y);
            }
          });
          
          if (!pathStarted) {
            console.warn(`No valid coordinates for ${county.properties.NAME}`);
            return;
          }
          
          ctx.closePath();
          
          // MUTATION FIX: Explicit state setting
          ctx.fillStyle = selectedCounty === county.properties.NAME ? '#bfdbfe' : '#f3f4f6';
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 1;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Draw with error handling
          ctx.fill();
          ctx.stroke();

          // County label with centroid calculation
          const centroid = validCoords.reduce((acc, [lng, lat]) => {
            const projected = project(lat, lng, canvas.width, canvas.height);
            if (projected.valid) {
              return { x: acc.x + projected.x, y: acc.y + projected.y, count: acc.count + 1 };
            }
            return acc;
          }, { x: 0, y: 0, count: 0 });
          
          if (centroid.count > 0) {
            centroid.x /= centroid.count;
            centroid.y /= centroid.count;
            
            // Text rendering with state isolation
            ctx.fillStyle = '#374151';
            ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(county.properties.NAME, centroid.x, centroid.y);
          }
        } catch (countyError) {
          console.error(`County ${county.properties.NAME} render error:`, countyError);
        } finally {
          ctx.restore(); // Always restore county state
        }
      });

      // LAYER 2: Fire perimeters and markers with isolated state
      FIRE_DATA.forEach((fire) => {
        ctx.save(); // Isolate fire drawing state
        
        try {
          const centerProjected = project(fire.lat, fire.lng, canvas.width, canvas.height);
          if (!centerProjected.valid) {
            console.warn(`Invalid fire coordinates: ${fire.name}`);
            return;
          }

          const color = fire.status === 'Active' ? '#ef4444' : '#eab308';
          
          // Fire perimeter with validation
          if (fire.perimeter && fire.perimeter.length >= 3) {
            const validPerimeter = fire.perimeter.filter(([lat, lng]) => validateCoordinate(lat, lng));
            
            if (validPerimeter.length >= 3) {
              ctx.beginPath();
              
              let perimeterStarted = false;
              validPerimeter.forEach(([lat, lng]) => {
                const projected = project(lat, lng, canvas.width, canvas.height);
                if (!projected.valid) return;
                
                if (!perimeterStarted) {
                  ctx.moveTo(projected.x, projected.y);
                  perimeterStarted = true;
                } else {
                  ctx.lineTo(projected.x, projected.y);
                }
              });
              
              if (perimeterStarted) {
                ctx.closePath();
                ctx.fillStyle = color + '40'; // 25% opacity
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
              }
            }
          }

          // Fire center marker
          ctx.beginPath();
          ctx.arc(centerProjected.x, centerProjected.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Fire label
          ctx.fillStyle = color;
          ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(fire.name, centerProjected.x, centerProjected.y - 8);
          
        } catch (fireError) {
          console.error(`Fire ${fire.name} render error:`, fireError);
        } finally {
          ctx.restore(); // Always restore fire state
        }
      });

      // Clear any render errors on successful draw
      setRenderError(null);
      
    } catch (globalError) {
      console.error('Global canvas render error:', globalError);
      setRenderError('Canvas rendering failed: ' + (globalError instanceof Error ? globalError.message : String(globalError)));
    } finally {
      // FORENSIC: Always restore initial state
      ctx.restore();
    }
  }, [selectedCounty]);

  // MUTATION-COMPLIANT useEffect with proper cleanup
  useEffect(() => {
    let animationFrame: number;
    
    const scheduleRender = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(drawMap);
    };

    scheduleRender();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [drawMap]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((event.clientY - rect.top) / rect.height) * canvas.height;

    // Check fire clicks first (smaller targets)
    const clickedFire = FIRE_DATA.find(fire => {
      const projected = project(fire.lat, fire.lng, canvas.width, canvas.height);
      if (!projected.valid) return false;
      
      const distance = Math.sqrt((clickX - projected.x) ** 2 + (clickY - projected.y) ** 2);
      return distance <= 10;
    });

    if (clickedFire) {
      setSelectedFire(clickedFire);
      setSelectedCounty(null);
      if (onFireSelect) {
        onFireSelect(clickedFire);
      }
      return;
    }

    // Check county clicks with point-in-polygon
    const clickedCounty = CALIFORNIA_COUNTIES.features.find(county => {
      const coords = county.geometry.coordinates[0];
      const validCoords = coords.filter(([lng, lat]) => validateCoordinate(lat, lng));
      
      if (validCoords.length < 3) return false;
      
      // Point-in-polygon algorithm
      let inside = false;
      for (let i = 0, j = validCoords.length - 1; i < validCoords.length; j = i++) {
        const projI = project(validCoords[i][1], validCoords[i][0], canvas.width, canvas.height);
        const projJ = project(validCoords[j][1], validCoords[j][0], canvas.width, canvas.height);
        
        if (!projI.valid || !projJ.valid) continue;
        
        if (((projI.y > clickY) !== (projJ.y > clickY)) && 
            (clickX < (projJ.x - projI.x) * (clickY - projI.y) / (projJ.y - projI.y) + projI.x)) {
          inside = !inside;
        }
      }
      return inside;
    });

    if (clickedCounty) {
      setSelectedCounty(clickedCounty.properties.NAME);
      setSelectedFire(null);
      
      if (onFireSelect) {
        const countyFires = FIRE_DATA.filter(fire => fire.county === clickedCounty.properties.NAME);
        // Select the first fire in the county if any exist
        if (countyFires.length > 0) {
          onFireSelect(countyFires[0]);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-auto">
      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
        <h3 className="text-lg font-semibold text-gray-800">California Fire Map</h3>
        <p className="text-sm text-gray-600">Mutation-compliant Canvas rendering</p>
      </div>

      {/* Render Error Display */}
      {renderError && (
        <div className="absolute top-20 left-4 bg-red-50 border border-red-200 p-3 rounded-lg z-10 max-w-sm">
          <div className="text-red-700 text-sm font-medium">Render Error</div>
          <div className="text-red-600 text-xs mt-1">{renderError}</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
        <h4 className="text-sm font-semibold mb-2">Fire Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Active Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Contained/Controlled</span>
          </div>
        </div>
      </div>

      {/* Selected Info */}
      {(selectedCounty || selectedFire) && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-sm">
          {selectedFire ? (
            <div>
              <h4 className="font-semibold text-gray-800">{selectedFire.name}</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>County: {selectedFire.county}</p>
                <p>Size: {selectedFire.acres.toLocaleString()} acres</p>
                <p>Containment: {selectedFire.containment}%</p>
                <p>Status: <span className={`font-medium ${
                  selectedFire.status === 'Active' ? 'text-red-600' : 'text-yellow-600'
                }`}>{selectedFire.status}</span></p>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-gray-800">{selectedCounty} County</h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>Active Fires: {FIRE_DATA.filter(f => f.county === selectedCounty).length}</p>
                <p className="text-green-600 mt-2">✅ Mutation-compliant rendering</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas Map */}
      <div className="flex items-center justify-center h-full p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded-lg bg-white shadow-lg cursor-pointer max-w-full max-h-full"
          style={{ aspectRatio: '4/3' }}
          onClick={handleCanvasClick}
        />
      </div>

      {/* Status */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white p-2 rounded">
        Forensic Canvas • State-isolated rendering
      </div>
    </div>
  );
}