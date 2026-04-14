import React, { useRef, useEffect } from 'react'

const ACModal = ({ isOpen, onClose, title, criteria }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    modalRef.current?.querySelector('button')?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Acceptance Criteria"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        data-testid="ac-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">
                Acceptance Criteria
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {title} — Quality Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            aria-label="Close"
            data-testid="ac-modal-close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {criteria.map((group, gi) => (
            <div key={gi} className="relative pt-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded uppercase tracking-widest">
                  Section {gi + 1}
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700"></div>
              </div>
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                {group.section}
              </h3>
              <ul className="grid gap-3">
                {group.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex items-start space-x-3 text-slate-600 dark:text-slate-400 text-sm group"
                  >
                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                      <svg
                        className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex-shrink-0 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-tighter">
            QA Deployment System · Verified Component Lab
          </p>
          <div className="flex items-center gap-1.5 grayscale opacity-50">
            <span className="text-[10px] font-bold text-slate-400">STATUS:</span>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              PASSED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ACModal
