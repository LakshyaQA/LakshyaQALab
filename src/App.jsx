import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'

import { LoggerProvider } from './context/LoggerContext'
import { NetworkProvider } from './context/NetworkContext'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import StatusPage from './pages/StatusPage'
import Sandbox from './pages/Sandbox'
import Shop from './pages/Shop'
import RandomTest from './pages/RandomTest'
import XPathLab from './pages/XPathLab'
import QAToolsOverlay from './components/qa/QAToolsOverlay'
import ScrollToHash from './components/navigation/ScrollToHash'

function App() {
  const [darkMode, _setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <LoggerProvider>
      <NetworkProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
              <Routes>
                {/* Default route redirects to Login for standalone QA Playground */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/random-test" element={<RandomTest />} />
                <Route path="/xpath-lab" element={<XPathLab />} />
                <Route path="/maintenance" element={<StatusPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toast />
              <ScrollToHash />
              <QAToolsOverlay />
            </div>
          </ToastProvider>
        </AuthProvider>
      </NetworkProvider>
    </LoggerProvider>
  )
}

export default App
