import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { PlayerProvider } from '../../context/PlayerContext'

// Custom render with real providers - uses real Supabase data
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

// Helper for components that only need router (no player context)
export function renderWithRouter(ui: ReactElement) {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
  })
}

// Accessibility test helpers
export function expectAccessibleButton(element: HTMLElement) {
  expect(element).toBeInTheDocument()
  expect(element.tagName).toBe('BUTTON')
  expect(element).not.toHaveAttribute('disabled')
  expect(element).toBeVisible()
}

export function expectAccessibleLink(element: HTMLElement) {
  expect(element).toBeInTheDocument()
  expect(element.tagName).toBe('A')
  expect(element).toHaveAttribute('href')
  expect(element).toBeVisible()
}

// Time format validation helper
export function isValidTimeFormat(timeString: string): boolean {
  const timeRegex = /^\d+:\d{2}$/
  return timeRegex.test(timeString)
}

// Wait for async data loading
export async function waitForDataLoad() {
  // Give components time to load data from Supabase
  await new Promise(resolve => setTimeout(resolve, 100))
}