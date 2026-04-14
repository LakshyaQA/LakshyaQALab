import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  React.useEffect(() => {
    document.title = '404 Not Found | LakshyaQALab'
  }, [])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center px-4 transition-colors duration-300">
      <h1 className="text-9xl font-bold mb-4 text-gray-200 dark:text-slate-800 select-none">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The route you requested could not be found. This page is designed to test wildcard routing
        and broken links within the QA Playground.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        data-testid="return-home-btn"
      >
        Return to Login
      </Link>
    </div>
  )
}

export default NotFound
