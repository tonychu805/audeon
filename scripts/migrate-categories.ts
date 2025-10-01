/**
 * Migration script to initialize the enhanced category system
 * Run this script to set up the initial categories with proper slugs and metadata
 */

import { supabase } from '../src/lib/supabase';
import { logger } from '../src/utils/logger';

interface CategoryMigrationData {
  name: string;
  slug: string;
  description: string;
  industry: string;
  color_theme: string;
  keywords: string[];
  target_audience: string[];
  sort_order: number;
}

const initialCategories: CategoryMigrationData[] = [
  {
    name: 'Business',
    slug: 'business',
    description: 'Business strategy, entrepreneurship, and corporate insights',
    industry: 'Business',
    color_theme: 'blue',
    keywords: ['strategy', 'entrepreneurship', 'leadership', 'management'],
    target_audience: ['executives', 'entrepreneurs', 'managers'],
    sort_order: 1
  },
  {
    name: 'Product Management',
    slug: 'product-management',
    description: 'Product strategy, development, and user experience insights',
    industry: 'Technology',
    color_theme: 'purple',
    keywords: ['product', 'strategy', 'development', 'user experience', 'roadmap'],
    target_audience: ['product managers', 'developers', 'designers'],
    sort_order: 2
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Digital marketing, branding, and customer acquisition strategies',
    industry: 'Business',
    color_theme: 'pink',
    keywords: ['marketing', 'branding', 'digital', 'customer acquisition', 'growth'],
    target_audience: ['marketers', 'brand managers', 'growth hackers'],
    sort_order: 3
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    description: 'Analytics, machine learning, and data-driven insights',
    industry: 'Technology',
    color_theme: 'green',
    keywords: ['data', 'analytics', 'machine learning', 'statistics', 'insights'],
    target_audience: ['data scientists', 'analysts', 'researchers'],
    sort_order: 4
  },
  {
    name: 'Psychology',
    slug: 'psychology',
    description: 'Human behavior, mental health, and cognitive insights',
    industry: 'Healthcare',
    color_theme: 'orange',
    keywords: ['psychology', 'behavior', 'mental health', 'cognitive', 'therapy'],
    target_audience: ['psychologists', 'therapists', 'researchers', 'healthcare professionals'],
    sort_order: 5
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Software engineering, emerging tech, and innovation',
    industry: 'Technology',
    color_theme: 'blue',
    keywords: ['technology', 'software', 'engineering', 'innovation', 'programming'],
    target_audience: ['developers', 'engineers', 'tech professionals'],
    sort_order: 6
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Mindfulness, fitness, and holistic wellbeing guidance',
    industry: 'Healthcare',
    color_theme: 'teal',
    keywords: ['wellness', 'mindfulness', 'fitness', 'self-care', 'health'],
    target_audience: ['health enthusiasts', 'coaches', 'wellbeing practitioners'],
    sort_order: 7
  },
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'Systems, automation, and focus frameworks for getting more done',
    industry: 'Business',
    color_theme: 'yellow',
    keywords: ['productivity', 'automation', 'systems', 'time management', 'focus'],
    target_audience: ['operators', 'founders', 'knowledge workers'],
    sort_order: 8
  }
];

async function migrateCategories() {
  logger.info('Starting category migration...');

  try {
    // First, check if categories already exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('slug')
      .in('slug', initialCategories.map(cat => cat.slug));

    if (fetchError) {
      logger.error('Error checking existing categories:', fetchError);
      return;
    }

    const existingSlugs = new Set(existingCategories?.map(cat => cat.slug) || []);
    const newCategories = initialCategories.filter(cat => !existingSlugs.has(cat.slug));

    if (newCategories.length === 0) {
      logger.info('All categories already exist. Migration skipped.');
      return;
    }

    logger.info(`Migrating ${newCategories.length} new categories...`);

    // Insert new categories
    const { data, error } = await supabase
      .from('categories')
      .insert(newCategories.map(category => ({
        ...category,
        level: 1,
        is_active: true,
        is_featured: category.sort_order <= 3, // First 3 are featured
        view_count: 0,
        creator_count: 0,
        track_count: 0
      })))
      .select();

    if (error) {
      logger.error('Error inserting categories:', error);
      return;
    }

    logger.info(`Successfully migrated ${data?.length || 0} categories`);
    
    // Log the created categories
    data?.forEach(category => {
      logger.info(`✅ Created category: ${category.name} (${category.slug})`);
    });

    // Update creator and track counts
    logger.info('Updating category counts...');
    const { error: updateError } = await supabase.rpc('update_category_counts');
    
    if (updateError) {
      logger.warn('Error updating category counts:', updateError);
    } else {
      logger.info('✅ Category counts updated');
    }

    logger.info('Category migration completed successfully!');

  } catch (error) {
    logger.error('Migration failed:', error);
  }
}

async function setupStorageBucket() {
  logger.info('Setting up storage bucket...');

  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.find(bucket => bucket.name === 'category_images');

    if (!bucketExists) {
      // Create bucket
      const { error } = await supabase.storage.createBucket('category_images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        logger.error('Error creating storage bucket:', error);
        return;
      }

      logger.info('✅ Created storage bucket: category_images');
    } else {
      logger.info('Storage bucket already exists');
    }

    // Create directory structure (these will be created as needed when files are uploaded)
    const directories = [
      'categories/main',
      'categories/subcategories',
      'categories/templates'
    ];

    logger.info('Storage directory structure ready:', directories);

  } catch (error) {
    logger.error('Error setting up storage:', error);
  }
}

// Main execution
async function main() {
  logger.info('🚀 Starting enhanced category system migration...');
  
  await setupStorageBucket();
  await migrateCategories();
  
  logger.info('🎉 Migration completed!');
  logger.info('Next steps:');
  logger.info('1. Run the SQL migration in Supabase Dashboard');
  logger.info('2. Upload category images to complete the setup');
  logger.info('3. Test the new category system in the app');
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    logger.error('Migration script failed:', error);
    process.exit(1);
  });
}

export { migrateCategories, setupStorageBucket };
