'use client';

import { useState } from 'react';

export default function FireLore() {
  const [selectedYear, setSelectedYear] = useState(2024);

  const historicalData = [
    {
      year: 2024,
      totalFires: 7194,
      totalAcres: 1040081,
      largestFire: 'Park Fire - 429,603 acres',
      notableEvents: [
        'Fourth largest wildfire in California history (Park Fire)',
        'Most destructive fire season since 2020',
        'Extended drought conditions in Northern California',
      ],
    },
    {
      year: 2023,
      totalFires: 7127,
      totalAcres: 324917,
      largestFire: 'Head Fire - 21,579 acres',
      notableEvents: [
        'Relatively mild fire season',
        'Early winter rains helped containment',
        'Improved forest management strategies implemented',
      ],
    },
    {
      year: 2020,
      totalFires: 9917,
      totalAcres: 4257863,
      largestFire: 'August Complex - 1,032,648 acres',
      notableEvents: [
        'Most destructive year on record',
        'First "Gigafire" in modern California history',
        'Five of six largest fires in state history',
        'Orange skies over San Francisco Bay Area',
      ],
    },
    {
      year: 2018,
      totalFires: 7948,
      totalAcres: 1975086,
      largestFire: 'Mendocino Complex - 459,123 acres',
      notableEvents: [
        'Camp Fire destroyed Paradise, CA',
        'Deadliest fire in California history (85 fatalities)',
        'Most destructive fire (18,804 structures)',
      ],
    },
  ];

  const patterns = [
    {
      pattern: 'El Niño/La Niña Cycles',
      description: 'Fire activity increases during La Niña years due to drier conditions',
      severity: 'HIGH',
    },
    {
      pattern: 'Santa Ana Winds',
      description: 'October-December wind events drive rapid fire spread in Southern California',
      severity: 'EXTREME',
    },
    {
      pattern: 'Lightning Siege Events',
      description: 'Multiple lightning-caused fires from single storm systems',
      severity: 'MEDIUM',
    },
    {
      pattern: 'Urban Interface Expansion',
      description: 'Increasing development in fire-prone areas raises structure loss risk',
      severity: 'HIGH',
    },
  ];

  const selectedData = historicalData.find(d => d.year === selectedYear);

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-orange-400">Historical Fire Data</h2>
        <div className="flex gap-2 flex-wrap">
          {historicalData.map(data => (
            <button
              key={data.year}
              onClick={() => setSelectedYear(data.year)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedYear === data.year
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {data.year}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Year Data */}
      {selectedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-orange-400">{selectedData.year} Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Fires</div>
                <div className="text-3xl font-bold text-orange-500">
                  {selectedData.totalFires.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Acres Burned</div>
                <div className="text-3xl font-bold text-red-500">
                  {selectedData.totalAcres.toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Largest Fire</div>
                <div className="text-lg font-semibold text-yellow-400">
                  {selectedData.largestFire}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-orange-400">Notable Events</h3>
            <ul className="space-y-2">
              {selectedData.notableEvents.map((event, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">🔥</span>
                  <span className="text-sm text-gray-300">{event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Historical Patterns */}
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-orange-400">Historical Fire Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map(pattern => (
            <div key={pattern.pattern} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-yellow-400">{pattern.pattern}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  pattern.severity === 'EXTREME' ? 'bg-red-900/50 text-red-300' :
                  pattern.severity === 'HIGH' ? 'bg-orange-900/50 text-orange-300' :
                  'bg-yellow-900/50 text-yellow-300'
                }`}>
                  {pattern.severity}
                </span>
              </div>
              <p className="text-sm text-gray-400">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fire Season Timeline */}
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-orange-400">California Fire Season Timeline</h3>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500"></div>
          <div className="pl-8 space-y-4">
            <div>
              <div className="font-semibold text-green-400">January - March</div>
              <div className="text-sm text-gray-400">Low Risk - Wet season, vegetation growth</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-400">April - June</div>
              <div className="text-sm text-gray-400">Moderate Risk - Vegetation drying begins</div>
            </div>
            <div>
              <div className="font-semibold text-orange-400">July - September</div>
              <div className="text-sm text-gray-400">High Risk - Peak fire season, dry conditions</div>
            </div>
            <div>
              <div className="font-semibold text-red-400">October - December</div>
              <div className="text-sm text-gray-400">Extreme Risk - Santa Ana winds, critically dry fuels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}