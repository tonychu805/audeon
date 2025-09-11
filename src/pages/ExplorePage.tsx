import React, { useState, useEffect } from 'react';
import { categoryService, creatorService, trackService } from '../services/database';
import { Category, Creator, AudioTrack } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, creatorsData, tracksData] = await Promise.all([
          categoryService.getAll(),
          creatorService.getAll(),
          trackService.getAll()
        ]);
        setCategories(categoriesData);
        setCreators(creatorsData);
        setTracks(tracksData);
      } catch (error) {
        console.error('Failed to load explore data:', error);
        setCategories([]);
        setCreators([]);
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Create content cards from categories only
  const getContentCards = () => {
    return categories.map(category => {
      const categoryCreators = creators.filter(c => 
        c.category.toLowerCase() === category.name.toLowerCase()
      );
      return {
        id: `category-${category.id}`,
        title: category.name.toUpperCase(),
        author: `${categoryCreators.length} creators`,
        image: `https://images.unsplash.com/photo-${getImageForCategory(category.name)}?w=300&h=200&fit=crop`,
        type: 'category' as const,
        data: category
      };
    });
  };

  const getImageForCategory = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      'business': '1560472354-b33ff0c44a43',
      'product management': '1546519638-68e109498ffc',
      'marketing': '1504711434969-e33886168f5c',
      'data science': '1446776877081-d282a0f896e2',
      'psychology': '1506905925346-21bda4d32df4',
      'technology': '1586339949916-3e9457bef6d3'
    };
    return imageMap[categoryName.toLowerCase()] || '1586339949916-3e9457bef6d3';
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.id);
  };

  const filteredContent = getContentCards().filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreators = selectedCategory 
    ? creators.filter(creator => {
        const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
        return selectedCategoryData && creator.category.toLowerCase() === selectedCategoryData.name.toLowerCase();
      })
    : creators;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  // Show category creators page
  if (selectedCategory) {
    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
    return (
      <div className="bg-white min-h-screen">
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-black">
              {selectedCategoryData?.name.toUpperCase()} CREATORS
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredCreators.map(creator => (
              <div
                key={creator.id}
                className="bg-white rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={creator.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop`}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-gray-900 text-center text-sm">{creator.name}</h3>
                <p className="text-xs text-gray-500 text-center mt-1">{creator.followerCount.toLocaleString()} followers</p>
                {creator.bio && (
                  <p className="text-xs text-gray-600 text-center mt-2 line-clamp-2">{creator.bio}</p>
                )}
              </div>
            ))}
          </div>

          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No creators found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get featured track for recommended section
  const getFeaturedTrack = () => {
    return tracks.length > 0 ? tracks[0] : null;
  };

  // Show main page with search, recommended section and categories
  return (
    <div className="bg-white min-h-screen">
      {/* Search Bar */}
      <div className="px-4 pt-6 pb-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Following"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <div className="absolute right-3 top-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Recommended Section */}
        <h2 className="text-xl font-bold text-black mb-4">RECOMMENDED</h2>
        {getFeaturedTrack() && (
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[16/9] mb-6 cursor-pointer">
            <img
              src={getFeaturedTrack()?.main_image.url || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=600&h=300&fit=crop'}
              alt={getFeaturedTrack()?.title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg leading-tight mb-1">
                {getFeaturedTrack()?.title}
              </h3>
              <p className="text-gray-300 text-sm">
                By {getFeaturedTrack()?.creator}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {getFeaturedTrack()?.category} • {getFeaturedTrack()?.read_time}
              </p>
            </div>
            {/* Play button */}
            <div className="absolute top-4 right-4">
              <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Browse Categories Section */}
      <div className="px-4 pb-4">
        <h2 className="text-xl font-bold text-black mb-4">Browse Categories</h2>
      </div>

      {/* Content Grid - Categories Only */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCategoryClick(item.data)}
              className="relative bg-black rounded-lg overflow-hidden aspect-[4/3] group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-sm leading-tight mb-1">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="text-gray-300 text-xs">
                    {item.author}
                  </p>
                )}
              </div>
              {/* Three dots menu */}
              <div className="absolute top-3 right-3">
                <button className="text-white opacity-80 hover:opacity-100">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No content found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};