'use client';

import { useEffect, useState } from 'react';
import FireMap from './FireMap';
import CountyCards from './CountyCards';
import IncidentList from './IncidentList';

interface DashboardProps {
  mutationMode: boolean;
}

export default function Dashboard({ mutationMode }: DashboardProps) {
  const [incidents, setIncidents] = useState([]);
  const [counties, setCounties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - will be replaced with Amplify API calls
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
      {
        incidentId: '3',
        incidentName: 'Nixon Fire',
        county: 'Riverside',
        acresBurned: 5156,
        containmentPercent: 100,
        latitude: 33.5,
        longitude: -116.8,
        isActive: false,
        crewsInvolved: 289,
      },
    ];

    const mockCounties = [
      { name: 'Butte', totalIncidents: 1, activeIncidents: 0, totalAcresBurned: 429603, riskLevel: 'EXTREME' },
      { name: 'Riverside', totalIncidents: 2, activeIncidents: 1, totalAcresBurned: 18394, riskLevel: 'HIGH' },
      { name: 'Los Angeles', totalIncidents: 0, activeIncidents: 0, totalAcresBurned: 0, riskLevel: 'LOW' },
      { name: 'San Diego', totalIncidents: 0, activeIncidents: 0, totalAcresBurned: 0, riskLevel: 'LOW' },
    ];

    setIncidents(mockIncidents);
    setCounties(mockCounties);
    setLoading(false);

    if (mutationMode) {
      console.log('[FORENSIC] Dashboard data mutation logged');
    }
  }, [mutationMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading fire data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Active Fires</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {incidents.filter(i => i.isActive).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Currently burning</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Total Acres</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {incidents.reduce((sum, i) => sum + i.acresBurned, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Burned this season</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Personnel</h3>
          <p className="text-3xl font-bold text-blue-500 mt-2">
            {incidents.reduce((sum, i) => sum + i.crewsInvolved, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total deployed</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400">Avg Containment</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {Math.round(incidents.reduce((sum, i) => sum + i.containmentPercent, 0) / incidents.length)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Across all fires</p>
        </div>
      </div>

      {/* Map and County Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FireMap incidents={incidents} />
        </div>
        <div>
          <CountyCards counties={counties} />
        </div>
      </div>

      {/* Incident List */}
      <IncidentList incidents={incidents} mutationMode={mutationMode} />
    </div>
  );
}