export interface Creator {
  id: string;
  name: string;
  image: string;
  bio: string;
  category: string;
  followerCount: number;
}

export interface Community {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
}

export interface AudioTrack {
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
  main_image: {
    url: string;
    caption: string;
    width: number;
    height: number;
  };
  voices: any[];
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