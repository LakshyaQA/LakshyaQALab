import React, { createContext, useContext, useState, useCallback } from 'react'

const LoggerContext = createContext(null)

export const LoggerProvider = ({ children }) => {
  const [logs, setLogs] = useState([])

  const addLog = useCallback((type, message, details = null) => {
    setLogs(prev =>
      [
        {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          type, // 'info', 'error', 'request', 'action'
          message,
          details,
        },
        ...prev,
      ].slice(0, 50)
    ) // Keep only the latest 50 logs
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return (
    <LoggerContext.Provider value={{ logs, addLog, clearLogs }}>{children}</LoggerContext.Provider>
  )
}

export const useLogger = () => {
  const context = useContext(LoggerContext)
  if (!context) {
    throw new Error('useLogger must be used within a LoggerProvider')
  }
  return context
}
