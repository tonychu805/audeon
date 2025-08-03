import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { featuredCreators } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';

interface HomePageProps {
  onCreatorClick: (creatorId: string) => void;
  onTrackClick: (trackId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreatorClick, onTrackClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  
  const featuredTracks = audioTracks.slice(0, 3);

  React.useEffect(() => {
    setTracks(audioTracks);
  }, [setTracks]);

  const filteredTracks = audioTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading audio tracks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search tracks, creators..."
      />

      {/* Latest Releases */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Releases</h2>
        <div className="space-y-3">
          {searchQuery ? filteredTracks.slice(0, 5).map(track => (
            <TrackCard 
              key={track.id} 
              track={track} 
              showSaveButton 
              onClick={() => onTrackClick(track.id)}
            />
          )) : featuredTracks.map(track => (
            <TrackCard 
              key={track.id} 
              track={track} 
              showSaveButton 
              onClick={() => onTrackClick(track.id)}
            />
          ))}
        </div>
      </section>

      {/* Featured Creators */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredCreators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onClick={() => onCreatorClick(creator.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};