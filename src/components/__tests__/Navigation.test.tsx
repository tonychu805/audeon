import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '../Navigation'
import { renderWithRouter } from '../../test/utils/test-utils'

describe('Navigation Component', () => {
  it('renders all navigation tabs', () => {
    renderWithRouter(<Navigation activeTab="home" />)

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /library/i })).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    renderWithRouter(<Navigation activeTab="explore" />)

    const exploreTab = screen.getByRole('link', { name: /explore/i })
    const homeTab = screen.getByRole('link', { name: /home/i })

    // Active tab should have purple styling
    expect(exploreTab).toHaveClass('text-purple-600', 'bg-purple-50')

    // Inactive tab should have gray styling
    expect(homeTab).toHaveClass('text-gray-600')
    expect(homeTab).not.toHaveClass('text-purple-600', 'bg-purple-50')
  })

  it('renders correct navigation paths', () => {
    renderWithRouter(<Navigation activeTab="home" />)

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/home')
    expect(screen.getByRole('link', { name: /explore/i })).toHaveAttribute('href', '/explore')
    expect(screen.getByRole('link', { name: /library/i })).toHaveAttribute('href', '/library')
  })

  it('renders navigation icons', () => {
    renderWithRouter(<Navigation activeTab="home" />)

    // Check that icons are rendered (they should have specific classes)
    const homeLink = screen.getByRole('link', { name: /home/i })
    const exploreLink = screen.getByRole('link', { name: /explore/i })
    const libraryLink = screen.getByRole('link', { name: /library/i })

    expect(homeLink.querySelector('svg')).toBeInTheDocument()
    expect(exploreLink.querySelector('svg')).toBeInTheDocument()
    expect(libraryLink.querySelector('svg')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    renderWithRouter(<Navigation activeTab="home" />)

    // Check that nav element exists
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()

    // All tabs should be focusable links
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toBeInTheDocument()
      expect(link).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('applies hover styles on interaction', async () => {
    const user = userEvent.setup()
    renderWithRouter(<Navigation activeTab="home" />)

    const exploreTab = screen.getByRole('link', { name: /explore/i })

    // Should have hover class available
    expect(exploreTab).toHaveClass('hover:text-purple-600')

    // Test that element is interactable
    await user.hover(exploreTab)
    expect(exploreTab).toBeInTheDocument()
  })

  it('handles different activeTab values correctly', () => {
    const { rerender } = renderWithRouter(<Navigation activeTab="library" />)

    // Library should be active
    expect(screen.getByRole('link', { name: /library/i })).toHaveClass('text-purple-600')

    // Re-render with different active tab
    rerender(<Navigation activeTab="explore" />)

    // Explore should now be active
    expect(screen.getByRole('link', { name: /explore/i })).toHaveClass('text-purple-600')
    expect(screen.getByRole('link', { name: /library/i })).not.toHaveClass('text-purple-600')
  })

  it('has fixed positioning for mobile navigation', () => {
    renderWithRouter(<Navigation activeTab="home" />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0')
  })
})