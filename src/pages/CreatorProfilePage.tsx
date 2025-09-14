import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { 
  FaLinkedin,
  FaTwitter, 
  FaMedium,
  FaGithub,
  FaGlobe,
  FaNewspaper
} from 'react-icons/fa';
import { TrackCard } from '../components/TrackCard';
import { creatorService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Creator } from '../types';


// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  const iconProps = { size: 16, className: "text-gray-600" };
  
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <FaLinkedin {...iconProps} className="text-blue-600" />;
    case 'twitter':
      return <FaTwitter {...iconProps} className="text-sky-500" />;
    case 'medium':
      return <FaMedium {...iconProps} className="text-gray-900" />;
    case 'substack':
    case 'beehiiv':
      return <FaNewspaper {...iconProps} className="text-orange-500" />; // Newsletter icon
    case 'github':
      return <FaGithub {...iconProps} className="text-gray-900" />;
    case 'website':
    default:
      return <FaGlobe {...iconProps} className="text-gray-600" />;
  }
};

export const CreatorProfilePage: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading: tracksLoading } = useAudioTracks();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const creatorTracks = React.useMemo(() => 
    audioTracks.filter(track => track.creator === creator?.name), 
    [audioTracks, creator?.name]
  );

  useEffect(() => {
    const loadCreator = async () => {
      if (!creatorId) return;
      
      try {
        const creators = await creatorService.getAll();
        const foundCreator = creators.find(c => c.id === creatorId);
        setCreator(foundCreator || null);
      } catch (error) {
        logger.error('Failed to load creator:', error);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadCreator();
  }, [creatorId]);

  React.useEffect(() => {
    setTracks(creatorTracks);
  }, [creatorTracks, setTracks]);

  if (isLoading || tracksLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Creator not found</p>
          <button 
            onClick={() => {
              logger.debug('Go back button clicked');
              navigate('/');
            }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logger.debug('Creator back button clicked');
            
            // Get the previous path from location state
            const from = location.state?.from;
            logger.debug('Creator location state from:', from);
            
            // Smart navigation to prevent loops
            const currentPath = `/creators/${creatorId}`;
            // Always go to home if we're coming from a track page to break potential loops
            if (from && from.includes('/tracks/')) {
              logger.debug('Detected track page in from state, navigating to home to prevent loop');
              navigate('/home', { replace: true });
            } else if (from && from === currentPath) {
              logger.debug('Detected circular reference, navigating to home to prevent loop');
              navigate('/home', { replace: true });
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
        <h1 className="text-2xl font-bold text-gray-900">Creator Profile</h1>
      </div>

      {/* Creator Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <img 
            src={creator.image} 
            alt={creator.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
          />
          <div>
            <h2 className="text-2xl font-bold">{creator.name}</h2>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{creator.followerCount.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Description - Outside purple block */}
      <div className="bg-white rounded-xl p-6 border">
        <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
        
        {/* Social Links */}
        {creator.socialLinks && creator.socialLinks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect with {creator.name}</h4>
            <div className="flex flex-wrap gap-3">
              {creator.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  className="flex items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  {getPlatformIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        )}
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
                onClick={() => navigate(`/tracks/${track.id}`, { state: { from: `/creators/${creator.id}` } })}
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