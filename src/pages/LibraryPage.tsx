import React from 'react';
import { TrackCard } from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';

interface LibraryPageProps {
  onTrackClick: (trackId: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onTrackClick }) => {
  const { savedTracks } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();

  const savedAudioTracks = audioTracks.filter(track => savedTracks.includes(track.id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Library</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Library</h1>
      
      {savedAudioTracks.length > 0 ? (
        <div className="space-y-3">
          {savedAudioTracks.map(track => (
            <TrackCard 
              key={track.id} 
              track={track} 
              showSaveButton 
              onClick={() => onTrackClick(track.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No saved tracks yet</p>
          <p className="text-sm text-gray-400">
            Save tracks by tapping the heart icon when exploring content
          </p>
        </div>
      )}
    </div>
  );
};