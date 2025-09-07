import { Community } from '../types';
import { supabase } from '../lib/supabase';

// Helper function to get Supabase community logo URL
const getCoverImageUrl = (filename: string) => {
  const { data } = supabase.storage.from('audio-files').getPublicUrl(filename);
  return data.publicUrl;
};

export const communities: Community[] = [
  {
    id: '1',
    name: 'Medium',
    logo: '/images/communities/medium.png', // Using placeholder as no logo URL provided
    description: 'A platform for writers and readers to share ideas and stories',
    website: 'https://medium.com'
  },
  {
    id: '2',
    name: 'Amplitude',
    logo: getCoverImageUrl('community/amplitude.jpeg'),
    description: 'Product analytics platform helping companies understand user behavior',
    website: 'https://amplitude.com'
  },
  {
    id: '3',
    name: 'Mind The Product',
    logo: getCoverImageUrl('community/mind-the-product.jpeg'),
    description: 'Global community of product managers sharing knowledge and best practices',
    website: 'https://www.mindtheproduct.com'
  },
  {
    id: '4',
    name: 'SVPG',
    logo: '/images/communities/svpg.png', // Using placeholder as no logo URL provided
    description: 'Silicon Valley Product Group - product management training and consulting',
    website: 'https://www.svpg.com'
  },
  {
    id: '5',
    name: 'a16z',
    logo: getCoverImageUrl('community/a16z.jpeg'),
    description: 'Andreessen Horowitz - venture capital firm investing in technology companies',
    website: 'https://a16z.com'
  },
  {
    id: '6',
    name: 'Unknown',
    logo: '/images/communities/default.png', // Default placeholder
    description: 'Content from various sources',
    website: ''
  }
];