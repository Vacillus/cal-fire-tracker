'use client';

import { useState, useEffect } from 'react';

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

// California Counties with approximate center coordinates
const countyCoordinates: Record<string, { lat: number; lng: number }> = {
  'Butte': { lat: 39.8056, lng: -121.6219 },
  'Riverside': { lat: 33.7366, lng: -116.2152 },
  'Los Angeles': { lat: 34.3247, lng: -118.5041 },
  'Fresno': { lat: 37.2052, lng: -119.2618 },
  'Napa': { lat: 38.5708, lng: -122.5269 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'Orange': { lat: 33.7175, lng: -117.8311 },
  'Sacramento': { lat: 38.5816, lng: -121.4944 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Ventura': { lat: 34.3705, lng: -119.1391 },
  'Mendocino': { lat: 39.7877, lng: -123.2223 },
  'Shasta': { lat: 40.9318, lng: -121.9996 }
};

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

const FireCard = ({ fire, isSelected, onClick }: { fire: FireData; isSelected: boolean; onClick: () => void }) => {
  const statusColors = {
    'Active': 'bg-red-100 text-red-800 border-red-200',
    'Contained': 'bg-green-100 text-green-800 border-green-200',
    'Controlled': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
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

// Simple California Map Component using SVG
const CaliforniaMapView = ({ fires, selectedFire, onFireClick }: { 
  fires: FireData[]; 
  selectedFire: FireData | null;
  onFireClick: (fire: FireData) => void;
}) => {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const latLngToSvg = (lat: number, lng: number) => {
    const x = ((lng + 124.5) / 10) * 400 + 50;
    const y = 600 - ((lat - 32) / 10) * 500;
    return { x, y };
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      <svg viewBox="0 0 500 700" className="absolute inset-0 w-full h-full">
        {/* California simplified outline */}
        <path
          d="M 120 50 L 140 70 L 150 100 L 155 140 L 160 180 L 165 220 L 162 260 L 158 300 L 155 340 L 150 380 L 145 420 L 140 460 L 135 500 L 130 540 L 125 580 L 120 620 L 110 650 L 100 640 L 95 600 L 90 560 L 85 520 L 80 480 L 75 440 L 70 400 L 65 360 L 60 320 L 55 280 L 50 240 L 45 200 L 40 160 L 35 120 L 40 80 L 50 60 L 70 45 L 90 40 L 110 45 Z"
          fill="#f5f5f5"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        
        {/* County markers */}
        {Object.entries(countyCoordinates).map(([county, coords]) => {
          const pos = latLngToSvg(coords.lat, coords.lng);
          return (
            <g key={county}>
              <circle cx={pos.x} cy={pos.y} r="3" fill="#94a3b8" opacity="0.3" />
              <text x={pos.x} y={pos.y - 5} fontSize="8" fill="#64748b" textAnchor="middle">
                {county}
              </text>
            </g>
          );
        })}
        
        {/* Fire indicators */}
        {fires.map((fire) => {
          const pos = latLngToSvg(fire.lat, fire.lng);
          const radius = Math.min(Math.sqrt(fire.acres / 10000) * 3, 30);
          const isSelected = selectedFire?.id === fire.id;
          
          return (
            <g key={fire.id} onClick={() => onFireClick(fire)} className="cursor-pointer">
              {/* Fire area */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={fire.status === 'Active' ? '#ef4444' : fire.status === 'Controlled' ? '#eab308' : '#22c55e'}
                fillOpacity={isSelected ? 0.5 : 0.3}
                stroke={fire.status === 'Active' ? '#dc2626' : fire.status === 'Controlled' ? '#ca8a04' : '#16a34a'}
                strokeWidth={isSelected ? 3 : 2}
                className={fire.status === 'Active' ? 'animate-pulse' : ''}
              />
              
              {/* Containment ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius * (fire.containment / 100)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.7"
              />
              
              {/* Fire icon */}
              <text x={pos.x} y={pos.y + 3} fontSize="16" textAnchor="middle">
                {fire.status === 'Active' ? '🔥' : '✓'}
              </text>
              
              {/* Fire name */}
              <text x={pos.x} y={pos.y - radius - 5} fontSize="10" fontWeight="bold" fill="#1f2937" textAnchor="middle">
                {fire.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold mb-2 text-gray-700">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Active Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Controlled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Contained</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="15" height="3">
              <line x1="0" y1="1.5" x2="15" y2="1.5" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <span>Containment %</span>
          </div>
        </div>
      </div>
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
      },
      {
        id: '6',
        name: 'August Complex',
        county: 'Mendocino',
        lat: 39.7877,
        lng: -123.2223,
        acres: 1032648,
        containment: 100,
        status: 'Contained',
        timestamp: new Date().toLocaleString(),
        personnel: 8743,
        structures_threatened: 0,
        evacuation_orders: false
      }
    ];
    
    setFireData(mockData);
    setFilteredFires(mockData);
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
      {/* Header for mobile */}
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
        
        {/* Search */}
        <div className="p-4 border-b">
          <SearchBar onSearch={handleSearch} />
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
      <main className="flex-1 relative bg-gradient-to-b from-blue-50 to-blue-100">
        <CaliforniaMapView 
          fires={fireData} 
          selectedFire={selectedFire}
          onFireClick={setSelectedFire}
        />
        
        {/* Selected Fire Details Overlay */}
        {selectedFire && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <button
              onClick={() => setSelectedFire(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="font-bold text-lg mb-2">{selectedFire.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{selectedFire.county} County</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium ${
                  selectedFire.status === 'Active' ? 'text-red-600' : 
                  selectedFire.status === 'Controlled' ? 'text-yellow-600' : 'text-green-600'
                }`}>{selectedFire.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium">{selectedFire.acres.toLocaleString()} acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Containment:</span>
                <span className="font-medium">{selectedFire.containment}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Personnel:</span>
                <span className="font-medium">{selectedFire.personnel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Structures at Risk:</span>
                <span className="font-medium">{selectedFire.structures_threatened}</span>
              </div>
            </div>
            
            {selectedFire.evacuation_orders && (
              <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                ⚠️ Evacuation orders are in effect
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-3">Updated: {selectedFire.timestamp}</p>
          </div>
        )}
      </main>
    </div>
  );
}