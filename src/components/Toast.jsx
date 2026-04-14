import React from 'react'
import { motion as _motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useToast } from '../context/ToastContext'

const Toast = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center space-y-3 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map(toast => (
          <_motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto flex items-center justify-between w-full p-4 rounded-xl shadow-2xl backdrop-blur-md border
              ${
                toast.type === 'success'
                  ? 'bg-emerald-50/90 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50/90 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              {toast.type === 'success' ? (
                <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
              ) : (
                <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0" />
              )}
              <p className="text-sm font-medium leading-tight">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className={`
                ml-4 p-1 rounded-lg transition-colors
                ${
                  toast.type === 'success'
                    ? 'hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50'
                    : 'hover:bg-rose-200/50 dark:hover:bg-rose-800/50'
                }
              `}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </_motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Toast
