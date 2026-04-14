import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { QA_SPECS } from '../../data/qaSpecs'
import ACModal from './ACModal'
import TestScenariosModal from '../sandbox/TestScenariosPanel'

const QAToolsOverlay = () => {
  const location = useLocation()

  const spec = useMemo(() => {
    const currentPath = location.pathname
    return QA_SPECS[currentPath] || QA_SPECS['/login'] // Fallback to login as default spec
  }, [location])

  const [showAC, setShowAC] = useState(false)
  const [showTS, setShowTS] = useState(false)

  // Portfolio Cross-Link Popup State
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [portfolioDismissed, setPortfolioDismissed] = useState(false)

  useEffect(() => {
    // Show portfolio popup after 2s on every page load unless dismissed
    const timer = setTimeout(() => setShowPortfolio(true), 2000)
    return () => clearTimeout(timer)
  }, [location])

  if (!spec) return null

  const handleVisitPortfolio = () => {
    window.open('https://lakshyasharmaqa.vercel.app/', '_blank', 'noopener,noreferrer')
    setPortfolioDismissed(true)
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[100] isolate">
      {/* 1. Portfolio Cross-Link Popup */}
      {showPortfolio && !portfolioDismissed && (
        <div
          className="w-72 bg-white dark:bg-slate-800 border-t-4 border-t-indigo-600 rounded-2xl shadow-2xl p-4 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300 relative group"
          data-testid="portfolio-popup"
        >
          <button
            onClick={() => setPortfolioDismissed(true)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
            data-testid="portfolio-popup-close"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex gap-3 items-start mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0 shadow-lg shadow-indigo-500/20">
              👋
            </div>
            <div>
              <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">
                Hey there, QA explorer!
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Want to check out{' '}
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  Lakshay&apos;s full portfolio
                </span>
                ? Built with all the QA love. 🚀
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleVisitPortfolio}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-1.5"
              data-testid="portfolio-popup-visit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Show me!
            </button>
            <button
              onClick={() => setPortfolioDismissed(true)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 text-[10px] font-bold uppercase rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              data-testid="portfolio-popup-dismiss"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* 2. Acceptance Criteria Button */}
      <button
        onClick={() => setShowAC(true)}
        className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 group active:scale-95"
        data-testid="ac-open-btn"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
            QA Spec
          </span>
          <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">
            Acceptance Criteria
          </span>
        </div>
      </button>

      {/* 3. Tests to Automate Button */}
      <button
        onClick={() => setShowTS(true)}
        className="flex items-center gap-2.5 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 active:scale-95 group"
        data-testid="ts-open-btn"
      >
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
          🤖
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
            Automation Hub
          </span>
          <span className="text-sm font-black text-white uppercase tracking-tight">
            Tests to Automate
          </span>
        </div>
      </button>

      {/* Modals */}
      <ACModal
        isOpen={showAC}
        onClose={() => setShowAC(false)}
        title={spec.title}
        criteria={spec.acceptanceCriteria}
      />

      <TestScenariosModal
        isOpen={showTS}
        onClose={() => setShowTS(false)}
        title={spec.title}
        scenarios={spec.testScenarios}
        masterPrompt={spec.masterPrompt}
      />
    </div>
  )
}

export default QAToolsOverlay
