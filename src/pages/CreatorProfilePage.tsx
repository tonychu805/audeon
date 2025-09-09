import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  LinkedinIcon,
  TwitterIcon, 
  MediumIcon,
  Mail01Icon,
  GlobeIcon
} from '@hugeicons/core-free-icons';
import { TrackCard } from '../components/TrackCard';
import { creatorService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Creator, CreatorLink } from '../types';

interface CreatorProfilePageProps {
  creatorId: string;
  onBack: () => void;
  onTrackClick: (trackId: string) => void;
}

// Helper function to get platform icon
const getPlatformIcon = (platform: string) => {
  const iconProps = { size: 16, color: "currentColor", className: "text-gray-600" };
  
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <HugeiconsIcon icon={LinkedinIcon} {...iconProps} />;
    case 'twitter':
      return <HugeiconsIcon icon={TwitterIcon} {...iconProps} />;
    case 'medium':
      return <HugeiconsIcon icon={MediumIcon} {...iconProps} />;
    case 'substack':
    case 'beehiiv':
      return <HugeiconsIcon icon={Mail01Icon} {...iconProps} />; // Newsletter icon
    case 'github':
      return '⚡'; // Keep emoji for now, can add GitHub icon later
    case 'website':
    default:
      return <HugeiconsIcon icon={GlobeIcon} {...iconProps} />;
  }
};

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({ creatorId, onBack, onTrackClick }) => {
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading: tracksLoading } = useAudioTracks();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const creatorTracks = audioTracks.filter(track => track.creator === creator?.name);

  useEffect(() => {
    const loadCreator = async () => {
      try {
        const creators = await creatorService.getAll();
        const foundCreator = creators.find(c => c.id === creatorId);
        setCreator(foundCreator || null);
      } catch (error) {
        console.error('Failed to load creator:', error);
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
            onClick={onBack}
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
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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