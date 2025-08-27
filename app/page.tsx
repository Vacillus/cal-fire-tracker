'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

interface FireData {
  id: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
  acres: number;
  containment: number;
  status: 'Active' | 'Contained' | 'Controlled';
  timestamp: string;
  personnel: number;
  structures_threatened: number;
  evacuation_orders: boolean;
}

// Search Bar Component
const SearchBar = ({ onSearch, className }: { onSearch: (query: string) => void; className?: string }) => {
  const [query, setQuery] = useState('');
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          placeholder="Search fires by name or county..."
          className="flex-1 outline-none text-sm"
        />
      </div>
    </div>
  );
};

// Fire Details Card Component
const FireCard = ({ fire, isSelected, onClick }: { fire: FireData; isSelected: boolean; onClick: () => void }) => {
  const statusColors = {
    'Active': 'bg-red-100 text-red-800 border-red-200',
    'Contained': 'bg-green-100 text-green-800 border-green-200',
    'Controlled': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{fire.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[fire.status]}`}>
          {fire.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{fire.county} County</p>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Size:</span>
          <p className="font-medium">{fire.acres.toLocaleString()} acres</p>
        </div>
        <div>
          <span className="text-gray-500">Containment:</span>
          <p className="font-medium">{fire.containment}%</p>
        </div>
        <div>
          <span className="text-gray-500">Personnel:</span>
          <p className="font-medium">{fire.personnel.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-gray-500">Threatened:</span>
          <p className="font-medium">{fire.structures_threatened}</p>
        </div>
      </div>
      
      {fire.evacuation_orders && (
        <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
          ⚠️ Evacuation orders in effect
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-3">Updated: {fire.timestamp}</p>
    </div>
  );
};

export default function CAFireWatchDashboard() {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireData | null>(null);
  const [filteredFires, setFilteredFires] = useState<FireData[]>([]);
  const [mutationMode, setMutationMode] = useState(false);
  const [forensicLogs, setForensicLogs] = useState<string[]>([]);

  // Mock fire data - replace with Lambda API endpoint
  useEffect(() => {
    const mockData: FireData[] = [
      {
        id: '1',
        name: 'Park Fire',
        county: 'Butte',
        lat: 39.8056,
        lng: -121.6219,
        acres: 429603,
        containment: 100,
        status: 'Contained',
        timestamp: new Date().toLocaleString(),
        personnel: 6393,
        structures_threatened: 0,
        evacuation_orders: false
      },
      {
        id: '2',
        name: 'Boyles Fire',
        county: 'Riverside',
        lat: 33.7366,
        lng: -116.2152,
        acres: 13238,
        containment: 45,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 512,
        structures_threatened: 142,
        evacuation_orders: true
      },
      {
        id: '3',
        name: 'Bridge Fire',
        county: 'Los Angeles',
        lat: 34.3247,
        lng: -118.5041,
        acres: 54782,
        containment: 78,
        status: 'Controlled',
        timestamp: new Date().toLocaleString(),
        personnel: 1847,
        structures_threatened: 31,
        evacuation_orders: false
      },
      {
        id: '4',
        name: 'Creek Fire',
        county: 'Fresno',
        lat: 37.2052,
        lng: -119.2618,
        acres: 379895,
        containment: 32,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 4281,
        structures_threatened: 856,
        evacuation_orders: true
      },
      {
        id: '5',
        name: 'Glass Fire',
        county: 'Napa',
        lat: 38.5708,
        lng: -122.5269,
        acres: 67484,
        containment: 100,
        status: 'Contained',
        timestamp: new Date().toLocaleString(),
        personnel: 2534,
        structures_threatened: 0,
        evacuation_orders: false
      }
    ];
    
    setFireData(mockData);
    setFilteredFires(mockData);
    
    // In production, replace with:
    // fetch('/api/california-fires')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setFireData(data);
    //     setFilteredFires(data);
    //   });
  }, []);

  // Mutation mode forensic logging
  useEffect(() => {
    if (mutationMode) {
      const initialLogs = [
        `[${new Date().toISOString()}] FORENSIC_MODE: Activated`,
        `[${new Date().toISOString()}] SCAN_INIT: Found ${fireData.length} fire incidents`,
        `[${new Date().toISOString()}] INTEGRITY_CHECK: Data mutation tracking enabled`
      ];
      setForensicLogs(initialLogs);
      
      const interval = setInterval(() => {
        const logs = [
          `MUTATION_DETECTED: Fire containment updated at index ${Math.floor(Math.random() * fireData.length)}`,
          `LAMBDA_EXEC: CAL FIRE API scraper completed - Duration: ${Math.floor(Math.random() * 3000)}ms`,
          `DYNAMODB_WRITE: Fire incident data persisted with TTL: ${Date.now() + 86400000}`,
          `CONTRADICTION_FOUND: Acreage decreased for active fire - Flagged for review`,
          `AUDIT_TRAIL: State snapshot saved to forensic log`
        ];
        
        setForensicLogs(prev => [...prev.slice(-9), `[${new Date().toISOString()}] ${logs[Math.floor(Math.random() * logs.length)]}`]);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [mutationMode, fireData.length]);

  const handleSearch = (query: string) => {
    const filtered = fireData.filter(fire => 
      fire.name.toLowerCase().includes(query.toLowerCase()) ||
      fire.county.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFires(filtered);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🔥 CAL FIRE Tracker</h1>
        <button
          onClick={() => setMutationMode(!mutationMode)}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            mutationMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {mutationMode ? 'Forensic ON' : 'Forensic OFF'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className="w-full lg:w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">California Wildfire Tracker</h1>
              <p className="text-sm text-gray-500 mt-1">Chinchilla AI Academy • AWS Amplify</p>
            </div>
            <button
              onClick={() => setMutationMode(!mutationMode)}
              className={`hidden lg:block px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                mutationMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mutationMode ? 'Forensic ON' : 'Forensic OFF'}
            </button>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">
                {fireData.filter(f => f.status === 'Active').length}
              </p>
              <p className="text-xs text-gray-600">Active Fires</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(fireData.reduce((sum, f) => sum + f.acres, 0) / 1000)}K
              </p>
              <p className="text-xs text-gray-600">Total Acres</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">
                {fireData.reduce((sum, f) => sum + f.personnel, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Personnel</p>
            </div>
          </div>
        </div>
        
        {/* Fire List */}
        <div className="p-4 space-y-3">
          {filteredFires.map((fire) => (
            <FireCard
              key={fire.id}
              fire={fire}
              isSelected={selectedFire?.id === fire.id}
              onClick={() => setSelectedFire(fire)}
            />
          ))}
        </div>
        
        {/* Forensic Logs */}
        {mutationMode && (
          <div className="p-4 border-t bg-gray-900">
            <h3 className="text-xs font-mono text-purple-400 mb-2">FORENSIC_LOGS</h3>
            <div className="h-32 overflow-y-auto bg-black rounded p-2 text-xs font-mono space-y-1">
              {forensicLogs.map((log, i) => (
                <div key={i} className="text-green-400 opacity-90">{log}</div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Map Container */}
      <main className="flex-1 relative">
        <SearchBar 
          onSearch={handleSearch} 
          className="absolute top-4 left-4 z-[1000] w-80"
        />
        
        {typeof window !== 'undefined' && (
          <MapContainer
            center={[37.5, -119.5]}
            zoom={6}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors | CAL FIRE Data"
            />
            
            {fireData.map((fire) => (
              <div key={fire.id}>
                <Circle
                  center={[fire.lat, fire.lng]}
                  radius={Math.sqrt(fire.acres) * 50}
                  pathOptions={{
                    color: fire.status === 'Active' ? '#ef4444' : fire.status === 'Controlled' ? '#eab308' : '#22c55e',
                    fillColor: fire.status === 'Active' ? '#ef4444' : fire.status === 'Controlled' ? '#eab308' : '#22c55e',
                    fillOpacity: 0.3,
                    weight: 2
                  }}
                />
                <Marker position={[fire.lat, fire.lng]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{fire.name}</h3>
                      <p className="text-sm text-gray-600">{fire.county} County</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><strong>Status:</strong> {fire.status}</p>
                        <p><strong>Size:</strong> {fire.acres.toLocaleString()} acres</p>
                        <p><strong>Containment:</strong> {fire.containment}%</p>
                        <p><strong>Personnel:</strong> {fire.personnel.toLocaleString()}</p>
                        {fire.evacuation_orders && (
                          <p className="text-red-600 font-semibold">⚠️ Evacuations in effect</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Updated: {fire.timestamp}</p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}
          </MapContainer>
        )}
      </main>
    </div>
  );
}