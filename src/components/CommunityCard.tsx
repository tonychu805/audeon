import { logger } from '../utils/logger';
import React from 'react';
import { Community } from '../types';

interface CommunityCardProps {
  community: Community;
  onClick: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer"
    >
      <img 
        src={community.logo} 
        alt={community.name}
        className="w-full h-32 object-contain rounded-lg mb-3 bg-gray-50"
        onError={(e) => {
          logger.error('Community logo load error:', community.name, community.logo);
          // Use placeholder for broken images
          e.currentTarget.src = 'https://picsum.photos/200/128?random=' + community.id;
          // Prevent further error events
          e.currentTarget.onerror = null;
        }}
        onLoad={() => {
          logger.debug('Community logo loaded:', community.name);
        }}
      />
      <h3 className="font-semibold text-gray-900 mb-1">{community.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{community.description}</p>
    </div>
  );
};
