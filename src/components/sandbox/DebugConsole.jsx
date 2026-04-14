import React, { useState } from 'react';
import { useLogger } from '../../context/LoggerContext';

const DebugConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logs, clearLogs } = useLogger();

  const getLogColorAction = (type) => {
    switch(type) {
      case 'error': return 'text-rose-500';
      case 'info': return 'text-blue-400';
      case 'request': return 'text-amber-400';
      case 'action': return 'text-emerald-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 transition-all duration-300 ease-in-out ${isOpen ? 'h-64' : 'h-12'}`} data-testid="debug-console">
      <div 
        className="h-12 px-6 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="debug-console-header"
      >
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="font-mono text-sm font-semibold text-slate-300">Terminal Output</span>
          {logs.length > 0 && !isOpen && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={(e) => { e.stopPropagation(); clearLogs(); }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            data-testid="clear-logs-btn"
          >
            Clear
          </button>
          <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {isOpen && (
        <div className="h-52 overflow-y-auto p-4 font-mono text-xs hidden-scrollbar bg-slate-950">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center mt-6">No logs generated yet. Interact with the sandbox.</div>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex space-x-4 border-b border-slate-800/50 pb-2 mb-2">
                  <span className="text-slate-600 flex-shrink-0">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>
                  <span className={`flex-shrink-0 w-16 uppercase font-bold ${getLogColorAction(log.type)}`}>
                    {log.type}
                  </span>
                  <div className="flex-1 text-slate-300">
                    <p>{log.message}</p>
                    {log.details && (
                      <pre className="mt-1 text-slate-500 bg-slate-900 p-2 rounded block">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugConsole;
