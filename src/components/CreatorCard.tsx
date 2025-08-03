import React from 'react';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  onClick: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer"
    >
      <img 
        src={creator.image} 
        alt={creator.name}
        className="w-full h-32 object-cover rounded-lg mb-3"
      />
      <h3 className="font-semibold text-gray-900 mb-1">{creator.name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{creator.bio}</p>
      <p className="text-xs text-gray-500">{creator.followerCount.toLocaleString()} followers</p>
    </div>
  );
};