import { Creator } from '../types';
import { supabase } from '../lib/supabase';

// Helper function to get Supabase creator image URL
const getCoverImageUrl = (filename: string) => {
  const { data } = supabase.storage.from('audio-files').getPublicUrl(filename);
  return data.publicUrl;
};

export const creators: Creator[] = [
  {
    id: '1',
    name: 'Naval Ravikant',
    image: '/images/creators/Naval.jpg',
    bio: 'Entrepreneur, philosopher, and investor',
    category: 'Business',
    followerCount: 1200000
  },
  {
    id: '2',
    name: 'Chamath Palihapitiya',
    image: '/images/creators/Chamath.jpg',
    bio: 'Venture capitalist and entrepreneur',
    category: 'Business',
    followerCount: 800000
  },
  {
    id: '3',
    name: 'Daliana Liu',
    image: '/images/creators/Daliana.jpg',
    bio: 'Data scientist and tech leader at FAANG companies',
    category: 'Data Science',
    followerCount: 450000
  },
  {
    id: '4',
    name: 'Madison Fugard',
    image: '/images/creators/Madison Fugard.jpg',
    bio: 'Product manager focused on digital health with a background as a clinician',
    category: 'Product Management',
    followerCount: 25000
  },
  {
    id: '5',
    name: 'Julie Zhou',
    image: getCoverImageUrl('creators/julie-zhuo.jpeg'),
    bio: 'Former VP of Product Design at Facebook, author of The Making of a Manager',
    category: 'Product Management',
    followerCount: 180000
  },
  {
    id: '6',
    name: 'Shayna Stewart',
    image: getCoverImageUrl('creators/shayna-stewart.jpeg'),
    bio: 'Director, Strategic Business Development at Turner Sports, NBA Digital',
    category: 'Data Science',
    followerCount: 45000
  },
  {
    id: '7',
    name: 'Louron Pratt',
    image: getCoverImageUrl('creators/louron-pratt.jpeg'),
    bio: 'Product management expert and community leader',
    category: 'Product Management',
    followerCount: 35000
  },
  {
    id: '8',
    name: 'Marty Cagan',
    image: getCoverImageUrl('creators/marty-cagan.jpeg'),
    bio: 'Founder of Silicon Valley Product Group (SVPG), renowned product management thought leader',
    category: 'Product Management',
    followerCount: 250000
  },
  {
    id: '9',
    name: 'Kyle Poyar',
    image: getCoverImageUrl('creators/kyle-poyar.jpeg'),
    bio: 'Growth and marketing expert, author of Growth Unhinged newsletter',
    category: 'Marketing',
    followerCount: 85000
  },
  {
    id: '10',
    name: 'Julia Dillon',
    image: getCoverImageUrl('creators/julia-dillon.jpeg'),
    bio: 'Product strategy expert focused on retention and user engagement',
    category: 'Product Management',
    followerCount: 42000
  },
  {
    id: '11',
    name: 'Audrey Xu Leung',
    image: getCoverImageUrl('creators/audrey-xu-leung.jpeg'),
    bio: 'Analytics and experimentation expert at Amplitude',
    category: 'Data Science',
    followerCount: 38000
  },
  {
    id: '12',
    name: 'Eric Metelka',
    image: getCoverImageUrl('creators/eric-metelka.jpeg'),
    bio: 'Experimentation and product analytics expert',
    category: 'Data Science',
    followerCount: 32000
  },
  {
    id: '13',
    name: 'David George',
    image: getCoverImageUrl('creators/david-george.jpeg'),
    bio: 'Growth investor at Andreessen Horowitz (a16z)',
    category: 'Finance',
    followerCount: 120000
  }
];