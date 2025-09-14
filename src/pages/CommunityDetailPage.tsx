import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, ExternalLink } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { communityService, creatorService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Community, Creator } from '../types';

export const CommunityDetailPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading: tracksLoading } = useAudioTracks();
  const [community, setCommunity] = useState<Community | null>(null);
  const [communityCreators, setCommunityCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const communityTracks = React.useMemo(() => 
    audioTracks.filter(track => track.community === community?.name), 
    [audioTracks, community?.name]
  );

  useEffect(() => {
    const loadCommunityData = async () => {
      if (!communityId) return;
      
      try {
        const [communities, creators] = await Promise.all([
          communityService.getAll(),
          creatorService.getAll()
        ]);
        
        const foundCommunity = communities.find(c => c.id === communityId);
        setCommunity(foundCommunity || null);
        
        if (foundCommunity) {
          // Get creators who have tracks in this community
          const communityTrackCreators = audioTracks
            .filter(track => track.community === foundCommunity.name)
            .map(track => track.creator);
          
          const uniqueCreatorNames = [...new Set(communityTrackCreators)];
          const relatedCreators = creators.filter(creator => 
            uniqueCreatorNames.includes(creator.name)
          );
          
          setCommunityCreators(relatedCreators);
        }
      } catch (error) {
        logger.error('Failed to load community data:', error);
        setCommunity(null);
        setCommunityCreators([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCommunityData();
  }, [communityId, audioTracks]);

  React.useEffect(() => {
    setTracks(communityTracks);
  }, [communityTracks, setTracks]);

  if (isLoading || tracksLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading community details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Community not found</p>
          <button 
            onClick={() => navigate('/home')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Get the previous path from location state
            const from = location.state?.from;
            
            // Smart navigation to prevent loops
            if (from && from.includes('/tracks/')) {
              navigate('/home', { replace: true });
            } else if (from && from.includes('/creators/')) {
              navigate('/home', { replace: true });
            } else if (from) {
              navigate(from, { replace: true });
            } else {
              // Fallback: try browser history, then home
              if (document.referrer && document.referrer.includes(window.location.origin)) {
                navigate(-1);
              } else {
                navigate('/home', { replace: true });
              }
            }
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Community</h1>
      </div>

      {/* Community Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <img 
            src={community.logo} 
            alt={community.name}
            className="w-20 h-20 rounded-lg object-contain bg-white/10 p-2 border-2 border-white/20"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{community.name}</h2>
            <div className="flex items-center space-x-4 text-sm mt-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{communityTracks.length} tracks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{communityCreators.length} creators</span>
              </div>
            </div>
          </div>
          {community.website && (
            <a
              href={community.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-medium">Visit Website</span>
            </a>
          )}
        </div>
      </div>

      {/* Community Description */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About {community.name}</h3>
        <p className="text-gray-700 leading-relaxed">{community.description}</p>
      </div>

      {/* Community Creators */}
      {communityCreators.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Featured Creators ({communityCreators.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {communityCreators.map(creator => (
              <CreatorCard 
                key={creator.id}
                creator={creator} 
                onClick={() => {
                  navigate(`/creators/${creator.id}`, { 
                    state: { from: community ? `/communities/${community.id}` : '/home' } 
                  });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Community Tracks */}
      <section>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Audio Tracks ({communityTracks.length})
        </h3>
        
        {communityTracks.length > 0 ? (
          <div className="space-y-3">
            {communityTracks.map(track => (
              <TrackCard 
                key={track.id} 
                track={track} 
                showSaveButton 
                onClick={() => {
                  navigate(`/tracks/${track.id}`, { state: { from: `/communities/${community.id}` } });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tracks available yet from this community</p>
          </div>
        )}
      </section>
    </div>
  );
};