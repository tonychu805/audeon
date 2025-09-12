import { logger } from '../utils/logger';
import { useState, useEffect, useCallback } from 'react';
import { AudioTrack } from '../types';
import { trackService } from '../services/database';
import { getAudioDuration, preloadDurations } from '../utils/audioDuration';

export const useAudioTracks = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Update track duration dynamically when it loads in background
  const updateTrackDuration = useCallback((trackId: string, duration: string) => {
    setTracks(currentTracks => 
      currentTracks.map(track => 
        track.id === trackId ? { ...track, duration } : track
      )
    );
  }, []);

  useEffect(() => {
    const loadTracksAndDurations = async () => {
      try {
        // First load tracks from database - immediate display
        const dbTracks = await trackService.getAll();
        
        // Set tracks immediately with existing durations or placeholders
        const tracksWithPlaceholders = dbTracks.map(track => ({
          ...track,
          duration: track.duration === '0:00' && track.audioUrl ? '--:--' : track.duration
        }));
        setTracks(tracksWithPlaceholders);
        setIsLoading(false); // UI shows immediately
        
        // Start background loading for tracks that need durations
        const tracksNeedingDuration = dbTracks.filter(
          track => track.duration === '0:00' && track.audioUrl
        );
        
        if (tracksNeedingDuration.length > 0) {
          // Preload all durations in background
          const audioUrls = tracksNeedingDuration.map(track => track.audioUrl);
          preloadDurations(audioUrls);
          
          // Update durations as they load
          tracksNeedingDuration.forEach(async (track) => {
            try {
              const duration = await getAudioDuration(track.audioUrl);
              updateTrackDuration(track.id, duration);
            } catch (error) {
              logger.error(`Failed to load duration for track ${track.id}:`, error);
              updateTrackDuration(track.id, '0:00');
            }
          });
        }
        
      } catch (error) {
        logger.error('Failed to load audio tracks:', error);
        setTracks([]);
        setIsLoading(false);
      }
    };

    loadTracksAndDurations();
  }, [updateTrackDuration]);

  return { tracks, isLoading };
};