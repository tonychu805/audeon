/**
 * Generate embeddings for audio tracks using OpenAI text-embedding-3-small
 *
 * Usage:
 *   npx tsx scripts/generate-embeddings.ts
 *
 * Required environment variables:
 *   - OPENAI_API_KEY: Your OpenAI API key
 *   - SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Service role key (not anon key) for write access
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { writeFileSync } from 'node:fs';

// Configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;
const BATCH_SIZE = 10; // Process tracks in batches to avoid rate limits

// Validate environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY environment variable');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ Missing SUPABASE_URL environment variable');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('   Note: You need the service role key, not the anon key');
  process.exit(1);
}

// Initialize Supabase with service role key for write access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface AudioTrack {
  track_id: number;
  title: string;
  summary: string | null;
  full_content: string | null;
  category: string | null;
  creator_name: string | null;
  embedding: number[] | null;
}

/**
 * Generate embedding using OpenAI API
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Build text content to embed from track data
 */
function buildEmbeddingText(track: AudioTrack): string {
  const parts: string[] = [];

  // Title is always included
  parts.push(track.title);

  // Add summary if available
  if (track.summary) {
    parts.push(track.summary);
  }

  // Add full content if available
  if (track.full_content) {
    parts.push(track.full_content);
  }

  // Add category
  if (track.category) {
    parts.push(`Category: ${track.category}`);
  }

  // Add creator
  if (track.creator_name) {
    parts.push(`Creator: ${track.creator_name}`);
  }

  return parts.join('\n\n');
}

/**
 * Fetch all tracks that need embeddings
 */
async function fetchTracksNeedingEmbeddings(): Promise<AudioTrack[]> {
  const { data, error } = await supabase
    .from('audio_tracks')
    .select(`
      track_id,
      title,
      summary,
      full_content,
      category,
      embedding,
      creators:creator_id(name)
    `)
    .is('embedding', null)
    .order('track_id');

  if (error) {
    throw new Error(`Failed to fetch tracks: ${error.message}`);
  }

  interface TrackWithCreator {
    track_id: number;
    title: string;
    summary: string | null;
    full_content: string | null;
    category: string | null;
    embedding: number[] | null;
    creators?: { name: string } | null;
  }

  return (data || []).map((track: TrackWithCreator) => ({
    track_id: track.track_id,
    title: track.title,
    summary: track.summary,
    full_content: track.full_content,
    category: track.category,
    creator_name: track.creators?.name || null,
    embedding: track.embedding,
  }));
}

// Store embeddings to be output as SQL
const pendingEmbeddings: { trackId: number; embedding: number[] }[] = [];

/**
 * Store embedding for later SQL output
 */
async function updateTrackEmbedding(trackId: number, embedding: number[]): Promise<void> {
  pendingEmbeddings.push({ trackId, embedding });
}

/**
 * Output all embeddings as SQL file
 */
function outputEmbeddingsAsSQL(): void {
  if (pendingEmbeddings.length === 0) return;

  const sqlStatements = pendingEmbeddings.map(({ trackId, embedding }) => {
    const embeddingString = `[${embedding.join(',')}]`;
    return `UPDATE audio_tracks SET embedding = '${embeddingString}'::vector(1536) WHERE track_id = ${trackId};`;
  }).join('\n');

  writeFileSync('embeddings.sql', sqlStatements);

  console.log('\n📄 SQL statements saved to: embeddings.sql');
  console.log('Run this file in Supabase SQL Editor to apply embeddings.\n');
}

/**
 * Process a batch of tracks
 */
async function processBatch(tracks: AudioTrack[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const track of tracks) {
    try {
      const text = buildEmbeddingText(track);
      const embedding = await generateEmbedding(text);
      await updateTrackEmbedding(track.track_id, embedding);
      success++;
      console.log(`  ✅ Track ${track.track_id}: "${track.title.substring(0, 50)}..."`);
    } catch (error) {
      failed++;
      console.error(`  ❌ Track ${track.track_id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { success, failed };
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting embedding generation for audio tracks\n');
  console.log(`📊 Configuration:`);
  console.log(`   Model: ${EMBEDDING_MODEL}`);
  console.log(`   Dimensions: ${EMBEDDING_DIMENSIONS}`);
  console.log(`   Batch size: ${BATCH_SIZE}\n`);

  // Fetch tracks needing embeddings
  console.log('📥 Fetching tracks without embeddings...');
  const tracks = await fetchTracksNeedingEmbeddings();

  if (tracks.length === 0) {
    console.log('✨ All tracks already have embeddings. Nothing to do!');
    return;
  }

  console.log(`📋 Found ${tracks.length} tracks needing embeddings\n`);

  // Process in batches
  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < tracks.length; i += BATCH_SIZE) {
    const batch = tracks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(tracks.length / BATCH_SIZE);

    console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} tracks):`);

    const { success, failed } = await processBatch(batch);
    totalSuccess += success;
    totalFailed += failed;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully processed: ${totalSuccess}`);
  console.log(`   ❌ Failed: ${totalFailed}`);
  console.log(`   📈 Total tracks: ${tracks.length}`);
  console.log('='.repeat(50));

  // Output SQL file with embeddings
  outputEmbeddingsAsSQL();
}

// Run the script
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
