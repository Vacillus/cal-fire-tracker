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
  started_date?: string;
  cause?: string;
}

// Professional Navigation Bar
const NavigationBar = ({ 
  mutationMode, 
  setMutationMode,
  activeCount,
  totalAcres
}: { 
  mutationMode: boolean; 
  setMutationMode: (mode: boolean) => void;
  activeCount: number;
  totalAcres: number;
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold text-blue-900">CAL FIRE</span>
              <span className="ml-2 text-xl text-yellow-600">TRACKER</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-900 px-3 py-2 text-sm font-medium">
                Active Incidents
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-900 px-3 py-2 text-sm font-medium">
                Resources
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-900 px-3 py-2 text-sm font-medium">
                Historical Data
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-900 px-3 py-2 text-sm font-medium">
                API Status
              </a>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Live Status Indicators */}
            <div className="hidden lg:flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-gray-600">{activeCount} Active</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">{(totalAcres / 1000).toFixed(0)}K Acres</span>
              </div>
            </div>

            {/* Forensic Mode Toggle */}
            <button
              onClick={() => setMutationMode(!mutationMode)}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                mutationMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Forensic Mode
            </button>

            {/* Academy Badge */}
            <div className="text-xs text-gray-500 border-l pl-4">
              Chinchilla AI Academy
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Fire Information Panel
const FireInfoPanel = ({ 
  fire, 
  onClose 
}: { 
  fire: FireData | null; 
  onClose: () => void;
}) => {
  if (!fire) return null;

  return (
    <div className="absolute top-20 left-4 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-blue-50">
        <h3 className="font-semibold text-gray-900">{fire.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            fire.status === 'Active' 
              ? 'bg-red-100 text-red-800' 
              : fire.status === 'Controlled'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {fire.status}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Location</span>
          <span className="text-sm font-medium text-gray-900">{fire.county} County</span>
        </div>

        {/* Size */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Size</span>
          <span className="text-sm font-medium text-gray-900">{fire.acres.toLocaleString()} acres</span>
        </div>

        {/* Containment */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Containment</span>
            <span className="text-sm font-medium text-gray-900">{fire.containment}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                fire.containment === 100 ? 'bg-green-500' :
                fire.containment >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${fire.containment}%` }}
            />
          </div>
        </div>

        {/* Resources */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Personnel</span>
          <span className="text-sm font-medium text-gray-900">{fire.personnel.toLocaleString()}</span>
        </div>

        {/* Threats */}
        {fire.structures_threatened > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Structures Threatened</span>
            <span className="text-sm font-medium text-orange-600">{fire.structures_threatened}</span>
          </div>
        )}

        {/* Evacuation Warning */}
        {fire.evacuation_orders && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs font-medium text-red-800">⚠ Evacuation Orders in Effect</p>
          </div>
        )}

        {/* Last Update */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">Updated: {fire.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

// Fire List Sidebar
const FireListSidebar = ({ 
  fires, 
  selectedFire, 
  onSelectFire,
  searchQuery,
  onSearchChange
}: {
  fires: FireData[];
  selectedFire: FireData | null;
  onSelectFire: (fire: FireData) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search fires or counties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-100 flex gap-2">
        <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md">
          All Fires
        </button>
        <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          Active Only
        </button>
        <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          Evacuations
        </button>
      </div>

      {/* Fire List */}
      <div className="flex-1 overflow-y-auto">
        {fires.map((fire) => (
          <div
            key={fire.id}
            onClick={() => onSelectFire(fire)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedFire?.id === fire.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-sm text-gray-900">{fire.name}</h4>
              {fire.status === 'Active' && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">{fire.county} County</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">{(fire.acres / 1000).toFixed(1)}K acres</span>
              <span className={`text-xs font-medium ${
                fire.containment === 100 ? 'text-green-600' :
                fire.containment >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {fire.containment}% contained
              </span>
            </div>
            {fire.evacuation_orders && (
              <p className="text-xs text-red-600 mt-1">Evacuations active</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Map Component
const CaliforniaMap = ({ 
  fires, 
  selectedFire, 
  onFireClick 
}: { 
  fires: FireData[]; 
  selectedFire: FireData | null;
  onFireClick: (fire: FireData) => void;
}) => {
  const latLngToSvg = (lat: number, lng: number) => {
    const x = ((lng + 124.5) / 10) * 400 + 50;
    const y = 600 - ((lat - 32) / 10) * 500;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <svg viewBox="0 0 500 700" className="w-full h-full">
        {/* California Outline */}
        <path
          d="M 120 50 L 140 70 L 150 100 L 155 140 L 160 180 L 165 220 L 162 260 L 158 300 L 155 340 L 150 380 L 145 420 L 140 460 L 135 500 L 130 540 L 125 580 L 120 620 L 110 650 L 100 640 L 95 600 L 90 560 L 85 520 L 80 480 L 75 440 L 70 400 L 65 360 L 60 320 L 55 280 L 50 240 L 45 200 L 40 160 L 35 120 L 40 80 L 50 60 L 70 45 L 90 40 L 110 45 Z"
          fill="#fef3c7"
          stroke="#1e40af"
          strokeWidth="2"
        />
        
        {/* Fire Markers */}
        {fires.map((fire) => {
          const pos = latLngToSvg(fire.lat, fire.lng);
          const radius = Math.min(Math.sqrt(fire.acres / 10000) * 2, 20);
          const isSelected = selectedFire?.id === fire.id;
          
          return (
            <g key={fire.id} onClick={() => onFireClick(fire)} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={fire.status === 'Active' ? '#dc2626' : fire.status === 'Controlled' ? '#f59e0b' : '#10b981'}
                fillOpacity={isSelected ? 0.8 : 0.5}
                stroke={isSelected ? '#1e40af' : '#ffffff'}
                strokeWidth={isSelected ? 2 : 1}
              />
              {fire.status === 'Active' && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius * 1.5}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="0.5"
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              <text 
                x={pos.x} 
                y={pos.y - radius - 5} 
                fontSize="9" 
                fill="#1e40af" 
                textAnchor="middle"
                className="font-medium"
              >
                {fire.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs">
        <p className="font-medium text-gray-700 mb-2">Fire Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Controlled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Contained</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Forensic Console
const ForensicConsole = ({ logs }: { logs: string[] }) => {
  return (
    <div className="absolute bottom-4 left-4 w-96 bg-black/90 text-green-400 rounded-lg shadow-xl p-3 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="text-purple-400">FORENSIC_CONSOLE</span>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="opacity-80 hover:opacity-100">{log}</div>
        ))}
      </div>
    </div>
  );
};

export default function CAFireWatchDashboard() {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mutationMode, setMutationMode] = useState(false);
  const [forensicLogs, setForensicLogs] = useState<string[]>([]);

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
        evacuation_orders: false,
        started_date: '2024-07-24',
        cause: 'Arson'
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
  }, []);

  useEffect(() => {
    if (mutationMode) {
      const initialLogs = [
        `[${new Date().toISOString()}] FORENSIC_MODE: ACTIVATED`,
        `[${new Date().toISOString()}] SCAN: ${fireData.length} incidents detected`,
        `[${new Date().toISOString()}] TRACKING: Mutations enabled`
      ];
      setForensicLogs(initialLogs);
      
      const interval = setInterval(() => {
        const logs = [
          `MUTATION: Containment update at idx ${Math.floor(Math.random() * fireData.length)}`,
          `LAMBDA: CAL FIRE API call - ${Math.floor(Math.random() * 300)}ms`,
          `DYNAMODB: Write confirmed - TTL ${Date.now() + 86400000}`,
          `ANOMALY: Data variance detected`,
          `SNAPSHOT: State preserved`
        ];
        
        setForensicLogs(prev => [...prev.slice(-6), `[${new Date().toISOString()}] ${logs[Math.floor(Math.random() * logs.length)]}`]);
      }, 3000);
      
      return () => clearInterval(interval);
    } else {
      setForensicLogs([]);
    }
  }, [mutationMode, fireData.length]);

  const filteredFires = fireData.filter(fire =>
    fire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fire.county.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = fireData.filter(f => f.status === 'Active').length;
  const totalAcres = fireData.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <NavigationBar
        mutationMode={mutationMode}
        setMutationMode={setMutationMode}
        activeCount={activeCount}
        totalAcres={totalAcres}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fire List Sidebar */}
        <FireListSidebar
          fires={filteredFires}
          selectedFire={selectedFire}
          onSelectFire={setSelectedFire}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Map Area */}
        <div className="flex-1 relative">
          <CaliforniaMap
            fires={fireData}
            selectedFire={selectedFire}
            onFireClick={setSelectedFire}
          />
          
          {/* Fire Detail Panel */}
          {selectedFire && (
            <FireInfoPanel
              fire={selectedFire}
              onClose={() => setSelectedFire(null)}
            />
          )}
          
          {/* Forensic Console */}
          {mutationMode && <ForensicConsole logs={forensicLogs} />}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Data Source: CAL FIRE API</span>
            <span>•</span>
            <span>Updates every 30 minutes</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{fireData.length} Total Incidents</span>
            <span>•</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}