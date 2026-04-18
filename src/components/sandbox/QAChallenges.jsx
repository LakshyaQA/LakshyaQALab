import React, { useState, useEffect, useRef } from 'react'
import { useLogger } from '../../context/LoggerContext'

const QAChallenges = () => {
  const { addLog } = useLogger()
  const shadowRef = useRef(null)

  // --- Challenge States ---
  const [dynamicId, setDynamicId] = useState('btn-dynamic-1234')
  const [isStale, setIsStale] = useState(false)
  const [visualJank, setVisualJank] = useState(false)
  const [showDelayed, setShowDelayed] = useState(false)
  const [staleKey, setStaleKey] = useState(0)

  // --- Shadow DOM Setup ---
  useEffect(() => {
    if (shadowRef.current && !shadowRef.current.shadowRoot) {
      const shadow = shadowRef.current.attachShadow({ mode: 'open' })
      const container = document.createElement('div')
      container.innerHTML = `
        <style>
          .shadow-box {
            padding: 1.5rem;
            background: #f8fafc;
            border-radius: 1rem;
            border: 2px dashed #cbd5e1;
            text-align: center;
          }
          .dark .shadow-box {
            background: #0f172a;
            border-color: #334155;
          }
          .shadow-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 900;
            color: #64748b;
            margin-bottom: 1rem;
          }
          .shadow-btn {
            background: #8b5cf6;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);
          }
          .shadow-btn:hover {
            background: #7c3aed;
            transform: translateY(-1px);
          }
          .shadow-btn:active {
            transform: scale(0.95);
          }
        </style>
        <div class="shadow-box">
          <div class="shadow-title">Encapsulated Shadow Root</div>
          <button class="shadow-btn" id="shadow-action-btn">Intercept Me</button>
        </div>
      `

      const btn = container.querySelector('#shadow-action-btn')
      btn.addEventListener('click', () => {
        window.dispatchEvent(
          new CustomEvent('shadow-click', { detail: { message: 'Shadow DOM button clicked!' } })
        )
      })

      shadow.appendChild(container)
    }
  }, [])

  useEffect(() => {
    const handleShadowClick = () => {
      addLog('action', `SUCCESS: Shadow DOM interaction detected!`)
    }
    window.addEventListener('shadow-click', handleShadowClick)
    return () => window.removeEventListener('shadow-click', handleShadowClick)
  }, [addLog])

  // --- Logic Helpers ---
  const randomizeId = () => {
    const newId = `btn-${Math.floor(Math.random() * 9999)}`
    setDynamicId(newId)
    addLog('info', `Button ID randomized to: ${newId}`)
  }

  const triggerStaleState = () => {
    setIsStale(true)
    setTimeout(() => {
      setStaleKey(prev => prev + 1)
      setIsStale(false)
      addLog('warning', 'DOM element was destroyed and recreated (Stale Element Simulation)')
    }, 100)
  }

  const toggleDelayed = () => {
    setShowDelayed(false)
    addLog('info', 'Visibility timer started (3 seconds)...')
    setTimeout(() => {
      setShowDelayed(true)
      addLog('info', 'Delayed element is now visible.')
    }, 3000)
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
      id="gauntlet"
    >
      {/* Header */}
      <div className="p-8 border-b border-gray-100 dark:border-slate-700 bg-rose-50/30 dark:bg-rose-900/10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            The Gauntlet
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Advanced automation challenges designed to break fragile scripts. Master these to become a
          Senior SDET.
        </p>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Shadow DOM Challenge */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">
            01. Shadow-Piercing
          </h3>
          <div ref={shadowRef} data-testid="shadow-host-container"></div>
          <p className="text-[10px] text-gray-400 italic">
            Tip: Standard CSS selectors won't work here. Use Playwright's default piercing or
            `shadowRoot` property.
          </p>
        </section>

        {/* 2. Flaky Selector Challenge */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">
            02. Dynamic Selectors
          </h3>
          <div className="p-6 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center">
            <button
              id={dynamicId}
              onMouseEnter={randomizeId}
              className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold rounded-xl shadow-sm hover:shadow-amber-500/20 active:scale-95 transition-all mb-4"
              data-testid="flaky-id-btn"
            >
              Hover to Randomize ID
            </button>
            <div className="text-[9px] font-mono text-gray-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-100 dark:border-slate-700">
              Current ID: <span className="text-rose-500">{dynamicId}</span>
            </div>
          </div>
        </section>

        {/* 3. Stale & Delayed Challenge */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">
            03. Timing & Lifecycle
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
              {!isStale && (
                <button
                  key={staleKey}
                  onClick={triggerStaleState}
                  className="w-full py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg"
                  data-testid="stale-element-btn"
                >
                  Stale Mode
                </button>
              )}
              <p className="mt-2 text-[9px] text-gray-400 italic">Causes Reference Error</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 text-center flex flex-col justify-center">
              {showDelayed ? (
                <div
                  className="py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-200 dark:border-indigo-800/50 animate-in fade-in zoom-in duration-300"
                  data-testid="delayed-element"
                  onClick={() => setShowDelayed(false)}
                >
                  I'm Here!
                </div>
              ) : (
                <button
                  onClick={toggleDelayed}
                  className="w-full py-2 bg-gray-200 dark:bg-slate-800 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg"
                >
                  Wait for it...
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 4. Visual Regression Stress Test */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-rose-500">
            04. Visual Regression
          </h3>
          <div
            className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all duration-300 ${visualJank ? 'border-rose-500/50 shadow-2xl scale-[1.01]' : 'border-gray-100 dark:border-slate-800'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`${visualJank ? 'ml-4' : 'ml-0'} transition-all duration-500`}>
                <h4
                  className={`font-bold ${visualJank ? 'text-rose-500 text-lg' : 'text-gray-900 dark:text-white text-sm'} transition-all`}
                >
                  Stress Test Card
                </h4>
                <p className="text-[10px] text-gray-400">Can your visual tool detect the shift?</p>
              </div>
              <button
                onClick={() => setVisualJank(!visualJank)}
                className={`p-2 rounded-xl transition-colors ${visualJank ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}
                data-testid="jank-toggle"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              <div
                className={`h-2 rounded-full flex-1 transition-all duration-500 ${visualJank ? 'bg-rose-500 w-full' : 'bg-gray-100 dark:bg-slate-800 w-1/2'}`}
              ></div>
              <div
                className={`h-2 rounded-full flex-1 transition-all duration-500 ${visualJank ? 'bg-rose-300 w-0 h-0 hidden' : 'bg-gray-100 dark:bg-slate-800'}`}
              ></div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Hard Mode Enabled
          </span>
        </div>
        <div className="text-[9px] font-mono text-gray-400">Section ID: section-gauntlet-2026</div>
      </div>
    </div>
  )
}

export default QAChallenges
