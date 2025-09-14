import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Heart, Calendar, User, Share, Download, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { creatorService } from '../services/database';
import { Creator } from '../types';

export const TrackDetailPage: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, savedTracks, toggleSaved } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [creatorLoading, setCreatorLoading] = useState(false);
  const track = audioTracks.find(t => t.id === trackId);

  // Load creator data when track changes
  useEffect(() => {
    const loadCreator = async () => {
      if (!track?.creator) return;
      
      setCreatorLoading(true);
      try {
        const creators = await creatorService.getAll();
        const foundCreator = creators.find(c => c.name === track.creator);
        setCreator(foundCreator || null);
      } catch (error) {
        logger.error('Failed to load creator:', error);
        setCreator(null);
      } finally {
        setCreatorLoading(false);
      }
    };
    
    loadCreator();
  }, [track?.creator]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              logger.debug('Track back button clicked');
              
              // Get the previous path from location state
              const from = location.state?.from;
              logger.debug('Track location state from:', from);
              
              // Smart navigation to prevent loops
              const currentPath = `/tracks/${trackId}`;
              if (from && from === currentPath) {
                logger.debug('Detected circular reference, navigating to home to prevent loop');
                navigate('/home', { replace: true });
              } else if (from && (from.includes('/communities/') || from.includes('/creators/'))) {
                logger.debug('Navigating back to community/creator page:', from);
                navigate(from, { replace: true });
              } else if (from) {
                logger.debug('Navigating back to:', from);
                navigate(from, { replace: true });
              } else {
                // Fallback: try browser history, then home
                logger.debug('No state found, trying browser history');
                if (document.referrer && document.referrer.includes(window.location.origin)) {
                  navigate(-1);
                } else {
                  logger.debug('Using home as fallback');
                  navigate('/home', { replace: true });
                }
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            type="button"
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logger.debug('Track back button clicked');
            
            // Get the previous path from location state
            const from = location.state?.from;
            logger.debug('Track location state from:', from);
            
            // Smart navigation to prevent loops
            const currentPath = `/tracks/${trackId}`;
            if (from && from === currentPath) {
              logger.debug('Detected circular reference, navigating to home to prevent loop');
              navigate('/home', { replace: true });
            } else if (from && (from.includes('/communities/') || from.includes('/creators/'))) {
              logger.debug('Navigating back to community/creator page:', from);
              navigate(from, { replace: true });
            } else if (from) {
              logger.debug('Navigating back to:', from);
              navigate(from, { replace: true });
            } else {
              // Fallback: try browser history, then home
              logger.debug('No state found, trying browser history');
              if (document.referrer && document.referrer.includes(window.location.origin)) {
                navigate(-1);
              } else {
                logger.debug('Using home as fallback');
                navigate('/home', { replace: true });
              }
            }
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Track Cover and Info */}
      <div className="space-y-6">
        <div className="relative">
          <img 
            src={track.main_image?.url || '/default-cover.jpg'} 
            alt={track.title}
            className="w-full max-h-96 object-contain rounded-2xl"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{track.title}</h1>
          
          <div className="flex items-center space-x-3">
            {creator ? (
              <img 
                src={creator.image} 
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{track.creator}</p>
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
        <p className="text-gray-700 leading-relaxed">{track.summary || track.full_content}</p>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-900">Creator</span>
          </div>
          <div className="flex items-center space-x-3">
            {creatorLoading ? (
              <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
            ) : creator ? (
              <img 
                src={creator.image} 
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{track.creator}</h3>
              {creator && (
                <>
                  <p className="text-gray-600 text-sm">{creator.bio}</p>
                  <p className="text-gray-500 text-xs mt-1">{creator.followerCount.toLocaleString()} followers</p>
                </>
              )}
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