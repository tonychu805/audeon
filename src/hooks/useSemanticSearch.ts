import { useState, useCallback, useRef, useEffect } from 'react';
import { AudioTrack } from '../types';
import { semanticSearch, SemanticSearchResult } from '../services/semanticSearch';
import { logger } from '../utils/logger';

export interface UseSemanticSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: AudioTrack[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  clearSearch: () => void;
}

const DEBOUNCE_DELAY = 400; // ms

export function useSemanticSearch(): UseSemanticSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Ref to track the latest query for debouncing
  const latestQueryRef = useRef(query);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    // Skip if query is too short
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResult: SemanticSearchResult = await semanticSearch(searchQuery, 10);

      // Only update if this is still the latest query
      if (latestQueryRef.current === searchQuery) {
        setResults(searchResult.tracks);
        setHasSearched(true);
      }
    } catch (err) {
      logger.error('Search error:', err);

      // Only update error if this is still the latest query
      if (latestQueryRef.current === searchQuery) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
        setHasSearched(true);
      }
    } finally {
      // Only clear loading if this is still the latest query
      if (latestQueryRef.current === searchQuery) {
        setIsLoading(false);
      }
    }
  }, []);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    latestQueryRef.current = newQuery;

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Clear results immediately if query is empty
    if (!newQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Show loading state immediately for better UX
    setIsLoading(true);

    // Debounce the actual search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, DEBOUNCE_DELAY);
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setQueryState('');
    latestQueryRef.current = '';
    setResults([]);
    setHasSearched(false);
    setError(null);
    setIsLoading(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    hasSearched,
    clearSearch,
  };
}
