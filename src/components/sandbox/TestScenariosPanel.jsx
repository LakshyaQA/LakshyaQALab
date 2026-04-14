import React, { useState, useRef, useEffect } from 'react'

const PriorityBadge = ({ level }) => {
  const colors = {
    P0: { bg: '#ef444420', border: '#ef4444', text: '#ef4444' },
    P1: { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' },
    P2: { bg: '#6366f120', border: '#6366f1', text: '#818cf8' },
  }
  const c = colors[level] || colors.P2
  return (
    <span
      className="text-[9px] font-bold tracking-tight px-1.5 py-0.5 rounded border leading-none"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      {level}
    </span>
  )
}

const TagBadge = ({ tag }) => {
  const colors = {
    smoke: '#10b981',
    validation: '#f59e0b',
    security: '#ef4444',
    ux: '#06b6d4',
    session: '#8b5cf6',
    a11y: '#84cc16',
    responsive: '#ec4899',
    network: '#3b82f6',
    chaos: '#f97316',
    logic: '#6366f1',
    complex: '#7c3aed',
  }
  const color = colors[tag] || '#6366f1'
  return (
    <span
      className="text-[9px] font-semibold px-2 py-0.5 rounded-full border leading-none capitalize"
      style={{ background: `${color}15`, color: color, borderColor: `${color}30` }}
    >
      #{tag}
    </span>
  )
}

const ScenarioCard = ({ scenario, isOpen, onToggle }) => (
  <div
    className={`border rounded-xl mb-2 overflow-hidden transition-all duration-200 ${isOpen ? 'bg-indigo-500/5 border-indigo-500/50' : 'bg-slate-900/40 border-slate-800'}`}
  >
    <button
      onClick={() => onToggle(scenario.id)}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="text-base flex-shrink-0">{scenario.icon || '🤖'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
            {scenario.id}
          </span>
          <PriorityBadge level={scenario.priority} />
          <TagBadge tag={scenario.tag} />
        </div>
        <span className="text-slate-200 text-xs font-bold leading-tight line-clamp-2">
          {scenario.title}
        </span>
      </div>
      <svg
        className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="px-3 pb-3 ml-11">
        <ol className="list-decimal space-y-1.5 ml-4">
          {scenario.steps.map((step, i) => (
            <li key={i} className="text-slate-400 text-[11px] leading-relaxed pl-1">
              {step}
            </li>
          ))}
        </ol>
        {scenario.selector && (
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/50">
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
              Target:
            </span>
            <code className="text-slate-500 text-[10px] font-mono bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800">
              [data-testid="{scenario.selector}"]
            </code>
          </div>
        )}
      </div>
    )}
  </div>
)

const TestScenariosModal = ({ isOpen, onClose, title, scenarios, masterPrompt }) => {
  const [openId, setOpenId] = useState(null)
  const [copied, setCopied] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(masterPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      console.warn('Copy failed')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        data-testid="test-scenarios-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-2xl">
              🤖
            </div>
            <div>
              <h2 className="text-white font-black text-xl leading-tight">Tests to Automate</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {title} — {scenarios.length} Scenarios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-xl"
            data-testid="ts-modal-close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* AI Prompt CTA */}
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="animate-pulse">🚀</span> AI Master Prompt
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
              Generate complete Playwright test scripts for this page instantly using our QA logic.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center gap-2 ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30'}`}
            data-testid="copy-master-prompt"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>{' '}
                Copied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>{' '}
                Copy Prompt
              </>
            )}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          {scenarios.map(s => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              isOpen={openId === s.id}
              onToggle={id => setOpenId(prev => (prev === id ? null : id))}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <span>Playbook v2.4a · Verified for Automation</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Documentation
          </span>
        </div>
      </div>
    </div>
  )
}

export default TestScenariosModal
