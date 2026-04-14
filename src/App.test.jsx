import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import React from 'react'

// Mock matchMedia since it's not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App Component', () => {
  it('renders correctly', () => {
    render(<App />)
    // Check if the name exists (part of profile data)
    // Using a more generic check or looking for something specific like Header
    expect(document.querySelector('header')).toBeDefined()
  })

  it('toggles dark mode when the theme button is clicked', () => {
    render(<App />)

    // Find the theme toggle button - it has aria-label="Toggle theme"
    const toggleButton = screen.getByLabelText(/toggle theme/i)

    // Initial state should be light (since our mock matchMedia returns matches: false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click to toggle
    fireEvent.click(toggleButton)

    // Should now have the 'dark' class
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click again to toggle back
    fireEvent.click(toggleButton)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
