import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ChaosForm from '../components/sandbox/ChaosForm'
import ControlCenter from '../components/sandbox/ControlCenter'
import DataTable from '../components/sandbox/DataTable'
import FileUpload from '../components/sandbox/FileUpload'
import Sidebar from '../components/navigation/Sidebar'

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard | LakshyaQALab'
  }, [])

  const { isAuthenticated, logout, token } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Disable scroll effects on mobile for stability
          if (window.innerWidth < 768) {
            setIsScrolled(false)
            ticking = false
            return
          }

          const y = window.scrollY
          setIsScrolled(prev => {
            // Wider hysteresis gap: 80px to collapse, < 20px to expand
            if (!prev && y > 80) return true
            if (prev && y < 20) return false
            return prev
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Sticky Header Wrapper */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-0 pt-0' : 'pt-8 px-8'}`}
        >
          <div
            className={`transition-all duration-500 ${isScrolled ? 'max-w-none w-full' : 'max-w-6xl mx-auto'}`}
          >
            <header
              className={`flex justify-between items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-700 transition-all duration-500 ${isScrolled ? 'p-3 px-8 rounded-none' : 'p-5 rounded-xl'}`}
              data-testid="dashboard-header"
            >
              <div
                className={`flex items-center justify-between w-full ${isScrolled ? 'max-w-6xl mx-auto' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  {/* Hamburger Menu Toggle */}
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

                  <div
                    className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}
                  >
                    <h1
                      className={`font-bold text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}
                    >
                      QA Automation Lab
                    </h1>
                    <div
                      className={`flex items-center transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 w-0 overflow-hidden' : 'opacity-100 mt-1 h-5'}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Authenticated Session Active
                      </span>
                    </div>
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
              </div>
            </header>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8 pt-6 pb-32">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 relative group">
            <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Session Token
              </span>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                data-testid="copy-token-btn"
              >
                {copied ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </h2>
            <p
              className="text-sm break-all font-mono bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600"
              data-testid="session-token-text"
            >
              {token}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataTable />
            <FileUpload />
            <ChaosForm />
          </div>
        </div>
      </div>
      <ControlCenter />
    </>
  )
}

export default Dashboard
