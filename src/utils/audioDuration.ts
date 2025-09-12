// Global caches for duration and loading states
const DURATION_CACHE = new Map<string, string>();
const LOADING_STATES = new Map<string, Promise<string>>();

export const getAudioDuration = async (audioUrl: string): Promise<string> => {
  // Return cached duration immediately
  if (DURATION_CACHE.has(audioUrl)) {
    return DURATION_CACHE.get(audioUrl)!;
  }
  
  // Return existing promise if already loading
  if (LOADING_STATES.has(audioUrl)) {
    return LOADING_STATES.get(audioUrl)!;
  }
  
  // Create promise for background loading
  const promise = new Promise<string>((resolve) => {
    const audio = new Audio();
    audio.preload = 'metadata'; // Only load metadata, not full audio
    
    // Don't block UI - return placeholder quickly
    const timeout = setTimeout(() => {
      LOADING_STATES.delete(audioUrl); // Clean up loading state
      resolve('--:--'); // Placeholder while loading
    }, 1000);
    
    audio.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
      const duration = formatDuration(Math.floor(audio.duration));
      
      // Cache the result for future use
      DURATION_CACHE.set(audioUrl, duration);
      LOADING_STATES.delete(audioUrl); // Clean up loading state
      
      resolve(duration);
    });
    
    audio.addEventListener('error', () => {
      clearTimeout(timeout);
      const fallback = '0:00';
      
      // Cache the fallback to prevent retry attempts
      DURATION_CACHE.set(audioUrl, fallback);
      LOADING_STATES.delete(audioUrl); // Clean up loading state
      
      resolve(fallback);
    });
    
    audio.src = audioUrl;
  });
  
  LOADING_STATES.set(audioUrl, promise);
  return promise;
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Cache management functions
export const clearDurationCache = (): void => {
  DURATION_CACHE.clear();
  LOADING_STATES.clear();
};

export const getCacheSize = (): number => {
  return DURATION_CACHE.size;
};

export const preloadDurations = async (audioUrls: string[]): Promise<void> => {
  // Start loading all durations in background without waiting
  audioUrls.forEach(url => {
    if (!DURATION_CACHE.has(url) && !LOADING_STATES.has(url)) {
      getAudioDuration(url); // Fire and forget - loads in background
    }
  });
};