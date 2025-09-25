import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { categoryStorage } from './categoryStorage';
import {
  Category,
  CategoryWithAssets,
  CategoryHierarchy,
  Community,
  Creator,
  AudioTrack,
} from '../types';


// Helper function to get Supabase storage URL
export const getStorageUrl = (bucket: string, filename: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
};

const httpUrlPattern = /^https?:\/\//i;

const getCommunityFallbackLogo = (name: string) =>
  `https://ui-avatars.com/api/?background=312e81&color=ffffff&name=${encodeURIComponent(
    name || 'Community'
  )}&size=256&bold=true`;

const getCreatorFallbackImage = (name: string) =>
  `https://ui-avatars.com/api/?background=6d28d9&color=ffffff&name=${encodeURIComponent(
    name || 'Creator'
  )}&size=256&bold=true`;

const getTrackFallbackImage = (seed: string | number) =>
  `https://picsum.photos/seed/track-${encodeURIComponent(String(seed))}/800/600`;

const normalizeCommunityLogo = (logo: string | null, name: string): string => {
  if (logo && httpUrlPattern.test(logo)) {
    return logo;
  }

  return getCommunityFallbackLogo(name);
};

const normalizeCreatorImage = (image: string | null, name: string): string => {
  if (image && httpUrlPattern.test(image)) {
    return image;
  }

  return getCreatorFallbackImage(name);
};

const normalizeTrackImage = (
  imageUrl: string | null,
  trackId: number,
  title: string
): string => {
  if (imageUrl && httpUrlPattern.test(imageUrl)) {
    return imageUrl;
  }

  return getTrackFallbackImage(trackId || title);
};

// Communities
export const communityService = {
  async getAll(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name');

    if (error) {
      logger.error('Error fetching communities:', error);
      return [];
    }

    return (data ?? []).map((community) => ({
      id: community.id,
      name: community.name,
      logo: normalizeCommunityLogo(community.logo ?? null, community.name ?? ''),
      description: community.description ?? '',
      website: community.website ?? '',
      socialLinks: community.social_links || [],
    }));
  },

  async getById(id: string): Promise<Community | null> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching community:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      logo: normalizeCommunityLogo(data.logo ?? null, data.name ?? ''),
      description: data.description ?? '',
      website: data.website ?? '',
      socialLinks: data.social_links || [],
    };
  },
};

// Creators
export const creatorService = {
  async getAll(): Promise<Creator[]> {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .order('follower_count', { ascending: false });
    
    if (error) {
      logger.error('Error fetching creators:', error);
      return [];
    }
    
    return (
      data?.map((creator) => ({
        id: creator.id,
        name: creator.name,
        image: normalizeCreatorImage(creator.image ?? null, creator.name ?? ''),
        bio: creator.bio || '',
        category: creator.category,
        followerCount: creator.follower_count || 0,
        socialLinks: creator.social_links || [],
      })) || []
    );
  },

  async getById(id: string): Promise<Creator | null> {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      logger.error('Error fetching creator:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      image: normalizeCreatorImage(data.image ?? null, data.name ?? ''),
      bio: data.bio || '',
      category: data.category,
      followerCount: data.follower_count || 0,
      socialLinks: data.social_links || [],
    };
  },

  async getByCategory(category: string): Promise<Creator[]> {
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('category', category)
      .order('follower_count', { ascending: false });
    
    if (error) {
      logger.error('Error fetching creators by category:', error);
      return [];
    }
    
    return (
      data?.map((creator) => ({
        id: creator.id,
        name: creator.name,
        image: normalizeCreatorImage(creator.image ?? null, creator.name ?? ''),
        bio: creator.bio || '',
        category: creator.category,
        followerCount: creator.follower_count || 0,
        socialLinks: creator.social_links || [],
      })) || []
    );
  }
};

// Audio Tracks  
export const trackService = {
  async getAll(): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select(`
        *,
        creators:creator_id(name),
        communities:community_id(name),
        categories:category_id(id, name, icon)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error('Error fetching tracks:', error);
      return [];
    }
    
    return data?.map(track => ({
      id: track.track_id.toString(),
      track_id: track.track_id,
      title: track.title,
      url: track.url || '',
      audioUrl: track.audio_url,
      creator: track.creators?.name || '',
      community: track.communities?.name || '',
      category: track.categories?.name || track.category || '',
      sub_category: track.sub_category || [],
      summary: track.summary || '',
      releaseDate: track.release_date || '',
      full_content: track.full_content || '',
      read_time: track.read_time || '',
      duration: track.duration || '0:00',
      main_image: {
        url: normalizeTrackImage(track.main_image_url ?? null, track.track_id, track.title ?? ''),
        caption: track.main_image_caption || '',
        width: track.main_image_width || 1200,
        height: track.main_image_height || 630,
      },
      voices: track.voices || [],
      gender: track.gender || '',
      audio_config: track.audio_config || {}
    })) || [];
  },

  async getById(trackId: number): Promise<AudioTrack | null> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select(`
        *,
        creators:creator_id(name),
        communities:community_id(name),
        categories:category_id(id, name, icon)
      `)
      .eq('track_id', trackId)
      .single();
    
    if (error) {
      logger.error('Error fetching track:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.track_id.toString(),
      track_id: data.track_id,
      title: data.title,
      url: data.url || '',
      audioUrl: data.audio_url,
      creator: data.creators?.name || '',
      community: data.communities?.name || '',
      category: data.category,
      sub_category: data.sub_category || [],
      summary: data.summary || '',
      releaseDate: data.release_date || '',
      full_content: data.full_content || '',
      read_time: data.read_time || '',
      duration: data.duration || '0:00',
      main_image: {
        url: normalizeTrackImage(data.main_image_url ?? null, data.track_id, data.title ?? ''),
        caption: data.main_image_caption || '',
        width: data.main_image_width || 1200,
        height: data.main_image_height || 630,
      },
      voices: data.voices || [],
      gender: data.gender || '',
      audio_config: data.audio_config || {}
    };
  },

  async getByCreator(creatorName: string): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select(`
        *,
        creators:creator_id(name),
        communities:community_id(name),
        categories:category_id(id, name, icon)
      `)
      .eq('creators.name', creatorName)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error('Error fetching tracks by creator:', error);
      return [];
    }
    
    return data?.map(track => ({
      id: track.track_id.toString(),
      track_id: track.track_id,
      title: track.title,
      url: track.url || '',
      audioUrl: track.audio_url,
      creator: track.creators?.name || '',
      community: track.communities?.name || '',
      category: track.categories?.name || track.category || '',
      sub_category: track.sub_category || [],
      summary: track.summary || '',
      releaseDate: track.release_date || '',
      full_content: track.full_content || '',
      read_time: track.read_time || '',
      duration: track.duration || '0:00',
      main_image: {
        url: normalizeTrackImage(track.main_image_url ?? null, track.track_id, track.title ?? ''),
        caption: track.main_image_caption || '',
        width: track.main_image_width || 1200,
        height: track.main_image_height || 630,
      },
      voices: track.voices || [],
      gender: track.gender || '',
      audio_config: track.audio_config || {}
    })) || [];
  },

  async getByCategory(category: string): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select(`
        *,
        creators:creator_id(name),
        communities:community_id(name),
        categories:category_id(id, name, icon)
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error('Error fetching tracks by category:', error);
      return [];
    }
    
    return data?.map(track => ({
      id: track.track_id.toString(),
      track_id: track.track_id,
      title: track.title,
      url: track.url || '',
      audioUrl: track.audio_url,
      creator: track.creators?.name || '',
      community: track.communities?.name || '',
      category: track.categories?.name || track.category || '',
      sub_category: track.sub_category || [],
      summary: track.summary || '',
      releaseDate: track.release_date || '',
      full_content: track.full_content || '',
      read_time: track.read_time || '',
      duration: track.duration || '0:00',
      main_image: {
        url: normalizeTrackImage(track.main_image_url ?? null, track.track_id, track.title ?? ''),
        caption: track.main_image_caption || '',
        width: track.main_image_width || 1200,
        height: track.main_image_height || 630
      },
      voices: track.voices || [],
      gender: track.gender || '',
      audio_config: track.audio_config || {}
    })) || [];
  }
};

// Categories

export const categoryService = {
  // Get all categories with basic info
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('level')
      .order('sort_order')
      .order('name');
    
    if (error) {
      logger.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  },

  // Get category by ID with enhanced info
  async getById(id: string): Promise<CategoryWithAssets | null> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
    
      if (error || !category) {
        logger.error('Error fetching category:', error);
        return null;
      }

      // Get assets for this category
      const assets = await categoryStorage.getCategoryAssets(id);
      
      // Get optimized image URLs
      const [heroImageUrl, mobileImageUrl, thumbnailUrl] = await Promise.all([
        categoryStorage.getOptimizedImageUrl(id, 'hero'),
        categoryStorage.getOptimizedImageUrl(id, 'mobile'),
        categoryStorage.getOptimizedImageUrl(id, 'thumbnail')
      ]);

      return {
        ...category,
        assets,
        heroImageUrl,
        mobileImageUrl,
        thumbnailUrl
      };
    } catch (error) {
      logger.error('Error in getById:', error);
      return null;
    }
  },

  // Get category hierarchy (main categories with subcategories)
  async getCategoryHierarchy(): Promise<CategoryHierarchy[]> {
    try {
      const { data, error } = await supabase
        .from('category_hierarchy')
        .select('*')
        .order('level')
        .order('sort_order');

      if (error) {
        logger.error('Error fetching category hierarchy:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error in getCategoryHierarchy:', error);
      return [];
    }
  },

  // Get categories with assets and subcategories
  async getCategoriesWithAssets(): Promise<CategoryWithAssets[]> {
    try {
      const categories = await this.getAll();
      const mainCategories = categories.filter(cat => cat.level === 1 || !cat.parent_id);
      
      const enrichedCategories = await Promise.all(
        mainCategories.map(async (category) => {
          // Get assets
          const assets = await categoryStorage.getCategoryAssets(category.id);
          
          // Get optimized URLs (with fallback to Unsplash during migration)
          let heroImageUrl: string;
          let mobileImageUrl: string;

          // First check if we have direct image paths in the category record
          if (category.hero_image_path) {
            heroImageUrl = getStorageUrl('category_images', category.hero_image_path);
          } else if (assets.length > 0) {
            heroImageUrl = await categoryStorage.getOptimizedImageUrl(category.id, 'hero');
          } else {
            heroImageUrl = categoryStorage.getFallbackImageUrl(category.name);
          }

          if (category.mobile_image_path) {
            mobileImageUrl = getStorageUrl('category_images', category.mobile_image_path);
          } else if (assets.length > 0) {
            mobileImageUrl = await categoryStorage.getOptimizedImageUrl(category.id, 'mobile');
          } else {
            mobileImageUrl = heroImageUrl;
          }

          const thumbnailUrl = heroImageUrl; // Use hero as thumbnail for now

          // Get subcategories
          const subcategories = categories.filter(cat => cat.parent_id === category.id);
          
          return {
            ...category,
            assets,
            heroImageUrl,
            mobileImageUrl,
            thumbnailUrl,
            subcategories: subcategories.map(sub => ({ ...sub, assets: [] }))
          };
        })
      );

      return enrichedCategories;
    } catch (error) {
      logger.error('Error in getCategoriesWithAssets:', error);
      return [];
    }
  },

  // Create new category
  async createCategory(data: {
    name: string;
    description?: string;
    parent_id?: string;
    industry?: string;
    color_theme?: string;
    heroImage?: File;
  }): Promise<Category | null> {
    try {
      const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const level = data.parent_id ? 2 : 1;
      
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          name: data.name,
          slug: slug,
          description: data.description,
          parent_id: data.parent_id,
          level: level,
          industry: data.industry,
          color_theme: data.color_theme || 'blue',
          is_active: true,
          sort_order: 999 // Place at end by default
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating category:', error);
        return null;
      }

      // Upload hero image if provided
      if (data.heroImage && category) {
        await categoryStorage.uploadCategoryAssets(
          category.id,
          slug,
          level,
          data.heroImage
        );
      }

      return category;
    } catch (error) {
      logger.error('Error in createCategory:', error);
      return null;
    }
  },

  // Update category
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error updating category:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error in updateCategory:', error);
      return null;
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Delete assets first
      await categoryStorage.deleteCategoryAssets(id);
      
      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting category:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error in deleteCategory:', error);
      return false;
    }
  },

  // Get categories for ExplorePage (current format for compatibility)
  async getForExplore(): Promise<CategoryWithAssets[]> {
    try {
      // First try the enhanced method (post-migration)
      try {
        const categoriesWithAssets = await this.getCategoriesWithAssets();
        return categoriesWithAssets;
      } catch (enhancedError) {
        // If enhanced method fails, fall back to basic method (pre-migration)
        console.error('Enhanced category method failed, falling back to basic:', enhancedError);
        logger.warn('Enhanced category method failed, falling back to basic:', enhancedError);
        
        try {
          const basicCategories = await this.getAll();
        
          // Transform basic categories to match CategoryWithAssets interface
          return basicCategories.map(category => {
            const heroUrl = category.hero_image_path 
              ? getStorageUrl('category_images', category.hero_image_path)
              : categoryStorage.getFallbackImageUrl(category.name);
              
            // Debug logging for data science
            if (category.name.toLowerCase() === 'data science') {
              console.log('Fallback method debug:', {
                categoryName: category.name,
                hero_image_path: category.hero_image_path,
                generatedHeroUrl: heroUrl,
                getStorageUrlResult: category.hero_image_path ? getStorageUrl('category_images', category.hero_image_path) : 'no path'
              });
            }
            
            return {
              ...category,
              // Use hero_image_path if available, fallback to Unsplash
              heroImageUrl: heroUrl,
              mobileImageUrl: category.mobile_image_path
                ? getStorageUrl('category_images', category.mobile_image_path)
                : categoryStorage.getFallbackImageUrl(category.name),
              thumbnailUrl: categoryStorage.getFallbackImageUrl(category.name),
              assets: [],
              subcategories: [],
              // Maintain backward compatibility
              icon: category.icon || '🎯'
            };
          });
        } catch (fallbackError) {
          console.error('Fallback method also failed:', fallbackError);
          return [];
        }
      }
    } catch (error) {
      logger.error('Error in getForExplore:', error);
      return [];
    }
  }
};
