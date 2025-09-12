import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';


// Helper function to get Supabase storage URL
export const getStorageUrl = (bucket: string, filename: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
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
    
    return data || [];
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
    
    return data;
  }
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
    
    return data?.map(creator => ({
      id: creator.id,
      name: creator.name,
      image: creator.image || '',
      bio: creator.bio || '',
      category: creator.category,
      followerCount: creator.follower_count || 0,
      socialLinks: creator.social_links || []
    })) || [];
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
      image: data.image || '',
      bio: data.bio || '',
      category: data.category,
      followerCount: data.follower_count || 0,
      socialLinks: data.social_links || []
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
    
    return data?.map(creator => ({
      id: creator.id,
      name: creator.name,
      image: creator.image || '',
      bio: creator.bio || '',
      category: creator.category,
      followerCount: creator.follower_count || 0,
      socialLinks: creator.social_links || []
    })) || [];
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
        url: track.main_image_url || '',
        caption: track.main_image_caption || '',
        width: track.main_image_width || 1200,
        height: track.main_image_height || 630
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
        url: data.main_image_url || '',
        caption: data.main_image_caption || '',
        width: data.main_image_width || 1200,
        height: data.main_image_height || 630
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
        url: track.main_image_url || '',
        caption: track.main_image_caption || '',
        width: track.main_image_width || 1200,
        height: track.main_image_height || 630
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
        url: track.main_image_url || '',
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
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      logger.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  },

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      logger.error('Error fetching category:', error);
      return null;
    }
    
    return data;
  }
};