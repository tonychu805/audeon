import { supabase } from '../lib/supabase';
import { AudioTrack } from '../types';
import { logger } from '../utils/logger';

export interface SemanticSearchResult {
  tracks: AudioTrack[];
  query: string;
  count: number;
}

interface SearchTrackResult {
  id: string;
  track_id: number;
  title: string;
  summary: string;
  creator: string;
  category: string;
  audioUrl: string;
  main_image: {
    url: string;
    caption: string;
    width: number;
    height: number;
  };
  releaseDate: string;
  similarity: number;
}

/**
 * Perform semantic search using the Supabase Edge Function
 */
export async function semanticSearch(
  query: string,
  limit: number = 10
): Promise<SemanticSearchResult> {
  if (!query || query.trim().length === 0) {
    return { tracks: [], query: '', count: 0 };
  }

  try {
    const { data, error } = await supabase.functions.invoke('semantic-search', {
      body: { query: query.trim(), limit },
    });

    if (error) {
      logger.error('Semantic search error:', error);
      throw new Error(error.message || 'Search failed');
    }

    // Transform results to match AudioTrack type
    const tracks: AudioTrack[] = (data?.tracks || []).map((track: SearchTrackResult) => ({
      id: track.id,
      track_id: track.track_id,
      title: track.title,
      url: '',
      audioUrl: track.audioUrl,
      creator: track.creator,
      community: '',
      category: track.category,
      sub_category: [],
      summary: track.summary,
      releaseDate: track.releaseDate,
      full_content: '',
      read_time: '',
      duration: '',
      main_image: track.main_image,
      voices: [],
      gender: '',
      audio_config: {
        tone_override: '',
        voice_preference: '',
        custom_instructions: '',
      },
    }));

    return {
      tracks,
      query: data?.query || query,
      count: data?.count || tracks.length,
    };
  } catch (error) {
    logger.error('Semantic search failed:', error);
    throw error;
  }
}

/**
 * Get similar tracks for recommendations
 */
export async function getSimilarTracks(
  trackId: number,
  limit: number = 5
): Promise<AudioTrack[]> {
  try {
    const { data, error } = await supabase.rpc('get_similar_tracks', {
      source_track_id: trackId,
      match_count: limit,
    });

    if (error) {
      logger.error('Similar tracks error:', error);
      throw new Error(error.message || 'Failed to get similar tracks');
    }

    // Transform results to match AudioTrack type
    interface SimilarTrackResult {
      track_id: number;
      title: string;
      summary: string | null;
      creator: string | null;
      category: string | null;
      audio_url: string;
      main_image_url: string | null;
      similarity: number;
    }

    return (data || []).map((track: SimilarTrackResult) => ({
      id: track.track_id.toString(),
      track_id: track.track_id,
      title: track.title,
      url: '',
      audioUrl: track.audio_url,
      creator: track.creator || '',
      community: '',
      category: track.category || '',
      sub_category: [],
      summary: track.summary || '',
      releaseDate: '',
      full_content: '',
      read_time: '',
      duration: '',
      main_image: {
        url: track.main_image_url || '',
        caption: '',
        width: 1200,
        height: 630,
      },
      voices: [],
      gender: '',
      audio_config: {
        tone_override: '',
        voice_preference: '',
        custom_instructions: '',
      },
    }));
  } catch (error) {
    logger.error('Failed to get similar tracks:', error);
    return [];
  }
}
