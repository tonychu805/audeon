# Deployment & Environment Guide

**For:** Production deployment and environment management  
**Updated:** 2025-09-07

## Environment Configuration

### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Admin Operations (Development/Seeding Only)
SUPABASE_SERVICE_KEY=your_service_key  # NEVER commit this
```

### Environment Files

```bash
# Development
.env                    # Local development
.env.example           # Template file (commit this)

# Production
.env.production        # Production variables
.env.staging          # Staging variables
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Option 2: Netlify

```bash
# Build command: npm run build
# Publish directory: dist

# Environment variables in Netlify dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### Option 3: Static Hosting

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - GitHub Pages
# - AWS S3 + CloudFront
# - Firebase Hosting
```

## Database Setup

### Supabase Project Setup

1. **Create Project** at supabase.com
2. **Get Credentials** from Settings → API
3. **Apply Migrations** via dashboard or CLI
4. **Seed Data** using service key script

### Migration Commands

```bash
# Apply schema
supabase db push

# Seed data
npm run tsx src/scripts/seedWithServiceKey.ts
```

## Build Process

### Production Build

```bash
npm run build
```

**Output:** `dist/` directory with optimized static files

### Build Verification

```bash
# Preview production build locally
npm run preview

# Check bundle size
npm run build -- --analyze
```

## Performance Optimization

### Vite Configuration

Already optimized in `vite.config.ts`:
- Code splitting
- Asset optimization  
- Modern browser targets

### Supabase Optimization

- RLS policies for security
- Indexes on foreign keys
- Connection pooling (automatic)

## Monitoring & Analytics

### Error Monitoring

Add to `src/main.tsx`:
```javascript
// Sentry, LogRocket, etc.
```

### Performance Monitoring

```javascript
// Web Vitals, Analytics
```

## Security Checklist

- [ ] Environment variables secured (no service key in frontend)
- [ ] HTTPS enabled in production
- [ ] CSP headers configured
- [ ] Supabase RLS policies active
- [ ] No console.log in production build

## Troubleshooting

### Common Issues

**Build Fails**
- Check TypeScript errors: `npm run build`
- Verify environment variables are set

**Database Connection Issues**
- Verify Supabase URL and key
- Check RLS policies
- Confirm database is seeded

**White Screen in Production**
- Check browser console for errors
- Verify assets are loading correctly
- Check async data loading

### Debug Commands

```bash
# Check environment
echo $VITE_SUPABASE_URL

# Test database connection
curl -H "apikey: $VITE_SUPABASE_ANON_KEY" $VITE_SUPABASE_URL/rest/v1/audio_tracks

# Check build output
npm run build && ls -la dist/
```