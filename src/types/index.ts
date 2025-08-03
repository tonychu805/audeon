export interface Creator {
  id: string;
  name: string;
  image: string;
  bio: string;
  category: string;
  followerCount: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  description: string;
  creator: Creator;
  duration: string;
  audioUrl: string;
  coverImage: string;
  category: string;
  releaseDate: string;
}

export interface PlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isExpanded: boolean;
  savedTracks: string[];
}</parameter>