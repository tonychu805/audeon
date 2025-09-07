// Complete setup script: Create schema + seed all 11 tracks
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const setupAndSeed = async () => {
  try {
    console.log('🚀 Starting complete database setup and seeding...');

    // Step 1: Create the database schema (manually using SQL)
    console.log('📋 Creating database schema...');
    
    // Create tables in the correct order (respecting foreign keys)
    const schemaQueries = [
      // Drop existing tables if they exist
      `DROP TABLE IF EXISTS user_saved_tracks CASCADE;`,
      `DROP TABLE IF EXISTS audio_tracks CASCADE;`,
      `DROP TABLE IF EXISTS creators CASCADE;`,
      `DROP TABLE IF EXISTS communities CASCADE;`,

      // Create communities table
      `CREATE TABLE communities (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        logo text,
        description text,
        website text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );`,

      // Create creators table  
      `CREATE TABLE creators (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        image text,
        bio text,
        category text NOT NULL,
        follower_count integer DEFAULT 0,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );`,

      // Create audio tracks table
      `CREATE TABLE audio_tracks (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        track_id integer UNIQUE NOT NULL,
        title text NOT NULL,
        url text,
        audio_url text NOT NULL,
        creator_id uuid REFERENCES creators(id) ON DELETE CASCADE,
        community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
        category text NOT NULL,
        sub_category text[] DEFAULT '{}',
        summary text,
        release_date date,
        full_content text,
        read_time text,
        main_image_url text,
        main_image_caption text DEFAULT '',
        main_image_width integer DEFAULT 1200,
        main_image_height integer DEFAULT 630,
        voices jsonb DEFAULT '[]',
        gender text,
        audio_config jsonb DEFAULT '{}',
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );`,

      // Create user saved tracks table
      `CREATE TABLE user_saved_tracks (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid,
        track_id uuid REFERENCES audio_tracks(id) ON DELETE CASCADE,
        saved_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(user_id, track_id)
      );`,

      // Enable RLS
      `ALTER TABLE communities ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE creators ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE user_saved_tracks ENABLE ROW LEVEL SECURITY;`,

      // Public read policies
      `CREATE POLICY "Communities are publicly readable" ON communities FOR SELECT TO public USING (true);`,
      `CREATE POLICY "Creators are publicly readable" ON creators FOR SELECT TO public USING (true);`,
      `CREATE POLICY "Audio tracks are publicly readable" ON audio_tracks FOR SELECT TO public USING (true);`,
      `CREATE POLICY "Users can view their own saved tracks" ON user_saved_tracks FOR SELECT TO authenticated USING (true);`,

      // Create indexes
      `CREATE INDEX idx_audio_tracks_creator_id ON audio_tracks(creator_id);`,
      `CREATE INDEX idx_audio_tracks_community_id ON audio_tracks(community_id);`,
      `CREATE INDEX idx_audio_tracks_category ON audio_tracks(category);`,
      `CREATE INDEX idx_audio_tracks_release_date ON audio_tracks(release_date DESC);`,
      `CREATE INDEX idx_user_saved_tracks_user_id ON user_saved_tracks(user_id);`
    ];

    // Execute schema creation
    for (const query of schemaQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error && !error.message.includes('already exists')) {
        console.log(`Schema query: ${query.substring(0, 50)}...`);
        console.log(`Error (may be ignorable):`, error.message);
      }
    }

    console.log('✅ Schema creation completed');

    // Step 2: Seed all communities
    console.log('🏢 Seeding communities...');
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .insert([
        {
          name: 'Medium',
          logo: '/images/communities/medium.png',
          description: 'A platform for writers and readers to share ideas and stories',
          website: 'https://medium.com'
        },
        {
          name: 'Amplitude',
          logo: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/amplitude.jpeg',
          description: 'Product analytics platform helping companies understand user behavior',
          website: 'https://amplitude.com'
        },
        {
          name: 'Mind The Product',
          logo: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/mind-the-product.jpeg',
          description: 'Global community of product managers sharing knowledge and best practices',
          website: 'https://www.mindtheproduct.com'
        },
        {
          name: 'SVPG',
          logo: '/images/communities/svpg.png',
          description: 'Silicon Valley Product Group - product management training and consulting',
          website: 'https://www.svpg.com'
        },
        {
          name: 'a16z',
          logo: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/a16z.jpeg',
          description: 'Andreessen Horowitz - venture capital firm investing in technology companies',
          website: 'https://a16z.com'
        },
        {
          name: 'Unknown',
          logo: '/images/communities/default.png',
          description: 'Content from various sources',
          website: ''
        }
      ])
      .select();

    if (communitiesError) {
      console.error('❌ Error seeding communities:', communitiesError);
      return;
    }
    console.log(`✅ Seeded ${communities?.length} communities`);

    // Step 3: Seed all creators
    console.log('👥 Seeding creators...');
    const { data: creators, error: creatorsError } = await supabase
      .from('creators')
      .insert([
        {
          name: 'Julie Zhuo',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julie-zhuo.jpeg',
          bio: 'Former VP of Product Design at Facebook, author of The Making of a Manager',
          category: 'Product Management',
          follower_count: 180000
        },
        {
          name: 'Louron Pratt',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/louron-pratt.jpeg',
          bio: 'Product management expert and community leader',
          category: 'Product Management',
          follower_count: 35000
        },
        {
          name: 'Marty Cagan',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/marty-cagan.jpeg',
          bio: 'Founder of Silicon Valley Product Group (SVPG), renowned product management thought leader',
          category: 'Product Management',
          follower_count: 250000
        },
        {
          name: 'Kyle Poyar',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/kyle-poyar.jpeg',
          bio: 'Growth and marketing expert, author of Growth Unhinged newsletter',
          category: 'Marketing',
          follower_count: 85000
        },
        {
          name: 'Julia Dillon',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julia-dillon.jpeg',
          bio: 'Product strategy expert focused on retention and user engagement',
          category: 'Product Management',
          follower_count: 42000
        },
        {
          name: 'Audrey Xu Leung',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/audrey-xu-leung.jpeg',
          bio: 'Analytics and experimentation expert at Amplitude',
          category: 'Data Science',
          follower_count: 38000
        },
        {
          name: 'Eric Metelka',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/eric-metelka.jpeg',
          bio: 'Experimentation and product analytics expert',
          category: 'Data Science',
          follower_count: 32000
        },
        {
          name: 'David George',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/david-george.jpeg',
          bio: 'Growth investor at Andreessen Horowitz (a16z)',
          category: 'Finance',
          follower_count: 120000
        },
        {
          name: 'Amplitude',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/community/amplitude.jpeg',
          bio: 'Product analytics platform',
          category: 'Data Science',
          follower_count: 50000
        }
      ])
      .select();

    if (creatorsError) {
      console.error('❌ Error seeding creators:', creatorsError);
      return;
    }
    console.log(`✅ Seeded ${creators?.length} creators`);

    // Helper functions
    const getCreatorId = (name: string) => creators?.find(c => c.name === name)?.id;
    const getCommunityId = (name: string) => communities?.find(c => c.name === name)?.id;

    // Step 4: Seed all 11 tracks
    console.log('🎵 Seeding all 11 tracks...');
    const tracksData = [
      {
        track_id: 33,
        title: 'How to Work with PMs',
        url: 'https://medium.com/the-year-of-the-looking-glass/3e852d5eccf5',
        creator_name: 'Julie Zhuo',
        community_name: 'Medium',
        category: 'Product Management',
        sub_category: ['Data Science'],
        summary: 'A Cheat Sheet for Designers.',
        release_date: '2013-08-23',
        read_time: '8 min read',
        main_image_url: 'https://miro.medium.com/v2/resize:fit:720/format:webp/0*JUtkBatW_7iNFr4I.jpeg',
        gender: 'female',
        audio_config: {
          tone_override: 'Speak clearly and methodically like a technical instructor',
          voice_preference: 'echo',
          custom_instructions: 'Explain technical concepts clearly with appropriate pauses'
        }
      },
      {
        track_id: 21,
        title: 'Are you Data-Driven, Data-informed or Data-inspired?',
        url: 'https://amplitude.com/blog/data-driven-data-informed-data-inspired#are-you-data-driven',
        creator_name: 'Amplitude',
        community_name: 'Amplitude',
        category: 'Product Management',
        sub_category: ['data_analytics'],
        summary: 'Comprehensive guide on are you data-driven, data-informed or data-inspired?',
        release_date: '2019-03-21',
        read_time: '8 min read',
        main_image_url: 'https://cdn.sanity.io/images/l5rq9j6r/production/08b66c7e82786c1d9f8bb2c88e8b22d2f3390863-1600x505.png?rect=319,0,962,505&w=1200&h=630&auto=format',
        gender: 'unknown'
      },
      {
        track_id: 15,
        title: 'How to work with engineers',
        url: 'https://medium.com/the-year-of-the-looking-glass/how-to-work-with-engineers-a3163ff1eced',
        creator_name: 'Julie Zhuo',
        community_name: 'Medium',
        category: 'Product Management',
        sub_category: ['leadership'],
        summary: 'Comprehensive guide on how to work with engineers',
        release_date: '2023-10-19',
        read_time: '6 min read',
        main_image_url: 'https://miro.medium.com/v2/resize:fit:700/0*pZsVj0ithllPHBUt.jpeg',
        gender: 'female'
      },
      {
        track_id: 25,
        title: 'What product professionals are focusing on in 2025: Survey results',
        url: 'https://www.mindtheproduct.com/what-product-professionals-are-focusing-on-in-2025-survey-results/',
        creator_name: 'Louron Pratt',
        community_name: 'Mind The Product',
        category: 'Product Management',
        sub_category: ['product_strategy'],
        summary: 'Comprehensive guide on what product professionals are focusing on in 2025: survey results',
        release_date: '2025-01-31',
        read_time: '3 min read',
        main_image_url: 'https://www.mindtheproduct.com/wp-content/uploads/2025/01/Screenshot-2025-01-31-at-11.38.04.png',
        gender: 'unknown',
        audio_config: {
          tone_override: 'Speak like an engaging storyteller sharing research insights',
          voice_preference: 'fable',
          custom_instructions: 'Share insights like telling an interesting story'
        }
      },
      {
        track_id: 17,
        title: 'Creating Intelligent Products',
        url: 'https://www.svpg.com/creating-intelligent-products/',
        creator_name: 'Marty Cagan',
        community_name: 'SVPG',
        category: 'Product Management',
        sub_category: ['ai_products'],
        summary: 'Comprehensive guide on creating intelligent products',
        release_date: '2025-06-09',
        read_time: '6 min read',
        main_image_url: 'https://www.svpg.com/wp-content/themes/svpg2022/app/img/svpg-social.jpg',
        gender: 'male'
      },
      {
        track_id: 28,
        title: 'Your next job will require AI skills',
        url: 'https://www.growthunhinged.com/p/your-next-job-will-require-ai-skills',
        creator_name: 'Kyle Poyar',
        community_name: 'Unknown',
        category: 'Product Management',
        sub_category: ['ai_products'],
        summary: 'Comprehensive guide on your next job will require ai skills',
        release_date: '2025-07-23',
        read_time: '10 min read',
        main_image_url: 'https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6797b043-7942-4d33-9f02-f5fcfbe0f98c_1080x810.png',
        gender: 'unknown'
      },
      {
        track_id: 18,
        title: 'Build vs Buy in the Age of AI',
        url: 'https://www.svpg.com/article-build-vs-buy-in-the-age-of-ai/',
        creator_name: 'Marty Cagan',
        community_name: 'SVPG',
        category: 'Product Management',
        sub_category: ['ai_products'],
        summary: 'Comprehensive guide on build vs buy in the age of ai',
        release_date: '2025-08-19',
        read_time: '6 min read',
        main_image_url: 'https://www.svpg.com/wp-content/themes/svpg2022/app/img/svpg-social.jpg',
        gender: 'male'
      },
      {
        track_id: 32,
        title: 'Retention Is the Ultimate Product Strategy',
        url: 'https://amplitude.com/blog/retention-product-strategy',
        creator_name: 'Julia Dillon',
        community_name: 'Amplitude',
        category: 'Product Management',
        sub_category: ['Data Science'],
        summary: 'What product leaders get wrong about retention—and how the best are fixing it.',
        release_date: '2025-08-26',
        read_time: '10 min read',
        main_image_url: 'https://amplitude.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fl5rq9j6r%2Fproduction%2F6491a65dc4d04febcf32c60ee564c7871c77bbcf-1920x1080.png%3Ffp-x%3D0.5%26fp-y%3D0.5%26w%3D1920%26h%3D1080%26q%3D85%26fit%3Dcrop%26crop%3Dfocalpoint%26auto%3Dformat&w=1200&q=75',
        gender: 'female'
      },
      {
        track_id: 31,
        title: 'Experimentation Is a Culture, Not a Task',
        url: 'https://amplitude.com/blog/experimentation-is-a-culture',
        creator_name: 'Audrey Xu Leung',
        community_name: 'Amplitude',
        category: 'Product Management',
        sub_category: ['Data Science'],
        summary: 'Finding truth in data requires an ongoing commitment.',
        release_date: '2025-08-28',
        read_time: '10 min read',
        main_image_url: 'https://amplitude.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fl5rq9j6r%2Fproduction%2F37be125626b12d4f000ab7dd62c8ee00ff57301d-1920x1080.jpg%3Ffp-x%3D0.5%26fp-y%3D0.5%26w%3D1920%26h%3D1080%26q%3D85%26fit%3Dcrop%26crop%3Dfocalpoint%26auto%3Dformat&w=1200&q=75',
        gender: 'female'
      },
      {
        track_id: 27,
        title: 'The Evolving Landscape of Experimentation Tooling: Build vs Buy',
        url: 'https://amplitude.com/blog/build-vs-buy-experimentation',
        creator_name: 'Eric Metelka',
        community_name: 'Amplitude',
        category: 'Product Management',
        sub_category: ['data_analytics'],
        summary: 'Comprehensive guide on the evolving landscape of experimentation tooling: build vs buy',
        release_date: '2025-08-28',
        read_time: '5 min read',
        main_image_url: '',
        gender: 'unknown'
      },
      {
        track_id: 29,
        title: 'Private Markets Are The New High-Growth Public Markets',
        url: 'https://a16z.com/private-markets-new-public-markets/',
        creator_name: 'David George',
        community_name: 'a16z',
        category: 'Product Management',
        sub_category: ['ai_products', 'growth'],
        summary: 'Comprehensive guide on private markets as the new high-growth public markets',
        release_date: '2025-09-02',
        read_time: '5 min read',
        main_image_url: 'https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/09/Top-10-companies-in-the-world-by-market-cap-2048x900.jpg',
        gender: 'male'
      }
    ];

    // Insert all tracks
    for (const track of tracksData) {
      const { error: trackError } = await supabase
        .from('audio_tracks')
        .insert({
          track_id: track.track_id,
          title: track.title,
          url: track.url,
          audio_url: `https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/track-${track.track_id}.mp3`,
          creator_id: getCreatorId(track.creator_name),
          community_id: getCommunityId(track.community_name),
          category: track.category,
          sub_category: track.sub_category,
          summary: track.summary,
          release_date: track.release_date,
          read_time: track.read_time,
          main_image_url: track.main_image_url,
          gender: track.gender,
          full_content: 'Complete full content available from actual_tracks.json',
          audio_config: track.audio_config || {
            tone_override: 'Speak clearly and methodically like a technical instructor',
            voice_preference: 'echo',
            custom_instructions: 'Explain technical concepts clearly with appropriate pauses'
          }
        });

      if (trackError) {
        console.error(`❌ Error seeding track ${track.title}:`, trackError);
      } else {
        console.log(`✅ Seeded track: ${track.title}`);
      }
    }

    console.log('🎉 Complete database setup and seeding finished successfully!');
    console.log(`📊 Final totals: ${communities?.length} communities, ${creators?.length} creators, ${tracksData.length} tracks`);
  } catch (error) {
    console.error('💥 Error during setup and seeding:', error);
  }
};

// Run the complete setup
setupAndSeed();