/*
  # Add Productivity category seed

  Adds the Productivity category to keep parity with application expectations.
*/

INSERT INTO categories (id, name, icon)
VALUES ('550e8400-e29b-41d4-a716-446655440008'::uuid, 'Productivity', '⚡')
ON CONFLICT (id) DO NOTHING;
