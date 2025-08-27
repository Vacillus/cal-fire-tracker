'use client';

import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

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

const FireCard = ({ fire, isSelected, onClick }: { fire: FireData; isSelected: boolean; onClick: () => void }) => {
  const getStatusStyle = () => {
    switch(fire.status) {
      case 'Active': return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'Controlled': return 'bg-gradient-to-r from-yellow-500 to-orange-400';
      case 'Contained': return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  const getContainmentColor = (percent: number) => {
    if (percent === 100) return 'text-green-600';
    if (percent >= 75) return 'text-blue-600';
    if (percent >= 50) return 'text-yellow-600';
    if (percent >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]' 
          : 'hover:shadow-xl hover:scale-[1.01] shadow-md'
        }`}
      onClick={onClick}
    >
      <div className={`h-1 ${getStatusStyle()}`} />
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {fire.status === 'Active' && (
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md animate-pulse" />
                  <div className="relative w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-900">{fire.name}</h3>
            </div>
            <p className="text-sm text-gray-500">{fire.county} County</p>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${getStatusStyle()}`}>
            {fire.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          {/* Containment Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 font-medium">Containment</span>
              <span className={`text-sm font-bold ${getContainmentColor(fire.containment)}`}>
                {fire.containment}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  fire.containment === 100 ? 'bg-green-500' :
                  fire.containment >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${fire.containment}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Size</p>
              <p className="font-bold text-gray-900">{(fire.acres / 1000).toFixed(1)}K acres</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Personnel</p>
              <p className="font-bold text-gray-900">{fire.personnel.toLocaleString()}</p>
            </div>
          </div>

          {fire.evacuation_orders && (
            <div className="bg-red-50 border-l-4 border-red-500 px-3 py-2 rounded">
              <p className="text-xs font-semibold text-red-800">⚠️ EVACUATION ORDERS IN EFFECT</p>
            </div>
          )}

          {fire.structures_threatened > 0 && (
            <div className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
              <span className="text-xs text-orange-800">Structures at Risk</span>
              <span className="text-sm font-bold text-orange-900">{fire.structures_threatened}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Last Update: {fire.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced California Map
const CaliforniaMapView = ({ fires, selectedFire, onFireClick }: { 
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
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <svg viewBox="0 0 500 700" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="californiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* California Shape */}
        <path
          d="M 120 50 L 140 70 L 150 100 L 155 140 L 160 180 L 165 220 L 162 260 L 158 300 L 155 340 L 150 380 L 145 420 L 140 460 L 135 500 L 130 540 L 125 580 L 120 620 L 110 650 L 100 640 L 95 600 L 90 560 L 85 520 L 80 480 L 75 440 L 70 400 L 65 360 L 60 320 L 55 280 L 50 240 L 45 200 L 40 160 L 35 120 L 40 80 L 50 60 L 70 45 L 90 40 L 110 45 Z"
          fill="url(#californiaGradient)"
          stroke="white"
          strokeWidth="2"
          opacity="0.95"
        />
        
        {/* Fire Indicators */}
        {fires.map((fire) => {
          const pos = latLngToSvg(fire.lat, fire.lng);
          const radius = Math.min(Math.sqrt(fire.acres / 10000) * 3, 40);
          const isSelected = selectedFire?.id === fire.id;
          
          return (
            <g key={fire.id} onClick={() => onFireClick(fire)} className="cursor-pointer">
              {/* Glow effect for active fires */}
              {fire.status === 'Active' && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius * 1.5}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1"
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              
              {/* Fire area */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={fire.status === 'Active' ? '#ef4444' : fire.status === 'Controlled' ? '#eab308' : '#22c55e'}
                fillOpacity={isSelected ? 0.8 : 0.6}
                stroke="white"
                strokeWidth={isSelected ? 3 : 1}
                filter={fire.status === 'Active' ? 'url(#glow)' : ''}
                className="transition-all duration-300"
              />
              
              {/* Fire name label */}
              <text 
                x={pos.x} 
                y={pos.y - radius - 8} 
                fontSize="11" 
                fontWeight="bold" 
                fill="white" 
                textAnchor="middle"
                className="drop-shadow-lg"
              >
                {fire.name}
              </text>
              
              {/* Containment percentage */}
              <text 
                x={pos.x} 
                y={pos.y + 4} 
                fontSize="10" 
                fontWeight="bold" 
                fill="white" 
                textAnchor="middle"
              >
                {fire.containment}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Modern Legend */}
      <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-xl rounded-xl p-4 text-white">
        <h4 className="text-sm font-bold mb-3 text-gray-200">FIRE STATUS</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs">Active Fire</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Controlled</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Contained</span>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-6 left-6 space-y-3">
        <div className="bg-black/70 backdrop-blur-xl rounded-xl px-4 py-3 text-white">
          <p className="text-xs text-gray-400 mb-1">TOTAL ACTIVE</p>
          <p className="text-2xl font-bold">{fires.filter(f => f.status === 'Active').length}</p>
        </div>
        <div className="bg-black/70 backdrop-blur-xl rounded-xl px-4 py-3 text-white">
          <p className="text-xs text-gray-400 mb-1">ACRES BURNED</p>
          <p className="text-2xl font-bold">{Math.round(fires.reduce((sum, f) => sum + f.acres, 0) / 1000)}K</p>
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
        evacuation_orders: true,
        started_date: '2024-08-25',
        cause: 'Under Investigation'
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
        evacuation_orders: false,
        started_date: '2024-08-20',
        cause: 'Lightning'
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
        evacuation_orders: true,
        started_date: '2024-08-18',
        cause: 'Unknown'
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
        evacuation_orders: false,
        started_date: '2024-08-10',
        cause: 'Vehicle'
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
        evacuation_orders: false,
        started_date: '2020-08-16',
        cause: 'Lightning'
      }
    ];
    
    setFireData(mockData);
    setFilteredFires(mockData);
  }, []);

  useEffect(() => {
    if (mutationMode) {
      const initialLogs = [
        `[${new Date().toISOString()}] FORENSIC_MODE: ACTIVATED`,
        `[${new Date().toISOString()}] SCAN_COMPLETE: ${fireData.length} incidents detected`,
        `[${new Date().toISOString()}] INTEGRITY_CHECK: Mutation tracking enabled`
      ];
      setForensicLogs(initialLogs);
      
      const interval = setInterval(() => {
        const logs = [
          `MUTATION_DETECTED: Containment delta at index ${Math.floor(Math.random() * fireData.length)}`,
          `LAMBDA_EXEC: CAL FIRE scraper - latency: ${Math.floor(Math.random() * 3000)}ms`,
          `DYNAMODB_WRITE: Persisted with TTL: ${Date.now() + 86400000}`,
          `CONTRADICTION: Acreage regression detected - flagged for audit`,
          `SNAPSHOT: State preserved in mutation log`
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
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-96 bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1s-5 4.68-5 10c0 2.76 2.24 5 5 5s5-2.24 5-5c0-5.32-5-10-5-10z"/>
                </svg>
                CAL FIRE WATCH
              </h1>
              <p className="text-sm opacity-90 mt-1">Chinchilla AI Academy</p>
            </div>
            <button
              onClick={() => setMutationMode(!mutationMode)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                mutationMode 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {mutationMode ? 'FORENSIC ON' : 'FORENSIC OFF'}
            </button>
          </div>
          
          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <p className="text-3xl font-bold">{fireData.filter(f => f.status === 'Active').length}</p>
              <p className="text-xs opacity-90">Active</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <p className="text-3xl font-bold">{Math.round(fireData.reduce((sum, f) => sum + f.acres, 0) / 1000)}K</p>
              <p className="text-xs opacity-90">Acres</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3">
              <p className="text-3xl font-bold">{fireData.reduce((sum, f) => sum + f.personnel, 0) / 1000}K</p>
              <p className="text-xs opacity-90">Personnel</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-50">
          <SearchBar className="w-full" onSearch={handleSearch} />
        </div>

        {/* Fire List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {filteredFires.map((fire) => (
            <FireCard
              key={fire.id}
              fire={fire}
              isSelected={selectedFire?.id === fire.id}
              onClick={() => setSelectedFire(fire)}
            />
          ))}
        </div>

        {/* Forensic Terminal */}
        {mutationMode && (
          <div className="bg-black p-4 border-t-4 border-purple-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-purple-400">FORENSIC_TERMINAL</h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="h-32 overflow-y-auto bg-gray-900 rounded p-2 font-mono text-xs">
              {forensicLogs.map((log, i) => (
                <div key={i} className="text-green-400 opacity-90 mb-1">{log}</div>
              ))}
              <div className="text-purple-400 animate-pulse">█</div>
            </div>
          </div>
        )}
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <CaliforniaMapView 
          fires={fireData} 
          selectedFire={selectedFire}
          onFireClick={setSelectedFire}
        />
        
        {/* Selected Fire Detail Popup */}
        {selectedFire && (
          <div className="absolute top-6 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideIn">
            <div className={`h-2 bg-gradient-to-r ${
              selectedFire.status === 'Active' ? 'from-red-500 to-orange-500' :
              selectedFire.status === 'Controlled' ? 'from-yellow-500 to-orange-400' :
              'from-green-500 to-emerald-500'
            }`} />
            
            <div className="p-6">
              <button
                onClick={() => setSelectedFire(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedFire.name}</h2>
              <p className="text-gray-600 mb-4">{selectedFire.county} County</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className={`font-bold ${
                    selectedFire.status === 'Active' ? 'text-red-600' :
                    selectedFire.status === 'Controlled' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{selectedFire.status}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Containment</p>
                  <p className="font-bold text-gray-900">{selectedFire.containment}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-bold text-gray-900">{selectedFire.acres.toLocaleString()} acres</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Personnel</p>
                  <p className="font-bold text-gray-900">{selectedFire.personnel.toLocaleString()}</p>
                </div>
              </div>
              
              {selectedFire.cause && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Cause</p>
                  <p className="font-semibold text-gray-900">{selectedFire.cause}</p>
                </div>
              )}
              
              {selectedFire.evacuation_orders && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="text-sm font-bold text-red-800">⚠️ EVACUATION ORDERS ACTIVE</p>
                  <p className="text-xs text-red-700 mt-1">{selectedFire.structures_threatened} structures at risk</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}