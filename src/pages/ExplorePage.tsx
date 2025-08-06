import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CreatorCard } from '../components/CreatorCard';
import { categories } from '../data/categories';
import { creators } from '../data/creators';

interface ExplorePageProps {
  onCreatorClick: (creatorId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onCreatorClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCreators = selectedCategory 
    ? creators.filter(creator => {
        // Handle category matching more precisely
        const creatorCategory = creator.category.toLowerCase().replace(/\s+/g, '-');
        const selectedCat = selectedCategory.toLowerCase();
        return creatorCategory === selectedCat || creator.category.toLowerCase() === selectedCat;
      })
    : [];

  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {categories.find(cat => cat.id === selectedCategory)?.name} Creators
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredCreators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onClick={() => onCreatorClick(creator.id)}
            />
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No creators found in this category yet.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Explore Categories</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="p-6 bg-white rounded-xl border hover:shadow-md transition-all text-left"
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {creators.filter(c => c.category.toLowerCase() === category.id.toLowerCase()).length} creators
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};