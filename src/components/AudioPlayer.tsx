import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const AudioPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    isExpanded, 
    savedTracks,
    togglePlayPause, 
    nextTrack, 
    previousTrack, 
    toggleExpanded,
    toggleSaved,
    playbackSpeed,
    setPlaybackSpeed
  } = usePlayer();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedControls, setShowSpeedControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const seekBy = useCallback((seconds: number) => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }

    const maxDuration = Number.isFinite(audioElement.duration) && audioElement.duration > 0
      ? audioElement.duration
      : Math.max(audioElement.currentTime + seconds, 0);
    const nextTime = Math.min(
      Math.max(audioElement.currentTime + seconds, 0),
      maxDuration
    );
    audioElement.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);
  
  useEffect(() => {
    // Get the audio element from the PlayerContext
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioRef.current = audioElement;
      
      const updateTime = () => {
        if (!isDragging) {
          setCurrentTime(audioElement.currentTime);
        }
      };
      
      const updateDuration = () => {
        setDuration(audioElement.duration);
      };
      
      audioElement.addEventListener('timeupdate', updateTime);
      audioElement.addEventListener('loadedmetadata', updateDuration);
      audioElement.addEventListener('durationchange', updateDuration);
      
      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
        audioElement.removeEventListener('loadedmetadata', updateDuration);
        audioElement.removeEventListener('durationchange', updateDuration);
      };
    }
  }, [currentTrack, isDragging]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      if (!currentTrack) {
        return;
      }

      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          ['input', 'textarea', 'button', 'a', 'select'].includes(tagName) ||
          target.isContentEditable
        ) {
          return;
        }
        if (target.getAttribute('role') === 'button') {
          return;
        }
      }

      if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        seekBy(10);
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        seekBy(-10);
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [currentTrack, seekBy, togglePlayPause]);

  // Close speed controls when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      if (showSpeedControls) {
        setShowSpeedControls(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSpeedControls]);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };
  
  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  const isSaved = savedTracks.includes(currentTrack.id);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime = Number.isFinite(currentTime) && currentTime >= 0 ? currentTime : 0;
  const formattedCurrentTime = formatTime(safeCurrentTime);
  const formattedDuration = safeDuration > 0 ? formatTime(safeDuration) : formatTime(duration);
  const progressPercent = safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0;
  const progressAriaText = safeDuration > 0
    ? `${formattedCurrentTime} elapsed of ${formattedDuration}`
    : `${formattedCurrentTime} elapsed`;
  const liveStatusMessage = isPlaying
    ? `Playing ${currentTrack.title}. ${progressAriaText}.`
    : `Paused ${currentTrack.title}. ${progressAriaText}.`;
  const expandedSpeedMenuId = 'player-speed-menu-expanded';
  const miniSpeedMenuId = 'player-speed-menu-mini';

  if (isExpanded) {
    return (
      <div
        className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black text-white z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Expanded audio player"
      >
        <div className="sr-only" aria-live="polite">{liveStatusMessage}</div>
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={toggleExpanded}
            aria-label="Minimize player"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          <img 
            src={currentTrack.main_image.url} 
            alt={`Cover art for ${currentTrack.title}`}
            className="w-64 h-64 rounded-2xl object-contain mb-8 shadow-2xl"
          />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
            <p className="text-lg text-gray-300">{currentTrack.creator}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mb-6">
            <input
              type="range"
              min="0"
              max={safeDuration}
              value={Math.min(safeCurrentTime, safeDuration || safeCurrentTime)}
              onChange={handleProgressChange}
              onMouseDown={handleProgressMouseDown}
              onMouseUp={handleProgressMouseUp}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progressPercent}%, #374151 ${progressPercent}%, #374151 100%)`
              }}
              aria-label="Track progress"
              aria-valuemin={0}
              aria-valuemax={safeDuration || Math.max(safeCurrentTime, 0)}
              aria-valuenow={Math.min(safeCurrentTime, safeDuration || safeCurrentTime)}
              aria-valuetext={progressAriaText}
              role="slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formattedCurrentTime}</span>
              <span>{formattedDuration}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-8">
            <button 
              onClick={() => toggleSaved(currentTrack.id)}
              aria-label={isSaved ? `Remove ${currentTrack.title} from saved tracks` : `Save ${currentTrack.title} to library`}
              aria-pressed={isSaved}
              className={`p-3 rounded-full transition-colors ${
                isSaved 
                  ? 'text-red-500 hover:text-red-400 bg-red-500/20' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
            
            <button 
              onClick={previousTrack}
              aria-label="Play previous track"
              className="p-3 text-white/80 hover:text-white transition-colors"
            >
              <SkipBack className="w-8 h-8" aria-hidden="true" />
            </button>
            
            <button 
              onClick={togglePlayPause}
              aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
              aria-pressed={isPlaying}
              className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
            >
              {isPlaying ? <Pause className="w-8 h-8" aria-hidden="true" /> : <Play className="w-8 h-8" aria-hidden="true" />}
            </button>
            
            <button 
              onClick={nextTrack}
              aria-label="Play next track"
              className="p-3 text-white/80 hover:text-white transition-colors"
            >
              <SkipForward className="w-8 h-8" aria-hidden="true" />
            </button>
            
            {/* Speed Controls for Expanded View */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedControls(!showSpeedControls);
                }}
                aria-label="Playback speed"
                aria-haspopup="menu"
                aria-expanded={showSpeedControls}
                aria-controls={expandedSpeedMenuId}
                className="p-3 text-white/60 hover:text-white transition-colors text-sm font-medium"
              >
                {playbackSpeed}x
              </button>
              
              {showSpeedControls && (
                <div
                  id={expandedSpeedMenuId}
                  role="menu"
                  aria-label="Playback speed options"
                  className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2 min-w-[80px]"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaybackSpeed(speed);
                        setShowSpeedControls(false);
                      }}
                      role="menuitemradio"
                      aria-checked={speed === playbackSpeed}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                        speed === playbackSpeed ? 'text-purple-400 bg-gray-700' : 'text-gray-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="audio-player"
      role="region"
      aria-label="Mini audio player"
      className="fixed left-0 right-0 bottom-[calc(env(safe-area-inset-bottom,0px)+3.5rem)] mx-auto max-w-[480px] bg-gray-900 border border-gray-700 z-50 rounded-xl shadow-[0_10px_24px_rgba(15,23,42,0.16)] overflow-hidden"
    >
      <div className="sr-only" aria-live="polite">{liveStatusMessage}</div>
      <div 
        onClick={toggleExpanded}
        className="flex items-center justify-between px-3 pt-2 pb-1 cursor-pointer hover:bg-gray-800 transition-colors"
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className="sr-only"
        >
          Expand player
        </button>
        <div className="flex items-center space-x-3">
          <img 
            src={currentTrack.main_image.url} 
            alt={`Cover art for ${currentTrack.title}`}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-white text-sm line-clamp-1">{currentTrack.title}</h3>
            <p className="text-gray-300 text-sm">{currentTrack.creator}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {/* Speed Controls */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeedControls(!showSpeedControls);
              }}
              aria-label="Playback speed"
              aria-haspopup="menu"
              aria-expanded={showSpeedControls}
              aria-controls={miniSpeedMenuId}
              className="p-1.5 text-gray-400 hover:text-white transition-colors text-xs font-medium"
            >
              {playbackSpeed}x
            </button>
            
            {showSpeedControls && (
              <div
                id={miniSpeedMenuId}
                role="menu"
                aria-label="Playback speed options"
                className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-2 min-w-[80px]"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaybackSpeed(speed);
                      setShowSpeedControls(false);
                    }}
                    role="menuitemradio"
                    aria-checked={speed === playbackSpeed}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                      speed === playbackSpeed ? 'text-purple-400 bg-gray-700' : 'text-gray-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(currentTrack.id);
            }}
            aria-label={isSaved ? `Remove ${currentTrack.title} from saved tracks` : `Save ${currentTrack.title} to library`}
            aria-pressed={isSaved}
            className={`p-1.5 rounded-full transition-colors ${
              isSaved 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              previousTrack();
            }}
            aria-label="Play previous track"
            className="p-1.5 text-gray-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" aria-hidden="true" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
            aria-pressed={isPlaying}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5" aria-hidden="true" />}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            aria-label="Play next track"
            className="p-1.5 text-gray-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      {/* Interactive Progress Bar at Bottom */}
      <div className="px-4 pb-1.5">
        <input
          type="range"
          min="0"
          max={safeDuration}
          value={Math.min(safeCurrentTime, safeDuration || safeCurrentTime)}
          onChange={handleProgressChange}
          onMouseDown={handleProgressMouseDown}
          onMouseUp={handleProgressMouseUp}
          className="w-full h-1.5 bg-gray-700 rounded-none appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progressPercent}%, #374151 ${progressPercent}%, #374151 100%)`,
            WebkitAppearance: 'none',
            outline: 'none'
          }}
          aria-label="Track progress"
          aria-valuemin={0}
          aria-valuemax={safeDuration || Math.max(safeCurrentTime, 0)}
          aria-valuenow={Math.min(safeCurrentTime, safeDuration || safeCurrentTime)}
          aria-valuetext={progressAriaText}
          role="slider"
        />
      </div>
    </div>
  );
};
