import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { creators } from '../data/creators';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';

interface CreatorProfilePageProps {
  creatorId: string;
  onBack: () => void;
  onTrackClick: (trackId: string) => void;
}

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({ creatorId, onBack, onTrackClick }) => {
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  const creator = creators.find(c => c.id === creatorId);
  const creatorTracks = audioTracks.filter(track => track.creator.id === creatorId);

  React.useEffect(() => {
    setTracks(creatorTracks);
  }, [creatorTracks, setTracks]);

  if (!creator) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Creator not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Creator Profile</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading creator tracks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Creator Profile</h1>
      </div>

      {/* Creator Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={creator.image} 
            alt={creator.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
          />
          <div>
            <h2 className="text-2xl font-bold">{creator.name}</h2>
            <p className="text-purple-100 mb-2">{creator.bio}</p>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{creator.followerCount.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creator's Tracks */}
      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Audio Tracks ({creatorTracks.length})
        </h3>
        
        {creatorTracks.length > 0 ? (
          <div className="space-y-3">
            {creatorTracks.map(track => (
              <TrackCard 
                key={track.id} 
                track={track} 
                showSaveButton 
                onClick={() => onTrackClick(track.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tracks available yet</p>
          </div>
        )}
      </section>
    </div>
  );
};