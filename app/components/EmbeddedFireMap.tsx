'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FireIncident {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  personnel?: number;
  structures_threatened?: number;
  evacuation_orders?: boolean;
  started_date?: string;
  cause?: string;
  timestamp?: string;
}

interface EmbeddedFireMapProps {
  onFireSelect?: (data: FireIncident) => void;
}

// Mutation logger
function logMapMutation(action: string, data: unknown) {
  const mutation = {
    timestamp: new Date().toISOString(),
    component: 'EmbeddedFireMap',
    action,
    data
  };
  console.log('[MAP_MUTATION]', mutation);
  
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('mapMutationLogs') || '[]');
    logs.push(mutation);
    if (logs.length > 200) logs.shift();
    localStorage.setItem('mapMutationLogs', JSON.stringify(logs));
  }
}

export default function EmbeddedFireMap({ onFireSelect }: EmbeddedFireMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const layerGroupRef = useRef<any>(null);
  const [selectedLayer, setSelectedLayer] = useState<'terrain' | 'satellite' | 'street'>('terrain');
  const [showPerimeters, setShowPerimeters] = useState(true);
  const [fireData, setFireData] = useState<FireIncident[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Comprehensive fire data including San Pedro Reservoir fires
  const staticFireData: FireIncident[] = [
    {
      id: '1',
      name: 'Park Fire',
      county: 'Butte',
      lat: 39.8056,
      lng: -121.6219,
      acres: 429603,
      containment: 100,
      status: 'Controlled',
      personnel: 6393,
      structures_threatened: 0,
      evacuation_orders: false,
      started_date: '2024-07-24',
      cause: 'Arson'
    },
    {
      id: '11',
      name: 'San Pedro Lake Fire',
      county: 'Santa Clara',
      lat: 37.0851,
      lng: -121.5146,
      acres: 1850,
      containment: 15,
      status: 'Active',
      personnel: 320,
      structures_threatened: 85,
      evacuation_orders: true,
      started_date: '2025-09-02',
      cause: 'Under Investigation'
    },
    {
      id: '12',
      name: 'TCU Lightning Complex',
      county: 'Santa Clara',
      lat: 37.1305,
      lng: -121.6543,
      acres: 3200,
      containment: 5,
      status: 'Active',
      personnel: 450,
      structures_threatened: 120,
      evacuation_orders: true,
      started_date: '2025-09-01',
      cause: 'Lightning'
    },
    {
      id: '3',
      name: 'Vista Fire',
      county: 'San Bernardino',
      lat: 34.32,
      lng: -117.48,
      acres: 2920,
      containment: 77,
      status: 'Active',
      personnel: 445,
      structures_threatened: 150,
      evacuation_orders: true,
      started_date: '2024-11-12'
    },
    {
      id: '4',
      name: 'Alexander Fire',
      county: 'Riverside',
      lat: 33.55,
      lng: -116.85,
      acres: 5400,
      containment: 85,
      status: 'Active',
      personnel: 650,
      structures_threatened: 200,
      evacuation_orders: false,
      started_date: '2024-11-10'
    },
    {
      id: '5',
      name: 'Creek Fire',
      county: 'Fresno',
      lat: 37.2,
      lng: -119.3,
      acres: 15000,
      containment: 45,
      status: 'Active',
      personnel: 850,
      structures_threatened: 300,
      evacuation_orders: true,
      started_date: '2024-11-15',
      cause: 'Lightning'
    },
    {
      id: '7',
      name: 'Pine Ridge Fire',
      county: 'Los Angeles',
      lat: 34.3,
      lng: -118.1,
      acres: 8500,
      containment: 30,
      status: 'Active',
      personnel: 1200,
      structures_threatened: 450,
      evacuation_orders: true,
      started_date: '2024-11-19'
    },
    {
      id: '9',
      name: 'Valley Fire',
      county: 'San Diego',
      lat: 32.8,
      lng: -116.8,
      acres: 4500,
      containment: 55,
      status: 'Active',
      personnel: 580,
      structures_threatened: 180,
      evacuation_orders: true,
      started_date: '2024-11-17'
    }
  ];

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          logMapMutation('LEAFLET_LOADED', { timestamp: new Date().toISOString() });
          setMapLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  // Fetch and update fire data
  const fetchFireData = useCallback(() => {
    logMapMutation('FETCH_FIRE_DATA', { 
      source: 'static_with_realtime_simulation',
      timestamp: new Date().toISOString() 
    });
    
    // Simulate real-time updates by slightly varying fire data
    const updatedData = staticFireData.map(fire => ({
      ...fire,
      timestamp: new Date().toLocaleString(),
      // Simulate containment progress
      containment: fire.status === 'Active' 
        ? Math.min(100, fire.containment + Math.random() * 2)
        : fire.containment,
      // Simulate acre changes for active fires
      acres: fire.status === 'Active'
        ? Math.round(fire.acres * (1 + (Math.random() - 0.3) * 0.01))
        : fire.acres
    }));
    
    setFireData(updatedData);
    setLastUpdate(new Date());
    
    logMapMutation('DATA_UPDATED', { 
      fireCount: updatedData.length,
      activeCount: updatedData.filter(f => f.status === 'Active').length 
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    
    // Initialize map with better controls and smooth scrolling
    const map = L.map(mapRef.current, {
      center: [36.7783, -119.4179],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      smoothWheelZoom: true,
      smoothSensitivity: 1,
      preferCanvas: true // Better performance for many markers
    });
    
    mapInstanceRef.current = map;
    logMapMutation('MAP_INITIALIZED', { center: [36.7783, -119.4179], zoom: 6 });

    // Base layers
    const terrainLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    // Add default layer
    terrainLayer.addTo(map);

    // Store layers for switching
    (window as any).mapLayers = {
      terrain: terrainLayer,
      satellite: satelliteLayer,
      street: streetLayer
    };

    // Create layer group for fire data
    layerGroupRef.current = L.layerGroup().addTo(map);

    // Initial data fetch
    fetchFireData();

    // Set up real-time updates (every 30 seconds for demo, 5 minutes in production)
    const updateInterval = setInterval(() => {
      fetchFireData();
    }, 30000); // 30 seconds for rapid testing

    // Cleanup
    return () => {
      clearInterval(updateInterval);
      map.remove();
      mapInstanceRef.current = null;
      logMapMutation('MAP_DESTROYED', { timestamp: new Date().toISOString() });
    };
  }, [mapLoaded, fetchFireData]);

  // Update fire markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || fireData.length === 0) return;

    const L = (window as any).L;
    const layerGroup = layerGroupRef.current;

    // Clear existing markers
    layerGroup.clearLayers();
    markersRef.current.clear();

    // Add fire markers and perimeters
    fireData.forEach(fire => {
      const isActive = fire.status === 'Active';
      const color = isActive ? '#ef4444' : fire.status === 'Contained' ? '#f59e0b' : '#10b981';
      
      // Calculate marker size based on acres (min 20px, max 50px)
      const size = Math.min(50, Math.max(20, 15 + Math.sqrt(fire.acres) / 20));

      // Create custom fire icon with pulsing animation for active fires
      const fireIcon = L.divIcon({
        className: 'custom-fire-icon',
        html: `
          <div class="fire-marker ${isActive ? 'active-fire' : ''}" style="
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color}dd, ${color}99);
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            ${isActive ? 'animation: pulse 2s infinite;' : ''}
          ">
            <span style="font-size: ${size/3}px; color: white;">🔥</span>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
      });

      const marker = L.marker([fire.lat, fire.lng], { 
        icon: fireIcon,
        title: fire.name 
      });

      // Create detailed popup
      const popupContent = `
        <div style="min-width: 250px; padding: 10px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
            ${fire.name}
          </h3>
          <div style="display: grid; gap: 5px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">County:</span>
              <strong>${fire.county}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Status:</span>
              <span style="
                background: ${color}22;
                color: ${color};
                padding: 2px 8px;
                border-radius: 4px;
                font-weight: 600;
              ">${fire.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Size:</span>
              <strong>${fire.acres.toLocaleString()} acres</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Containment:</span>
              <div style="display: flex; align-items: center; gap: 5px;">
                <div style="width: 60px; height: 6px; background: #e5e7eb; border-radius: 3px;">
                  <div style="
                    width: ${fire.containment}%;
                    height: 100%;
                    background: ${fire.containment > 75 ? '#10b981' : fire.containment > 50 ? '#f59e0b' : '#ef4444'};
                    border-radius: 3px;
                  "></div>
                </div>
                <strong>${fire.containment.toFixed(1)}%</strong>
              </div>
            </div>
            ${fire.personnel ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Personnel:</span>
                <strong>${fire.personnel.toLocaleString()}</strong>
              </div>
            ` : ''}
            ${fire.evacuation_orders ? `
              <div style="
                background: #fef2f2;
                color: #dc2626;
                padding: 5px;
                border-radius: 4px;
                margin-top: 5px;
                text-align: center;
                font-weight: 600;
              ">
                ⚠️ Evacuation Orders Active
              </div>
            ` : ''}
          </div>
          <button onclick="window.zoomToFire('${fire.id}')" style="
            width: 100%;
            margin-top: 10px;
            padding: 8px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">
            Zoom to Fire
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Add click handler for smooth zoom
      marker.on('click', () => {
        logMapMutation('FIRE_CLICKED', { fireId: fire.id, fireName: fire.name });
        
        // Smooth fly to animation
        mapInstanceRef.current.flyTo([fire.lat, fire.lng], 12, {
          duration: 1.5,
          easeLinearity: 0.25
        });

        // Trigger callback if provided
        if (onFireSelect) {
          onFireSelect(fire);
        }
      });

      // Add to layer group
      marker.addTo(layerGroup);
      markersRef.current.set(fire.id, marker);

      // Add fire perimeter if enabled and fire is active
      if (showPerimeters && isActive) {
        // Calculate radius based on acres (rough approximation)
        const radiusMeters = Math.sqrt(fire.acres * 4047); // Convert acres to square meters, then to radius
        
        const perimeter = L.circle([fire.lat, fire.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          opacity: 0.5,
          radius: radiusMeters
        });

        perimeter.bindTooltip(`${fire.name} perimeter`, { 
          permanent: false, 
          direction: 'top' 
        });

        perimeter.addTo(layerGroup);
      }
    });

    logMapMutation('MARKERS_UPDATED', { 
      markerCount: markersRef.current.size,
      showPerimeters 
    });
  }, [fireData, showPerimeters, onFireSelect]);

  // Global zoom function
  useEffect(() => {
    (window as any).zoomToFire = (fireId: string) => {
      const fire = fireData.find(f => f.id === fireId);
      if (fire && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([fire.lat, fire.lng], 14, {
          duration: 1.5,
          easeLinearity: 0.25
        });
        
        const marker = markersRef.current.get(fireId);
        if (marker) {
          setTimeout(() => marker.openPopup(), 1500);
        }
        
        logMapMutation('ZOOM_TO_FIRE', { fireId, fireName: fire.name });
      }
    };

    return () => {
      delete (window as any).zoomToFire;
    };
  }, [fireData]);

  // Handle layer switching
  const switchLayer = (layerType: 'terrain' | 'satellite' | 'street') => {
    if (!mapInstanceRef.current) return;
    
    const layers = (window as any).mapLayers;
    if (!layers) return;

    // Remove all base layers
    Object.values(layers).forEach((layer: any) => {
      mapInstanceRef.current.removeLayer(layer);
    });

    // Add selected layer
    layers[layerType].addTo(mapInstanceRef.current);
    setSelectedLayer(layerType);
    
    logMapMutation('LAYER_SWITCHED', { newLayer: layerType });
  };

  if (!mapLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CAL FIRE Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="space-y-3">
          {/* Layer Controls */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Map Type</h4>
            <div className="flex gap-1">
              <button
                onClick={() => switchLayer('terrain')}
                className={`px-3 py-1 text-xs rounded ${
                  selectedLayer === 'terrain' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Terrain
              </button>
              <button
                onClick={() => switchLayer('satellite')}
                className={`px-3 py-1 text-xs rounded ${
                  selectedLayer === 'satellite' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => switchLayer('street')}
                className={`px-3 py-1 text-xs rounded ${
                  selectedLayer === 'street' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Street
              </button>
            </div>
          </div>

          {/* Perimeter Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="perimeters"
              checked={showPerimeters}
              onChange={(e) => {
                setShowPerimeters(e.target.checked);
                logMapMutation('PERIMETERS_TOGGLED', { enabled: e.target.checked });
              }}
              className="rounded"
            />
            <label htmlFor="perimeters" className="text-xs">Show Fire Perimeters</label>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
          <div className="text-gray-500">
            Last: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="font-semibold">
            {fireData.filter(f => f.status === 'Active').length} Active Fires
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-semibold mb-2">Fire Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span>Contained</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Controlled</span>
          </div>
          {showPerimeters && (
            <div className="flex items-center gap-2 pt-1 border-t">
              <div className="w-4 h-4 border-2 border-red-500 rounded-full opacity-30"></div>
              <span>Perimeter</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="flex-1 w-full" />

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .active-fire {
          animation: pulse 2s infinite;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
}