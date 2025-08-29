'use client';

import { useEffect, useRef } from 'react';

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

interface GoogleFireMapProps {
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
  { id: 10, name: 'Oak Fire', lat: 37.5, lng: -119.9, acres: 2100, containment: 100, status: 'Controlled', county: 'Mariposa' }
];

export default function GoogleFireMap({ onFireSelect }: GoogleFireMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        // Using a free tier API key with restrictions
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6X_MUfGz84kiAv9pRTBLJvXE&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        (window as typeof window & { initMap: () => void }).initMap = initializeMap;
        document.head.appendChild(script);
      } else if (window.google) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Initialize map centered on California
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 36.7783, lng: -119.4179 }, // California center
        zoom: 6,
        mapTypeId: 'terrain',
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e9e9e' }]
          }
        ]
      });

      googleMapRef.current = map;

      // Add fire markers
      fireLocations.forEach(fire => {
        const isActive = fire.status === 'Active';
        
        // Create custom marker icon based on fire status
        const icon = {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: isActive ? '#ef4444' : fire.status === 'Contained' ? '#f59e0b' : '#10b981',
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: Math.min(15, 5 + (fire.acres / 10000))
        };

        const marker = new google.maps.Marker({
          position: { lat: fire.lat, lng: fire.lng },
          map: map,
          title: fire.name,
          icon: icon,
          animation: isActive ? google.maps.Animation.BOUNCE : undefined
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${fire.name}</h3>
              <p style="margin: 4px 0; color: #4b5563; font-size: 14px;">
                <strong>County:</strong> ${fire.county}<br/>
                <strong>Status:</strong> <span style="color: ${isActive ? '#ef4444' : fire.status === 'Contained' ? '#f59e0b' : '#10b981'}">${fire.status}</span><br/>
                <strong>Size:</strong> ${fire.acres.toLocaleString()} acres<br/>
                <strong>Containment:</strong> ${fire.containment}%
              </p>
              ${isActive ? '<p style="color: #ef4444; font-size: 12px; margin-top: 8px;">⚠️ Active Fire</p>' : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          // Close other info windows
          markersRef.current.forEach(m => {
            if (m.get('infoWindow')) {
              m.get('infoWindow').close();
            }
          });
          
          infoWindow.open(map, marker);
          marker.set('infoWindow', infoWindow);
          
          if (onFireSelect) {
            onFireSelect(fire);
          }
        });

        markersRef.current.push(marker);
      });

      // Add fire perimeter overlay for active fires (simulated)
      fireLocations.filter(f => f.status === 'Active').forEach(fire => {
        new google.maps.Circle({
          strokeColor: '#ef4444',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.1,
          map: map,
          center: { lat: fire.lat, lng: fire.lng },
          radius: Math.sqrt(fire.acres * 4047) // Convert acres to approximate radius in meters
        });
      });
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [onFireSelect]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
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
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-xs text-gray-600">
          Click on fire markers to see details. Marker size indicates fire size.
        </p>
      </div>
    </div>
  );
}