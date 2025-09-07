/*
  # Seed database with existing mock data
  
  Populate tables with current mock data from the codebase
*/

-- Insert communities
INSERT INTO communities (id, name, logo, description, website) VALUES
  (gen_random_uuid(), 'Medium', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/medium.svg', 'Online publishing platform', 'https://medium.com'),
  (gen_random_uuid(), 'Amplitude', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amplitude.svg', 'Product analytics platform', 'https://amplitude.com'),
  (gen_random_uuid(), 'SVPG', 'https://www.svpg.com/wp-content/themes/svpg2022/app/img/svpg-social.jpg', 'Silicon Valley Product Group', 'https://www.svpg.com'),
  (gen_random_uuid(), 'Mind The Product', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mindmeister.svg', 'Product management community', 'https://www.mindtheproduct.com'),
  (gen_random_uuid(), 'a16z', 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/a.svg', 'Andreessen Horowitz', 'https://a16z.com'),
  (gen_random_uuid(), 'Unknown', '', 'Unknown community', '');

-- Insert creators
INSERT INTO creators (id, name, image, bio, category, follower_count) VALUES
  (gen_random_uuid(), 'Naval Ravikant', '/images/creators/Naval.jpg', 'Entrepreneur, philosopher, and investor', 'Business', 1200000),
  (gen_random_uuid(), 'Chamath Palihapitiya', '/images/creators/Chamath.jpg', 'Venture capitalist and entrepreneur', 'Business', 800000),
  (gen_random_uuid(), 'Daliana Liu', '/images/creators/Daliana.jpg', 'Data scientist and tech leader at FAANG companies', 'Data Science', 450000),
  (gen_random_uuid(), 'Madison Fugard', '/images/creators/Madison Fugard.jpg', 'Product manager focused on digital health with a background as a clinician', 'Product Management', 25000),
  (gen_random_uuid(), 'Julie Zhou', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julie-zhuo.jpeg', 'Former VP of Product Design at Facebook, author of The Making of a Manager', 'Product Management', 180000),
  (gen_random_uuid(), 'Shayna Stewart', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/shayna-stewart.jpeg', 'Director, Strategic Business Development at Turner Sports, NBA Digital', 'Data Science', 45000),
  (gen_random_uuid(), 'Louron Pratt', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/louron-pratt.jpeg', 'Product management expert and community leader', 'Product Management', 35000),
  (gen_random_uuid(), 'Marty Cagan', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/marty-cagan.jpeg', 'Founder of Silicon Valley Product Group (SVPG), renowned product management thought leader', 'Product Management', 250000),
  (gen_random_uuid(), 'Kyle Poyar', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/kyle-poyar.jpeg', 'Growth and marketing expert, author of Growth Unhinged newsletter', 'Marketing', 85000),
  (gen_random_uuid(), 'Julia Dillon', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julia-dillon.jpeg', 'Product strategy expert focused on retention and user engagement', 'Product Management', 42000),
  (gen_random_uuid(), 'Audrey Xu Leung', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/audrey-xu-leung.jpeg', 'Analytics and experimentation expert at Amplitude', 'Data Science', 38000),
  (gen_random_uuid(), 'Eric Metelka', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/eric-metelka.jpeg', 'Experimentation and product analytics expert', 'Data Science', 32000),
  (gen_random_uuid(), 'David George', 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/david-george.jpeg', 'Growth investor at Andreessen Horowitz (a16z)', 'Finance', 120000);

-- Insert audio tracks (sample data - you can add more later)
INSERT INTO audio_tracks (
  track_id, title, url, audio_url, creator_id, community_id, category, sub_category,
  summary, release_date, full_content, read_time, main_image_url, main_image_caption,
  main_image_width, main_image_height, voices, gender, audio_config
) 
SELECT 
  33,
  'How to Work with PMs',
  'https://medium.com/the-year-of-the-looking-glass/3e852d5eccf5',
  'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2013-08-23_Julie%20Zhuo_How%20to%20work%20with%20PMs_nova.mp3',
  (SELECT id FROM creators WHERE name = 'Julie Zhou'),
  (SELECT id FROM communities WHERE name = 'Medium'),
  'Product Management',
  ARRAY['Data Science'],
  'A Cheat Sheet for Designers.',
  '2013-08-23',
  'Once, a long time ago, I was a product manager...',
  '8 min read',
  'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/article-main-image/2013-08-23_Julie%20Zhuo_How%20to%20work%20with%20PMs_main.jpeg',
  '',
  1200,
  630,
  '[]'::jsonb,
  'female',
  '{"tone_override": "Speak clearly and methodically like a technical instructor", "voice_preference": "echo", "custom_instructions": "Explain technical concepts clearly with appropriate pauses"}'::jsonb;