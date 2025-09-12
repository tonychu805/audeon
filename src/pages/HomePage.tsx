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


  // Momentum-based carousel state
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragStartScrollPosition, setDragStartScrollPosition] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastDragPosition, setLastDragPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isDecelerating, setIsDecelerating] = useState(false);

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
        const maxScroll = Math.max(0, (featuredCreators.length - 3) * 160); // Account for actual card width
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
  }, [isDecelerating, velocity, featuredCreators.length]);

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

      </section>
    </div>
  );
};