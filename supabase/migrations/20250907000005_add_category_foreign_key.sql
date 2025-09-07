/*
  # Add category foreign key to audio_tracks table

  1. Changes
    - Add category_id foreign key column to audio_tracks
    - Migrate existing category text data to reference category IDs
    - Keep category text field for backward compatibility during transition
    
  2. Data Migration
    - Map existing category text values to category IDs
    - Update all existing tracks with proper category_id references
*/

-- Drop existing category_id column (contains text values)
ALTER TABLE audio_tracks DROP COLUMN IF EXISTS category_id;

-- Add new category_id foreign key column with proper UUID type
ALTER TABLE audio_tracks ADD COLUMN category_id uuid REFERENCES categories(id);

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