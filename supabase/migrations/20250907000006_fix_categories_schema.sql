/*
  # Fix categories schema with proper UUID relationships
  
  This migration handles the current state where:
  - categories table may not exist or has wrong schema
  - audio_tracks.category_id exists as text type
  
  Steps:
  1. Drop/recreate categories table with UUID
  2. Fix audio_tracks.category_id to be UUID FK
  3. Migrate data properly
*/

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table with UUID primary key
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);

-- Insert categories with specific UUIDs for referencing
INSERT INTO categories (id, name, icon) VALUES
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Business', '💼'),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'Data Science', '📊'),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Psychology', '🧠'),
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Product Management', '🚀'),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'Marketing', '📢'),
('550e8400-e29b-41d4-a716-446655440006'::uuid, 'Finance', '💰');

-- Drop existing category_id column from audio_tracks (may be text type)
ALTER TABLE audio_tracks DROP COLUMN IF EXISTS category_id;

-- Add new category_id foreign key column (without constraint first)
ALTER TABLE audio_tracks ADD COLUMN category_id uuid;

-- Migrate existing data: map category text to category UUIDs
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440001'::uuid WHERE category = 'Business';
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440002'::uuid WHERE category = 'Data Science';
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440003'::uuid WHERE category = 'Psychology';
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440004'::uuid WHERE category = 'Product Management';
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440005'::uuid WHERE category = 'Marketing';
UPDATE audio_tracks SET category_id = '550e8400-e29b-41d4-a716-446655440006'::uuid WHERE category = 'Finance';

-- For any unmapped categories, default to Business category
UPDATE audio_tracks 
SET category_id = '550e8400-e29b-41d4-a716-446655440001'::uuid 
WHERE category_id IS NULL AND category IS NOT NULL;

-- Set NOT NULL constraint after data migration
ALTER TABLE audio_tracks ALTER COLUMN category_id SET NOT NULL;

-- Add foreign key constraint after data is migrated
ALTER TABLE audio_tracks ADD CONSTRAINT audio_tracks_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id);