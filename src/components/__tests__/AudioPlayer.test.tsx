import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { AudioPlayer } from '../AudioPlayer'
import { renderWithProviders } from '../../test/utils/test-utils'

describe('AudioPlayer Component', () => {
  it('renders nothing when no track is playing', () => {
    renderWithProviders(<AudioPlayer />)

    // AudioPlayer should not render anything when no track is current
    expect(screen.queryByText(/now playing/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has correct component structure for empty state', () => {
    const { container } = renderWithProviders(<AudioPlayer />)

    // Component should render but return null (empty)
    expect(container.firstChild).toBeNull()
  })

  it('respects PlayerContext when no current track exists', () => {
    renderWithProviders(<AudioPlayer />)

    // Verify no audio player elements are present
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(screen.queryByText(/skip/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/pause/i)).not.toBeInTheDocument()
  })
})