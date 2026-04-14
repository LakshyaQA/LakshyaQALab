import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Toast from './components/Toast'

import { LoggerProvider } from './context/LoggerContext'
import { NetworkProvider } from './context/NetworkContext'

// Pages
import Portfolio from './pages/Portfolio'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import StatusPage from './pages/StatusPage'
import Sandbox from './pages/Sandbox'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or default to light mode
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <LoggerProvider>
      <NetworkProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
              <Routes>
                {/* Default route redirects to Login for standalone QA Playground */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/portfolio" element={<Portfolio darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/maintenance" element={<StatusPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toast />
            </div>
          </ToastProvider>
        </AuthProvider>
      </NetworkProvider>
    </LoggerProvider>
  )
}

export default App
