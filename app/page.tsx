/**
 * Cal-Fire-Tracker Main Page
 * Developer: Samuel Zepeda
 * 
 * While I explored ideas with Claude during development, this artifact was
 * architected, coded, and mutation tracked by me. Every contradiction loop,
 * forensic pivot, and audit trail scaffold reflects my design decisions and
 * technical authorship. AI tools supported the process, but the responsibility,
 * modularity, and mutation awareness logic are my own.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import OpenStreetFireMap from './components/OpenStreetFireMap';
import EmbeddedFireMap from './components/EmbeddedFireMap';
import FireDetailModal from './components/FireDetailModal';

interface FireData {
  id: string;
  name: string;
  county: string;
  city?: string;
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

export default function Home() {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [selectedFire, setSelectedFire] = useState<FireData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapType, setMapType] = useState<'openstreet' | 'embedded'>('openstreet');
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleString());
  const [updateCount, setUpdateCount] = useState<number>(0);

  const fetchFireData = useCallback(() => {
    // Log mutation for tracking data updates
    const mutationLog = {
      timestamp: new Date().toISOString(),
      action: 'FIRE_DATA_REFRESH',
      updateNumber: updateCount + 1,
      source: 'MOCK_DATA', // Will be 'CAL_FIRE_API' in production
      fireCount: 12
    };
    console.log('[MUTATION LOG]', mutationLog);
    
    // Mock fire data - in production this would come from CAL FIRE API
    const mockData: FireData[] = [
      {
        id: '1',
        name: 'Park Fire',
        county: 'Butte',
        city: 'Chico',
        lat: 39.8056,
        lng: -121.6219,
        acres: 429603,
        containment: 100,
        status: 'Controlled',
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
        city: 'Clearlake',
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
        city: 'Highland',
        lat: 34.32,
        lng: -117.48,
        acres: 2920,
        containment: 77,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 445,
        structures_threatened: 150,
        evacuation_orders: true,
        started_date: '2024-11-12',
        cause: 'Under Investigation'
      },
      {
        id: '4',
        name: 'Alexander Fire',
        county: 'Riverside',
        city: 'Hemet',
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
        city: 'Shaver Lake',
        lat: 37.2,
        lng: -119.3,
        acres: 15000,
        containment: 45,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 850,
        structures_threatened: 300,
        evacuation_orders: true,
        started_date: '2024-11-15',
        cause: 'Lightning'
      },
      {
        id: '6',
        name: 'Glass Fire',
        county: 'Napa',
        city: 'St. Helena',
        lat: 38.5,
        lng: -122.4,
        acres: 3200,
        containment: 60,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 400,
        structures_threatened: 120,
        evacuation_orders: true,
        started_date: '2024-11-18'
      },
      {
        id: '7',
        name: 'Pine Ridge Fire',
        county: 'Los Angeles',
        city: 'Angeles Forest',
        lat: 34.3,
        lng: -118.1,
        acres: 8500,
        containment: 30,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 1200,
        structures_threatened: 450,
        evacuation_orders: true,
        started_date: '2024-11-19',
        cause: 'Under Investigation'
      },
      {
        id: '8',
        name: 'Summit Fire',
        county: 'Santa Barbara',
        city: 'Goleta',
        lat: 34.5,
        lng: -119.8,
        acres: 1200,
        containment: 90,
        status: 'Contained',
        timestamp: new Date().toLocaleString(),
        personnel: 200,
        structures_threatened: 30,
        evacuation_orders: false,
        started_date: '2024-11-14'
      },
      {
        id: '9',
        name: 'Valley Fire',
        county: 'San Diego',
        city: 'Alpine',
        lat: 32.8,
        lng: -116.8,
        acres: 4500,
        containment: 55,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 580,
        structures_threatened: 180,
        evacuation_orders: true,
        started_date: '2024-11-17'
      },
      {
        id: '10',
        name: 'Oak Fire',
        county: 'Mariposa',
        city: 'Midpines',
        lat: 37.5,
        lng: -119.9,
        acres: 2100,
        containment: 100,
        status: 'Controlled',
        timestamp: new Date().toLocaleString(),
        personnel: 150,
        structures_threatened: 0,
        evacuation_orders: false,
        started_date: '2024-11-10',
        cause: 'Power Lines'
      },
      {
        id: '11',
        name: 'San Pedro Lake Fire',
        county: 'Santa Clara',
        city: 'Morgan Hill',
        lat: 37.0851,
        lng: -121.5146,
        acres: 1850,
        containment: 15,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 320,
        structures_threatened: 85,
        evacuation_orders: true,
        started_date: '2025-09-02',
        cause: 'Under Investigation'
      },
      {
        id: '12',
        name: 'TCU Lightning Complex',
        county: 'Santa Clara',
        city: 'San Pedro Reservoir',
        lat: 37.1305,
        lng: -121.6543,
        acres: 3200,
        containment: 5,
        status: 'Active',
        timestamp: new Date().toLocaleString(),
        personnel: 450,
        structures_threatened: 120,
        evacuation_orders: true,
        started_date: '2025-09-01',
        cause: 'Lightning'
      }
    ];
    
    setFireData(mockData);
    setLastUpdate(new Date().toLocaleString());
    setUpdateCount(prev => prev + 1);
    
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
    
    // Set up 5-minute interval for updates (5 * 60 * 1000 milliseconds)
    const intervalId = setInterval(() => {
      fetchFireData();
      console.log('[AUTO-UPDATE] Fire data refreshed at:', new Date().toLocaleString());
    }, 5 * 60 * 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchFireData]);

  const handleFireSelect = (fire: FireData) => {
    setSelectedFire(fire);
    setIsModalOpen(true);
  };

  const activeFiresCount = fireData.filter(f => f.status === 'Active').length;
  const totalAcres = fireData.reduce((sum, f) => sum + f.acres, 0);
  const totalPersonnel = fireData.reduce((sum, f) => sum + f.personnel, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-orange-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">California Fire Tracker</h1>
              <p className="text-orange-100 mt-1">
                Real-time wildfire monitoring • Updates every 5 min • Last: {lastUpdate}
                {updateCount > 0 && <span className="ml-2 text-xs">(#{updateCount})</span>}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setMapType(mapType === 'openstreet' ? 'embedded' : 'openstreet')}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
              >
                {mapType === 'openstreet' ? 'Switch to CAL FIRE Map' : 'Switch to Interactive Map'}
              </button>
              <div className="flex gap-6 text-right">
              <div>
                <div className="text-2xl font-bold">{activeFiresCount}</div>
                <div className="text-sm text-orange-100">Active Fires</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{(totalAcres / 1000).toFixed(0)}K</div>
                <div className="text-sm text-orange-100">Total Acres</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPersonnel.toLocaleString()}</div>
                <div className="text-sm text-orange-100">Personnel</div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Section */}
        <div className="flex-1 relative min-h-[50vh] md:min-h-0">
          {mapType === 'openstreet' ? (
            <OpenStreetFireMap 
              onFireSelect={(data) => {
                // Convert OpenStreetMap data format to match our FireData interface
                const fireData: FireData = {
                  id: data.id?.toString() || '',
                  name: data.name || '',
                  county: data.county || '',
                  lat: data.lat || 0,
                  lng: data.lng || 0,
                  acres: data.acres || 0,
                  containment: data.containment || 0,
                  status: (data.status as 'Active' | 'Contained' | 'Controlled') || 'Active',
                  timestamp: new Date().toLocaleString(),
                  personnel: data.personnel || 0,
                  structures_threatened: data.structures_threatened || 0,
                  evacuation_orders: data.evacuation_orders || false
                };
                handleFireSelect(fireData);
              }}
            />
          ) : (
            <EmbeddedFireMap />
          )}
        </div>

        {/* Fire List Sidebar */}
        <div className="w-full md:w-96 bg-white shadow-lg overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Active Incidents</h2>
            <p className="text-sm text-gray-600 mt-1">Click on a fire for details</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {fireData
              .filter(fire => fire.status === 'Active')
              .sort((a, b) => b.acres - a.acres)
              .map((fire) => (
                <div
                  key={fire.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleFireSelect(fire)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{fire.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {fire.county} County{fire.city && ` • ${fire.city}`}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Size:</span>
                          <span className="font-medium">{fire.acres.toLocaleString()} acres</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Containment:</span>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                              <div 
                                className={`h-2 rounded-full ${
                                  fire.containment > 75 ? 'bg-green-500' : 
                                  fire.containment > 50 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{width: `${fire.containment}%`}}
                              />
                            </div>
                            <span className="font-medium">{fire.containment}%</span>
                          </div>
                        </div>
                        {fire.evacuation_orders && (
                          <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Evacuations Ordered
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            
            {fireData
              .filter(fire => fire.status !== 'Active')
              .map((fire) => (
                <div
                  key={fire.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors opacity-75"
                  onClick={() => handleFireSelect(fire)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-700">{fire.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {fire.county} County{fire.city && ` • ${fire.city}`}
                      </p>
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-gray-500">{fire.acres.toLocaleString()} acres</span>
                        <span className={`font-medium ${
                          fire.status === 'Controlled' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {fire.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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