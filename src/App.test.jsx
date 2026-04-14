import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import React from 'react'

// Mock matchMedia since it's not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App Component', () => {
  it('renders the login page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    // The app should redirect to /login and render the login form
    expect(screen.getByTestId('login-form') || document.querySelector('form')).toBeDefined()
  })

  it('shows 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/some-random-page']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('404')).toBeDefined()
    expect(screen.getByText('Return to Login')).toBeDefined()
  })
})
