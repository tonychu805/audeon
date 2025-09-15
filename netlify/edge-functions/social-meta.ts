import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration
const SUPABASE_URL = Deno.env.get('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('VITE_SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TrackData {
  track_id: number;
  title: string;
  audio_url: string;
  summary?: string;
  full_content?: string;
  release_date?: string;
  duration?: string;
  main_image_url?: string;
  creators?: { name: string } | null;
}

// Check if request is from a social media crawler
function isSocialCrawler(userAgent: string): boolean {
  const crawlers = [
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'slackbot',
    'whatsapp',
    'telegrambot'
  ];
  
  return crawlers.some(crawler => 
    userAgent.toLowerCase().includes(crawler)
  );
}

// Fetch track data from Supabase
async function getTrackData(trackId: string): Promise<TrackData | null> {
  try {
    const { data, error } = await supabase
      .from('audio_tracks')
      .select(`
        track_id,
        title,
        audio_url,
        summary,
        full_content,
        release_date,
        duration,
        main_image_url,
        creators:creator_id(name)
      `)
      .eq('track_id', parseInt(trackId))
      .single();

    if (error || !data) {
      console.error('Error fetching track:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Database query failed:', error);
    return null;
  }
}

// Generate HTML with dynamic meta tags
function generateHTML(track: TrackData, trackId: string, baseUrl: string): string {
  const trackUrl = `${baseUrl}/tracks/${trackId}`;
  const description = track.summary || track.full_content || `Listen to ${track.title} by ${track.creators?.name || 'Unknown'}`;
  const imageUrl = track.main_image_url || `${baseUrl}/default-cover.jpg`;
  const creatorName = track.creators?.name || 'Unknown';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Dynamic Meta Tags -->
  <title>${track.title} - ${creatorName} | Audeon</title>
  <meta name="description" content="${description.substring(0, 160)}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="music.song" />
  <meta property="og:url" content="${trackUrl}" />
  <meta property="og:title" content="${track.title} - ${creatorName}" />
  <meta property="og:description" content="${description.substring(0, 160)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:site_name" content="Audeon" />
  <meta property="og:audio" content="${track.audio_url}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${trackUrl}" />
  <meta name="twitter:title" content="${track.title} - ${creatorName}" />
  <meta name="twitter:description" content="${description.substring(0, 160)}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- Music specific -->
  <meta property="music:duration" content="${track.duration || '0:00'}" />
  <meta property="music:musician" content="${creatorName}" />
  <meta property="music:release_date" content="${track.release_date || ''}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if this is a track route
  const trackMatch = url.pathname.match(/^\/tracks\/(\d+)$/);
  
  // If not a social crawler or not a track route, pass through
  if (!isSocialCrawler(userAgent) || !trackMatch) {
    return context.next();
  }

  const trackId = trackMatch[1];
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch track data
    const track = await getTrackData(trackId);
    
    if (!track) {
      // Track not found, return 404 with basic HTML
      return new Response(
        '<!DOCTYPE html><html><head><title>Track not found</title></head><body><h1>Track not found</h1></body></html>',
        {
          status: 404,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // Generate HTML with dynamic meta tags
    const html = generateHTML(track, trackId, baseUrl);

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return context.next();
  }
};