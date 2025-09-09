# Audeon Development Commands

## Development Workflow
```bash
# Start development server
npm run dev

# Build for production
npm run build  

# Preview production build
npm run preview

# Lint code
npm run lint
```

## macOS/Darwin Specific Commands
```bash
# Navigation
ls -la          # List files with details
cd <directory>  # Change directory
find . -name    # Find files by name
grep -r         # Search in files

# Git operations
git status      # Check repository status
git branch      # List branches
git log --oneline # Compact commit history

# Process management
ps aux | grep   # Find processes
kill -9 <pid>   # Force kill process

# Network
lsof -i :port   # Check port usage
netstat -an     # Network connections
```

## Database Commands (Supabase)
```bash
# Supabase CLI (if installed)
supabase start
supabase db reset
supabase migration up
```

## Project Specific
```bash
# Install dependencies
npm install

# Clean install
rm -rf node_modules package-lock.json && npm install

# Check TypeScript
npx tsc --noEmit

# Check bundle size
npm run build && du -sh dist/
```