'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import MutationMode from '@/components/MutationMode';
import FireLore from '@/components/FireLore';

export default function Home() {
  const [mutationMode, setMutationMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lore' | 'mutations'>('dashboard');

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
        
        {activeTab === 'dashboard' && <Dashboard mutationMode={mutationMode} />}
        {activeTab === 'lore' && <FireLore />}
        {activeTab === 'mutations' && <MutationMode />}
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