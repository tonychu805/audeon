export interface CreatorLink {
  name: string;
  url: string;
  platform: string;
}

export interface Creator {
  id: string;
  name: string;
  image: string;
  bio: string;
  category: string;
  followerCount: number;
  socialLinks?: CreatorLink[];
}

export interface Voice {
  id: string;
  name: string;
  provider: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  accent?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug?: string;
  description?: string;
  hero_image_path?: string;
  mobile_image_path?: string;
  icon_path?: string;
  gradient_config?: {
    from: string;
    to: string;
  };
  color_theme?: string;
  industry?: string;
  target_audience?: string[];
  keywords?: string[];
  parent_id?: string;
  level?: number;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  view_count?: number;
  creator_count?: number;
  track_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryAsset {
  id: string;
  category_id: string;
  asset_type: 'hero' | 'mobile' | 'icon' | 'thumbnail';
  file_path: string;
  file_size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  format: 'jpg' | 'webp' | 'svg' | 'png';
  is_primary: boolean;
  created_at: string;
}

export interface CategoryWithAssets extends Category {
  subcategories?: CategoryWithAssets[];
  assets?: CategoryAsset[];
  heroImageUrl?: string;
  mobileImageUrl?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
}

export interface CategoryHierarchy extends Category {
  path: string[];
  id_path: string[];
  depth: number;
}

export interface Community {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
}

export interface AudioTrack {
  id: string;
  track_id: number;
  title: string;
  url: string;
  audioUrl: string;
  creator: string;
  community: string;
  category: string;
  sub_category: string[];
  summary: string;
  releaseDate: string;
  full_content: string;
  read_time: string;
  duration: string;
  main_image: {
    url: string;
    caption: string;
    width: number;
    height: number;
  };
  voices: Voice[];
  gender: string;
  audio_config: {
    tone_override: string;
    voice_preference: string;
    custom_instructions: string;
  };
}

export interface PlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isExpanded: boolean;
  savedTracks: string[];
}