/*
  # Add social links to creators

  Add JSONB column for flexible social media and platform links
  Structure: [{"name": "LinkedIn", "url": "https://...", "platform": "linkedin"}]
*/

-- Add social_links JSONB column to creators table
ALTER TABLE creators ADD COLUMN social_links jsonb DEFAULT '[]';

-- Create index for performance when querying social links
CREATE INDEX idx_creators_social_links ON creators USING gin (social_links);

-- Update sample creator data with social links
UPDATE creators SET social_links = '[
  {"name": "LinkedIn", "url": "https://linkedin.com/in/audreyxuleung", "platform": "linkedin"},
  {"name": "Newsletter", "url": "https://audreyxu.substack.com", "platform": "substack"},
  {"name": "Company Blog", "url": "https://amplitude.com/blog/author/audrey", "platform": "website"}
]' WHERE name = 'Audrey Xu Leung';

UPDATE creators SET social_links = '[
  {"name": "LinkedIn", "url": "https://linkedin.com/in/davidgeorge", "platform": "linkedin"},
  {"name": "Medium", "url": "https://davidgeorge.medium.com", "platform": "medium"},
  {"name": "Website", "url": "https://davidgeorge.dev", "platform": "website"}
]' WHERE name = 'David George';

UPDATE creators SET social_links = '[
  {"name": "LinkedIn", "url": "https://linkedin.com/in/ericmetelka", "platform": "linkedin"},
  {"name": "Twitter", "url": "https://twitter.com/ericmetelka", "platform": "twitter"},
  {"name": "Blog", "url": "https://ericmetelka.com", "platform": "website"}
]' WHERE name = 'Eric Metelka';