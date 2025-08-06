import { creators } from './creators';
import { audioTracks } from './tracks';
import { categories } from './categories';

// Featured content for home page (3 tracks, 5 creators)
export const featuredTracks = audioTracks.slice(0, 3);
export const featuredCreators = creators.slice(0, 5);

// Re-export everything for backward compatibility
export { creators, audioTracks, categories };