import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { CommunityCard } from '../components/CommunityCard';
import { creatorService, communityService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Creator, Community } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<Community[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [communityScrollPosition, setCommunityScrollPosition] = useState(0);
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  
  const normalizeCategoryKey = (rawCategory?: string | null) => {
    if (!rawCategory) return '';
    const value = rawCategory.toLowerCase();
    if (value.includes('product')) return 'product';
    if (value.includes('data')) return 'data';
    if (value.includes('psychology')) return 'psychology';
    if (value.includes('marketing')) return 'marketing';
    if (value.includes('finance')) return 'finance';
    return value;
  };

  const uniqueCategories = React.useMemo(() => {
    const defaultCategories = ['data', 'finance', 'marketing', 'psychology', 'product'];

    const categoryMap = new Map<string, number>();
    audioTracks.forEach(track => {
      const key = normalizeCategoryKey(track.category);
      if (key) {
        categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
      }
    });

    const dynamicCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key);

    const orderedCategories: string[] = [];
    const seen = new Set<string>();

    const addCategory = (category: string) => {
      const key = normalizeCategoryKey(category);
      if (key && !seen.has(key)) {
        orderedCategories.push(key);
        seen.add(key);
      }
    };

    dynamicCategories.forEach(addCategory);
    defaultCategories.forEach(addCategory);

    return ['all', ...orderedCategories];
  }, [audioTracks]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTracks = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return audioTracks;
    }

    return audioTracks.filter(track => normalizeCategoryKey(track.category) === selectedCategory);
  }, [audioTracks, selectedCategory]);

  const filteredCreators = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return featuredCreators;
    }

    return featuredCreators.filter(creator => normalizeCategoryKey(creator.category) === selectedCategory);
  }, [featuredCreators, selectedCategory]);

  const filteredCommunities = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return featuredCommunities;
    }

    const matchingCommunityNames = new Set(
      filteredTracks
        .map(track => track.community)
        .filter(Boolean)
    );

    return featuredCommunities.filter(community => matchingCommunityNames.has(community.name));
  }, [filteredTracks, featuredCommunities, selectedCategory]);

  const featuredTracks = React.useMemo(() => 
    filteredTracks.slice(0, 5), 
    [filteredTracks]
  );

  React.useEffect(() => {
    setTracks(audioTracks);
  }, [setTracks, audioTracks]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [creators, communities] = await Promise.all([
          creatorService.getAll(),
          communityService.getAll()
        ]);
        setFeaturedCreators(creators.slice(0, 10)); // Get more creators for smooth scrolling
        setFeaturedCommunities(communities.slice(0, 4)); // Get 4 communities for homepage
      } catch (error) {
        logger.error('Failed to load data:', error);
        setFeaturedCreators([]);
        setFeaturedCommunities([]);
      }
    };
    loadData();
  }, []);

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [isLoading]);

  // Momentum-based carousel state
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragStartScrollPosition, setDragStartScrollPosition] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastDragPosition, setLastDragPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDecelerating, setIsDecelerating] = useState(false);

  const [isCommunityDragging, setIsCommunityDragging] = useState(false);
  const [isCommunityMouseDown, setIsCommunityMouseDown] = useState(false);
  const [communityDragStart, setCommunityDragStart] = useState(0);
  const [communityDragStartScrollPosition, setCommunityDragStartScrollPosition] = useState(0);
  const [communityLastDragTime, setCommunityLastDragTime] = useState(0);
  const [communityLastDragPosition, setCommunityLastDragPosition] = useState(0);
  const [communityVelocity, setCommunityVelocity] = useState(0);
  const [isCommunityDecelerating, setIsCommunityDecelerating] = useState(false);

  const categoryContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const DRAG_THRESHOLD = 5; // pixels before considering it a drag
  const MOMENTUM_FACTOR = 0.95; // Deceleration factor (0-1, closer to 1 = less friction)
  const MIN_VELOCITY = 0.5; // Minimum velocity to continue momentum
  const MAX_VELOCITY = 15; // Maximum velocity cap

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setDragStart(e.clientX);
    setDragStartScrollPosition(scrollPosition);
    setLastDragTime(Date.now());
    setLastDragPosition(e.clientX);
    setIsDecelerating(false); // Stop any existing momentum
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    
    const currentTime = Date.now();
    const currentPosition = e.clientX;
    const dragDistance = Math.abs(dragStart - currentPosition);
    
    // Only start dragging if we've moved beyond threshold
    if (dragDistance > DRAG_THRESHOLD && !isDragging) {
      setIsDragging(true);
    }
    
    if (isDragging) {
      e.preventDefault();
      const scrollDistance = dragStart - currentPosition;
      const newPosition = Math.max(0, dragStartScrollPosition + scrollDistance);
      setScrollPosition(newPosition);
      
      // Calculate velocity for momentum
      const timeDelta = currentTime - lastDragTime;
      const positionDelta = currentPosition - lastDragPosition;
      if (timeDelta > 0) {
        const newVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, -positionDelta / timeDelta * 16)); // Normalize to ~60fps
        setVelocity(newVelocity);
      }
      
      setLastDragTime(currentTime);
      setLastDragPosition(currentPosition);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && Math.abs(velocity) > MIN_VELOCITY) {
      setIsDecelerating(true);
    }
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMouseDown(true);
    setDragStart(e.touches[0].clientX);
    setDragStartScrollPosition(scrollPosition);
    setLastDragTime(Date.now());
    setLastDragPosition(e.touches[0].clientX);
    setIsDecelerating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown) return;
    
    const currentTime = Date.now();
    const currentPosition = e.touches[0].clientX;
    const dragDistance = Math.abs(dragStart - currentPosition);
    
    // Only start dragging if we've moved beyond threshold
    if (dragDistance > DRAG_THRESHOLD && !isDragging) {
      setIsDragging(true);
    }
    
    if (isDragging) {
      const scrollDistance = dragStart - currentPosition;
      const newPosition = Math.max(0, dragStartScrollPosition + scrollDistance);
      setScrollPosition(newPosition);
      
      // Calculate velocity for momentum
      const timeDelta = currentTime - lastDragTime;
      const positionDelta = currentPosition - lastDragPosition;
      if (timeDelta > 0) {
        const newVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, -positionDelta / timeDelta * 16));
        setVelocity(newVelocity);
      }
      
      setLastDragTime(currentTime);
      setLastDragPosition(currentPosition);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && Math.abs(velocity) > MIN_VELOCITY) {
      setIsDecelerating(true);
    }
    setIsMouseDown(false);
    setIsDragging(false);
  };

  // Momentum scrolling animation
  useEffect(() => {
    if (!isDecelerating || Math.abs(velocity) < MIN_VELOCITY) {
      if (isDecelerating) {
        setIsDecelerating(false);
      }
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      setScrollPosition(currentPosition => {
        const maxScroll = Math.max(0, (filteredCreators.length - 3) * 160); // Account for actual card width
        const newPosition = Math.max(0, Math.min(maxScroll, currentPosition + velocity));
        return newPosition;
      });
      
      // Apply friction to velocity
      setVelocity(currentVelocity => {
        const newVelocity = currentVelocity * MOMENTUM_FACTOR;
        return Math.abs(newVelocity) < MIN_VELOCITY ? 0 : newVelocity;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isDecelerating, velocity, filteredCreators.length]);

  const handleCommunityMouseDown = (e: React.MouseEvent) => {
    setIsCommunityMouseDown(true);
    setCommunityDragStart(e.clientX);
    setCommunityDragStartScrollPosition(communityScrollPosition);
    setCommunityLastDragTime(Date.now());
    setCommunityLastDragPosition(e.clientX);
    setIsCommunityDecelerating(false);
  };

  const handleCommunityMouseMove = (e: React.MouseEvent) => {
    if (!isCommunityMouseDown) return;

    const currentTime = Date.now();
    const currentPosition = e.clientX;
    const dragDistance = Math.abs(communityDragStart - currentPosition);

    if (dragDistance > DRAG_THRESHOLD && !isCommunityDragging) {
      setIsCommunityDragging(true);
    }

    if (isCommunityDragging) {
      e.preventDefault();
      const scrollDistance = communityDragStart - currentPosition;
      const newPosition = Math.max(0, communityDragStartScrollPosition + scrollDistance);
      setCommunityScrollPosition(newPosition);

      const timeDelta = currentTime - communityLastDragTime;
      const positionDelta = currentPosition - communityLastDragPosition;
      if (timeDelta > 0) {
        const newVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, -positionDelta / timeDelta * 16));
        setCommunityVelocity(newVelocity);
      }

      setCommunityLastDragTime(currentTime);
      setCommunityLastDragPosition(currentPosition);
    }
  };

  const handleCommunityMouseUp = () => {
    if (isCommunityDragging && Math.abs(communityVelocity) > MIN_VELOCITY) {
      setIsCommunityDecelerating(true);
    }
    setIsCommunityMouseDown(false);
    setIsCommunityDragging(false);
  };

  const handleCommunityTouchStart = (e: React.TouchEvent) => {
    setIsCommunityMouseDown(true);
    setCommunityDragStart(e.touches[0].clientX);
    setCommunityDragStartScrollPosition(communityScrollPosition);
    setCommunityLastDragTime(Date.now());
    setCommunityLastDragPosition(e.touches[0].clientX);
    setIsCommunityDecelerating(false);
  };

  const handleCommunityTouchMove = (e: React.TouchEvent) => {
    if (!isCommunityMouseDown) return;

    const currentTime = Date.now();
    const currentPosition = e.touches[0].clientX;
    const dragDistance = Math.abs(communityDragStart - currentPosition);

    if (dragDistance > DRAG_THRESHOLD && !isCommunityDragging) {
      setIsCommunityDragging(true);
    }

    if (isCommunityDragging) {
      const scrollDistance = communityDragStart - currentPosition;
      const newPosition = Math.max(0, communityDragStartScrollPosition + scrollDistance);
      setCommunityScrollPosition(newPosition);

      const timeDelta = currentTime - communityLastDragTime;
      const positionDelta = currentPosition - communityLastDragPosition;
      if (timeDelta > 0) {
        const newVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, -positionDelta / timeDelta * 16));
        setCommunityVelocity(newVelocity);
      }

      setCommunityLastDragTime(currentTime);
      setCommunityLastDragPosition(currentPosition);
    }
  };

  const handleCommunityTouchEnd = () => {
    if (isCommunityDragging && Math.abs(communityVelocity) > MIN_VELOCITY) {
      setIsCommunityDecelerating(true);
    }
    setIsCommunityMouseDown(false);
    setIsCommunityDragging(false);
  };

  useEffect(() => {
    if (!isCommunityDecelerating || Math.abs(communityVelocity) < MIN_VELOCITY) {
      if (isCommunityDecelerating) {
        setIsCommunityDecelerating(false);
      }
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      setCommunityScrollPosition(currentPosition => {
        const maxScroll = Math.max(0, (filteredCommunities.length - 2) * 220);
        const newPosition = Math.max(0, Math.min(maxScroll, currentPosition + communityVelocity));
        return newPosition;
      });

      setCommunityVelocity(currentVelocity => {
        const newVelocity = currentVelocity * MOMENTUM_FACTOR;
        return Math.abs(newVelocity) < MIN_VELOCITY ? 0 : newVelocity;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isCommunityDecelerating, communityVelocity, filteredCommunities.length]);

  useEffect(() => {
    const container = categoryContainerRef.current;
    const button = categoryButtonRefs.current[selectedCategory];
    if (!container || !button) return;

    button.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [selectedCategory, uniqueCategories.length]);

  useEffect(() => {
    setScrollPosition(0);
    setCommunityScrollPosition(0);
    setIsDragging(false);
    setIsDecelerating(false);
    setIsCommunityDragging(false);
    setIsCommunityDecelerating(false);
    setVelocity(0);
    setCommunityVelocity(0);
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-2">
        <img
          src="https://i.pravatar.cc/48?img=5"
          alt="User avatar"
          className="w-10 h-10 rounded-full border border-purple-200 shadow-sm flex-shrink-0"
        />
        <div ref={categoryContainerRef} className="flex-1 overflow-hidden">
          <div className="no-scrollbar overflow-x-auto">
            <div className="flex gap-2 items-center pr-4">
              {uniqueCategories.map(category => {
                const displayName = category === 'all'
                  ? 'All'
                  : category
                      .split(/[\s_-]+/)
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(' ');
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  ref={el => {
                    categoryButtonRefs.current[category] = el;
                  }}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap font-medium transition-colors border ${
                    isActive
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={isActive}
                >
                  {displayName}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Releases */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Releases</h2>
        <div className="space-y-3">
          {featuredTracks.length > 0 ? (
            featuredTracks.map(track => (
              <TrackCard 
                key={track.id} 
                track={track} 
                showSaveButton 
                onClick={() => navigate(`/tracks/${track.id}`, { state: { from: '/home' } })}
              />
            ))
          ) : (
            <div className="text-center py-6 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No tracks available for this filter yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Creators Smooth Carousel */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>
        
        {filteredCreators.length > 0 ? (
          <div className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
            <div 
              className="flex space-x-4"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                transition: (isDragging || isDecelerating) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex-shrink-0 w-40 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: isDragging ? 'none' : 'auto'
                  }}
                >
                  <CreatorCard 
                    creator={creator} 
                    onClick={() => {
                      // Only navigate if we're not dragging
                      if (!isDragging) {
                        navigate(`/creators/${creator.id}`, { 
                          state: { from: '/home' } 
                        });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Gradient fade effects */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500 text-sm">No creators match this category yet.</p>
          </div>
        )}

      </section>

      {/* Recommended Communities */}
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Communities</h2>
        </div>
        {filteredCommunities.length > 0 ? (
          <div className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
            <div
              className="flex space-x-4"
              style={{
                transform: `translateX(-${communityScrollPosition}px)`,
                transition: (isCommunityDragging || isCommunityDecelerating) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseDown={handleCommunityMouseDown}
              onMouseMove={handleCommunityMouseMove}
              onMouseUp={handleCommunityMouseUp}
              onMouseLeave={handleCommunityMouseUp}
              onTouchStart={handleCommunityTouchStart}
              onTouchMove={handleCommunityTouchMove}
              onTouchEnd={handleCommunityTouchEnd}
            >
              {filteredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="flex-shrink-0 w-56 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    pointerEvents: isCommunityDragging ? 'none' : 'auto'
                  }}
                >
                  <CommunityCard
                    community={community}
                    onClick={() => {
                      if (!isCommunityDragging) {
                        navigate(`/communities/${community.id}`, {
                          state: { from: '/home' }
                        });
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No communities available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
};
