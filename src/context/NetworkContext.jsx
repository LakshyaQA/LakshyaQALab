import React, { createContext, useContext, useState } from 'react'
import { useLogger } from './LoggerContext'

const NetworkContext = createContext(null)

export const NetworkProvider = ({ children }) => {
  const [simulate500Error, setSimulate500Error] = useState(false)
  const [simulateOffline, setSimulateOffline] = useState(false)
  const [simulateSlowNetwork, setSimulateSlowNetwork] = useState(false)
  const { addLog } = useLogger()

  // A generic wrapper function that UI components can call to mimic an API fetch.
  // It obeys the current god mode toggles.
  const mockFetch = async (endpoint, options = {}) => {
    addLog('request', `Outgoing Request: ${endpoint}`, options)

    if (simulateOffline) {
      addLog('error', `Network Error: User is offline (${endpoint})`)
      throw new Error('Network Error: Offline mode active')
    }

    if (simulateSlowNetwork) {
      addLog('info', `Simulating slow network (+3000ms delay)`)
      await new Promise(resolve => setTimeout(resolve, 3000))
    } else {
      // Normal simulated delay
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    if (simulate500Error) {
      addLog('error', `500 Internal Server Error (${endpoint})`)
      throw new Error('500 Internal Server Error')
    }

    addLog('info', `200 OK (${endpoint})`)
    return { success: true, timestamp: Date.now() }
  }

  return (
    <NetworkContext.Provider
      value={{
        simulate500Error,
        setSimulate500Error,
        simulateOffline,
        setSimulateOffline,
        simulateSlowNetwork,
        setSimulateSlowNetwork,
        mockFetch,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}
