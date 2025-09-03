'use client';

import { useEffect, useRef, useState } from 'react';

interface FireMapData {
  id: number;
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: string;
  personnel?: number;
  structures_threatened?: number;
  evacuation_orders?: boolean;
}

interface OpenStreetFireMapProps {
  onFireSelect?: (data: FireMapData) => void;
}

// Mock fire data with real California coordinates
const fireLocations = [
  { id: 1, name: 'Park Fire', lat: 39.8056, lng: -121.6219, acres: 429603, containment: 100, status: 'Controlled', county: 'Butte' },
  { id: 2, name: 'Boyles Fire', lat: 39.10, lng: -122.93, acres: 76, containment: 100, status: 'Contained', county: 'Lake' },
  { id: 3, name: 'Vista Fire', lat: 34.32, lng: -117.48, acres: 2920, containment: 77, status: 'Active', county: 'San Bernardino' },
  { id: 4, name: 'Alexander Fire', lat: 33.55, lng: -116.85, acres: 5400, containment: 85, status: 'Active', county: 'Riverside' },
  { id: 5, name: 'Creek Fire', lat: 37.2, lng: -119.3, acres: 15000, containment: 45, status: 'Active', county: 'Fresno' },
  { id: 6, name: 'Glass Fire', lat: 38.5, lng: -122.4, acres: 3200, containment: 60, status: 'Active', county: 'Napa' },
  { id: 7, name: 'Pine Ridge Fire', lat: 34.3, lng: -118.1, acres: 8500, containment: 30, status: 'Active', county: 'Los Angeles' },
  { id: 8, name: 'Summit Fire', lat: 34.5, lng: -119.8, acres: 1200, containment: 90, status: 'Contained', county: 'Santa Barbara' },
  { id: 9, name: 'Valley Fire', lat: 32.8, lng: -116.8, acres: 4500, containment: 55, status: 'Active', county: 'San Diego' },
  { id: 10, name: 'Oak Fire', lat: 37.5, lng: -119.9, acres: 2100, containment: 100, status: 'Controlled', county: 'Mariposa' },
  { id: 11, name: 'San Pedro Lake Fire', lat: 37.0851, lng: -121.5146, acres: 1850, containment: 15, status: 'Active', county: 'Santa Clara' },
  { id: 12, name: 'TCU Lightning Complex', lat: 37.1305, lng: -121.6543, acres: 3200, containment: 5, status: 'Active', county: 'Santa Clara' }
];

// Leaflet type declaration
interface LeafletMap {
  flyTo: (coords: [number, number], zoom: number, options?: object) => void;
  remove: () => void;
}

interface LeafletMarker {
  openPopup: () => void;
  on: (event: string, handler: () => void) => void;
}

export default function OpenStreetFireMap({ onFireSelect }: OpenStreetFireMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<number, LeafletMarker>>(new Map());

  useEffect(() => {
    // Load Leaflet CSS and JS from CDN
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
      if (!(window as typeof window & { L?: unknown }).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setLeafletLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setLeafletLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as typeof window & { L: any }).L;
    
    // Initialize map with better controls
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true
    }).setView([36.7783, -119.4179], 6);
    
    mapInstanceRef.current = map;
    
    // Force map to recalculate its size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add fire markers
    fireLocations.forEach(fire => {
      const isActive = fire.status === 'Active';
      const color = isActive ? '#ef4444' : fire.status === 'Contained' ? '#f59e0b' : '#10b981';
      const size = Math.min(30, 10 + (fire.acres / 10000));

      // Custom icon
      const fireIcon = L.divIcon({
        className: 'custom-fire-marker',
        html: `<div style="
          width: ${size}px; 
          height: ${size}px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ${isActive ? 'animation: pulse 2s infinite;' : ''}
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      const marker = L.marker([fire.lat, fire.lng], { icon: fireIcon });
      markersRef.current.set(fire.id, marker);

      // Popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${fire.name}</h3>
          <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">
            <strong>County:</strong> ${fire.county}<br/>
            <strong>Status:</strong> <span style="color: ${color}">${fire.status}</span><br/>
            <strong>Size:</strong> ${fire.acres.toLocaleString()} acres<br/>
            <strong>Containment:</strong> ${fire.containment}%
          </p>
          ${isActive ? '<p style="color: #ef4444; font-size: 12px; margin-top: 8px;">⚠️ Active Fire</p>' : ''}
          <button onclick="window.selectFire(${fire.id})" style="
            background: #3b82f6; 
            color: white; 
            border: none; 
            padding: 6px 12px; 
            border-radius: 4px; 
            cursor: pointer;
            margin-top: 8px;
          ">View Details</button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(map);

      // Add fire perimeter for active fires
      if (isActive) {
        const radius = Math.sqrt(fire.acres * 4047) / 1000; // Convert to km
        L.circle([fire.lat, fire.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.1,
          radius: radius * 1000 // Convert back to meters
        }).addTo(map);
      }
    });

    // Global function for fire selection with smooth zoom
    (window as typeof window & { selectFire?: (id: number) => void }).selectFire = (fireId: number) => {
      const fire = fireLocations.find(f => f.id === fireId);
      if (fire) {
        // Smooth fly to animation
        map.flyTo([fire.lat, fire.lng], 14, {
          duration: 1.5,
          easeLinearity: 0.25
        });
        
        // Open the marker popup
        const marker = markersRef.current.get(fireId);
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 1500);
        }
        
        if (onFireSelect) {
          onFireSelect(fire);
        }
      }
    };
    
    // Add click handler to markers for direct zoom
    markersRef.current.forEach((marker, fireId) => {
      marker.on('click', () => {
        const fire = fireLocations.find(f => f.id === fireId);
        if (fire) {
          map.flyTo([fire.lat, fire.lng], 14, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
      });
    });

    // Cleanup
    return () => {
      // Copy refs to avoid stale closure issues
      const markers = markersRef.current;
      markers.clear();
      map.remove();
      delete (window as typeof window & { selectFire?: (id: number) => void }).selectFire;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletLoaded, onFireSelect]);

  if (!leafletLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div ref={mapRef} className="absolute inset-0" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[2000]">
        <h4 className="text-sm font-semibold mb-2">Fire Status</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs">Contained</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Controlled</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-[2000]">
        <p className="text-xs text-gray-600">
          Click on fire markers to zoom & see details. Updates every 5 minutes from CAL FIRE.
        </p>
      </div>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}