import React, { useState, useRef } from 'react'
import { useNetwork } from '../../context/NetworkContext'
import { useLogger } from '../../context/LoggerContext'

const ControlCenter = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hoverTimeout = useRef(null)

  const {
    simulate500Error,
    setSimulate500Error,
    simulateOffline,
    setSimulateOffline,
    simulateSlowNetwork,
    setSimulateSlowNetwork,
  } = useNetwork()

  const { logs, clearLogs, addLog } = useLogger()

  const handleToggle = (name, currentValue, setter) => {
    const newValue = !currentValue
    setter(newValue)
    addLog('action', `God Mode Event: Simulated ${name} turned ${newValue ? 'ON' : 'OFF'}`)
  }

  const getLogColorAction = type => {
    switch (type) {
      case 'error':
        return 'text-rose-500'
      case 'info':
        return 'text-blue-400'
      case 'request':
        return 'text-amber-400'
      case 'action':
        return 'text-emerald-400'
      default:
        return 'text-slate-300'
    }
  }

  const onMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setIsExpanded(true)
  }

  const onMouseLeave = () => {
    // Small delay to prevent accidental closing
    hoverTimeout.current = setTimeout(() => {
      setIsExpanded(false)
    }, 300)
  }

  return (
    <div
      className={`fixed top-0 right-0 h-screen z-[60] flex transition-all duration-500 ease-in-out ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-8px)]'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid="control-center"
    >
      {/* Interaction Trigger (Arrow/Tab) */}
      <div className="w-8 h-full flex flex-col items-center justify-center cursor-pointer group">
        <div
          className={`flex flex-col items-center justify-center bg-slate-900 border-l border-y border-slate-700 p-2 rounded-l-2xl shadow-2xl transition-all duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
        >
          <svg
            className={`w-6 h-6 text-slate-400 group-hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest group-hover:text-rose-500 transition-colors">
            Testing Controls
          </span>
        </div>
      </div>

      {/* Main Drawer Content */}
      <div className="w-80 h-full bg-slate-900 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-slate-700 flex flex-col overflow-hidden">
        {/* God Mode Section */}
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-6 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            God Mode Controls
          </h3>

          <div className="space-y-4">
            {/* Toggle 500 Error */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-slate-300 text-xs group-hover:text-white transition-colors">
                Force 500 Error
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={simulate500Error}
                  onChange={() => handleToggle('500 Error', simulate500Error, setSimulate500Error)}
                  data-testid="toggle-500"
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors ${simulate500Error ? 'bg-rose-500' : 'bg-slate-700'}`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${simulate500Error ? 'translate-x-4' : ''}`}
                ></div>
              </div>
            </label>

            {/* Toggle Slow Network */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-slate-300 text-xs group-hover:text-white transition-colors">
                Slow Network (3s)
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={simulateSlowNetwork}
                  onChange={() =>
                    handleToggle('Slow Network', simulateSlowNetwork, setSimulateSlowNetwork)
                  }
                  data-testid="toggle-slow"
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors ${simulateSlowNetwork ? 'bg-amber-500' : 'bg-slate-700'}`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${simulateSlowNetwork ? 'translate-x-4' : ''}`}
                ></div>
              </div>
            </label>

            {/* Toggle Offline */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-slate-300 text-xs group-hover:text-white transition-colors">
                Force Offline
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={simulateOffline}
                  onChange={() => handleToggle('Offline Mode', simulateOffline, setSimulateOffline)}
                  data-testid="toggle-offline"
                />
                <div
                  className={`block w-9 h-5 rounded-full transition-colors ${simulateOffline ? 'bg-zinc-500' : 'bg-slate-700'}`}
                ></div>
                <div
                  className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${simulateOffline ? 'translate-x-4' : ''}`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        {/* Terminal Header */}
        <div className="px-6 py-4 bg-slate-950/50 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">
              Terminal Output
            </span>
          </div>
          <button
            onClick={e => {
              e.stopPropagation()
              clearLogs()
            }}
            className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors"
            data-testid="clear-logs-btn"
          >
            Clear
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] hidden-scrollbar bg-slate-950">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center mt-12 opacity-50 italic">
              Waiting for events...
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="border-b border-slate-800/50 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`uppercase font-black ${getLogColorAction(log.type)}`}>
                      {log.type}
                    </span>
                    <span className="text-slate-600 text-[9px]">
                      [{log.timestamp.toLocaleTimeString()}]
                    </span>
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    <p>{log.message}</p>
                    {log.details && (
                      <pre className="mt-2 text-[9px] text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800/50 block overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[9px] text-slate-600 text-center font-mono">
          Linked Debugging Mode Active
        </div>
      </div>
    </div>
  )
}

export default ControlCenter
