import React, { createContext, useContext } from 'react'
import { useStorage } from '../hooks/useStorage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [localToken, setLocalToken] = useStorage('qa_auth_token', null, 'local')
  const [sessionToken, setSessionToken] = useStorage('qa_auth_token', null, 'session')

  // Active token is whatever we can find
  const token = localToken || sessionToken
  const isAuthenticated = !!token

  const login = async (username, password, rememberMe) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Hardcoded credentials for the playground
    if (username === 'admin' && password === 'Qwerty@1234') {
      const mockJwt = `mock_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_${Date.now()}`

      if (rememberMe) {
        setLocalToken(mockJwt)
        setSessionToken(null) // Clear session to avoid conflicts
      } else {
        setSessionToken(mockJwt)
        setLocalToken(null) // Clear local to avoid conflicts
      }
      return { success: true }
    } else {
      return { success: false, error: 'Invalid credentials. Please use admin / Qwerty@1234' }
    }
  }

  const logout = () => {
    setLocalToken(null)
    setSessionToken(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
