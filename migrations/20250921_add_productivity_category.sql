-- Add Productivity category to the enhanced category system
-- Mirrors the wellness upsert to keep environments in sync
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

WITH upsert AS (
  INSERT INTO categories (
    name,
    slug,
    icon,
    description,
    industry,
    color_theme,
    keywords,
    target_audience,
    sort_order,
    level,
    is_active,
    is_featured
  ) VALUES (
    'Productivity',
    'productivity',
    '⚡',
    'Systems, automation, and focus frameworks for getting more done',
    'Business',
    'yellow',
    ARRAY['productivity', 'automation', 'systems', 'time management', 'focus'],
    ARRAY['operators', 'founders', 'knowledge workers'],
    8,
    1,
    true,
    false
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    industry = EXCLUDED.industry,
    color_theme = EXCLUDED.color_theme,
    keywords = EXCLUDED.keywords,
    target_audience = EXCLUDED.target_audience,
    sort_order = EXCLUDED.sort_order,
    level = EXCLUDED.level,
    is_active = EXCLUDED.is_active,
    is_featured = EXCLUDED.is_featured,
    updated_at = NOW()
  RETURNING id
)
SELECT 1 FROM upsert;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_category_counts'
  ) THEN
    PERFORM update_category_counts();
  END IF;
END $$;
