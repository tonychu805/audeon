// Complete data seeding script with all original data
import { supabase } from '../lib/supabase';

const seedCompleteData = async () => {
  try {
    console.log('Starting complete database seeding...');

    // Clear existing data (development only)
    await supabase.from('audio_tracks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('creators').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('communities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Cleared existing data');

    // Seed all communities
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
      console.error('Error seeding communities:', communitiesError);
      return;
    }
    console.log(`✓ Seeded ${communities?.length} communities`);

    // Seed all creators
    const { data: creators, error: creatorsError } = await supabase
      .from('creators')
      .insert([
        {
          name: 'Naval Ravikant',
          image: '/images/creators/Naval.jpg',
          bio: 'Entrepreneur, philosopher, and investor',
          category: 'Business',
          follower_count: 1200000
        },
        {
          name: 'Chamath Palihapitiya',
          image: '/images/creators/Chamath.jpg',
          bio: 'Venture capitalist and entrepreneur',
          category: 'Business',
          follower_count: 800000
        },
        {
          name: 'Daliana Liu',
          image: '/images/creators/Daliana.jpg',
          bio: 'Data scientist and tech leader at FAANG companies',
          category: 'Data Science',
          follower_count: 450000
        },
        {
          name: 'Madison Fugard',
          image: '/images/creators/Madison Fugard.jpg',
          bio: 'Product manager focused on digital health with a background as a clinician',
          category: 'Product Management',
          follower_count: 25000
        },
        {
          name: 'Julie Zhou',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/julie-zhuo.jpeg',
          bio: 'Former VP of Product Design at Facebook, author of The Making of a Manager',
          category: 'Product Management',
          follower_count: 180000
        },
        {
          name: 'Shayna Stewart',
          image: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/creators/shayna-stewart.jpeg',
          bio: 'Director, Strategic Business Development at Turner Sports, NBA Digital',
          category: 'Data Science',
          follower_count: 45000
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
        }
      ])
      .select();

    if (creatorsError) {
      console.error('Error seeding creators:', creatorsError);
      return;
    }
    console.log(`✓ Seeded ${creators?.length} creators`);

    // Helper function to get creator ID by name
    const getCreatorId = (name: string) => creators?.find(c => c.name === name)?.id;
    const getCommunityId = (name: string) => communities?.find(c => c.name === name)?.id;

    // Seed all tracks from actual_tracks.json with complete metadata
    const tracksToSeed = [
      {
        track_id: 33,
        title: 'How to Work with PMs',
        url: 'https://medium.com/the-year-of-the-looking-glass/3e852d5eccf5',
        audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2013-08-23_Julie%20Zhuo_How%20to%20work%20with%20PMs_nova.mp3',
        creator_name: 'Julie Zhuo',
        community_name: 'Medium',
        category: 'Product Management',
        sub_category: ['Data Science'],
        summary: 'A Cheat Sheet for Designers.',
        release_date: '2013-08-23',
        read_time: '8 min read',
        main_image_url: 'https://miro.medium.com/v2/resize:fit:720/format:webp/0*JUtkBatW_7iNFr4I.jpeg',
        gender: 'female',
        full_content: `Once, a long time ago, I was a product manager. Then, I was an engineer. For the past seven years, I've been in design. Every single day, I work with people in all of these roles. Every single day, I find new ways to appreciate the responsibilities, challenges, and art behind each of these three pillars of product development. The PM is a chameleon of sorts, constantly adapting to what is needed to ship a successful product. As a designer, how do you handle their affable charm and their data-gushing, team-herding, smooth-talking ways? Read on. Understand that the PM's job is to be a connector that helps teams ship successful products. This means PMs are, for the most part, exceptionally good at: Clear communication: as part of helping teams successfully ship great products, PMs need to represent the goals, priorities, and roadmap of a team to many constituents, including legal, marketing, customer operations, sales, and more. This means they need to be crystal clear, succinct, and on-topic. A designer or engineer with a tendency to ramble or mumble can be forgiven—it's not usually the first thing in the job req, after all. But a PM who does the same will not last long. This is why PMs tend to represent the product to executives or to external press—it's not because they're considered more 'elevated' than design or engineering, but that PMs are on average better at communicating because they won't get hired if they aren't.Being organized: in order to successfully ship great products, a PM must understand at every moment how the project is going, and whether it's on-track or off. She should be able to deliver the entire map of all the pieces that are required to come together for something to go out the door. This requires ruthless, ninja-level organization skills. Working well with a variety of people in a variety of roles: it's not uncommon for a PM to talk with dozens of people across different teams throughout the course of a single day. Since PMs don't typically have the authority to make something happen (they can't directly hire or fire engineers or designers, for instance), they need to demonstrate and earn trust. If a PM is an asshole, it generally comes out rather quickly and cripples their effectiveness. Everybody knows the old cliches of the eccentric, curmudgeonly engineer and the unreliable, Don-Draper-esque designer, but I have a hard time coming up with a similar caricature for a career PM. Again, a pretty big generalization here, but I'd posit that on average, PMs have higher levels of maturity and empathy for others in the organization than engineers or designers. At the same time, any specific PM, like any specific designer, will have their own unique set of strengths. Being communicative, organized, and easy to work with isn't enough. A good PM must also demonstrate some combination of the following skills: Execution: how well does the PM ship products that are 1) successful relative to goals, 2) on-time relative to expectations, and 3) smooth relative to how the team feels about it? The more senior the PM, the bigger and more ambitious the project they're expected to execute. (For instance, a junior PM may take on a project like add feature X to product Y whereas a senior PM may take on a project like build a new mobile app suite Z). Executing well is like captaining a tight, smooth-sailing ship. You need to make sure that everyone knows what they need to do and then does it, that the crew hums together in unison, that you estimated the journey well enough to have packed ample supplies, and that when you set out for X marks the spot on the map, you don't end up at the sea monster instead (who will probably eat you all alive.) Design thinking: how well does a PM understand, appreciate, and help drive a successful user experience? A PM with this strength will be one that designers clamor to work with. This isn't to say that she has to be good at designing herself, but that she should have a critical eye for what is or isn't a strong design proposal, and understand a designer's values even if she doesn't always agree with the suggestions. Analytical ability: how well does a PM plan for and then draw conclusions from known inputs (quantitative data, tasks, user feedback, past experiences, etc) in order to craft a well-rationed plan for the future? An analytical PM considers all the ways something can be known and unknown, and figures out how to gain more certainty and predictability for the future. A strongly analytical PM will use all the tools at her disposal to figure out how to set goals, prioritize tasks, and sequence projects in a way that inspires confidence. Product vision: how well does a PM read the market and current technologies, problems, and attitudes to come up with new and innovative solutions to problems? This is generally a more senior-level PM skill. PMs who are visionary are like a spark—they ignite and inspire entire teams of people to chase after bold, sometimes very risky new directions. As a designer working with a PM, it's important to keep in mind that the overall team must be well-balanced and well-suited to the task at hand. This means, for example, PMs who are weaker on design thinking should probably avoid heavily design-centric projects like redesigns or some major new user product, or be paired with senior designers who can help fill that skill gap. Similarly, designers who need more structure around goals and timelines may do well to have a strong executor PM to keep them focused on the most important things. Your job will be easier if you treat your PM as a partner and a resource, not a taskmaster. Need context on some related product area? Your PM's got that. (And if they don't, they'll hook you up with somebody who does, or keep digging until they find the answer themselves.) Want feedback from customers, or salespeople, or your users? Your PM can make it happen. Want to know the current set of priorities or fires or what the worst-offender bugs are? How about what the latest data teaches us about Feature Y? Surely you'd appreciate some additional perspective on how to prioritize the 7 design ideas you just came up with and which ones you should explore first. Your PM can arm you with context, with data, and with insightful feedback so that you can do your best and most impactful design work. Your PM can shield you from 85% of the distractions that's going on around you so that you can focus on the work. Just don't be afraid to ask. You are going to disagree with your PM. This is certainly going to happen. Most of the time it's okay, it's just the natural system of checks and balances between the three pillars of product development (product, design, and engineering). There are a few common ways this disagreement manifests: Is this product good enough/ready to ship? Since PMs are responsible for getting products out the door successfully and on-time, they have a natural incentive to push for aggressive milestones so they can ship and then iterate quickly. Since designers are incentivized to produce the very best user experience they can, they prefer to have more time on the design, implementation and polish stages. Taken to the extreme, neither of these are reasonable positions. Nobody wants to ship something tomorrow that's shitty. Nobody wants to spend 10 years designing the perfect registration flow. Real impact is made by shipping something good in a timely manner. (Most people get this, and the actual debate is about what, precisely, constitutes good and what constitutes timely, but for some reason the argument often devolves into these unproductive extreme caricatures). So, what can you do to resolve this? You can explain your position calmly and rationally. You can do an analysis of what you stand to lose or gain by delaying the launch. You can agree to escalate to an authoritative decision-maker. You can get opinions from other people that both of you trust (my favorite method.) You can do some user testing, vet out whether anyone's assumptions are wrong. On the whole, if you work with reasonable people, even if this disagreement comes up again and again, it's not that big of a problem. Can we ship this experience that feels qualitatively bad to the designer but performs well according to the metrics we track? This one is tricky because there are two ways it could play out. The first is that the designer's point is fair, and the metrics are not tracking actual user value correctly (maybe they are too short-term, maybe they are too incomplete—i.e. good for this one thing, but bad for something else that isn't being tracked, etc.) In which case, as a designer, you should figure out if there are other metrics to look into that would shine light onto this being a bad experience. The second way it plays out is that the designer is overvaluing their individual experience at the cost of network experience. For instance, maybe it's not such a great individual thing for a user to be presented with an 'invite your friends' flow so early in their session, but long-term, the more friends they have, the more value they'll get out of the product. We fundamentally don't agree on the product strategy. This one I talk more about in How to work with Designers, and is the prime case in which I think the designer and PM should seriously reconsider working together. Regardless of the disagreement, it's a hell of a lot easier to disagree on tactics when everyone is in staunch agreement about the end goals. (And if you're not, as in the case of #3, then it may be time for a change.) I find it helpful to record such debates and return to them after-the-fact. Usually, they're enlightening, and there are some lessons to be learned for next time. Sometimes they seem silly in retrospect. (We argued so much over that little detail? It didn't even matter in the end!) The quickest way to a PM's heart is to be reliable. Don't be the Don Draper that disappears after lunch to find his "creative mojo" and doesn't return until Thursday afternoon. Seriously. The creative realm is not some higher plane that excuses you from making commitments and doing your damned best to meet them. Yes, it can be difficult to predict when you'll come up with something that meets the high quality bar you uphold. But notice I said reliable and not meets every deadline. You may not always know exactly when a good design will materialize, but you should take the time along the way to communicate what you're doing, why you're doing it, and when you think it'll be done even if that's still changing. Share your in-progress work and your process. Explain why you're still exploring, and the reasons you're not happy with what you have so far. The fact that you sought out your PM to talk it over gives you instant reliability cred. It helps her do her job effectively. More than that, it helps her understand you and the way you work, so that you guys will have a stronger relationship in the future. Because at the end of the day, you, dear designer, shouldn't just own the goals of your design. You should own the whole of the thing that your team is building. Together. Which is the only way anything great is ever done.`,
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
        audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2019-03-21_Shayna%20Stewart_Are%20You%20Data-driven_%20Data-informed%20or%20Data-inspired_nova.mp3',
        creator_name: 'Shayna Stewart',
        community_name: 'Amplitude', 
        category: 'Product Management',
        sub_category: ['data_analytics'],
        summary: 'Comprehensive guide on are you data-driven, data-informed or data-inspired?',
        release_date: '2019-03-21',
        read_time: '8 min read',
        main_image_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/article-main-image/2019-03-21_Shayna%20Stewart_Are%20You%20Data-driven_%20Data-informed%20or%20Data-inspired_main.jpeg',
        gender: 'unknown'
      },
      {
        track_id: 15,
        title: 'How to work with engineers',
        url: 'https://medium.com/the-year-of-the-looking-glass/how-to-work-with-engineers-a3163ff1eced',
        audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2023-10-19_Julie%20Zhuo_How%20to%20work%20with%20engineers_shimmer.mp3',
        creator_name: 'Julie Zhou',
        community_name: 'Medium',
        category: 'Product Management',
        sub_category: ['leadership'],
        summary: 'Comprehensive guide on how to work with engineers',
        release_date: '2023-10-19',
        read_time: '6 min read',
        main_image_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/article-main-image/2023-10-19_Julie%20Zhuo_How%20to%20work%20with%20engineers_main.jpeg',
        gender: 'female'
      },
      {
        track_id: 25,
        title: 'What product professionals are focusing on in 2025: Survey results',
        url: 'https://www.mindtheproduct.com/what-product-professionals-are-focusing-on-in-2025-survey-results/',
        audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2025-01-31_Louron%20Pratt_What%20product%20professionals%20are%20focusing%20on%20in%202025_%20Survey%20results_nova.mp3',
        creator_name: 'Louron Pratt',
        community_name: 'Mind The Product',
        category: 'Product Management',
        sub_category: ['product_strategy'],
        summary: 'Comprehensive guide on what product professionals are focusing on in 2025: survey results',
        release_date: '2025-01-31',
        read_time: '3 min read',
        main_image_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/article-main-image/2025-01-31_Louron%20Pratt_What%20product%20professionals%20are%20focusing%20on%20in%202025_%20Survey%20results_main.jpeg',
        gender: 'unknown'
      },
      {
        track_id: 17,
        title: 'Creating Intelligent Products',
        url: 'https://www.svpg.com/creating-intelligent-products/',
        audio_url: 'https://xkwlkiweozjgujnqomze.supabase.co/storage/v1/object/public/audio-files/Tracks/2025-06-09_Marty%20Cagan_Creating%20Intelligent%20Products_echo.mp3',
        creator_name: 'Marty Cagan',
        community_name: 'SVPG',
        category: 'Product Management',
        sub_category: ['ai_products'],
        summary: 'Comprehensive guide on creating intelligent products',
        release_date: '2025-06-09',
        read_time: '6 min read',
        main_image_url: 'https://www.svpg.com/wp-content/themes/svpg2022/app/img/svpg-social.jpg',
        gender: 'male'
      }
    ];

    // Insert tracks with relationships
    for (const track of tracksToSeed) {
      const { error: trackError } = await supabase
        .from('audio_tracks')
        .insert({
          track_id: track.track_id,
          title: track.title,
          url: track.url,
          audio_url: track.audio_url,
          creator_id: getCreatorId(track.creator_name),
          community_id: getCommunityId(track.community_name),
          category: track.category,
          sub_category: track.sub_category,
          summary: track.summary,
          release_date: track.release_date,
          read_time: track.read_time,
          main_image_url: track.main_image_url,
          gender: track.gender,
          full_content: 'Full content available...',
          audio_config: {
            tone_override: 'Speak clearly and methodically like a technical instructor',
            voice_preference: 'echo',
            custom_instructions: 'Explain technical concepts clearly with appropriate pauses'
          }
        });

      if (trackError) {
        console.error(`Error seeding track ${track.title}:`, trackError);
      } else {
        console.log(`✓ Seeded track: ${track.title}`);
      }
    }

    console.log('✅ Complete database seeding finished successfully!');
    console.log(`📊 Total seeded: ${communities?.length} communities, ${creators?.length} creators, ${tracksToSeed.length} tracks`);
  } catch (error) {
    console.error('❌ Error during complete seeding:', error);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCompleteData();
}

export default seedCompleteData;