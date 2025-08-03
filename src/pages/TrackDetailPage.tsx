import React from 'react';
import { ArrowLeft, Play, Pause, Heart, Calendar, User, Share, Download, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';

interface TrackDetailPageProps {
  trackId: string;
  onBack: () => void;
}

export const TrackDetailPage: React.FC<TrackDetailPageProps> = ({ trackId, onBack }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, savedTracks, toggleSaved } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  const track = audioTracks.find(t => t.id === trackId);

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
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading track details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Track not found</p>
      </div>
    );
  }

  const isCurrentTrack = currentTrack?.id === track.id;
  const isSaved = savedTracks.includes(track.id);

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Track Cover and Info */}
      <div className="space-y-6">
        <div className="relative">
          <img 
            src={track.coverImage} 
            alt={track.title}
            className="w-full h-64 object-cover rounded-2xl"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{track.title}</h1>
          
          <div className="flex items-center space-x-3">
            <img 
              src={track.creator.image} 
              alt={track.creator.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{track.creator.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(track.releaseDate)}</span>
                </div>
                <span>•</span>
                <span>{track.duration}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlayClick}
              className="flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              {isCurrentTrack && isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              <span className="font-semibold">{isCurrentTrack && isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button 
              onClick={() => toggleSaved(track.id)}
              className={`p-3 rounded-full transition-colors ${
                isSaved 
                  ? 'text-red-500 hover:text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            
            <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
              <Download className="w-6 h-6" />
            </button>
            
            <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
              <Share className="w-6 h-6" />
            </button>
            
            <button className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About this episode</h2>
        <p className="text-gray-700 leading-relaxed">{track.description}</p>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-900">Creator</span>
          </div>
          <div className="flex items-center space-x-3">
            <img 
              src={track.creator.image} 
              alt={track.creator.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{track.creator.name}</h3>
              <p className="text-gray-600 text-sm">{track.creator.bio}</p>
              <p className="text-gray-500 text-xs mt-1">{track.creator.followerCount.toLocaleString()} followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section Placeholder */}
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Comments</h2>
          <span className="text-purple-600 text-sm font-medium">Show all (0)</span>
        </div>
        <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
      </div>
    </div>
  );
};