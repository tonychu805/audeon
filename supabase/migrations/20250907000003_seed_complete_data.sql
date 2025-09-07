/*
  # Complete data migration - All original creators, communities, and tracks
  
  Migrate all existing data from src/data files to database
*/

-- Clear any existing seed data
DELETE FROM audio_tracks WHERE track_id IS NOT NULL;
DELETE FROM creators WHERE name IS NOT NULL;  
DELETE FROM communities WHERE name IS NOT NULL;

-- Insert all communities
INSERT INTO communities (name, logo, description, website) VALUES
  ('Medium', '/images/communities/medium.png', 'A platform for writers and readers to share ideas and stories', 'https://medium.com'),
  ('Amplitude', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/amplitude.jpeg', 'Product analytics platform helping companies understand user behavior', 'https://amplitude.com'),
  ('Mind The Product', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/mind-the-product.jpeg', 'Global community of product managers sharing knowledge and best practices', 'https://www.mindtheproduct.com'),
  ('SVPG', '/images/communities/svpg.png', 'Silicon Valley Product Group - product management training and consulting', 'https://www.svpg.com'),
  ('a16z', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/a16z.jpeg', 'Andreessen Horowitz - venture capital firm investing in technology companies', 'https://a16z.com'),
  ('Unknown', '/images/communities/default.png', 'Content from various sources', '');

-- Insert all creators
INSERT INTO creators (name, image, bio, category, follower_count) VALUES
  ('Naval Ravikant', '/images/creators/Naval.jpg', 'Entrepreneur, philosopher, and investor', 'Business', 1200000),
  ('Chamath Palihapitiya', '/images/creators/Chamath.jpg', 'Venture capitalist and entrepreneur', 'Business', 800000),
  ('Daliana Liu', '/images/creators/Daliana.jpg', 'Data scientist and tech leader at FAANG companies', 'Data Science', 450000),
  ('Madison Fugard', '/images/creators/Madison Fugard.jpg', 'Product manager focused on digital health with a background as a clinician', 'Product Management', 25000),
  ('Julie Zhou', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julie-zhuo.jpeg', 'Former VP of Product Design at Facebook, author of The Making of a Manager', 'Product Management', 180000),
  ('Shayna Stewart', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/shayna-stewart.jpeg', 'Director, Strategic Business Development at Turner Sports, NBA Digital', 'Data Science', 45000),
  ('Louron Pratt', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/louron-pratt.jpeg', 'Product management expert and community leader', 'Product Management', 35000),
  ('Marty Cagan', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/marty-cagan.jpeg', 'Founder of Silicon Valley Product Group (SVPG), renowned product management thought leader', 'Product Management', 250000),
  ('Kyle Poyar', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/kyle-poyar.jpeg', 'Growth and marketing expert, author of Growth Unhinged newsletter', 'Marketing', 85000),
  ('Julia Dillon', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julia-dillon.jpeg', 'Product strategy expert focused on retention and user engagement', 'Product Management', 42000),
  ('Audrey Xu Leung', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/audrey-xu-leung.jpeg', 'Analytics and experimentation expert at Amplitude', 'Data Science', 38000),
  ('Eric Metelka', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/eric-metelka.jpeg', 'Experimentation and product analytics expert', 'Data Science', 32000),
  ('David George', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/david-george.jpeg', 'Growth investor at Andreessen Horowitz (a16z)', 'Finance', 120000);