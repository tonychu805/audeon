import { useState, useEffect } from 'react';
import { AudioTrack } from '../types';
import { getSimilarTracks } from '../services/semanticSearch';
import { logger } from '../utils/logger';

export interface UseSimilarTracksReturn {
  tracks: AudioTrack[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch similar tracks for recommendations ("Up Next" section)
 */
export function useSimilarTracks(
  trackId: number | null,
  limit: number = 5
): UseSimilarTracksReturn {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if no track ID
    if (!trackId || trackId <= 0) {
      setTracks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const fetchSimilarTracks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const similarTracks = await getSimilarTracks(trackId, limit);

        if (isMounted) {
          setTracks(similarTracks);
        }
      } catch (err) {
        logger.error('Failed to fetch similar tracks:', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load recommendations');
          setTracks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSimilarTracks();

    return () => {
      isMounted = false;
    };
  }, [trackId, limit]);

  return { tracks, isLoading, error };
}
