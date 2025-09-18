import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { categoryService, creatorService, communityService } from '../services/database';
import { Category, Creator, CategoryWithAssets, Community } from '../types';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { CommunityCard } from '../components/CommunityCard';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useAudioTracks } from '../hooks/useAudioTracks';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryWithAssets[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tracks, isLoading: tracksLoading } = useAudioTracks();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, creatorsData, communitiesData] = await Promise.all([
          categoryService.getForExplore(), // Use compatibility method that falls back gracefully
          creatorService.getAll(),
          communityService.getAll()
        ]);
        setCategories(categoriesData);
        setCreators(creatorsData);
        setCommunities(communitiesData);
      } catch (error) {
        logger.error('Failed to load explore data:', error);
        setCategories([]);
        setCreators([]);
        setCommunities([]);
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
        // Use heroImageUrl from new system, fallback to existing logic
        image: category.heroImageUrl || `https://images.unsplash.com/photo-${getImageForCategory(category.name)}?w=300&h=200&fit=crop`,
        type: 'category' as const,
        data: category
      };
    });
  };

  const getImageForCategory = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      'business': '1507679799987-cfe2ef4d2e1f',        // Business strategy meeting
      'product management': '1611224923853-80b023f02d71', // Product development
      'marketing': '1504711434969-e33886168f5c',          // Keep current (good)
      'data science': '1551288049-d7102ea010ae',           // Data visualization
      'psychology': '1559757148-5c350d0d3c56',             // Psychology/mental health
      'technology': '1586339949916-3e9457bef6d3'           // Keep current (good)
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

  // Get communities that have tracks in the selected category
  const getCommunitiesInCategory = (categoryName: string) => {
    const categoryTracks = tracks.filter(track => 
      track.category.toLowerCase() === categoryName.toLowerCase()
    );
    const communityNames = [...new Set(categoryTracks.map(track => track.community).filter(Boolean))];
    return communities.filter(community => 
      communityNames.includes(community.name)
    );
  };

  if (isLoading || tracksLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  // Show category creators page
  if (selectedCategory) {
    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
    const communitiesInCategory = selectedCategoryData ? getCommunitiesInCategory(selectedCategoryData.name) : [];
    
    const categoryHeroImage = selectedCategoryData?.heroImageUrl ||
      `https://images.unsplash.com/photo-${getImageForCategory(selectedCategoryData?.name || '')}?w=800&h=300&fit=crop`;

    return (
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden -mx-4 -mt-6">
          <img
            src={categoryHeroImage}
            alt={selectedCategoryData?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Gradient border effects */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>

          {/* Back button and title overlay */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 pt-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <div className="text-white px-4 pb-6">
              <h1 className="text-3xl font-bold mb-2">
                {selectedCategoryData?.name.toUpperCase()}
              </h1>
              <p className="text-white/90 text-sm">
                Discover {filteredCreators.length} creators and premium content
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6 pb-4">

          {/* Creators Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">CREATORS IN {selectedCategoryData?.name.toUpperCase()}</h2>
            <div className="grid grid-cols-2 gap-4">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                >
                  <CreatorCard
                    creator={creator}
                    onClick={() => navigate(`/creators/${creator.id}`, {
                      state: { from: '/explore' }
                    })}
                    layout="compact"
                  />
                </div>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No creators found in this category yet.</p>
              </div>
            )}
          </div>

          {/* Communities Section */}
          {communitiesInCategory.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-black mb-4">
                COMMUNITIES IN {selectedCategoryData?.name.toUpperCase()}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {communitiesInCategory.map((community) => (
                  <div
                    key={community.id}
                    className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none'
                    }}
                  >
                    <CommunityCard
                      community={community}
                      onClick={() => navigate(`/communities/${community.id}`, {
                        state: { from: '/explore' }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get featured track for recommended section - prefer tracks with actual duration
  const getFeaturedTrack = () => {
    // First try to find a track with actual duration (not 0:00)
    const trackWithDuration = tracks.find(track => track.duration && track.duration !== '0:00');
    if (trackWithDuration) return trackWithDuration;
    
    // Fallback to first track if none have duration
    return tracks.length > 0 ? tracks[0] : null;
  };

  // Show main page with search, recommended section and categories
  return (
    <div className="bg-white min-h-screen">
      {/* Search Bar */}
      <div className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tracks, creators..."
          />
        </div>
        
        {/* Recommended Section */}
        <h2 className="text-xl font-bold text-black mb-4">RECOMMENDED</h2>
        {getFeaturedTrack() && (
          <div className="mb-6">
            <TrackCard 
              track={getFeaturedTrack()!} 
              showSaveButton 
              onClick={() => navigate(`/tracks/${getFeaturedTrack()?.id}`, { state: { from: '/explore' } })}
            />
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