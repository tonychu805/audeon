import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { communityService, creatorService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Community, Creator, SocialLink } from '../types';
import { getSocialPlatformIcon } from '../utils/socialLinks';

interface CommunityLocationState {
  from?: string;
  categoryId?: string | null;
}

export const CommunityDetailPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CommunityLocationState | null;
  const from = locationState?.from;
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading: tracksLoading } = useAudioTracks();
  const [community, setCommunity] = useState<Community | null>(null);
  const [communityCreators, setCommunityCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const communityTracks = React.useMemo(() => 
    audioTracks.filter(track => track.community === community?.name), 
    [audioTracks, community?.name]
  );

  const categoryTags = React.useMemo(() => {
    const tags = new Set<string>();

    communityTracks.forEach((track) => {
      if (track.category) {
        tags.add(track.category);
      }
      (track.sub_category ?? []).forEach((sub) => {
        if (sub) {
          tags.add(sub);
        }
      });
    });

    return Array.from(tags).slice(0, 6);
  }, [communityTracks]);

  const communitySocialLinks = React.useMemo<SocialLink[]>(() => {
    if (!community) {
      return [];
    }

    const links = (community.socialLinks ?? []).filter(
      (link): link is SocialLink => Boolean(link?.url)
    );
    const hasWebsiteLink = links.some(
      (link) => link.platform?.toLowerCase() === 'website'
    );

    if (community.website && !hasWebsiteLink) {
      return [
        ...links,
        {
          name: `${community.name} Website`,
          url: community.website,
          platform: 'website',
        },
      ];
    }

    return links;
  }, [community]);

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
            // Smart navigation to prevent loops
            if (from && from.includes('/tracks/')) {
              navigate('/home', { replace: true });
            } else if (from && from.includes('/creators/')) {
              navigate('/home', { replace: true });
            } else if (from === '/explore' && locationState?.categoryId) {
              navigate('/explore', {
                replace: true,
                state: { categoryId: locationState.categoryId }
              });
            } else if (from) {
              navigate(from, { replace: true });
            } else {
              // Fallback: try browser history, then home
              if (typeof window !== 'undefined' && document.referrer && document.referrer.includes(window.location.origin)) {
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
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img 
            src={community.logo} 
            alt={community.name}
            className="w-20 h-20 rounded-xl object-cover border border-white/30 shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold">{community.name}</h2>
            {categoryTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Description */}
      <div className="bg-white rounded-xl p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About {community.name}</h3>
        <p className="text-gray-700 leading-relaxed">{community.description}</p>

        {communitySocialLinks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Connect with {community.name}
            </h4>
            <div className="flex flex-wrap gap-3">
              {communitySocialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  className="flex items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {getSocialPlatformIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};
