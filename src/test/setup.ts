import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Tests now use REAL Supabase connection with actual data from your .env file
// No more mocks - testing with real cloud database data!

// Mock window.matchMedia for responsive testing
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

// Mock IntersectionObserver for carousel/infinite scroll testing
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock HTMLMediaElement for audio player testing
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve()),
})

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
})

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
})

// Mock audio duration and currentTime
Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 180, // 3 minutes default
})

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
})

// Mock URL.createObjectURL for file handling
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Suppress console warnings in tests unless needed
const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  // Suppress React Router warnings in tests
  if (args[0]?.includes?.('React Router')) return
  originalConsoleWarn(...args)
}