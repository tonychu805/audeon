import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AudioTrack } from '../types';
import { getTrackFallbackImage } from '../utils/imageFallbacks';

interface UpNextSectionProps {
  tracks: AudioTrack[];
  isLoading: boolean;
  currentTrackId?: string;
}

export const UpNextSection: React.FC<UpNextSectionProps> = ({
  tracks,
  isLoading,
  currentTrackId,
}) => {
  const navigate = useNavigate();

  // Don't render if no tracks and not loading
  if (!isLoading && tracks.length === 0) {
    return null;
  }

  const handleTrackClick = (track: AudioTrack) => {
    navigate(`/tracks/${track.id}`, {
      state: { from: `/tracks/${currentTrackId}` },
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
        {tracks.length > 3 && (
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
            See all
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 animate-pulse"
            >
              <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-scrollbar overflow-x-auto -mx-2 px-2">
          <div className="flex gap-4">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackClick(track)}
                className="flex-shrink-0 w-32 text-left group"
              >
                {/* Track Image */}
                <div className="relative mb-2 overflow-hidden rounded-lg">
                  <img
                    src={track.main_image?.url || getTrackFallbackImage(track.id)}
                    alt={track.title}
                    className="w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = getTrackFallbackImage(track.id);
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>

                {/* Track Info */}
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                  {track.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-1">
                  {track.creator || 'Unknown Creator'}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {track.duration || '0:00'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
