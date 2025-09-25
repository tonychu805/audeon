import React, { useEffect, act } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AudioPlayer } from '../AudioPlayer'
import { renderWithProviders } from '../../test/utils/test-utils'
import { usePlayer } from '../../context/PlayerContext'
import { AudioTrack } from '../../types'

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

  it('provides accessible controls when a track is active', async () => {
    const mockTrack: AudioTrack = {
      id: 'track-1',
      track_id: 1,
      title: 'Test Track',
      url: '',
      audioUrl: 'https://example.com/audio.mp3',
      creator: 'Test Creator',
      community: 'Test Community',
      category: 'Test Category',
      sub_category: [],
      summary: 'A summary for testing purposes',
      releaseDate: new Date().toISOString(),
      full_content: 'Full content',
      read_time: '5 min',
      duration: '3:00',
      main_image: {
        url: 'https://picsum.photos/seed/test-track/200/200',
        caption: '',
        width: 200,
        height: 200
      },
      voices: [],
      gender: '',
      audio_config: {
        tone_override: '',
        voice_preference: '',
        custom_instructions: ''
      }
    }

    const Harness: React.FC = () => {
      const { setTracks, playTrack } = usePlayer()
      useEffect(() => {
        setTracks([mockTrack])
        playTrack(mockTrack)
      }, [setTracks, playTrack])

      return <AudioPlayer />
    }

    const playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve())
    const pauseSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {})

    const user = userEvent.setup()

    renderWithProviders(<Harness />)

    const slider = await screen.findByRole('slider', { name: /track progress/i })
    expect(slider).toBeInTheDocument()

    const audio = document.querySelector('audio') as HTMLAudioElement
    expect(audio).toBeTruthy()

    let simulatedCurrentTime = 0
    act(() => {
      Object.defineProperty(audio, 'duration', {
        configurable: true,
        get: () => 120
      })
      Object.defineProperty(audio, 'currentTime', {
        configurable: true,
        get: () => simulatedCurrentTime,
        set: (value: number) => {
          simulatedCurrentTime = value
        }
      })
      audio.dispatchEvent(new Event('loadedmetadata'))
    })

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuetext', expect.stringContaining('2:00'))
    })

    await user.keyboard('{ArrowRight}')

    await waitFor(() => {
      expect(slider).toHaveAttribute('aria-valuetext', expect.stringContaining('0:10'))
    })

    const playButton = screen.getByRole('button', { name: /pause test track/i })
    expect(playButton).toHaveAttribute('aria-pressed', 'true')

    const speedButton = screen.getAllByRole('button', { name: /playback speed/i })[0]
    await user.click(speedButton)
    const speedMenu = await screen.findByRole('menu', { name: /playback speed options/i })
    expect(speedMenu).toBeInTheDocument()

    playSpy.mockRestore()
    pauseSpy.mockRestore()
  })
})