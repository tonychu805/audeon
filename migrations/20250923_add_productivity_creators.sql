-- Add prominent productivity creators
-- This keeps environments aligned when seeding new category voices
INSERT INTO creators (name, image, bio, category, follower_count)
SELECT 
  'Tim Ferriss',
  'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=600&q=80',
  'Author of The 4-Hour Workweek, investor, and host of The Tim Ferriss Show.',
  'Productivity',
  2500000
WHERE NOT EXISTS (
  SELECT 1 FROM creators WHERE name = 'Tim Ferriss'
);

INSERT INTO creators (name, image, bio, category, follower_count)
SELECT 
  'Ali Abdaal',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  'Doctor turned creator focused on evidence-based productivity and learning systems.',
  'Productivity',
  1800000
WHERE NOT EXISTS (
  SELECT 1 FROM creators WHERE name = 'Ali Abdaal'
);

INSERT INTO creators (name, image, bio, category, follower_count)
SELECT 
  'James Clear',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  'Author of Atomic Habits sharing frameworks for consistent improvement and focus.',
  'Productivity',
  2200000
WHERE NOT EXISTS (
  SELECT 1 FROM creators WHERE name = 'James Clear'
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_category_counts'
  ) THEN
    PERFORM update_category_counts();
  END IF;
END $$;
