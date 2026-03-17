/**
 * Supabase Edge Function: Semantic Search
 *
 * Provides semantic search for audio tracks using vector embeddings.
 *
 * POST /functions/v1/semantic-search
 * Body: { query: string, limit?: number, threshold?: number }
 * Returns: { tracks: AudioTrack[], query: string }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;
const DEFAULT_LIMIT = 10;
const DEFAULT_THRESHOLD = 0.25; // Lower threshold for better recall

interface SearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
}

interface SearchResult {
  track_id: number;
  title: string;
  summary: string;
  creator: string;
  category: string;
  audio_url: string;
  main_image_url: string;
  release_date: string;
  similarity: number;
}

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body: SearchRequest = await req.json();
    const { query, limit = DEFAULT_LIMIT, threshold = DEFAULT_THRESHOLD } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query is required and must be a non-empty string' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openaiApiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query.trim(), openaiApiKey);

    // Call the match_tracks RPC function
    const { data: tracks, error } = await supabase.rpc('match_tracks', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: Math.min(limit, 50), // Cap at 50 results
    });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Transform results to match frontend AudioTrack format
    const results = (tracks || []).map((track: SearchResult) => ({
      id: track.track_id.toString(),
      track_id: track.track_id,
      title: track.title,
      summary: track.summary || '',
      creator: track.creator || '',
      category: track.category || '',
      audioUrl: track.audio_url,
      main_image: {
        url: track.main_image_url || '',
        caption: '',
        width: 1200,
        height: 630,
      },
      releaseDate: track.release_date || '',
      similarity: track.similarity,
    }));

    return new Response(
      JSON.stringify({
        tracks: results,
        query: query.trim(),
        count: results.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Semantic search error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
