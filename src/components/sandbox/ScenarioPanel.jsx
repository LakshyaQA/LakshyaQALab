import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useLogger } from '../../context/LoggerContext';

const ScenarioPanel = () => {
  const {
    simulate500Error, setSimulate500Error,
    simulateOffline, setSimulateOffline,
    simulateSlowNetwork, setSimulateSlowNetwork
  } = useNetwork();
  
  const { addLog } = useLogger();

  const handleToggle = (name, currentValue, setter) => {
    const newValue = !currentValue;
    setter(newValue);
    addLog('action', `God Mode Event: Simulated ${name} turned ${newValue ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="fixed top-24 right-6 w-64 bg-slate-900 shadow-2xl rounded-xl border border-slate-700 p-4 z-40" data-testid="scenario-panel">
      <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4 flex items-center">
        <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        God Mode
      </h3>
      
      <div className="space-y-4">
        {/* Toggle 500 Error */}
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Force 500 Error</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={simulate500Error}
              onChange={() => handleToggle('500 Error', simulate500Error, setSimulate500Error)}
              data-testid="toggle-500"
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${simulate500Error ? 'bg-rose-500' : 'bg-slate-700'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${simulate500Error ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>

        {/* Toggle Slow Network */}
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Slow Network (3s)</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={simulateSlowNetwork}
              onChange={() => handleToggle('Slow Network', simulateSlowNetwork, setSimulateSlowNetwork)}
              data-testid="toggle-slow"
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${simulateSlowNetwork ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${simulateSlowNetwork ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>

        {/* Toggle Offline */}
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-slate-300 text-sm group-hover:text-white transition-colors">Force Offline</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={simulateOffline}
              onChange={() => handleToggle('Offline Mode', simulateOffline, setSimulateOffline)}
              data-testid="toggle-offline"
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${simulateOffline ? 'bg-zinc-500' : 'bg-slate-700'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${simulateOffline ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ScenarioPanel;
