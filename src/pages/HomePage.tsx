import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { creatorService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Creator } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { setTracks } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  
  const featuredTracks = audioTracks.slice(0, 3);

  React.useEffect(() => {
    setTracks(audioTracks);
  }, [setTracks, audioTracks]);

  React.useEffect(() => {
    const loadCreators = async () => {
      try {
        const creators = await creatorService.getAll();
        setFeaturedCreators(creators.slice(0, 10)); // Get more creators for smooth scrolling
      } catch (error) {
        logger.error('Failed to load creators:', error);
        setFeaturedCreators([]);
      }
    };
    loadCreators();
  }, []);

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [isLoading]);

  const filteredTracks = audioTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Touch/drag handlers for smooth scrolling
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragStartScrollPosition, setDragStartScrollPosition] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragStartScrollPosition(scrollPosition);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const dragDistance = dragStart - e.clientX;
    const newPosition = Math.max(0, dragStartScrollPosition + dragDistance);
    setScrollPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragStartScrollPosition(scrollPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dragDistance = dragStart - e.touches[0].clientX;
    const newPosition = Math.max(0, dragStartScrollPosition + dragDistance);
    setScrollPosition(newPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search tracks, creators..."
      />

      {/* Latest Releases */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Releases</h2>
        <div className="space-y-3">
          {searchQuery ? filteredTracks.slice(0, 5).map(track => (
            <TrackCard 
              key={track.id} 
              track={track} 
              showSaveButton 
              onClick={() => navigate(`/tracks/${track.id}`)}
            />
          )) : featuredTracks.map(track => (
            <TrackCard 
              key={track.id} 
              track={track} 
              showSaveButton 
              onClick={() => navigate(`/tracks/${track.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Featured Creators Smooth Carousel */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>
        
        <div className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
          <div 
            className="flex space-x-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {featuredCreators.map((creator) => (
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
                  onClick={() => !isDragging && navigate(`/creators/${creator.id}`)}
                />
              </div>
            ))}
          </div>
          
          {/* Gradient fade effects */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* Smooth scroll indicator */}
        {featuredCreators.length > 3 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              {Array.from({ length: Math.max(1, featuredCreators.length - 2) }).map((_, index) => {
                const cardWidth = 180;
                const indicatorPosition = (index * cardWidth);
                const isActive = Math.abs(scrollPosition - indicatorPosition) < cardWidth / 2;
                return (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-purple-600 w-8' : 'bg-gray-300 w-2'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};