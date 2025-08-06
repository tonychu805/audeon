import { AudioTrack } from '../types';
import { creators } from './creators';
import { supabase } from '../lib/supabase';

// Helper function to get Supabase audio URL
const getAudioUrl = (filename: string) => {
  const { data } = supabase.storage.from('audio-files').getPublicUrl(filename);
  return data.publicUrl;
};

// Helper function to find creator by ID
const getCreator = (id: string) => creators.find(c => c.id === id)!;

export const audioTracks: AudioTrack[] = [
  // Naval Ravikant tracks
  {
    id: '1',
    title: 'Insights on Wealth Creation',
    description: 'Naval shares his thoughts on building wealth and the importance of specific knowledge in creating value.',
    creator: getCreator('1'),
    duration: '0:00', // Will be updated with actual duration
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Naval.jpg',
    category: 'Business',
    releaseDate: '2024-01-15'
  },
  // Chamath Palihapitiya tracks
  {
    id: '2',
    title: 'Deep Dive: Is India the Next Big Market?',
    description: 'Chamath discusses the potential of the Indian market and investment opportunities in emerging economies.',
    creator: getCreator('2'),
    duration: '0:00', // Will be updated with actual duration
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Chamath.jpg',
    category: 'Business',
    releaseDate: '2024-01-12'
  },
  // Daliana Liu tracks
  {
    id: '3',
    title: 'Data Scientists in FAANG: What They Actually Do',
    description: 'Daliana breaks down the day-to-day responsibilities and challenges of data scientists at major tech companies.',
    creator: getCreator('3'),
    duration: '0:00', // Will be updated with actual duration
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2024-01-10'
  },
  // Tristan Handy tracks
  {
    id: '4',
    title: 'Reflections and Predictions',
    description: 'Most recently, I\'m the founder of dbt Labs, co-creator of dbt, and pioneer of the analytics engineering workflow.',
    creator: getCreator('4'),
    duration: '0:00', // Will be updated with actual duration
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2024-01-08'
  },
  {
    id: '5',
    title: 'It is time to take agentic workflows for data work seriously',
    description: 'Exploring how AI agents can revolutionize data workflows and analytics engineering practices.',
    creator: getCreator('4'),
    duration: '0:00', // Will be updated with actual duration
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2024-01-05'
  },
  // Jason Ganz tracks (using Tristan's creator for collaboration)
  {
    id: '6',
    title: 'A New Kind of Weird',
    description: 'Jason Ganz explores the unconventional approaches to data science and analytics engineering.',
    creator: getCreator('12'),
    duration: '16:45',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Jason Ganz.jpg',
    category: 'Data Science',
    releaseDate: '2024-01-03'
  },
  {
    id: '7',
    title: 'How AI will Disrupt BI As We Know It',
    description: 'A deep dive into how artificial intelligence is transforming business intelligence and analytics.',
    creator: getCreator('4'),
    duration: '25:45',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2024-01-01'
  },
  {
    id: '8',
    title: 'Data tales from across the multiverse',
    description: 'Jason Ganz takes us on a journey through different data universes and analytical approaches.',
    creator: getCreator('12'),
    duration: '21:20',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Jason Ganz.jpg',
    category: 'Data Science',
    releaseDate: '2023-12-30'
  },
  {
    id: '9',
    title: 'The space between data dogmatism and data nihilism',
    description: 'Finding the balanced approach to data science between extreme positions.',
    creator: getCreator('4'),
    duration: '18:35',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2023-12-28'
  },
  {
    id: '10',
    title: 'Analytics Personas',
    description: 'Understanding different types of analytics professionals and their unique approaches to data.',
    creator: getCreator('4'),
    duration: '17:15',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2023-12-25'
  },
  {
    id: '11',
    title: 'Optimism and "Green Shoots"',
    description: 'Exploring positive trends and emerging opportunities in the analytics engineering space.',
    creator: getCreator('4'),
    duration: '14:50',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Tristan Handy.jpg',
    category: 'Data Science',
    releaseDate: '2023-12-22'
  },
  {
    id: '12',
    title: 'Dispatches from the frontiers',
    description: 'Jason Ganz reports from the cutting edge of data science and analytics innovation.',
    creator: getCreator('12'),
    duration: '20:30',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Jason Ganz.jpg',
    category: 'Data Science',
    releaseDate: '2023-12-20'
  },
  // Allan John tracks
  {
    id: '13',
    title: 'Staying True to Yourself (Even When It Costs You)',
    description: 'Practical philosophy to help you learn from the past, plan for the future, and live in the present.',
    creator: getCreator('5'),
    duration: '16:20',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Allan John.png',
    category: 'Psychology',
    releaseDate: '2023-12-18'
  },
  {
    id: '14',
    title: 'Micro Morning Meditation: We Are Not Disturbed By Events',
    description: 'A stoic approach to morning meditation and finding peace in daily challenges.',
    creator: getCreator('5'),
    duration: '8:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Allan John.png',
    category: 'Psychology',
    releaseDate: '2023-12-15'
  },
  {
    id: '15',
    title: 'Stoicism for Today\'s Creative, Resilient Life',
    description: 'How ancient stoic principles can guide modern creative and resilient living.',
    creator: getCreator('5'),
    duration: '19:45',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Allan John.png',
    category: 'Psychology',
    releaseDate: '2023-12-12'
  },
  {
    id: '16',
    title: 'A Stoic Approach to Easing Anxiety',
    description: 'Using stoic philosophy to manage anxiety and find inner peace in turbulent times.',
    creator: getCreator('5'),
    duration: '15:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Allan John.png',
    category: 'Psychology',
    releaseDate: '2023-12-10'
  },
  // John Cutler tracks
  {
    id: '17',
    title: 'TBM 369: Sources Of Truth',
    description: 'Exploring how product teams can establish reliable sources of truth for better decision making.',
    creator: getCreator('6'),
    duration: '21:10',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-12-08'
  },
  {
    id: '18',
    title: 'TBM 368: Goals Take Practice',
    description: 'Why setting and achieving meaningful goals in product development requires continuous practice.',
    creator: getCreator('6'),
    duration: '18:35',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-12-05'
  },
  {
    id: '19',
    title: 'TBM 367: The Wicked "Big Picture" Loop',
    description: 'Understanding the complex feedback loops in product strategy and big picture thinking.',
    creator: getCreator('6'),
    duration: '23:20',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-12-03'
  },
  {
    id: '20',
    title: 'TBM 366: Empowered For Delivery, But...',
    description: 'The challenges of empowering teams for delivery while maintaining strategic alignment.',
    creator: getCreator('6'),
    duration: '19:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-12-01'
  },
  {
    id: '21',
    title: 'A Cagan Critique',
    description: 'Critical analysis of popular product management frameworks and methodologies.',
    creator: getCreator('6'),
    duration: '26:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-28'
  },
  {
    id: '22',
    title: 'TBM 365: The Problem With Value Hierarchies (Video)',
    description: 'Why traditional value hierarchies in product management can be problematic.',
    creator: getCreator('6'),
    duration: '22:50',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-25'
  },
  {
    id: '23',
    title: 'TBM 364: Three Team Vibes',
    description: 'Understanding different team dynamics and how they impact product development.',
    creator: getCreator('6'),
    duration: '17:30',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-22'
  },
  {
    id: '24',
    title: 'TBM 363: Is Matt A Loser?',
    description: 'A case study in product management decision-making and team dynamics.',
    creator: getCreator('6'),
    duration: '20:15',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-20'
  },
  {
    id: '25',
    title: 'TBM 362: How (And Why) We Help',
    description: 'The philosophy and practice of helping in product management and team leadership.',
    creator: getCreator('6'),
    duration: '18:45',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-18'
  },
  {
    id: '26',
    title: 'TBM 361: Context, Collaboration, Intent, and Investment',
    description: 'The four pillars of effective product management and team collaboration.',
    creator: getCreator('6'),
    duration: '24:20',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/John Cutler.jpg',
    category: 'Product Management',
    releaseDate: '2023-11-15'
  },
  // Richard Chappell tracks
  {
    id: '27',
    title: 'How to Save the World',
    description: 'Exploring effective altruism and how to maximize your positive impact on the world.',
    creator: getCreator('7'),
    duration: '24:50',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2025-07-22'
  },
  {
    id: '28',
    title: 'Diversity, Merit, and Distrust',
    description: 'A philosophical examination of diversity initiatives and their relationship to merit-based selection.',
    creator: getCreator('7'),
    duration: '20:15',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2025-07-18'
  },
  {
    id: '29',
    title: 'Autonomy Consequentialism',
    description: 'Exploring the intersection of autonomy and consequentialist moral theory.',
    creator: getCreator('7'),
    duration: '22:30',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2025-07-14'
  },
  {
    id: '30',
    title: 'Vibe Bias',
    description: 'How correlational reasoning and social perceptions can bias our judgment of ideas.',
    creator: getCreator('7'),
    duration: '18:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2025-07-11'
  },
  {
    id: '31',
    title: 'Discussing ethical altruism and consequentialism vs. deontology',
    description: 'A deep dive into the fundamental differences between consequentialist and deontological ethics.',
    creator: getCreator('7'),
    duration: '26:15',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2024-01-07'
  },
  {
    id: '32',
    title: 'What\'s Wrong with Collaboration?',
    description: 'Examining the potential downsides and limitations of collaborative approaches.',
    creator: getCreator('7'),
    duration: '19:25',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2025-07-08'
  },
  {
    id: '33',
    title: 'The Costs of Permission',
    description: 'Exploring the hidden costs and implications of permission-based systems in society.',
    creator: getCreator('7'),
    duration: '21:50',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2022-05-05'
  },
  {
    id: '34',
    title: 'Death by Metaphysics',
    description: 'How abstract philosophical debates can have real-world consequences.',
    creator: getCreator('7'),
    duration: '17:35',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2022-05-05'
  },
  {
    id: '35',
    title: 'Limiting Reason',
    description: 'The boundaries and limitations of rational decision-making in complex scenarios.',
    creator: getCreator('7'),
    duration: '23:10',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2022-05-05'
  },
  {
    id: '36',
    title: 'Moral Theories Lack Confidence',
    description: 'Why moral theories should be more humble about their claims and implications.',
    creator: getCreator('7'),
    duration: '20:45',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2022-05-05'
  },
  {
    id: '37',
    title: 'The View from Everywhere',
    description: 'Exploring radical theories of perception and consciousness in philosophy of mind.',
    creator: getCreator('7'),
    duration: '25:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Richard Chappell.jpg',
    category: 'Psychology',
    releaseDate: '2022-05-05'
  },
  // Ethan Mollick tracks
  {
    id: '38',
    title: 'Against "Brain Damage"',
    description: 'How AI can enhance collective intelligence rather than diminish individual thinking capabilities.',
    creator: getCreator('8'),
    duration: '17:40',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-07-07'
  },
  {
    id: '39',
    title: 'Using AI Right Now: A Quick Guide',
    description: 'Practical advice for leveraging AI tools effectively in your current workflow.',
    creator: getCreator('8'),
    duration: '14:25',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-06-23'
  },
  {
    id: '40',
    title: 'The recent history of AI in 32 otters',
    description: 'A creative and engaging overview of AI development through the lens of otter imagery.',
    creator: getCreator('8'),
    duration: '21:15',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-06-01'
  },
  {
    id: '41',
    title: 'Making AI Work: Leadership, Lab, and Crowd',
    description: 'Three approaches to successfully implementing AI in organizations and teams.',
    creator: getCreator('8'),
    duration: '28:30',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-05-22'
  },
  {
    id: '42',
    title: 'Personality and Persuasion',
    description: 'How AI systems can be more persuasive than humans when given personal information.',
    creator: getCreator('8'),
    duration: '19:45',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-05-01'
  },
  {
    id: '43',
    title: 'On Jagged AGI: o3, Gemini 2.5, and everything after',
    description: 'Exploring the uneven capabilities of advanced AI systems and what comes next.',
    creator: getCreator('8'),
    duration: '26:20',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-04-20'
  },
  {
    id: '44',
    title: 'No elephants: Breakthroughs in image generation',
    description: 'Recent advances in AI image generation and their implications for creative work.',
    creator: getCreator('8'),
    duration: '18:55',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_06_53_Seasoned Entrepreneur_pvc_sp100_s50_sb75_se45_b_m2.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-03-30'
  },
  {
    id: '45',
    title: 'The Cybernetic Teammate',
    description: 'How AI can function as an effective teammate in collaborative work environments.',
    creator: getCreator('8'),
    duration: '22:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-03-22'
  },
  {
    id: '46',
    title: 'Speaking things into existence',
    description: 'The power of AI code generation and how it\'s changing software development.',
    creator: getCreator('8'),
    duration: '16:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2025-03-11'
  },
  {
    id: '47',
    title: 'A new generation of AIs: Claude 3.7 and Grok 3',
    description: 'Analysis of the latest AI models and what they tell us about the future of AI.',
    creator: getCreator('8'),
    duration: '24:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2022-11-08'
  },
  {
    id: '48',
    title: 'The End of Search, The Beginning of Research',
    description: 'How AI research agents are transforming the way we find and process information.',
    creator: getCreator('8'),
    duration: '20:50',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Ethan Mollick.jpg',
    category: 'Business',
    releaseDate: '2022-11-08'
  },
  // Rachel Karten tracks
  {
    id: '49',
    title: 'The business of brand trips',
    description: 'How brands can create authentic experiences that resonate with audiences through strategic partnerships.',
    creator: getCreator('9'),
    duration: '19:55',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2025-07-31'
  },
  {
    id: '50',
    title: 'Why Arthur finally posted the fist meme',
    description: 'A case study in brand social media strategy and the decision to embrace viral content.',
    creator: getCreator('9'),
    duration: '15:20',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2025-07-24'
  },
  {
    id: '51',
    title: 'How Zohran Mamdani drove over 20K clicks from Instagram DMs',
    description: 'Innovative social media strategies using Instagram chatbots for political engagement.',
    creator: getCreator('9'),
    duration: '18:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2025-07-10'
  },
  {
    id: '52',
    title: '10 storytelling tips from 10 years at Disney',
    description: 'Lessons learned from a decade of storytelling at one of the world\'s most beloved brands.',
    creator: getCreator('9'),
    duration: '23:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2025-07-03'
  },
  {
    id: '53',
    title: 'My favorite account is a library in Ohio',
    description: 'How a local library became a social media sensation through authentic community engagement.',
    creator: getCreator('9'),
    duration: '16:45',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  {
    id: '54',
    title: 'The ABCs of Notion\'s B2C2B influencer strategy',
    description: 'How Notion built a successful influencer program targeting both consumers and businesses.',
    creator: getCreator('9'),
    duration: '21:25',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  {
    id: '55',
    title: 'The gear social marketers recommend',
    description: 'Essential tools and equipment recommendations from experienced social media professionals.',
    creator: getCreator('9'),
    duration: '14:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  {
    id: '56',
    title: 'How Craighill Got 45M Video Views In Five Months',
    description: 'The viral video strategy that transformed a small brand into a social media phenomenon.',
    creator: getCreator('9'),
    duration: '22:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  {
    id: '57',
    title: 'How to grow a brand YouTube channel',
    description: 'Comprehensive strategies for building a successful brand presence on YouTube.',
    creator: getCreator('9'),
    duration: '27:40',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  {
    id: '58',
    title: 'The Agency Helping Progressive Candidates Break Through Online',
    description: 'How political campaigns are using innovative digital strategies to reach voters.',
    creator: getCreator('9'),
    duration: '20:35',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Rachel Karten.jpg',
    category: 'Marketing',
    releaseDate: '2021-02-03'
  },
  // Michael Howell tracks
  {
    id: '59',
    title: 'The Geopolitical Dollar & China\'s Currency Ambitions',
    description: 'Analysis of the dollar\'s strength and its impact on global rivals, particularly China\'s currency strategy.',
    creator: getCreator('10'),
    duration: '28:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2025-07-25'
  },
  {
    id: '60',
    title: 'Crescendo',
    description: 'Understanding the building momentum in global financial markets and monetary policy.',
    creator: getCreator('10'),
    duration: '23:45',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2025-07-16'
  },
  {
    id: '61',
    title: 'How To Value Modern Assets',
    description: 'A framework for understanding asset valuation in the current monetary environment.',
    creator: getCreator('10'),
    duration: '26:40',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2023-05-02'
  },
  {
    id: '62',
    title: '\'Yellen-omics\' & $4500/oz Gold Bullion',
    description: 'Analysis of Janet Yellen\'s economic policies and their impact on gold prices.',
    creator: getCreator('10'),
    duration: '24:20',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2023-05-02'
  },
  {
    id: '63',
    title: 'What Drives Bitcoin: Money Or Liquidity?',
    description: 'Examining the fundamental drivers behind Bitcoin\'s price movements and adoption.',
    creator: getCreator('10'),
    duration: '21:55',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2023-05-02'
  },
  {
    id: '64',
    title: 'Economic Risks, Faster Inflation…Rising Asset Prices?',
    description: 'The paradox of rising asset prices amid economic uncertainty and inflation concerns.',
    creator: getCreator('10'),
    duration: '19:30',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2023-05-02'
  },
  {
    id: '65',
    title: 'Future Prospects For Global Liquidity',
    description: 'Analyzing the key drivers of global liquidity and their future implications.',
    creator: getCreator('10'),
    duration: '25:15',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Michael Howell.jpg',
    category: 'Finance',
    releaseDate: '2023-05-02'
  },
  // Arbitrage Andy tracks
  {
    id: '66',
    title: 'They Are Telling You What Comes Next',
    description: 'Market analysis covering Federal Reserve policy, crypto regulation, and emerging economic trends.',
    creator: getCreator('11'),
    duration: '22:20',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2025-07-31'
  },
  {
    id: '67',
    title: 'Tesla\'s Robot Waiters, Silver at $39, and America\'s Culture',
    description: 'Weekly market roundup covering tech innovations, precious metals, and cultural shifts affecting markets.',
    creator: getCreator('11'),
    duration: '25:10',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2025-07-24'
  },
  {
    id: '68',
    title: 'Don\'t Get Caught Shorting',
    description: 'Risk management strategies and market timing considerations for short positions.',
    creator: getCreator('11'),
    duration: '18:45',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '69',
    title: 'Microsoft Cuts 9,000, Alligator Alcatraz',
    description: 'Analysis of corporate layoffs and their broader economic implications.',
    creator: getCreator('11'),
    duration: '20:30',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '70',
    title: 'United States of What, Exactly?',
    description: 'Examining the cultural and economic implications of demographic and policy changes.',
    creator: getCreator('11'),
    duration: '27:15',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '71',
    title: 'US Airstrikes, Crypto Stamina, MIT Brain Warning',
    description: 'Geopolitical events and their impact on cryptocurrency markets and technology sectors.',
    creator: getCreator('11'),
    duration: '23:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_06_53_Seasoned Entrepreneur_pvc_sp100_s50_sb75_se45_b_m2.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '72',
    title: 'When Things Go Kinetic',
    description: 'Analysis of military conflicts and their immediate impact on global financial markets.',
    creator: getCreator('11'),
    duration: '21:25',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '73',
    title: 'CCP Terror Plot, Mercenaries in Haiti',
    description: 'Geopolitical risks and their implications for international markets and security.',
    creator: getCreator('11'),
    duration: '24:50',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '74',
    title: 'Russia\'s Pearl Harbor Moment',
    description: 'Historical parallels and their relevance to current geopolitical and economic situations.',
    creator: getCreator('11'),
    duration: '26:35',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  {
    id: '75',
    title: 'Did Markets Get The Green Light to Rip?',
    description: 'Market sentiment analysis and the factors driving recent bullish momentum.',
    creator: getCreator('11'),
    duration: '19:20',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Arbitrage Andy.jpg',
    category: 'Finance',
    releaseDate: '2021-03-07'
  },
  // Additional Daliana Liu tracks
  {
    id: '76',
    title: '7 Principles That Separate Great Data Scientists From The Rest',
    description: 'Key principles that distinguish exceptional data scientists from the average practitioner.',
    creator: getCreator('3'),
    duration: '20:45',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2024-11-01'
  },
  {
    id: '77',
    title: 'The real difference between academia vs industry',
    description: 'An ex-Uber researcher explains the key differences between academic and industry data science roles.',
    creator: getCreator('3'),
    duration: '18:30',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-10-23'
  },
  {
    id: '78',
    title: 'How a "side project" helped fast-track my promotion at Amazon',
    description: 'The story of how an internal newsletter became a career accelerator at a major tech company.',
    creator: getCreator('3'),
    duration: '16:40',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-10-04'
  },
  {
    id: '79',
    title: 'Is product data scientist a glorified data analyst role?',
    description: 'Examining the role and responsibilities of product data scientists in modern tech companies.',
    creator: getCreator('3'),
    duration: '17:25',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-09-24'
  },
  {
    id: '80',
    title: 'Three ridiculous biases in A/B testing',
    description: 'Common pitfalls and biases that can invalidate your A/B testing results.',
    creator: getCreator('3'),
    duration: '15:50',
    audioUrl: getAudioUrl('Chamath Palihapitiya - Deep Dive: Is India the Next Big Market.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-08-29'
  },
  {
    id: '81',
    title: 'Behind the scenes of my first computer vision project',
    description: 'Lessons learned from leading a computer vision project as a first-time team lead.',
    creator: getCreator('3'),
    duration: '22:15',
    audioUrl: getAudioUrl('ElevenLabs_2025-07-31T18_49_18_Professional Speaker, Coach, Podcast Host_pvc_sp102_s35_sb68_se48_b_m2.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-08-07'
  },
  {
    id: '82',
    title: 'You won\'t be a great data scientist... until you do these 3 things',
    description: 'Three essential practices that separate good data scientists from great ones.',
    creator: getCreator('3'),
    duration: '18:20',
    audioUrl: getAudioUrl('Naval Ravikant - Insights on Wealth Creation.mp3'),
    coverImage: '/images/creators/Daliana.jpg',
    category: 'Data Science',
    releaseDate: '2023-02-19'
  }
];