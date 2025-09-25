import React, { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AudioTrack, PlayerState } from '../types';
import { logger } from '../utils/logger';

const FALLBACK_ARTWORK_URL = 'https://picsum.photos/seed/audeon-lock-screen/512/512';

const buildArtworkEntries = (track: AudioTrack) => {
  const artwork: Array<{ src: string; sizes?: string; type?: string }> = [];
  const appendArtwork = (src?: string | null) => {
    if (!src) {
      return;
    }
    artwork.push({
      src,
      sizes: '512x512',
      type: src.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
    });
  };

  appendArtwork(track?.main_image?.url);
  appendArtwork(`${FALLBACK_ARTWORK_URL}?track=${encodeURIComponent(track.id)}`);

  return artwork;
};

// Split contexts: State and Actions
interface PlayerStateContextType extends PlayerState {
  tracks: AudioTrack[];
  playbackSpeed: number;
}

interface PlayerActionsContextType {
  playTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleExpanded: () => void;
  toggleSaved: (trackId: string) => void;
  setTracks: (tracks: AudioTrack[]) => void;
  setPlaybackSpeed: (speed: number) => void;
}

const PlayerStateContext = createContext<PlayerStateContextType | undefined>(undefined);
const PlayerActionsContext = createContext<PlayerActionsContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedTracks, setSavedTracks] = useState<string[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Memoized actions - prevent recreation on every render
  const playTrack = useCallback((track: AudioTrack) => {
    logger.debug('Playing track:', track.title, 'Audio URL:', track.audioUrl);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  }, [currentTrack, tracks, playTrack]);

  const previousTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIndex]);
  }, [currentTrack, tracks, playTrack]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const toggleSaved = useCallback((trackId: string) => {
    setSavedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          logger.error('Audio play failed:', error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    const mediaSession = navigator.mediaSession;

    const MediaMetadataConstructor = typeof MediaMetadata !== 'undefined' ? MediaMetadata : undefined;

    if (currentTrack && MediaMetadataConstructor) {
      try {
        mediaSession.metadata = new MediaMetadataConstructor({
          title: currentTrack.title || 'Audeon',
          artist: currentTrack.creator || 'Audeon',
          album: currentTrack.community || 'Audeon',
          artwork: buildArtworkEntries(currentTrack)
        });
      } catch (error) {
        logger.warn('Failed to set media session metadata:', error);
      }
    }

    try {
      mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (error) {
      logger.warn('Failed to set media session playback state:', error);
    }

    const audio = audioRef.current;
    if (audio && typeof mediaSession.setPositionState === 'function') {
      try {
        mediaSession.setPositionState({
          duration: Number.isFinite(audio.duration) ? audio.duration : 0,
          playbackRate: Number.isFinite(audio.playbackRate) ? audio.playbackRate : playbackSpeed,
          position: Number.isFinite(audio.currentTime) ? audio.currentTime : 0
        });
      } catch (error) {
        logger.debug('Unable to update media session position state:', error);
      }
    }
  }, [currentTrack, isPlaying, playbackSpeed]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    const handlePlay = async () => {
      if (!currentTrack) {
        const nextTrackInQueue = tracks[0];
        if (nextTrackInQueue) {
          playTrack(nextTrackInQueue);
        }
        return;
      }
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleNext = () => {
      nextTrack();
    };

    const handlePrevious = () => {
      previousTrack();
    };

    const mediaSession = navigator.mediaSession;

    const setHandler = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        mediaSession.setActionHandler(action, handler);
      } catch (error) {
        logger.debug(`Media Session action ${action} not supported`, error);
      }
    };

    setHandler('play', handlePlay);
    setHandler('pause', handlePause);
    setHandler('nexttrack', handleNext);
    setHandler('previoustrack', handlePrevious);

    return () => {
      setHandler('play', null);
      setHandler('pause', null);
      setHandler('nexttrack', null);
      setHandler('previoustrack', null);
    };
  }, [currentTrack, tracks, playTrack, nextTrack, previousTrack]);

  // Memoized state object - prevents recreation on every render
  const stateValue = useMemo(() => ({
    currentTrack,
    isPlaying,
    isExpanded,
    savedTracks,
    tracks,
    playbackSpeed
  }), [currentTrack, isPlaying, isExpanded, savedTracks, tracks, playbackSpeed]);

  // Memoized actions object - prevents recreation on every render
  const actionsValue = useMemo(() => ({
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    toggleExpanded,
    toggleSaved,
    setTracks,
    setPlaybackSpeed
  }), [playTrack, togglePlayPause, nextTrack, previousTrack, toggleExpanded, toggleSaved]);

  return (
    <PlayerStateContext.Provider value={stateValue}>
      <PlayerActionsContext.Provider value={actionsValue}>
        {children}
        {currentTrack && currentTrack.audioUrl && (
          <audio
            ref={audioRef}
            src={currentTrack.audioUrl}
            onEnded={nextTrack}
            onError={(e) => {
              logger.error('Audio load error:', e, 'for track:', currentTrack.title);
              setIsPlaying(false);
            }}
            onLoadStart={() => {
              logger.debug('Loading audio:', currentTrack.title, currentTrack.audioUrl);
            }}
          />
        )}
      </PlayerActionsContext.Provider>
    </PlayerStateContext.Provider>
  );
};

// Separate hooks for state and actions
export const usePlayerState = () => {
  const context = useContext(PlayerStateContext);
  if (!context) {
    throw new Error('usePlayerState must be used within PlayerProvider');
  }
  return context;
};

export const usePlayerActions = () => {
  const context = useContext(PlayerActionsContext);
  if (!context) {
    throw new Error('usePlayerActions must be used within PlayerProvider');
  }
  return context;
};

// Backward compatibility hook
export const usePlayer = () => {
  const state = usePlayerState();
  const actions = usePlayerActions();
  return { ...state, ...actions };
};