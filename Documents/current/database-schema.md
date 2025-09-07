# Database Schema & Migration Guide

**Version:** 2.1  
**Updated:** 2025-09-08  
**Author:** Claude Code  
**Status:** Current  
**Database:** Supabase PostgreSQL  

## Changelog
- v2.1 (2025-09-08): Documentation reorganization and cleanup
- v2.0 (2025-09-07): Added categories foreign key relationships
- v1.0 (2025-09-06): Initial database migration from mock data

## Schema Overview

```sql
communities (6 records)
├── id: uuid (PK)
├── name: text
├── logo: text
├── description: text
└── website: text

creators (9 records)
├── id: uuid (PK)
├── name: text
├── image: text
├── bio: text
├── category: text
├── follower_count: integer
└── community_id: uuid (FK → communities.id)

audio_tracks (11 records)
├── track_id: serial (PK)
├── title: text
├── url: text
├── audio_url: text
├── creator_id: uuid (FK → creators.id)
├── community_id: uuid (FK → communities.id)
├── category: text
├── sub_category: text[]
├── summary: text
├── release_date: date
├── full_content: text
├── read_time: text
├── main_image_*: text/integer (image metadata)
├── voices: jsonb
├── gender: text
├── audio_config: jsonb
└── created_at: timestamp
```

## Migration Files

Located in `supabase/migrations/`:

1. **20250907000001_create_schema.sql** - Core tables and RLS policies
2. **20250907000002_seed_data.sql** - Initial seed data
3. **20250907000003_seed_complete_data.sql** - Complete dataset (11 tracks)

## Environment Setup

### Required Variables (.env)
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # For seeding only
```

### Service Integration
- **File**: `src/services/database.ts`
- **Services**: `communityService`, `creatorService`, `trackService`
- **Pattern**: Async methods returning transformed data

## Data Access Patterns

### Frontend Data Flow
```javascript
// Hook pattern
const { tracks, isLoading } = useAudioTracks();

// Service pattern
const tracks = await trackService.getAll();
const track = await trackService.getById(trackId);
```

### Key Transformations
- `track_id` (DB) → `id` (Frontend)
- Snake_case (DB) → camelCase (Frontend)
- Default `duration: '0:00'` added dynamically

## Seeding Data

### Manual Seeding
```bash
# With service key in .env
npm run tsx src/scripts/seedWithServiceKey.ts
```

### Data Sources
- Communities: 6 predefined platforms
- Creators: 9 content creators across categories
- Tracks: 11 complete audio tracks with metadata

## RLS Policies

### Current Setup
- **Public Read Access**: All content tables readable without auth
- **Service Key Bypass**: For seeding and admin operations
- **Future Auth**: User-specific policies for saved tracks

### Security Notes
- Anon key: Read-only access to content
- Service key: Admin access (keep secure, use only for seeding)
- RLS enabled on all tables for future user features

## Common Operations

### Add New Track
1. Insert to `audio_tracks` table
2. Ensure `creator_id` and `community_id` exist
3. Frontend will auto-load via service layer

### Update Schema
1. Create new migration file: `supabase/migrations/[timestamp]_[description].sql`
2. Apply via Supabase dashboard or CLI
3. Update TypeScript interfaces in `src/types/`
4. Update service layer transformations in `src/services/database.ts`

### Troubleshooting
- **RLS Error 42501**: Use service key for admin operations
- **Foreign Key Error**: Ensure referenced IDs exist
- **Type Mismatch**: Check interface definitions match DB schema