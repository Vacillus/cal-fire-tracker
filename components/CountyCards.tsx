'use client';

interface County {
  name: string;
  totalIncidents: number;
  activeIncidents: number;
  totalAcresBurned: number;
  riskLevel: string;
}

interface CountyCardsProps {
  counties: County[];
}

export default function CountyCards({ counties }: CountyCardsProps) {
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'EXTREME': return 'bg-red-900/50 border-red-500 text-red-300';
      case 'HIGH': return 'bg-orange-900/50 border-orange-500 text-orange-300';
      case 'MEDIUM': return 'bg-yellow-900/50 border-yellow-500 text-yellow-300';
      default: return 'bg-green-900/50 border-green-500 text-green-300';
    }
  };

  const getRiskEmoji = (level: string) => {
    switch(level) {
      case 'EXTREME': return '🔥🔥🔥';
      case 'HIGH': return '🔥🔥';
      case 'MEDIUM': return '🔥';
      default: return '✅';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-orange-400">County Status</h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {counties
          .sort((a, b) => b.totalAcresBurned - a.totalAcresBurned)
          .map(county => (
            <div 
              key={county.name}
              className={`p-4 rounded-lg border ${getRiskColor(county.riskLevel)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{county.name}</h3>
                <span className="text-sm">{getRiskEmoji(county.riskLevel)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Active:</span>
                  <span className="ml-1 font-bold">{county.activeIncidents}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total:</span>
                  <span className="ml-1 font-bold">{county.totalIncidents}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Acres:</span>
                  <span className="ml-1 font-bold">{county.totalAcresBurned.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      county.riskLevel === 'EXTREME' ? 'bg-red-500 w-full' :
                      county.riskLevel === 'HIGH' ? 'bg-orange-500 w-3/4' :
                      county.riskLevel === 'MEDIUM' ? 'bg-yellow-500 w-1/2' :
                      'bg-green-500 w-1/4'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}