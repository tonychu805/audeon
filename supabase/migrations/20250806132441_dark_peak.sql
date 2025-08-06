/*
  # Create audio storage bucket

  1. Storage
    - Create `audio-files` bucket for storing audio tracks
    - Set up public access policies for audio files
  
  2. Security
    - Allow public read access to audio files
    - Restrict upload/delete to authenticated users only
*/

-- Create the audio-files bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-files',
  'audio-files',
  true,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
);

-- Allow public read access to audio files
CREATE POLICY "Public read access for audio files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audio-files');

-- Allow authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-files');

-- Allow authenticated users to update their own audio files
CREATE POLICY "Users can update their own audio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'audio-files');

-- Allow authenticated users to delete their own audio files
CREATE POLICY "Users can delete their own audio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'audio-files');