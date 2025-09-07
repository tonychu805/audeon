// Development script to seed database with initial data
import { supabase } from '../lib/supabase';

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (development only)
    await supabase.from('audio_tracks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('creators').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('communities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Seed communities
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .insert([
        {
          name: 'Medium',
          logo: '',
          description: 'Online publishing platform',
          website: 'https://medium.com'
        },
        {
          name: 'Amplitude',
          logo: '',
          description: 'Product analytics platform',
          website: 'https://amplitude.com'
        },
        {
          name: 'SVPG',
          logo: '',
          description: 'Silicon Valley Product Group',
          website: 'https://www.svpg.com'
        },
        {
          name: 'Mind The Product',
          logo: '',
          description: 'Product management community',
          website: 'https://www.mindtheproduct.com'
        },
        {
          name: 'a16z',
          logo: '',
          description: 'Andreessen Horowitz',
          website: 'https://a16z.com'
        }
      ])
      .select();

    if (communitiesError) {
      console.error('Error seeding communities:', communitiesError);
      return;
    }
    console.log('Communities seeded successfully');

    // Seed creators
    const { data: creators, error: creatorsError } = await supabase
      .from('creators')
      .insert([
        {
          name: 'Julie Zhou',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julie-zhuo.jpeg',
          bio: 'Former VP of Product Design at Facebook, author of The Making of a Manager',
          category: 'Product Management',
          follower_count: 180000
        },
        {
          name: 'Marty Cagan',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/marty-cagan.jpeg',
          bio: 'Founder of Silicon Valley Product Group (SVPG), renowned product management thought leader',
          category: 'Product Management',
          follower_count: 250000
        },
        {
          name: 'Naval Ravikant',
          image: '/images/creators/Naval.jpg',
          bio: 'Entrepreneur, philosopher, and investor',
          category: 'Business',
          follower_count: 1200000
        }
      ])
      .select();

    if (creatorsError) {
      console.error('Error seeding creators:', creatorsError);
      return;
    }
    console.log('Creators seeded successfully');

    // Get the Julie Zhou creator ID for tracks
    const julieCreator = creators?.find(c => c.name === 'Julie Zhou');
    const mediumCommunity = communities?.find(c => c.name === 'Medium');

    if (julieCreator && mediumCommunity) {
      // Seed sample track
      const { error: tracksError } = await supabase
        .from('audio_tracks')
        .insert([
          {
            track_id: 33,
            title: 'How to Work with PMs',
            url: 'https://medium.com/the-year-of-the-looking-glass/3e852d5eccf5',
            audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2013-08-23_Julie%20Zhuo_How%20to%20work%20with%20PMs_nova.mp3',
            creator_id: julieCreator.id,
            community_id: mediumCommunity.id,
            category: 'Product Management',
            sub_category: ['Data Science'],
            summary: 'A Cheat Sheet for Designers.',
            release_date: '2013-08-23',
            full_content: 'Once, a long time ago, I was a product manager...',
            read_time: '8 min read',
            main_image_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/article-main-image/2013-08-23_Julie%20Zhuo_How%20to%20work%20with%20PMs_main.jpeg',
            gender: 'female',
            audio_config: {
              tone_override: 'Speak clearly and methodically like a technical instructor',
              voice_preference: 'echo',
              custom_instructions: 'Explain technical concepts clearly with appropriate pauses'
            }
          }
        ]);

      if (tracksError) {
        console.error('Error seeding tracks:', tracksError);
        return;
      }
      console.log('Sample track seeded successfully');
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;