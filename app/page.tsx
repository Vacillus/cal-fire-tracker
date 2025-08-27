'use client';

import { useState, useEffect } from 'react';

interface FireIncident {
  incidentId: string;
  incidentName: string;
  county: string;
  acresBurned: number;
  containmentPercent: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
  crewsInvolved: number;
}

// California SVG Map Component
const CaliforniaMap = ({ fires }: { fires: FireIncident[] }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl overflow-hidden">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified California outline */}
        <path
          d="M 100 50 L 120 80 L 130 120 L 140 180 L 135 240 L 130 300 L 125 360 L 120 420 L 115 480 L 110 540 L 100 580 L 90 560 L 85 500 L 80 440 L 75 380 L 70 320 L 65 260 L 60 200 L 55 140 L 60 90 L 70 60 Z"
          fill="#f3f4f6"
          stroke="#6b7280"
          strokeWidth="2"
        />
        
        {/* Fire indicators */}
        {fires.map((fire) => (
          <g key={fire.incidentId}>
            {/* Fire location */}
            <circle
              cx={100 + (fire.longitude + 124) * 8}
              cy={550 - (fire.latitude - 32) * 12}
              r={Math.sqrt(fire.acresBurned / 10000) * 2}
              fill={fire.isActive ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.4)'}
              stroke={fire.isActive ? '#dc2626' : '#16a34a'}
              strokeWidth="2"
              className={fire.isActive ? 'animate-pulse' : ''}
            />
            {/* Containment ring */}
            <circle
              cx={100 + (fire.longitude + 124) * 8}
              cy={550 - (fire.latitude - 32) * 12}
              r={Math.sqrt(fire.acresBurned / 10000) * 2 * (fire.containmentPercent / 100)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="5 3"
              opacity="0.8"
            />
            {/* Fire label */}
            <text
              x={100 + (fire.longitude + 124) * 8}
              y={550 - (fire.latitude - 32) * 12 - 15}
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-700"
            >
              {fire.incidentName}
            </text>
          </g>
        ))}
        
        {/* Major cities for reference */}
        <g>
          <circle cx="95" cy="480" r="3" fill="#4b5563" />
          <text x="105" y="485" className="text-xs fill-gray-600">Los Angeles</text>
          
          <circle cx="85" cy="420" r="3" fill="#4b5563" />
          <text x="95" y="425" className="text-xs fill-gray-600">Fresno</text>
          
          <circle cx="75" cy="320" r="3" fill="#4b5563" />
          <text x="85" y="325" className="text-xs fill-gray-600">San Francisco</text>
          
          <circle cx="70" cy="280" r="3" fill="#4b5563" />
          <text x="80" y="285" className="text-xs fill-gray-600">Sacramento</text>
          
          <circle cx="100" cy="540" r="3" fill="#4b5563" />
          <text x="110" y="545" className="text-xs fill-gray-600">San Diego</text>
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Active Fire</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Contained</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="20" height="10">
              <line x1="0" y1="5" x2="20" y2="5" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <span>Containment Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// County Fire Card Component
const CountyFireCard = ({ incident }: { incident: FireIncident }) => {
  const getStatusColor = (containment: number) => {
    if (containment === 100) return 'text-green-600 bg-green-50';
    if (containment >= 75) return 'text-blue-600 bg-blue-50';
    if (containment >= 50) return 'text-yellow-600 bg-yellow-50';
    if (containment >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className={`h-2 ${incident.isActive ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{incident.incidentName}</h3>
            <p className="text-sm text-gray-500">{incident.county} County</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident.containmentPercent)}`}>
            {incident.containmentPercent}%
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Acres Burned</p>
            <p className="font-semibold text-gray-800">{incident.acresBurned.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Personnel</p>
            <p className="font-semibold text-gray-800">{incident.crewsInvolved.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Emergency Measures</p>
          <div className="flex flex-wrap gap-1">
            {incident.containmentPercent < 50 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Evacuations</span>
            )}
            {incident.crewsInvolved > 1000 && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Air Support</span>
            )}
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Containment Lines</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className={`text-xs font-medium ${incident.isActive ? 'text-red-600' : 'text-green-600'}`}>
            {incident.isActive ? '🔥 ACTIVE' : '✓ CONTAINED'}
          </span>
          <span className="text-xs text-gray-400">
            Lat: {incident.latitude.toFixed(2)}, Lon: {incident.longitude.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [mutationMode, setMutationMode] = useState(false);
  const [forensicLogs, setForensicLogs] = useState<string[]>([]);

  const mockIncidents = [
    {
      incidentId: '1',
      incidentName: 'Park Fire',
      county: 'Butte',
      acresBurned: 429603,
      containmentPercent: 100,
      latitude: 39.8,
      longitude: -121.6,
      isActive: false,
      crewsInvolved: 6393,
    },
    {
      incidentId: '2',
      incidentName: 'Boyles Fire',
      county: 'Riverside',
      acresBurned: 13238,
      containmentPercent: 45,
      latitude: 33.7,
      longitude: -116.2,
      isActive: true,
      crewsInvolved: 512,
    },
    {
      incidentId: '3',
      incidentName: 'Bridge Fire',
      county: 'Los Angeles',
      acresBurned: 54782,
      containmentPercent: 78,
      latitude: 34.3,
      longitude: -118.5,
      isActive: true,
      crewsInvolved: 1847,
    },
    {
      incidentId: '4',
      incidentName: 'Glass Fire',
      county: 'Napa',
      acresBurned: 67484,
      containmentPercent: 100,
      latitude: 38.5,
      longitude: -122.5,
      isActive: false,
      crewsInvolved: 2534,
    },
    {
      incidentId: '5',
      incidentName: 'Creek Fire',
      county: 'Fresno',
      acresBurned: 379895,
      containmentPercent: 32,
      latitude: 37.2,
      longitude: -119.3,
      isActive: true,
      crewsInvolved: 4281,
    },
    {
      incidentId: '6',
      incidentName: 'August Complex',
      county: 'Mendocino',
      acresBurned: 1032648,
      containmentPercent: 100,
      latitude: 39.7,
      longitude: -122.8,
      isActive: false,
      crewsInvolved: 8743,
    },
  ];

  // Forensic logging simulation
  useEffect(() => {
    if (mutationMode) {
      const logs = [
        `[${new Date().toISOString()}] MUTATION_INIT: Forensic mode activated`,
        `[${new Date().toISOString()}] SCAN_COMPLETE: Found ${mockIncidents.length} fire incidents`,
        `[${new Date().toISOString()}] CONTRADICTION_CHECK: No temporal anomalies detected`,
        `[${new Date().toISOString()}] INTEGRITY_VERIFIED: Data mutation tracking enabled`,
      ];
      setForensicLogs(logs);
      
      const interval = setInterval(() => {
        const randomLogs = [
          `MUTATION_DETECTED: Containment percentage altered at index ${Math.floor(Math.random() * 6)}`,
          `SYNC_OPERATION: DynamoDB write confirmed - TTL set to ${Date.now() + 86400000}`,
          `AUDIT_TRAIL: Lambda execution logged - Duration: ${Math.floor(Math.random() * 3000)}ms`,
          `CONTRADICTION_ALERT: Historical data variance detected in county records`,
          `ARTIFACT_PRESERVED: State snapshot saved to mutation log`,
        ];
        const newLog = `[${new Date().toISOString()}] ${randomLogs[Math.floor(Math.random() * randomLogs.length)]}`;
        setForensicLogs(prev => [...prev.slice(-9), newLog]);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [mutationMode, mockIncidents.length]);

  const activeIncidents = mockIncidents.filter(i => i.isActive);
  const totalAcresBurned = mockIncidents.reduce((sum, i) => sum + i.acresBurned, 0);
  const totalPersonnel = mockIncidents.reduce((sum, i) => sum + i.crewsInvolved, 0);
  const avgContainment = Math.round(mockIncidents.reduce((sum, i) => sum + i.containmentPercent, 0) / mockIncidents.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔥</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  California Fire Intelligence System
                </h1>
                <p className="text-sm text-gray-500">
                  Chinchilla AI Academy • AWS Amplify Showcase
                </p>
              </div>
            </div>
            
            {/* Mutation Mode Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Forensic Mode</span>
              <button
                onClick={() => setMutationMode(!mutationMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  mutationMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mutationMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Forensic Alert */}
        {mutationMode && (
          <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-600 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-purple-800 font-mono">
                  [FORENSIC_MODE: ACTIVE] Mutation tracking enabled • Audit trail: ON • Contradiction detection: RUNNING
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Fires</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{activeIncidents.length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Acres</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{(totalAcresBurned / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Personnel</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalPersonnel.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Containment</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{avgContainment}%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* California Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              California Fire Map
            </h2>
            <CaliforniaMap fires={mockIncidents} />
          </div>
          
          {/* County Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              County Fire Status
            </h2>
            <div className="overflow-y-auto max-h-[600px] space-y-4 pr-2">
              {mockIncidents.map(incident => (
                <CountyFireCard key={incident.incidentId} incident={incident} />
              ))}
            </div>
          </div>
        </div>

        {/* Forensic Logs Panel */}
        {mutationMode && (
          <div className="mt-8 bg-gray-900 rounded-xl shadow-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-purple-400 font-mono">FORENSIC_MUTATION_LOGS</h3>
              <span className="text-xs text-green-400 font-mono animate-pulse">● LIVE</span>
            </div>
            <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
              {forensicLogs.map((log, index) => (
                <div key={index} className="text-green-400 opacity-90 hover:opacity-100 transition-opacity">
                  {log}
                </div>
              ))}
              <div className="text-purple-400 animate-pulse">_</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div className="bg-gray-800 rounded p-2">
                <span className="text-gray-400">Mutations Detected</span>
                <p className="text-lg font-bold text-purple-400">{forensicLogs.length}</p>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <span className="text-gray-400">Contradictions</span>
                <p className="text-lg font-bold text-orange-400">{Math.floor(forensicLogs.length / 3)}</p>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <span className="text-gray-400">Audit Status</span>
                <p className="text-lg font-bold text-green-400">ACTIVE</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p>© 2024 California Fire Intelligence System</p>
              <p className="text-xs mt-1">AWS Amplify Gen 2 • Chinchilla AI Academy</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Data Source: CAL FIRE API</p>
              <p className="text-xs mt-1">
                {mutationMode && <span className="text-purple-600 font-mono">[FORENSIC_ACTIVE] </span>}
                Last sync: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}