import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const StatusPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  // Default to 503 if no code is provided
  const statusCode = params.get('code') || '503'

  React.useEffect(() => {
    document.title = `Status ${statusCode} | LakshyaQALab`
  }, [statusCode])

  const statusInfo = {
    503: {
      title: 'Under Maintenance',
      message:
        "We're currently performing some scheduled maintenance to improve your playground experience. We'll be back online in a few minutes.",
      icon: (
        <svg
          className="w-20 h-20 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      ),
    },
    500: {
      title: 'Internal Server Error',
      message:
        'Something went wrong on our end. Our QA team has been notified and is investigating the issue.',
      icon: (
        <svg
          className="w-20 h-20 text-rose-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    404: {
      title: 'Page Not Found',
      message:
        "The page you're looking for doesn't exist or has been moved. Use this for testing broken links.",
      icon: (
        <svg
          className="w-20 h-20 text-amber-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  }

  const info = statusInfo[statusCode] || statusInfo['503']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl">{info.icon}</div>
        </div>

        <h1
          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
          data-testid="status-code"
        >
          {statusCode}
        </h1>
        <h2
          className="text-xl font-semibold text-gray-700 dark:text-slate-200 mb-4"
          data-testid="status-title"
        >
          {info.title}
        </h2>
        <p
          className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
          data-testid="status-message"
        >
          {info.message}
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            data-testid="retry-btn"
          >
            Retry Connection
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-all active:scale-95"
            data-testid="home-btn"
          >
            Go Back Home
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 dark:text-slate-500 font-mono">
        QA Playground Deployment System · 2.4.0-stable
      </p>
    </div>
  )
}

export default StatusPage
