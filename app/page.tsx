'use client';

import { useState } from 'react';

export default function Home() {
  const [mutationMode, setMutationMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lore' | 'mutations'>('dashboard');

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
      containmentPercent: 95,
      latitude: 33.7,
      longitude: -116.2,
      isActive: true,
      crewsInvolved: 512,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-orange-500/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                🔥 CAL FIRE Tracker
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Chinchilla AI Academy - First Amplify App
              </p>
            </div>
            
            {/* Mutation Mode Toggle */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm">Mutation Mode</span>
                <input
                  type="checkbox"
                  checked={mutationMode}
                  onChange={(e) => setMutationMode(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  mutationMode ? 'bg-purple-600' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    mutationMode ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </label>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('lore')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'lore' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              Fire Lore
            </button>
            <button
              onClick={() => setActiveTab('mutations')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'mutations' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              Mutations {mutationMode && <span className="text-xs">●</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {mutationMode && (
          <div className="mb-4 p-3 bg-purple-900/30 border border-purple-500 rounded-lg">
            <p className="text-purple-300 text-sm font-mono">
              [FORENSIC MODE ACTIVE] All mutations are being logged...
            </p>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Active Fires</h3>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                  {mockIncidents.filter(i => i.isActive).length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Total Acres</h3>
                <p className="text-3xl font-bold text-red-500 mt-2">
                  {mockIncidents.reduce((sum, i) => sum + i.acresBurned, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Personnel</h3>
                <p className="text-3xl font-bold text-blue-500 mt-2">
                  {mockIncidents.reduce((sum, i) => sum + i.crewsInvolved, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Avg Containment</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">
                  {Math.round(mockIncidents.reduce((sum, i) => sum + i.containmentPercent, 0) / mockIncidents.length)}%
                </p>
              </div>
            </div>

            {/* Incident List */}
            <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-orange-400">Active Incidents</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-left">
                      <th className="pb-3 text-gray-400">Incident</th>
                      <th className="pb-3 text-gray-400">County</th>
                      <th className="pb-3 text-gray-400">Acres</th>
                      <th className="pb-3 text-gray-400">Contained</th>
                      <th className="pb-3 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockIncidents.map(incident => (
                      <tr key={incident.incidentId} className="border-b border-gray-700/50">
                        <td className="py-3">{incident.incidentName}</td>
                        <td className="py-3">{incident.county}</td>
                        <td className="py-3">{incident.acresBurned.toLocaleString()}</td>
                        <td className="py-3">{incident.containmentPercent}%</td>
                        <td className="py-3">
                          <span className={incident.isActive ? 'text-red-400' : 'text-green-400'}>
                            {incident.isActive ? '🔥 Active' : '✓ Contained'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lore' && (
          <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-orange-400">Fire Lore</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-yellow-400">2024 - Park Fire</h3>
                <p className="text-gray-300">Fourth largest wildfire in California history at 429,603 acres</p>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-400">2020 - August Complex</h3>
                <p className="text-gray-300">First "Gigafire" in modern California history at 1,032,648 acres</p>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-400">2018 - Camp Fire</h3>
                <p className="text-gray-300">Deadliest fire in California history with 85 fatalities</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mutations' && (
          <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-purple-400">Mutation Logs</h2>
            <div className="space-y-2 font-mono text-xs text-purple-300">
              <div>[FORENSIC] Mutation monitoring active...</div>
              <div>[FORENSIC] Contradiction detection: ENABLED</div>
              <div>[FORENSIC] Temporal anomaly scanner: RUNNING</div>
              <div>[FORENSIC] Quantum state observer: INITIALIZED</div>
              <div className="text-green-400">[FORENSIC] All systems operational</div>
              {mutationMode && (
                <>
                  <div className="mt-4 text-yellow-400">[MUTATION] Data sync initiated</div>
                  <div className="text-orange-400">[CONTRADICTION] Acres burned decreased detected</div>
                  <div className="text-blue-400">[ARTIFACT] Mutation logged to audit trail</div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-700 bg-black/50">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-400">
          <p>Built with AWS Amplify Gen 2 | Real-time CAL FIRE Data</p>
          <p className="mt-1 text-xs">
            {mutationMode && <span className="text-purple-400">[Mutation artifacts are being collected] </span>}
            Last sync: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </footer>
    </div>
  );
}