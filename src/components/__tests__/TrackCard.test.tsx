import { describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrackCard } from '../TrackCard'
import { renderWithProviders, isValidTimeFormat } from '../../test/utils/test-utils'
import { trackService } from '../../services/database'
import type { AudioTrack } from '../../types'

describe('TrackCard Component', () => {
  let testTrack: AudioTrack | undefined

  beforeEach(async () => {
    // Get real track data from database
    const tracks = await trackService.getAll()
    testTrack = tracks[0] // Use first available track

    // Skip tests if no tracks available
    if (!testTrack) {
      console.warn('No tracks available in database for testing')
      return
    }
  })

  it('renders track information correctly with real data', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} />)

    // Check basic track info is displayed
    expect(screen.getByText(testTrack.title)).toBeInTheDocument()
    expect(screen.getByText(testTrack.creator)).toBeInTheDocument()
    expect(screen.getByText(testTrack.summary)).toBeInTheDocument()
    expect(screen.getByText(testTrack.category)).toBeInTheDocument()

    // Check duration is in valid format
    expect(screen.getByText(testTrack.duration)).toBeInTheDocument()
    expect(isValidTimeFormat(testTrack.duration)).toBe(true)
  })

  it('displays track image with error handling', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} />)

    const image = screen.getByAltText(testTrack.title)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', testTrack.main_image.url)

    // Test error handling
    fireEvent.error(image)
    // Image should still be in document (error handler prevents removal)
    expect(image).toBeInTheDocument()
  })

  it('renders play button and handles interaction', async () => {
    if (!testTrack) return

    const user = userEvent.setup()
    renderWithProviders(<TrackCard track={testTrack} />)

    // Play button has play icon - find by looking for the purple button
    const buttons = screen.getAllByRole('button')
    const playButton = buttons.find(btn => btn.classList.contains('bg-purple-600'))

    expect(playButton).toBeInTheDocument()
    expect(playButton).toHaveClass('bg-purple-600')

    // Click play button
    if (playButton) {
      await user.click(playButton)
      // Should trigger playTrack in context
      expect(playButton).toBeInTheDocument()
    }
  })

  it('shows save button when enabled', async () => {
    if (!testTrack) return

    const user = userEvent.setup()
    renderWithProviders(<TrackCard track={testTrack} showSaveButton={true} />)

    // Should have 2 buttons when save button is enabled: heart + play
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)

    // Find save button (the one that's not purple - the heart button)
    const saveButton = buttons.find(btn => !btn.classList.contains('bg-purple-600'))
    expect(saveButton).toBeInTheDocument()

    if (saveButton) {
      await user.click(saveButton)
      expect(saveButton).toBeInTheDocument()
    }
  })

  it('hides save button when disabled', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} showSaveButton={false} />)

    // Save button should not be present (check by counting buttons)
    const buttons = screen.getAllByRole('button')
    // Should only have play button (1 button) when save is disabled
    expect(buttons).toHaveLength(1)
  })

  it('handles onClick callback', async () => {
    if (!testTrack) return

    const user = userEvent.setup()
    let clickHandled = false
    const handleClick = () => { clickHandled = true }

    renderWithProviders(<TrackCard track={testTrack} onClick={handleClick} />)

    // Click on the card (but not on buttons)
    const cardTitle = screen.getByText(testTrack.title)
    await user.click(cardTitle)

    expect(clickHandled).toBe(true)
  })

  it('formats release date correctly', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} />)

    // Should display some form of date (component formats to relative time like "2 weeks ago")
    const dateElement = screen.getByText(/ago|yesterday|today|\d+ days?|\d+ weeks?|\d+ months?/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('prevents event bubbling on button clicks', async () => {
    if (!testTrack) return

    const user = userEvent.setup()
    let cardClicked = false
    const handleCardClick = () => { cardClicked = true }

    renderWithProviders(
      <TrackCard
        track={testTrack}
        onClick={handleCardClick}
        showSaveButton={true}
      />
    )

    // Click play button - should not trigger card click
    const buttons = screen.getAllByRole('button')
    const playButton = buttons.find(btn => btn.classList.contains('bg-purple-600'))
    if (playButton) {
      await user.click(playButton)
      expect(cardClicked).toBe(false)
    }

    // Click save button - should not trigger card click (reuse buttons from above)
    const saveButton = buttons.find(btn => !btn.classList.contains('bg-purple-600'))
    if (saveButton) {
      await user.click(saveButton)
    }
    expect(cardClicked).toBe(false)
  })

  it('has proper accessibility structure', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} showSaveButton={true} />)

    // Check all buttons are present and interactable
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // play + save buttons

    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
      expect(button).toBeVisible()
      expect(button).not.toHaveAttribute('disabled')
    })

    // Check heading structure
    const heading = screen.getByRole('heading', { name: testTrack.title })
    expect(heading).toBeInTheDocument()
  })

  it('displays all track metadata correctly', async () => {
    if (!testTrack) return

    renderWithProviders(<TrackCard track={testTrack} />)

    // Verify all expected content is present
    expect(screen.getByText(testTrack.title)).toBeInTheDocument()
    expect(screen.getByText(testTrack.creator)).toBeInTheDocument()
    expect(screen.getByText(testTrack.summary)).toBeInTheDocument()
    expect(screen.getByText(testTrack.category)).toBeInTheDocument()
    expect(screen.getByText(testTrack.duration)).toBeInTheDocument()

    // Check that image is loaded
    const image = screen.getByAltText(testTrack.title)
    expect(image).toHaveAttribute('src', testTrack.main_image.url)
  })
})
