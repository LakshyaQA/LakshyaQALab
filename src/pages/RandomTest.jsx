import React, { useState, useEffect } from 'react'
import Sidebar from '../components/navigation/Sidebar'
import ControlCenter from '../components/sandbox/ControlCenter'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useLogger } from '../context/LoggerContext'

const RandomTest = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { addLog } = useLogger()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [frameCount, setFrameCount] = useState(0)

  useEffect(() => {
    document.title = 'Random Test Lab | LakshyaQALab'
    if (!isAuthenticated) navigate('/login')

    // Header scroll handling
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth >= 768) {
            const y = window.scrollY
            setIsScrolled(prev => {
              if (!prev && y > 80) return true
              if (prev && y < 20) return false
              return prev
            })
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  // Listener for Iframe interaction (Cross-origin simulated via postMessage or local handlers)
  useEffect(() => {
    const handleMessage = event => {
      if (event.data?.type === 'FRAME_ACTION') {
        setFrameCount(prev => prev + 1)
        addLog('action', `Iframe Event Received: ${event.data.message}`)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [addLog])

  if (!isAuthenticated) return null

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Header - Reusing logic from Dashboard/Sandbox */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-0 pt-0' : 'pt-8 px-8'}`}
        >
          <div
            className={`transition-all duration-500 ${isScrolled ? 'max-w-none w-full' : 'max-w-6xl mx-auto'}`}
          >
            <header
              className={`flex justify-between items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-700 transition-all duration-500 ${isScrolled ? 'p-3 px-8 rounded-none' : 'p-5 rounded-xl'}`}
            >
              <div
                className={`flex items-center justify-between w-full ${isScrolled ? 'max-w-6xl mx-auto' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
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
                  <h1
                    className={`font-black uppercase text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}
                  >
                    Random Test Lab
                  </h1>
                </div>
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100 dark:border-rose-800/50">
                  Experimental
                </span>
              </div>
            </header>
          </div>
        </div>

        <main className="max-w-6xl mx-auto p-8 pt-12 pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ───── Iframe Player Challenge ───── */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 text-xl font-bold italic">
                  F!
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    The "Fahhh" Player
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Challenge: Switch to Iframe and automate the video state.
                  </p>
                </div>
              </div>

              <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative group">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/VP6eZu3SAak?autoplay=0&enablejsapi=1"
                  title="Taileons Fahhh Meme"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 z-10"
                  data-testid="fahhh-iframe"
                ></iframe>
                {/* Visual Overlay for automation context */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/60 text-white text-[9px] font-mono px-2 py-1 rounded border border-white/20">
                    TARGET: iframe[data-testid="fahhh-iframe"]
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700">
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                  Scenario Specs
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-xs text-gray-600 dark:text-slate-300">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mr-2"></span>
                    Confirm Iframe is present in DOM.
                  </li>
                  <li className="flex items-center text-xs text-gray-600 dark:text-slate-300">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mr-2"></span>
                    Switch context and wait for video player initialization.
                  </li>
                </ul>
              </div>
            </div>

            {/* ───── Cross-Frame Interaction ───── */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 text-xl font-black">
                  ↔
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    Cross-Window Flow
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Interact inside Iframe to update parent state.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 min-h-[400px] flex flex-col justify-between">
                <div className="text-center mb-8">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">
                    Parent Counter
                  </p>
                  <div
                    className="text-6xl font-black font-mono text-indigo-600 animate-in zoom-in duration-300"
                    data-testid="parent-counter"
                  >
                    {frameCount}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                  <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Embedded Iframe Area
                  </p>

                  {/* Using a local srcDoc to truly simulate a switchable Iframe without needing a separate file */}
                  <iframe
                    srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>
                                body { 
                                  margin: 0; padding: 20px; font-family: sans-serif; 
                                  background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
                                  display: flex; flex-direction: column; align-items: center; justify-content: center;
                                  height: 120px; border-radius: 12px; overflow: hidden;
                                }
                                button { 
                                  background: white; border: none; padding: 10px 20px; 
                                  border-radius: 8px; font-weight: 800; color: #4f46e5;
                                  cursor: pointer; font-size: 12px; text-transform: uppercase;
                                  box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.1s;
                                }
                                button:active { transform: scale(0.95); }
                              </style>
                            </head>
                            <body>
                              <button id="iframe-ping-btn" onclick="window.parent.postMessage({type: 'FRAME_ACTION', message: 'User clicked button inside Iframe!'}, '*')">Ping Parent</button>
                            </body>
                          </html>
                        `}
                    className="w-full h-[160px] border-none rounded-xl shadow-inner bg-slate-900"
                    data-testid="interactive-iframe"
                    title="Interactive Challenge Frame"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ControlCenter />
    </>
  )
}

export default RandomTest
