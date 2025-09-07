/*
  # Create database schema for Audeon streaming platform

  1. Tables
    - communities: Community/platform information
    - creators: Content creator profiles
    - audio_tracks: Track metadata and content
    - user_saved_tracks: User's saved tracks (for future auth)
    
  2. Security
    - Public read access for content discovery
    - RLS policies for future user features
*/

-- Communities table
CREATE TABLE communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo text,
  description text,
  website text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creators table  
CREATE TABLE creators (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  image text,
  bio text,
  category text NOT NULL,
  follower_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Audio tracks table
CREATE TABLE audio_tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id integer UNIQUE NOT NULL, -- Legacy compatibility
  title text NOT NULL,
  url text,
  audio_url text NOT NULL,
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  category text NOT NULL,
  sub_category text[] DEFAULT '{}',
  summary text,
  release_date date,
  full_content text,
  read_time text,
  main_image_url text,
  main_image_caption text DEFAULT '',
  main_image_width integer DEFAULT 1200,
  main_image_height integer DEFAULT 630,
  voices jsonb DEFAULT '[]',
  gender text,
  audio_config jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User saved tracks table (for future auth features)
CREATE TABLE user_saved_tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid, -- Will reference auth.users when auth is implemented
  track_id uuid REFERENCES audio_tracks(id) ON DELETE CASCADE,
  saved_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, track_id)
);

-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_tracks ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Communities are publicly readable" 
ON communities FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Creators are publicly readable" 
ON creators FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Audio tracks are publicly readable" 
ON audio_tracks FOR SELECT 
TO public 
USING (true);

-- Future: User saved tracks will be private to user
CREATE POLICY "Users can view their own saved tracks" 
ON user_saved_tracks FOR SELECT 
TO authenticated 
USING (true); -- Will be: auth.uid() = user_id when auth is implemented

-- Create indexes for performance
CREATE INDEX idx_audio_tracks_creator_id ON audio_tracks(creator_id);
CREATE INDEX idx_audio_tracks_community_id ON audio_tracks(community_id);
CREATE INDEX idx_audio_tracks_category ON audio_tracks(category);
CREATE INDEX idx_audio_tracks_release_date ON audio_tracks(release_date DESC);
CREATE INDEX idx_user_saved_tracks_user_id ON user_saved_tracks(user_id);