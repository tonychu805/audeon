import React, { useState, useEffect, useRef } from 'react';
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
    toggleSaved
  } = usePlayer();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  if (isExpanded) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black text-white z-50 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <button 
            onClick={toggleExpanded}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <div className="w-10" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          <img 
            src={currentTrack.coverImage} 
            alt={currentTrack.creator.name}
            className="w-64 h-64 rounded-2xl object-cover mb-8 shadow-2xl"
          />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
            <p className="text-lg text-gray-300">{currentTrack.creator.name}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mb-6">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              onMouseDown={handleProgressMouseDown}
              onMouseUp={handleProgressMouseUp}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-8">
            <button 
              onClick={() => toggleSaved(currentTrack.id)}
              className={`p-3 rounded-full transition-colors ${
                isSaved 
                  ? 'text-red-500 hover:text-red-400 bg-red-500/20' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            
            <button 
              onClick={previousTrack}
              className="p-3 text-white/80 hover:text-white transition-colors"
            >
              <SkipBack className="w-8 h-8" />
            </button>
            
            <button 
              onClick={togglePlayPause}
              className="p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            
            <button 
              onClick={nextTrack}
              className="p-3 text-white/80 hover:text-white transition-colors"
            >
              <SkipForward className="w-8 h-8" />
            </button>
            
            <div className="w-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={toggleExpanded}
      className="fixed bottom-16 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40 cursor-pointer hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img 
            src={currentTrack.coverImage} 
            alt={currentTrack.creator.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-white text-sm line-clamp-1">{currentTrack.title}</h3>
            <p className="text-gray-300 text-sm">{currentTrack.creator.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(currentTrack.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              isSaved 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              previousTrack();
            }}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mini Progress Bar - Made highly visible for debugging */}
      <div className="h-3 bg-red-500 w-full border-t-2 border-yellow-400">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};