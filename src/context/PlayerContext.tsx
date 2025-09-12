import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { AudioTrack, PlayerState } from '../types';
import { logger } from '../utils/logger';

interface PlayerContextType extends PlayerState {
  playTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleExpanded: () => void;
  toggleSaved: (trackId: string) => void;
  setTracks: (tracks: AudioTrack[]) => void;
  tracks: AudioTrack[];
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedTracks, setSavedTracks] = useState<string[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (track: AudioTrack) => {
    logger.debug('Playing track:', track.title, 'Audio URL:', track.audioUrl);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIndex]);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSaved = (trackId: string) => {
    setSavedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

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

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      isExpanded,
      savedTracks,
      tracks,
      playTrack,
      togglePlayPause,
      nextTrack,
      previousTrack,
      toggleExpanded,
      toggleSaved,
      setTracks,
      playbackSpeed,
      setPlaybackSpeed
    }}>
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
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};