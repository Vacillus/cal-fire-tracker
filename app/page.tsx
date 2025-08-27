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
        `FORENSIC_MODE: ACTIVATED`,
        `SCAN: ${fireData.length} incidents detected`,
        `TRACKING: Mutations enabled`
      ];
      setForensicLogs(initialLogs);
      
      const interval = setInterval(() => {
        const logs = [
          `MUTATION: Containment update`,
          `LAMBDA: CAL FIRE API call`,
          `DYNAMODB: Write confirmed`,
          `ANOMALY: Data variance detected`,
          `SNAPSHOT: State preserved`
        ];
        
        setForensicLogs(prev => [...prev.slice(-4), logs[Math.floor(Math.random() * logs.length)]]);
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
    <div className="h-screen flex">
      <div className="lg:w-1/3 w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="grid gap-4">
            <div>
              <h1 className="text-base lg:text-lg font-semibold text-blue-900">CAL FIRE</h1>
              <p className="text-base text-yellow-600">TRACKER</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search fires or counties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="text-gray-600">{activeCount} Active</span>
              <span className="text-gray-600">{(totalAcres / 1000).toFixed(0)}K Acres</span>
              <button
                onClick={() => setMutationMode(!mutationMode)}
                className={`px-3 py-1 text-base font-medium rounded-md transition-colors ${
                  mutationMode 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Forensic
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-4">
            {filteredFires.map((fire) => (
              <div
                key={fire.id}
                onClick={() => setSelectedFire(fire)}
                className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedFire?.id === fire.id ? 'bg-blue-50 border-blue-300' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-base lg:text-lg font-medium text-gray-900">{fire.name}</h3>
                  {fire.status === 'Active' && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-base text-gray-500 mt-1">{fire.county} County</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-base text-gray-600">{(fire.acres / 1000).toFixed(1)}K acres</span>
                  <span className={`text-base font-medium ${
                    fire.containment === 100 ? 'text-green-600' :
                    fire.containment >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {fire.containment}%
                  </span>
                </div>
                {fire.evacuation_orders && (
                  <p className="text-base text-red-600 mt-1">Evacuations active</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-full w-full z-0">
        <div className="relative h-full w-full bg-gray-50">
          <svg viewBox="0 0 500 700" className="w-full h-full">
            <path
              d="M 120 50 L 140 70 L 150 100 L 155 140 L 160 180 L 165 220 L 162 260 L 158 300 L 155 340 L 150 380 L 145 420 L 140 460 L 135 500 L 130 540 L 125 580 L 120 620 L 110 650 L 100 640 L 95 600 L 90 560 L 85 520 L 80 480 L 75 440 L 70 400 L 65 360 L 60 320 L 55 280 L 50 240 L 45 200 L 40 160 L 35 120 L 40 80 L 50 60 L 70 45 L 90 40 L 110 45 Z"
              fill="#fef3c7"
              stroke="#1e40af"
              strokeWidth="2"
            />
            
            {filteredFires.map((fire) => {
              const x = ((fire.lng + 124.5) / 10) * 400 + 50;
              const y = 600 - ((fire.lat - 32) / 10) * 500;
              const radius = Math.min(Math.sqrt(fire.acres / 10000) * 2, 20);
              const isSelected = selectedFire?.id === fire.id;
              
              return (
                <g key={fire.id} onClick={() => setSelectedFire(fire)} className="cursor-pointer">
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={fire.status === 'Active' ? '#dc2626' : fire.status === 'Controlled' ? '#f59e0b' : '#10b981'}
                    fillOpacity={isSelected ? 0.8 : 0.5}
                    stroke={isSelected ? '#1e40af' : '#ffffff'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text 
                    x={x} 
                    y={y - radius - 5} 
                    fontSize="10" 
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
          
          {selectedFire && (
            <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">{selectedFire.name}</h3>
                <button
                  onClick={() => setSelectedFire(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-base font-medium rounded ${
                    selectedFire.status === 'Active' 
                      ? 'bg-red-100 text-red-800' 
                      : selectedFire.status === 'Controlled'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedFire.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">County</span>
                  <span className="text-base font-medium text-gray-900">{selectedFire.county}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Size</span>
                  <span className="text-base font-medium text-gray-900">{selectedFire.acres.toLocaleString()} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Containment</span>
                  <span className="text-base font-medium text-gray-900">{selectedFire.containment}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Personnel</span>
                  <span className="text-base font-medium text-gray-900">{selectedFire.personnel.toLocaleString()}</span>
                </div>
                {selectedFire.evacuation_orders && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-base font-medium text-red-800">Evacuation Orders in Effect</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {mutationMode && (
            <div className="absolute bottom-4 left-4 w-80 bg-black/90 text-green-400 rounded-lg p-4 font-mono text-base">
              <div className="flex justify-between items-center mb-2">
                <span className="text-purple-400">FORENSIC_CONSOLE</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-1">
                {forensicLogs.map((log, i) => (
                  <div key={i} className="opacity-80">{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}