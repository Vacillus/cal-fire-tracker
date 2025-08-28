'use client';

import { useEffect, useRef, useState } from 'react';

interface CalFireMapProps {
  onFireSelect?: (fireData: any) => void;
}

interface FireData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  county: string;
  perimeter?: google.maps.LatLngLiteral[];
}

// Mock fire data with accurate coordinates
const mockFireData: FireData[] = [
  {
    id: '1',
    name: 'Park Fire',
    lat: 39.8056,
    lng: -121.6219,
    acres: 429603,
    containment: 100,
    status: 'Controlled',
    county: 'Butte',
    perimeter: [
      { lat: 39.8256, lng: -121.6419 },
      { lat: 39.8156, lng: -121.6019 },
      { lat: 39.7856, lng: -121.6019 },
      { lat: 39.7856, lng: -121.6419 }
    ]
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
    perimeter: [
      { lat: 34.3300, lng: -117.4900 },
      { lat: 34.3200, lng: -117.4700 },
      { lat: 34.3100, lng: -117.4700 },
      { lat: 34.3100, lng: -117.4900 }
    ]
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
    perimeter: [
      { lat: 33.5600, lng: -116.8600 },
      { lat: 33.5500, lng: -116.8400 },
      { lat: 33.5400, lng: -116.8400 },
      { lat: 33.5400, lng: -116.8600 }
    ]
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
    perimeter: [
      { lat: 37.2200, lng: -119.3200 },
      { lat: 37.2000, lng: -119.2800 },
      { lat: 37.1800, lng: -119.2800 },
      { lat: 37.1800, lng: -119.3200 }
    ]
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
    perimeter: [
      { lat: 38.5100, lng: -122.4100 },
      { lat: 38.5000, lng: -122.3900 },
      { lat: 38.4900, lng: -122.3900 },
      { lat: 38.4900, lng: -122.4100 }
    ]
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
    perimeter: [
      { lat: 34.3200, lng: -118.1200 },
      { lat: 34.3000, lng: -118.0800 },
      { lat: 34.2800, lng: -118.0800 },
      { lat: 34.2800, lng: -118.1200 }
    ]
  }
];

// Custom Fire Overlay Class
class FireOverlay extends google.maps.OverlayView {
  private fire: FireData;
  private div: HTMLElement | null = null;
  private onFireClick: (fire: FireData) => void;

  constructor(fire: FireData, onFireClick: (fire: FireData) => void) {
    super();
    this.fire = fire;
    this.onFireClick = onFireClick;
  }

  onAdd() {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.cursor = 'pointer';
    div.style.userSelect = 'none';
    div.style.width = 'auto';
    div.style.height = 'auto';

    // Create fire marker content
    const fireIcon = this.fire.status === 'Active' ? '🔥' : '🟡';
    const bgColor = this.fire.status === 'Active' ? 'bg-red-500' : 'bg-yellow-500';
    
    div.innerHTML = `
      <div class="flex items-center ${bgColor} text-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold transform hover:scale-105 transition-transform">
        <span class="mr-1">${fireIcon}</span>
        <span>${this.fire.name}</span>
        <span class="ml-2 text-xs opacity-75">${this.fire.acres.toLocaleString()}ac</span>
      </div>
    `;

    div.addEventListener('click', () => {
      this.onFireClick(this.fire);
    });

    this.div = div;
    const panes = this.getPanes()!;
    panes.overlayMouseTarget.appendChild(div);
  }

  draw() {
    if (this.div) {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(
        new google.maps.LatLng(this.fire.lat, this.fire.lng)
      );
      
      if (position) {
        this.div.style.left = position.x - 50 + 'px';
        this.div.style.top = position.y - 15 + 'px';
      }
    }
  }

  onRemove() {
    if (this.div) {
      this.div.parentNode?.removeChild(this.div);
      this.div = null;
    }
  }
}

export default function CalFireMap({ onFireSelect }: CalFireMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps API
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry`;
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Create map centered on California
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 36.7783, lng: -119.4179 },
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#4b6cb7' }]
            }
          ]
        });

        // Load and display county boundaries
        try {
          const response = await fetch('/california-counties.geojson');
          const geoData = await response.json();
          
          mapInstance.data.addGeoJson(geoData);
          mapInstance.data.setStyle({
            fillColor: 'transparent',
            strokeColor: '#666666',
            strokeWeight: 2,
            strokeOpacity: 0.8,
            clickable: true
          });

          // County click handler
          mapInstance.data.addListener('click', (event: any) => {
            const countyName = event.feature.getProperty('NAME');
            setSelectedCounty(countyName);
            
            if (onFireSelect) {
              const countyFires = mockFireData.filter(
                fire => fire.county === countyName
              );
              
              onFireSelect({
                county: countyName,
                fires: countyFires.map(fire => ({
                  name: fire.name,
                  acres: fire.acres,
                  startDate: '2024-11-01',
                  containment: fire.containment,
                  cause: 'Under Investigation'
                }))
              });
            }
          });

        } catch (err) {
          console.warn('Could not load county boundaries:', err);
        }

        // Add fire overlays
        mockFireData.forEach(fire => {
          // Fire perimeter polygon
          if (fire.perimeter) {
            const firePolygon = new google.maps.Polygon({
              paths: fire.perimeter,
              fillColor: fire.status === 'Active' ? '#ff0000' : '#ffaa00',
              fillOpacity: 0.3,
              strokeColor: fire.status === 'Active' ? '#cc0000' : '#dd8800',
              strokeWeight: 2,
              strokeOpacity: 0.8
            });
            firePolygon.setMap(mapInstance);
          }

          // Fire overlay marker
          const fireOverlay = new FireOverlay(fire, (selectedFire) => {
            if (onFireSelect) {
              onFireSelect({
                county: selectedFire.county,
                fires: [{
                  name: selectedFire.name,
                  acres: selectedFire.acres,
                  startDate: '2024-11-01',
                  containment: selectedFire.containment,
                  cause: 'Under Investigation'
                }]
              });
            }
          });
          fireOverlay.setMap(mapInstance);
        });

        setMap(mapInstance);
        setIsLoading(false);

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Using API key placeholder - please configure Google Maps API.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (map) {
        // Cleanup if needed
      }
    };
  }, [onFireSelect]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-lg font-semibold mb-2">Map Configuration Needed</div>
          <div className="text-gray-600 text-sm mb-4">{error}</div>
          <div className="text-xs text-gray-500">
            Add your Google Maps API key to enable the interactive map
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <div className="text-gray-600">Loading geospatial fire map...</div>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full min-h-[400px] md:min-h-[600px]" />
      
      {selectedCounty && !isLoading && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
          <p className="text-sm font-semibold">Selected: {selectedCounty} County</p>
          <p className="text-xs text-gray-600">Click fires for detailed information</p>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
        <h4 className="text-sm font-semibold mb-2">Fire Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span>Active Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟡</span>
            <span>Contained Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-gray-600"></div>
            <span>County Boundaries</span>
          </div>
        </div>
      </div>
    </div>
  );
}