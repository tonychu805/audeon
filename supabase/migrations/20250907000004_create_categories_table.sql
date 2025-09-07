/*
  # Add categories table

  1. Table
    - categories: Track/content categories with icons
    
  2. Security
    - Public read access for content discovery
    - RLS policies for consistency
*/

-- Categories table
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