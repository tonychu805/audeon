import { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { audioTracks as initialTracks } from '../data/mockData';
import { loadAudioDurations } from '../utils/audioUtils';

export const useAudioTracks = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>(initialTracks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDurations = async () => {
      try {
        const tracksWithDurations = await loadAudioDurations(initialTracks);
        setTracks(tracksWithDurations);
      } catch (error) {
        console.error('Failed to load audio durations:', error);
        // Keep original tracks if loading fails
        setTracks(initialTracks);
      } finally {
        setIsLoading(false);
      }
    };

    loadDurations();
  }, []);

  return { tracks, isLoading };
};