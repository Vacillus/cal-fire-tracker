'use client';

import { useState, useEffect } from 'react';
import FireDetailModal from './components/FireDetailModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        county: 'Lake',
        lat: 39.10,
        lng: -122.93,
        acres: 76,
        containment: 100,
        status: 'Contained',
        timestamp: new Date().toLocaleString(),
        personnel: 120,
        structures_threatened: 10,
        evacuation_orders: false,
        started_date: '2024-07-30'
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
        timestamp: new Date().toLocaleString(),
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
        timestamp: new Date().toLocaleString(),
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
        timestamp: new Date().toLocaleString(),
        personnel: 850,
        structures_threatened: 300,
        evacuation_orders: true,
        started_date: '2024-11-15'
      }
    ];
    setFireData(mockData);
  }, []);

  const filteredData = fireData.filter(fire =>
    fire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fire.county.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = filteredData.filter(f => f.status === 'Active').length;
  const totalAcres = filteredData.reduce((sum, f) => sum + f.acres, 0);

  const transformLat = (lat: number) => {
    return 700 - ((lat - 32.5) * 700 / 10);
  };

  const transformLng = (lng: number) => {
    return ((lng + 124) * 500 / 10);
  };

  const californiaPath = "M 60 650 L 30 600 L 20 550 L 15 500 L 12 450 L 10 400 L 12 350 L 15 300 L 20 250 L 25 200 L 30 150 L 40 100 L 50 70 L 70 50 L 100 40 L 150 35 L 200 40 L 250 50 L 300 70 L 350 100 L 400 140 L 440 180 L 460 230 L 470 280 L 475 330 L 470 380 L 460 430 L 440 480 L 410 520 L 370 560 L 320 590 L 260 610 L 200 625 L 140 640 L 90 650 Z";

  return (
    <>
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="lg:w-1/3 w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-6 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="grid gap-4">
            <div>
              <h1 className="text-2xl font-bold">CAL FIRE</h1>
              <p className="text-sm text-orange-100">Real-Time Fire Tracking System</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search fires or counties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">{activeCount} Active Fires</span>
              <span className="text-white/80">{(totalAcres / 1000).toFixed(0)}K Total Acres</span>
            </div>
            <button
              onClick={() => setMutationMode(!mutationMode)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all transform hover:scale-105 ${
                mutationMode
                  ? 'bg-white text-red-600 hover:bg-red-50'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {mutationMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 space-y-3">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">No fires found</p>
              </div>
            ) : (
              filteredData.map((fire) => (
                <div
                  key={fire.id}
                  className={`p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                    selectedFire?.id === fire.id ? 'border-orange-500 shadow-lg ring-2 ring-orange-200' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedFire(fire);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{fire.name}</h3>
                    {fire.status === 'Active' && (
                      <div className="relative">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{fire.county} County</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {(fire.acres / 1000).toFixed(1)}K acres
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div 
                          className={`h-2 rounded-full ${
                            fire.containment === 100 ? 'bg-green-500' : 
                            fire.containment > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{width: `${fire.containment}%`}}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${
                        fire.containment === 100 ? 'text-green-600' : 
                        fire.containment > 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {fire.containment}%
                      </span>
                    </div>
                  </div>
                  {fire.evacuation_orders && (
                    <div className="mt-2 flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Evacuation Orders Active
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 relative h-full w-full z-0">
        <div className="relative h-full w-full bg-gradient-to-br from-gray-100 to-gray-200">
          <svg viewBox="0 0 500 700" className="w-full h-full drop-shadow-lg">
            <path
              d={californiaPath}
              fill="url(#gradient)"
              stroke="#4b5563"
              strokeWidth="1.5"
              className="drop-shadow-md"
            />
            {filteredData.map((fire) => (
              <g key={fire.id} onClick={() => {
                setSelectedFire(fire);
                setIsModalOpen(true);
              }} className="cursor-pointer group">
                <circle
                  cx={transformLng(fire.lng)}
                  cy={transformLat(fire.lat)}
                  r={Math.sqrt(fire.acres / 1000) * 2}
                  fill={fire.status === 'Active' ? '#dc2626' : '#f59e0b'}
                  opacity="0.6"
                  className="group-hover:opacity-80 transition-opacity"
                />
                {fire.status === 'Active' && (
                  <>
                    <circle
                      cx={transformLng(fire.lng)}
                      cy={transformLat(fire.lat)}
                      r={Math.sqrt(fire.acres / 1000) * 2}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                    <circle
                      cx={transformLng(fire.lng)}
                      cy={transformLat(fire.lat)}
                      r={Math.sqrt(fire.acres / 1000) * 2 + 5}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="1"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  </>
                )}
                <text
                  x={transformLng(fire.lng)}
                  y={transformLat(fire.lat) + 4}
                  className="font-semibold pointer-events-none"
                  fontSize="11"
                  fill="#1f2937"
                  textAnchor="middle"
                  stroke="white"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {fire.name}
                </text>
              </g>
            ))}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="100%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
          </svg>

          {selectedFire && !isModalOpen && (
            <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 backdrop-blur-sm bg-white/95">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedFire.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">County:</span>
                  <span className="font-medium">{selectedFire.county}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Acres:</span>
                  <span className="font-medium">{selectedFire.acres.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Containment:</span>
                  <span className="font-medium">{selectedFire.containment}%</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Personnel:</span>
                  <span className="font-medium">{selectedFire.personnel.toLocaleString()}</span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all"
              >
                View Full Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <FireDetailModal 
      fire={selectedFire} 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
    />
    </>
  );
}