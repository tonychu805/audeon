export const getAudioDuration = (audioUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.preload = 'metadata'; // Only load metadata, not full audio
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = Math.floor(audio.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    });
    
    audio.addEventListener('error', () => {
      resolve('0:00'); // Fallback if audio can't be loaded
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      resolve('0:00');
    }, 5000);
  });
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};