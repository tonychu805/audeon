import { logger } from '../utils/logger';
import { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { getAudioDuration } from '../utils/audioDuration';

export const useAudioDurations = (tracks: AudioTrack[]) => {
  const [tracksWithDurations, setTracksWithDurations] = useState<AudioTrack[]>(tracks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDurations = async () => {
      const updatedTracks = await Promise.all(
        tracks.map(async (track) => {
          // Only update duration if it's 0:00 and has a valid audio URL
          if (track.duration === '0:00' && track.audioUrl) {
            try {
              const duration = await getAudioDuration(track.audioUrl);
              return { ...track, duration };
            } catch (error) {
              logger.error(`Failed to load duration for track ${track.id}:`, error);
              return track;
            }
          }
          return track;
        })
      );
      
      setTracksWithDurations(updatedTracks);
      setLoading(false);
    };

    loadDurations();
  }, [tracks]);

  return { tracks: tracksWithDurations, loading };
};