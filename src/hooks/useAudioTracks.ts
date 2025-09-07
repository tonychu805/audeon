import { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { trackService } from '../services/database';
import { getAudioDuration } from '../utils/audioDuration';

export const useAudioTracks = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracksAndDurations = async () => {
      try {
        // First load tracks from database
        const dbTracks = await trackService.getAll();
        
        // Then load durations for tracks that need them
        const tracksWithDurations = await Promise.all(
          dbTracks.map(async (track) => {
            // Only update duration if it's 0:00 and has a valid audio URL
            if (track.duration === '0:00' && track.audioUrl) {
              try {
                const duration = await getAudioDuration(track.audioUrl);
                return { ...track, duration };
              } catch (error) {
                console.error(`Failed to load duration for track ${track.id}:`, error);
                return track;
              }
            }
            return track;
          })
        );
        setTracks(tracksWithDurations);
      } catch (error) {
        console.error('Failed to load audio tracks:', error);
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracksAndDurations();
  }, []);

  return { tracks, isLoading };
};