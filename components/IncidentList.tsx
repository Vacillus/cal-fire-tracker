'use client';

interface IncidentListProps {
  incidents: any[];
  mutationMode: boolean;
}

export default function IncidentList({ incidents, mutationMode }: IncidentListProps) {
  return (
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
              <th className="pb-3 text-gray-400">Personnel</th>
              <th className="pb-3 text-gray-400">Status</th>
              {mutationMode && <th className="pb-3 text-gray-400">Mutation</th>}
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => (
              <tr key={incident.incidentId} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-3 font-medium">{incident.incidentName}</td>
                <td className="py-3">{incident.county}</td>
                <td className="py-3">{incident.acresBurned.toLocaleString()}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${incident.containmentPercent}%` }}
                      />
                    </div>
                    <span className="text-xs">{incident.containmentPercent}%</span>
                  </div>
                </td>
                <td className="py-3">{incident.crewsInvolved.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    incident.isActive 
                      ? 'bg-red-900/50 text-red-300 border border-red-500' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {incident.isActive ? '🔥 Active' : '✓ Contained'}
                  </span>
                </td>
                {mutationMode && (
                  <td className="py-3">
                    <span className="text-xs text-purple-400 font-mono">
                      LOGGED_{incident.incidentId}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}