'use client';

import { useState, useEffect } from 'react';

export default function MutationMode() {
  const [mutations, setMutations] = useState<any[]>([]);

  useEffect(() => {
    // Simulated mutation logs
    const mockMutations = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        entityType: 'FireIncident',
        action: 'UPDATE',
        entityId: 'PARK_FIRE',
        forensicSignature: 'MUTATION_ARTIFACT_CAPTURED',
        source: 'CAL_FIRE_API',
        contradictionNotes: null,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        entityType: 'FireIncident',
        action: 'UPDATE',
        entityId: 'BOYLES_FIRE',
        forensicSignature: 'CONTRADICTION_LOOP_DETECTED',
        source: 'USER_UPDATE',
        contradictionNotes: 'Acres burned decreased from 15000 to 13238',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        entityType: 'County',
        action: 'CREATE',
        entityId: 'RIVERSIDE',
        forensicSignature: 'TEMPORAL_SHIFT_DETECTED',
        source: 'SYSTEM_SCRAPE',
        contradictionNotes: null,
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        entityType: 'MutationLog',
        action: 'CREATE',
        entityId: 'META_LOG',
        forensicSignature: 'QUANTUM_STATE_COLLAPSED',
        source: 'SYSTEM',
        contradictionNotes: 'Mutation of mutation detected - recursive anomaly',
      },
    ];

    setMutations(mockMutations);
  }, []);

  const getActionColor = (action: string) => {
    switch(action) {
      case 'CREATE': return 'text-green-400';
      case 'UPDATE': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSignatureIcon = (signature: string) => {
    if (signature.includes('CONTRADICTION')) return '⚠️';
    if (signature.includes('TEMPORAL')) return '⏱️';
    if (signature.includes('QUANTUM')) return '🌀';
    if (signature.includes('ARTIFACT')) return '📦';
    return '✓';
  };

  return (
    <div className="space-y-6">
      {/* Forensic Summary */}
      <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-purple-400">Forensic Mutation Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/30 rounded p-3">
            <div className="text-sm text-gray-400">Total Mutations</div>
            <div className="text-2xl font-bold text-purple-300">{mutations.length}</div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-sm text-gray-400">Contradictions</div>
            <div className="text-2xl font-bold text-red-400">
              {mutations.filter(m => m.contradictionNotes).length}
            </div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-sm text-gray-400">Sources</div>
            <div className="text-2xl font-bold text-blue-400">
              {new Set(mutations.map(m => m.source)).size}
            </div>
          </div>
          <div className="bg-black/30 rounded p-3">
            <div className="text-sm text-gray-400">Anomalies</div>
            <div className="text-2xl font-bold text-yellow-400">
              {mutations.filter(m => m.forensicSignature.includes('ANOMALY')).length}
            </div>
          </div>
        </div>
      </div>

      {/* Mutation Timeline */}
      <div className="bg-gray-800/50 backdrop-blur rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-orange-400">Mutation Timeline</h3>
        <div className="space-y-4">
          {mutations.map(mutation => (
            <div key={mutation.id} className="border-l-2 border-purple-500 pl-4 ml-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getSignatureIcon(mutation.forensicSignature)}</span>
                    <span className={`font-mono text-sm ${getActionColor(mutation.action)}`}>
                      {mutation.action}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">{mutation.entityType}</span>
                    <span className="text-xs text-gray-500">#{mutation.entityId}</span>
                  </div>
                  
                  <div className="text-xs text-purple-300 font-mono mb-1">
                    [{mutation.forensicSignature}]
                  </div>
                  
                  {mutation.contradictionNotes && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-2 mt-2">
                      <span className="text-xs text-red-400">⚠️ Contradiction: </span>
                      <span className="text-xs text-red-300">{mutation.contradictionNotes}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Source: {mutation.source}</span>
                    <span>{new Date(mutation.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Console */}
      <div className="bg-black/50 rounded-lg p-4 border border-purple-500/30">
        <div className="font-mono text-xs space-y-1 text-purple-300">
          <div>[FORENSIC] Mutation monitoring active...</div>
          <div>[FORENSIC] Contradiction detection: ENABLED</div>
          <div>[FORENSIC] Temporal anomaly scanner: RUNNING</div>
          <div>[FORENSIC] Quantum state observer: INITIALIZED</div>
          <div className="text-green-400">[FORENSIC] All systems operational</div>
        </div>
      </div>
    </div>
  );
}