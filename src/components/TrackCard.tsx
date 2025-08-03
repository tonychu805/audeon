import React from 'react';
import { Play, Pause, Heart, Calendar } from 'lucide-react';
import { AudioTrack } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface TrackCardProps {
  track: AudioTrack;
  showSaveButton?: boolean;
  onClick?: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, showSaveButton = false, onClick }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, savedTracks, toggleSaved } = usePlayer();
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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  return (
    <div 
      className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4 mb-3">
        <img 
          src={track.coverImage} 
          alt={track.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">{track.title}</h3>
          <p className="text-gray-600 font-medium mb-1">{track.creator.name}</p>
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">{track.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(track.releaseDate)}</span>
            </div>
            <span>•</span>
            <span>{track.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {track.category}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {showSaveButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSaved(track.id);
              }}
              className={`p-2 rounded-full transition-colors ${
                isSaved 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            {isCurrentTrack && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};