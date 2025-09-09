import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CreatorCard } from '../components/CreatorCard';
import { categoryService, creatorService } from '../services/database';
import { Category, Creator } from '../types';

interface ExplorePageProps {
  onCreatorClick: (creatorId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onCreatorClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, creatorsData] = await Promise.all([
          categoryService.getAll(),
          creatorService.getAll()
        ]);
        setCategories(categoriesData);
        setCreators(creatorsData);
      } catch (error) {
        console.error('Failed to load explore data:', error);
        setCategories([]);
        setCreators([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCreators = selectedCategory 
    ? creators.filter(creator => {
        const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
        return selectedCategoryData && creator.category.toLowerCase() === selectedCategoryData.name.toLowerCase();
      })
    : creators;

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading explore content...</p>
        </div>
      </div>
    );
  }

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
              {creators.filter(c => c.category.toLowerCase() === category.name.toLowerCase()).length} creators
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};