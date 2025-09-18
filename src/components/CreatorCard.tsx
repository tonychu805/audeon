import { logger } from '../utils/logger';
import React from 'react';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  onClick: () => void;
  layout?: 'default' | 'compact';
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick, layout = 'default' }) => {
  if (layout === 'compact') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition-all cursor-pointer text-center"
      >
        <img
          src={creator.image}
          alt={creator.name}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
          onError={(e) => {
            logger.error('Creator image load error:', creator.name, creator.image);
            e.currentTarget.src = 'https://picsum.photos/64/64?random=' + creator.id;
            e.currentTarget.onerror = null;
          }}
          onLoad={() => {
            logger.debug('Creator image loaded:', creator.name);
          }}
        />
        <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{creator.name}</h3>
        <p className="text-xs text-gray-500">{creator.followerCount.toLocaleString()} followers</p>
        {creator.bio && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{creator.bio}</p>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer"
    >
      <img
        src={creator.image}
        alt={creator.name}
        className="w-full h-32 object-cover rounded-lg mb-3"
        onError={(e) => {
          logger.error('Creator image load error:', creator.name, creator.image);
          // Use placeholder for broken images
          e.currentTarget.src = 'https://picsum.photos/150/150?random=' + creator.id;
          // Prevent further error events
          e.currentTarget.onerror = null;
        }}
        onLoad={() => {
          logger.debug('Creator image loaded:', creator.name);
        }}
      />
      <h3 className="font-semibold text-gray-900 mb-1">{creator.name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{creator.bio}</p>
      <p className="text-xs text-gray-500">{creator.followerCount.toLocaleString()} followers</p>
    </div>
  );
};