import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackCard } from '../components/TrackCard';
import { CreatorCard } from '../components/CreatorCard';
import { CommunityCard } from '../components/CommunityCard';
import { SummaryOfDayCard } from '../components/SummaryOfDayCard';
import { creatorService, communityService, dailyBriefService } from '../services/database';
import { usePlayer } from '../context/PlayerContext';
import { useAudioTracks } from '../hooks/useAudioTracks';
import { Creator, Community, DailyBrief, AudioTrack } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([]);
  const [featuredCommunities, setFeaturedCommunities] = useState<Community[]>([]);
  const creatorScrollRef = useRef<HTMLDivElement | null>(null);
  const communityScrollRef = useRef<HTMLDivElement | null>(null);
  const { setTracks, playTrack, currentTrack, isPlaying } = usePlayer();
  const { tracks: audioTracks, isLoading } = useAudioTracks();
  const [displayName, setDisplayName] = useState('Tony');
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
  
  const normalizeCategoryKey = (rawCategory?: string | null) => {
    if (!rawCategory) return '';
    const value = rawCategory.toLowerCase();
    if (value.includes('product')) return 'product';
    if (value.includes('data')) return 'data';
    if (value.includes('psychology')) return 'psychology';
    if (value.includes('marketing')) return 'marketing';
    if (value.includes('finance')) return 'finance';
    if (value.includes('well')) return 'wellness';
    return value;
  };

  const uniqueCategories = React.useMemo(() => {
    const defaultCategories = ['data', 'finance', 'marketing', 'psychology', 'product', 'wellness'];

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

  const fallbackTrack = React.useMemo(() => (
    filteredTracks[0] ?? audioTracks[0] ?? null
  ), [filteredTracks, audioTracks]);

  const dailyBriefTrack = React.useMemo<AudioTrack | null>(() => {
    if (!dailyBrief) {
      return null;
    }

    const releaseDate = dailyBrief.briefDate;

    return {
      id: `daily-brief-${releaseDate}`,
      track_id: -1,
      title: dailyBrief.title || 'Daily Brief',
      url: '',
      audioUrl: dailyBrief.audioUrl,
      creator: 'Daily Brief',
      community: '',
      category: 'daily-brief',
      sub_category: [],
      summary: dailyBrief.summary || '',
      releaseDate,
      full_content: dailyBrief.summary || '',
      read_time: '',
      duration: dailyBrief.duration || '',
      main_image: {
        url: 'https://picsum.photos/seed/daily-brief/800/600',
        caption: '',
        width: 1200,
        height: 630
      },
      voices: [],
      gender: '',
      audio_config: {
        tone_override: '',
        voice_preference: '',
        custom_instructions: ''
      }
    };
  }, [dailyBrief]);

  const summaryTrack = dailyBriefTrack ?? fallbackTrack;

  const combinedTracks = React.useMemo(() => {
    if (!dailyBriefTrack) {
      return audioTracks;
    }

    const withoutDailyBrief = audioTracks.filter(track => track.id !== dailyBriefTrack.id);
    return [dailyBriefTrack, ...withoutDailyBrief];
  }, [dailyBriefTrack, audioTracks]);

  React.useEffect(() => {
    setTracks(combinedTracks);
  }, [setTracks, combinedTracks]);

  const isPlayingSummaryTrack = Boolean(
    summaryTrack && currentTrack && currentTrack.id === summaryTrack.id && isPlaying
  );

  const handlePlayDailyBrief = () => {
    if (dailyBriefTrack) {
      playTrack(dailyBriefTrack);
      return;
    }

    if (fallbackTrack) {
      playTrack(fallbackTrack);
    }
  };

  useEffect(() => {
    const fetchDailyBrief = async () => {
      try {
        const brief = await dailyBriefService.getLatest();
        setDailyBrief(brief);
      } catch (error) {
        logger.error('Failed to load daily brief:', error);
        setDailyBrief(null);
      }
    };

    fetchDailyBrief();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = localStorage.getItem('audeon:userName') || localStorage.getItem('audeon:displayName');
    if (!stored) {
      return;
    }
    const firstName = stored.trim().split(/\s+/)[0];
    if (!firstName) {
      return;
    }
    const normalized = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    setDisplayName(normalized);
  }, []);

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
  const categoryContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = categoryContainerRef.current;
    const button = categoryButtonRefs.current[selectedCategory];
    if (!container || !button) return;

    // Only scroll if the button is not visible in the viewport
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const isVisible = buttonRect.left >= containerRect.left &&
                     buttonRect.right <= containerRect.right;

    if (!isVisible) {
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedCategory, uniqueCategories.length]);

  useEffect(() => {
    if (creatorScrollRef.current) {
      creatorScrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
    if (communityScrollRef.current) {
      communityScrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
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
        <div ref={categoryContainerRef} className="flex-1 overflow-hidden relative">
          <div className="no-scrollbar overflow-x-auto pb-1"
               style={{ scrollSnapType: 'x mandatory' }}>
            <div className="flex gap-2 items-center pr-4">
              {uniqueCategories.map(category => {
                const displayNameLabel = category === 'all'
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
                    className={`rounded-full px-4 py-2.5 text-sm whitespace-nowrap font-medium transition-colors border min-h-[44px] flex items-center justify-center ${
                      isActive
                        ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                    style={{ scrollSnapAlign: 'center' }}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${displayNameLabel} category`}
                  >
                    {displayNameLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scroll hint gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-60"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none opacity-60"></div>
        </div>
      </div>

      <SummaryOfDayCard
        canPlay={Boolean(summaryTrack)}
        onPlayDailyBrief={handlePlayDailyBrief}
        isPlaying={isPlayingSummaryTrack}
        userName={displayName}
      />

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

      {/* Featured Creators */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>

        {filteredCreators.length > 0 ? (
          <div ref={creatorScrollRef} className="no-scrollbar overflow-x-auto">
            <div className="flex space-x-4 pr-4">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex-shrink-0 w-40 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                >
                  <CreatorCard
                    creator={creator}
                    onClick={() => navigate(`/creators/${creator.id}`, {
                      state: { from: '/home' }
                    })}
                    layout="compact"
                  />
                </div>
              ))}
            </div>
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
          <div ref={communityScrollRef} className="no-scrollbar overflow-x-auto">
            <div className="flex space-x-4 pr-4">
              {filteredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="flex-shrink-0 w-56 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                  }}
                >
                  <CommunityCard
                    community={community}
                    onClick={() => navigate(`/communities/${community.id}`, {
                      state: { from: '/home' }
                    })}
                  />
                </div>
              ))}
            </div>
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
