export const getTrackFallbackImage = (seed: string | number) =>
  `https://picsum.photos/seed/track-${encodeURIComponent(String(seed))}/800/600`;
