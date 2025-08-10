import { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { audioTracks as initialTracks } from '../data/tracks';
import { getAudioDuration } from '../utils/audioDuration';

export const useAudioTracks = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>(initialTracks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDurations = async () => {
      try {
        const tracksWithDurations = await Promise.all(
          initialTracks.map(async (track) => {
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
        console.error('Failed to load audio durations:', error);
        setTracks(initialTracks);
      } finally {
        setIsLoading(false);
      }
    };

    loadDurations();
  }, []);

  return { tracks, isLoading };
};