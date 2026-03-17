-- Migration: Add pgvector support for semantic search and recommendations
-- This migration adds embedding support to audio_tracks for semantic search

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to audio_tracks
-- Using 1536 dimensions for OpenAI text-embedding-3-small
ALTER TABLE audio_tracks
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Semantic search function: find tracks matching a query embedding
CREATE OR REPLACE FUNCTION match_tracks(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  track_id integer,
  title text,
  summary text,
  creator text,
  category text,
  audio_url text,
  main_image_url text,
  release_date text,
  similarity float
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    at.track_id,
    at.title,
    at.summary,
    c.name as creator,
    at.category,
    at.audio_url,
    at.main_image_url,
    at.release_date::text,
    1 - (at.embedding <=> query_embedding) as similarity
  FROM audio_tracks at
  LEFT JOIN creators c ON at.creator_id = c.id
  WHERE at.embedding IS NOT NULL
    AND 1 - (at.embedding <=> query_embedding) > match_threshold
  ORDER BY at.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Similar tracks function: find tracks similar to a given track (for recommendations)
CREATE OR REPLACE FUNCTION get_similar_tracks(
  source_track_id integer,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  track_id integer,
  title text,
  summary text,
  creator text,
  category text,
  audio_url text,
  main_image_url text,
  similarity float
)
LANGUAGE plpgsql AS $$
DECLARE
  source_embedding vector(1536);
BEGIN
  -- Get the embedding for the source track
  SELECT embedding INTO source_embedding
  FROM audio_tracks WHERE audio_tracks.track_id = source_track_id;

  -- If no embedding exists, return empty result
  IF source_embedding IS NULL THEN RETURN; END IF;

  RETURN QUERY
  SELECT
    at.track_id,
    at.title,
    at.summary,
    c.name as creator,
    at.category,
    at.audio_url,
    at.main_image_url,
    1 - (at.embedding <=> source_embedding) as similarity
  FROM audio_tracks at
  LEFT JOIN creators c ON at.creator_id = c.id
  WHERE at.embedding IS NOT NULL
    AND at.track_id != source_track_id
  ORDER BY at.embedding <=> source_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION match_tracks TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_similar_tracks TO authenticated, anon;

-- Add comment for documentation
COMMENT ON FUNCTION match_tracks IS 'Semantic search: finds tracks matching a query embedding using cosine similarity';
COMMENT ON FUNCTION get_similar_tracks IS 'Recommendation: finds tracks similar to a given track for "Up Next" suggestions';
