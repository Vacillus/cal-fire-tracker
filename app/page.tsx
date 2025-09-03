'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import FireDetailModal from './components/FireDetailModal';
import EmbeddedFireMap from './components/EmbeddedFireMap';
import { fetchActiveFiresGeoJson, type FireIncident } from './lib/calFireGeoJson';

// Use the same type as the API returns
type FireData = FireIncident;

export default function HomePage() {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>('Loading...');
  const [searchQuery, setSearchQuery] = useState('');
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  const [selectedFire, setSelectedFire] = useState<FireData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHistorical, setShowHistorical] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch fire data from CAL FIRE API
  const fetchFireData = useCallback(async () => {
    const mutationLog = {
      timestamp: new Date().toISOString(),
      action: 'FETCH_FIRE_DATA',
      component: 'HomePage',
      trigger: updateCount === 0 ? 'initial_load' : 'interval_update',
      dataSource: 'cal_fire_api'
    };
    
    console.log('[FIRE_DATA_MUTATION]', mutationLog);
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch real data from CAL FIRE API
      console.log('[API] Fetching from CAL FIRE...');
      const apiData = await fetchActiveFiresGeoJson();
      
      console.log('[API] Response received:', apiData ? `${apiData.length} fires` : 'null/undefined');
      
      if (apiData && apiData.length > 0) {
        setFireData(apiData);
        setLastUpdate(new Date().toLocaleString());
        setUpdateCount(prev => prev + 1);
        setError(null);
        
        console.log('[CAL_FIRE_API] Successfully loaded', apiData.length, 'fires');
        console.log('[CAL_FIRE_API] First 3 fires:', apiData.slice(0, 3).map(f => f.name));
      } else {
        // If no data returned
        console.warn('API returned no fires');
        setError('No fire data available from CAL FIRE');
        setFireData([]);
        setLastUpdate(new Date().toLocaleString());
        setUpdateCount(prev => prev + 1);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch CAL FIRE data:', errorMsg);
      setError(`Failed to load fires: ${errorMsg}`);
      setFireData([]);
      setLastUpdate('Failed');
      setUpdateCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
    
    // Store mutation log in localStorage for forensic analysis
    if (typeof window !== 'undefined') {
      const logs = JSON.parse(localStorage.getItem('fireDataMutationLogs') || '[]');
      logs.push(mutationLog);
      // Keep only last 100 logs
      if (logs.length > 100) logs.shift();
      localStorage.setItem('fireDataMutationLogs', JSON.stringify(logs));
    }
  }, [updateCount]);

  useEffect(() => {
    // Initial data fetch
    fetchFireData();
    
    // Set up 2-minute interval for updates from real API
    const intervalId = setInterval(() => {
      fetchFireData();
      console.log('[AUTO-UPDATE] Fire data refreshed from CAL FIRE API at:', new Date().toLocaleString());
    }, 2 * 60 * 1000); // 2 minutes
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchFireData]);

  const handleFireSelect = (fire: FireData) => {
    setSelectedFire(fire);
    setIsModalOpen(true);
    // Zoom the map to the selected fire
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).zoomToFire) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).zoomToFire(fire.id);
    }
  };

  const activeFiresCount = fireData.filter(f => f.status === 'Active').length;
  const totalAcres = fireData.reduce((sum, f) => sum + f.acres, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalPersonnel = fireData.reduce((sum, f) => sum + (f.personnel || 0), 0);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-orange-600 text-white shadow-lg flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">California Fire Tracker</h1>
              <p className="text-orange-100 mt-1">
                Real-time wildfire monitoring • Updates every 2 min • Last: {lastUpdate}
                {updateCount > 0 && <span className="ml-2 text-xs">(#{updateCount})</span>}
              </p>
            </div>
            <div className="flex gap-6 text-right items-center">
              <button 
                onClick={fetchFireData}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                🔄 Refresh Data
              </button>
              <div>
                <div className="text-2xl font-bold">{fireData.length}</div>
                <div className="text-sm text-orange-100">Total Fires</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{activeFiresCount}</div>
                <div className="text-sm text-orange-100">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{(totalAcres / 1000).toFixed(0)}K</div>
                <div className="text-sm text-orange-100">Acres</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <EmbeddedFireMap onFireSelect={handleFireSelect} />
        </div>

        {/* Fire Details Panel */}
        <div 
          ref={detailsPanelRef}
          className="w-96 bg-white shadow-xl overflow-y-auto border-l border-gray-200 flex-shrink-0"
        >
          {/* Search Bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by fire name or county..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Fire List */}
          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={fetchFireData}
                  className="mt-2 text-red-600 underline text-sm"
                >
                  Try again
                </button>
              </div>
            )}
            
            <h2 className="text-lg font-semibold text-gray-900">
              Active Fires ({isLoading ? '...' : activeFiresCount})
            </h2>
            {fireData
              .filter(fire => fire.status === 'Active')
              .filter(fire => 
                searchQuery === '' ||
                fire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fire.county.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(fire => (
                <div
                  key={fire.id}
                  onClick={() => handleFireSelect(fire)}
                  className="bg-white border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-orange-400"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{fire.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      fire.containment < 30 ? 'bg-red-100 text-red-800' :
                      fire.containment < 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fire.containment}% contained
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📍 {fire.county} County</p>
                    <p>🔥 {fire.acres.toLocaleString()} acres</p>
                    {fire.personnel && <p>👥 {fire.personnel.toLocaleString()} personnel</p>}
                    {fire.structures_threatened && fire.structures_threatened > 0 && (
                      <p className="text-orange-600 font-medium">
                        ⚠️ {fire.structures_threatened} structures threatened
                      </p>
                    )}
                    {fire.evacuation_orders && (
                      <p className="text-red-600 font-semibold">🚨 Evacuation Orders</p>
                    )}
                  </div>
                </div>
              ))}

            {activeFiresCount === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading active fires...</p>
                <button 
                  onClick={fetchFireData}
                  className="mt-2 text-orange-600 hover:underline"
                >
                  Click to refresh
                </button>
              </div>
            )}

            {/* Historical Data Section - Collapsible */}
            <div className="mt-8 border-t pt-4">
              <button
                onClick={() => setShowHistorical(!showHistorical)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  Contained/Controlled Fires ({fireData.filter(f => f.status !== 'Active').length})
                </h2>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${showHistorical ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

            {showHistorical && (
              <div className="mt-4 space-y-3">
                {fireData
              .filter(fire => fire.status !== 'Active')
              .filter(fire => 
                searchQuery === '' ||
                fire.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fire.county.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 10) // Limit to 10 contained fires
              .map(fire => (
                <div
                  key={fire.id}
                  onClick={() => handleFireSelect(fire)}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-700">{fire.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {fire.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>📍 {fire.county} County</p>
                    <p>🔥 {fire.acres.toLocaleString()} acres</p>
                    <p>✅ {fire.containment}% contained</p>
                  </div>
                </div>
              ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Fire Detail Modal */}
      <FireDetailModal
        fire={selectedFire}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}