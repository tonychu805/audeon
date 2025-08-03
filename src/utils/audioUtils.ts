export const getAudioDuration = (audioUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      if (isNaN(duration)) {
        resolve('0:00');
        return;
      }
      
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      resolve(formattedDuration);
    });
    
    audio.addEventListener('error', () => {
      console.warn(`Could not load audio metadata for: ${audioUrl}`);
      resolve('0:00');
    });
    
    audio.src = audioUrl;
  });
};

export const loadAudioDurations = async (tracks: any[]) => {
  const updatedTracks = await Promise.all(
    tracks.map(async (track) => {
      try {
        const duration = await getAudioDuration(track.audioUrl);
        return { ...track, duration };
      } catch (error) {
        console.warn(`Failed to get duration for track: ${track.title}`);
        return { ...track, duration: '0:00' };
      }
    })
  );
  
  return updatedTracks;
};