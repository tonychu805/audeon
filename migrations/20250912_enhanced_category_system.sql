-- Enhanced Category Management System Migration
-- Run this in Supabase SQL Editor

-- 1. Add new columns to existing categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_image_path TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS mobile_image_path TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_path TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS gradient_config JSONB;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'blue';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS target_audience TEXT[];
ALTER TABLE categories ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS creator_count INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS track_count INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update existing categories with slugs (if they don't exist)
UPDATE categories 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;

-- 3. Add unique constraint on slug
ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);

-- 4. Create category_assets table
CREATE TABLE IF NOT EXISTS category_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'hero', 'mobile', 'icon', 'thumbnail'
  file_path TEXT NOT NULL,
  file_size INTEGER,
  dimensions JSONB, -- {width: 600, height: 400}
  format TEXT, -- 'jpg', 'webp', 'svg', 'png'
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_category_assets_category_id ON category_assets(category_id);
CREATE INDEX IF NOT EXISTS idx_category_assets_type ON category_assets(asset_type);

-- 6. Create category hierarchy view
CREATE OR REPLACE VIEW category_hierarchy AS
WITH RECURSIVE category_tree AS (
  -- Base case: main categories (level 1)
  SELECT 
    id, name, slug, parent_id, level, hero_image_path, mobile_image_path,
    color_theme, industry, is_active, is_featured, sort_order,
    creator_count, track_count, view_count,
    ARRAY[name] as path,
    ARRAY[id] as id_path,
    1 as depth
  FROM categories 
  WHERE parent_id IS NULL AND is_active = true
  
  UNION ALL
  
  -- Recursive case: subcategories
  SELECT 
    c.id, c.name, c.slug, c.parent_id, c.level, c.hero_image_path, c.mobile_image_path,
    c.color_theme, c.industry, c.is_active, c.is_featured, c.sort_order,
    c.creator_count, c.track_count, c.view_count,
    ct.path || c.name,
    ct.id_path || c.id,
    ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
  WHERE c.is_active = true AND ct.depth < 5 -- Prevent infinite recursion
)
SELECT * FROM category_tree ORDER BY level, sort_order, name;

-- 7. Create function to update category counts (both trigger and direct call versions)
CREATE OR REPLACE FUNCTION update_category_counts_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Update creator count
  UPDATE categories 
  SET creator_count = (
    SELECT COUNT(*) 
    FROM creators 
    WHERE category = categories.name
  );
  
  -- Update track count (assuming tracks have category field)
  UPDATE categories 
  SET track_count = (
    SELECT COUNT(*) 
    FROM audio_tracks 
    WHERE category = categories.name
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function for direct calls (non-trigger)
CREATE OR REPLACE FUNCTION update_category_counts()
RETURNS void AS $$
BEGIN
  -- Update creator count
  UPDATE categories 
  SET creator_count = (
    SELECT COUNT(*) 
    FROM creators 
    WHERE category = categories.name
  );
  
  -- Update track count (assuming tracks have category field)  
  UPDATE categories 
  SET track_count = (
    SELECT COUNT(*) 
    FROM audio_tracks 
    WHERE category = categories.name
  );
END;
$$ LANGUAGE plpgsql;

-- 8. Create triggers to maintain counts
DROP TRIGGER IF EXISTS update_category_counts_trigger ON creators;
CREATE TRIGGER update_category_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON creators
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_category_counts_trigger();

DROP TRIGGER IF EXISTS update_category_counts_trigger_tracks ON audio_tracks;
CREATE TRIGGER update_category_counts_trigger_tracks
  AFTER INSERT OR UPDATE OR DELETE ON audio_tracks
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_category_counts_trigger();

-- 9. Create storage bucket policies (run after creating bucket in Supabase dashboard)
-- These policies should be created through Supabase dashboard or via RPC calls

-- 10. Update existing categories with new field values
UPDATE categories 
SET 
  level = 1,
  is_active = true,
  sort_order = CASE name
    WHEN 'Business' THEN 1
    WHEN 'Product Management' THEN 2  
    WHEN 'Marketing' THEN 3
    WHEN 'Data Science' THEN 4
    WHEN 'Psychology' THEN 5
    WHEN 'Technology' THEN 6
    WHEN 'Wellness' THEN 7
    ELSE 99
  END,
  color_theme = CASE name
    WHEN 'Business' THEN 'blue'
    WHEN 'Product Management' THEN 'purple'
    WHEN 'Marketing' THEN 'pink'
    WHEN 'Data Science' THEN 'green'
    WHEN 'Psychology' THEN 'orange'
    WHEN 'Technology' THEN 'blue'
    WHEN 'Wellness' THEN 'teal'
    ELSE 'blue'
  END,
  industry = CASE name
    WHEN 'Business' THEN 'Business'
    WHEN 'Product Management' THEN 'Technology'
    WHEN 'Marketing' THEN 'Business'
    WHEN 'Data Science' THEN 'Technology'
    WHEN 'Psychology' THEN 'Healthcare'
    WHEN 'Technology' THEN 'Technology'
    WHEN 'Wellness' THEN 'Healthcare'
    ELSE 'General'
  END
WHERE level IS NULL OR level = 0;

-- 11. Insert any missing default categories (only if they don't exist)
INSERT INTO categories (name, slug, icon, level, is_active, color_theme, industry, sort_order)
SELECT * FROM (VALUES 
  ('Business', 'business', '🎯', 1, true, 'blue', 'Business', 1),
  ('Product Management', 'product-management', '📈', 1, true, 'purple', 'Technology', 2),
  ('Marketing', 'marketing', '💼', 1, true, 'pink', 'Business', 3),
  ('Data Science', 'data-science', '🔬', 1, true, 'green', 'Technology', 4),
  ('Psychology', 'psychology', '🧠', 1, true, 'orange', 'Healthcare', 5),
  ('Technology', 'technology', '💻', 1, true, 'blue', 'Technology', 6),
  ('Wellness', 'wellness', '🧘', 1, true, 'teal', 'Healthcare', 7)
) AS new_categories(name, slug, icon, level, is_active, color_theme, industry, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.name = new_categories.name
);

-- 11. Update the counts for existing data
SELECT update_category_counts();

-- 12. Create RLS policies for security
ALTER TABLE category_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to category assets
CREATE POLICY "Public read access to category assets" ON category_assets
  FOR SELECT USING (true);

-- Allow authenticated users to manage category assets (for admin)
CREATE POLICY "Authenticated users can manage category assets" ON category_assets
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON category_hierarchy TO anon, authenticated;
GRANT ALL ON category_assets TO authenticated;
GRANT SELECT ON category_assets TO anon;
