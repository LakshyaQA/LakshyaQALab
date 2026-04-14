import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/navigation/Sidebar'
import ControlCenter from '../components/sandbox/ControlCenter'
import ProductGallery from '../components/sandbox/ProductGallery'
import AdvancedForms from '../components/sandbox/AdvancedForms'

const Sandbox = () => {
  useEffect(() => {
    document.title = 'Sandbox | LakshyaQALab'
  }, [])

  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }

    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled(prev => {
        if (!prev && y > 60) return true
        if (prev && y < 10) return false
        return prev
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-0 pt-0' : 'pt-8 px-8'}`}
        >
          <div className="max-w-6xl mx-auto">
            <header
              className={`flex justify-between items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-700 transition-all duration-500 ${isScrolled ? 'p-3 rounded-none' : 'p-5 rounded-xl'}`}
              data-testid="sandbox-header"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Open menu"
                  data-testid="sidebar-toggle"
                >
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <h1
                    className={`font-bold text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}
                  >
                    Automation Sandbox
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className={`border-2 border-rose-500 text-rose-500 font-bold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-300 ${isScrolled ? 'px-3 py-1.5 text-xs uppercase' : 'px-5 py-2'}`}
                  data-testid="logout-btn"
                >
                  Logout
                </button>
              </div>
            </header>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8 pt-6 pb-32">
          <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 mb-12 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">
                Advanced Widget Testing
              </h2>
              <p className="max-w-2xl text-blue-100 font-medium leading-relaxed">
                Welcome to the specialized sandbox. This area is designed for testing complex UI
                interactions like dynamic list filtering, date range selection, and nested DOM
                extractions.
              </p>
            </div>
            {/* Visual Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 2v20c-5.07 0-9.22-3.9-9.73-8.83L1.04 12l.23-1.17C1.78 5.9 5.93 2 11 2zm2 0c5.07 0 9.22 3.9 9.73 8.83l.23 1.17-.23 1.17C22.22 18.1 18.07 22 13 22V2z" />
              </svg>
            </div>
          </div>

          <div className="space-y-12">
            <ProductGallery />
            <AdvancedForms />
          </div>
        </div>
      </div>
      <ControlCenter />
    </>
  )
}

export default Sandbox
