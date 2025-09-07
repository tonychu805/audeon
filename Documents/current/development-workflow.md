# Development Workflow

**Version:** 1.2  
**Updated:** 2025-09-08  
**Author:** Claude Code  
**Status:** Current  

**For:** Long-term Audeon development

## Changelog
- v1.2 (2025-09-08): Added session context and active issues tracking
- v1.1 (2025-09-07): Added Linear integration workflow
- v1.0 (2025-09-07): Initial development workflow documentation

## Quick Start

```bash
# Clone and setup
git clone [repo]
cd audeon
npm install

# Environment setup
cp .env.example .env
# Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY

# Development
npm run dev          # Start dev server
npm run lint         # Check code quality
npm run build        # Production build
```

## Development Standards

### Git Workflow
```bash
# Feature development
git checkout -b feature/[description]
git add . && git commit -m "feat: [description]"
git push origin feature/[description]
```

### Code Quality Gates
1. **Pre-commit**: `npm run lint` must pass
2. **Pre-push**: `npm run build` must succeed
3. **Database changes**: Test with seed data first

### Database Changes
```bash
# Test schema changes
npm run db:migrate
npm run db:seed

# Verify in Supabase dashboard
# Then commit migration files
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React Context (PlayerContext)
├── hooks/         # Custom hooks (useAudioTracks)
├── pages/         # Main views (HomePage, ExplorePage)
├── services/      # Database services (database.ts)
├── types/         # TypeScript interfaces
└── utils/         # Helper functions
```

## Key Integration Points

### Database Service Layer
- **File**: `src/services/database.ts`
- **Pattern**: Service objects with async methods
- **Usage**: Import service, call async methods in hooks

### State Management
- **Global**: PlayerContext for audio state
- **Local**: useState/useEffect in components
- **Async Data**: Custom hooks (useAudioTracks)

### Navigation
- **Pattern**: State-based routing in App.tsx
- **Props**: Callback functions for navigation
- **No router**: Manual state management

## Common Issues & Solutions

### White Screen
- Check browser console for errors
- Verify async data loading in hooks
- Ensure database service returns expected format

### Database Connectivity
- Verify `.env` variables are set
- Check Supabase dashboard for data
- Test with `npm run db:seed`

### Type Errors
- Update interfaces in `src/types/`
- Check database service return types
- Run `npm run build` to catch issues

## Current Session Context

### Active Issues (Created 2025-09-08)
- **AUD-9**: Audio player not functioning (High priority)
- **AUD-16**: Track metadata display issues (High priority)  
- **AUD-17**: Navigation white screens (High priority)

### Session Continuity
- **Status File**: Check `Documents/Session_Status.md` for current progress
- **Database**: Live Supabase connection with seeded data
- **Environment**: All variables configured, dev server ready
- **Branch**: Working on `main` (AUD-11 successfully merged)

## Linear Integration Workflow

### Issue Management Protocol
- **Always ask permission** before creating Linear issues
- **Reference issues** when working: "Working on AUD-X" 
- **Confirm completion** before marking issues Done
- **User controls Linear** - Claude executes technical work

### Bug Discovery Process
1. Identify bug during development/testing
2. Ask: "Should I create a Linear issue for [problem]?"
3. Wait for approval before creating
4. Focus on current task unless redirected

### Task Flow
- New bugs found → Ask about Linear issues
- Complex tasks → Reference Linear issue number
- Task complete → "Ready to mark AUD-X as Done?"

## Production Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No console errors in dev server