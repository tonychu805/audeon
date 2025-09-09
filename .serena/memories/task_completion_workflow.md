# Task Completion Workflow

## Pre-Development
1. **Environment Check**: Ensure `npm run dev` starts successfully
2. **Git Status**: Check current branch and working directory status
3. **Dependencies**: Verify all required packages are installed

## During Development  
1. **Type Safety**: Ensure TypeScript compilation without errors
2. **Component Testing**: Test components in browser during development
3. **Responsive Design**: Check mobile and desktop layouts
4. **Audio Functionality**: Test audio playback if modifying player

## Post-Development (Task Completion)
1. **Lint Check**: `npm run lint` - Fix all ESLint issues
2. **Type Check**: `npx tsc --noEmit` - Ensure no TypeScript errors
3. **Build Verification**: `npm run build` - Ensure production build succeeds
4. **Browser Testing**: Test functionality in development mode
5. **Git Operations**: Stage, commit with descriptive messages

## Quality Checks
- **No Console Logs**: Remove development console.log statements
- **Error Handling**: Proper try/catch blocks for async operations
- **Loading States**: UI feedback during data loading
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Performance**: Optimize large lists and heavy operations

## Common Issues to Check
- **Audio URLs**: Ensure audio files load correctly
- **Image Loading**: Handle missing images gracefully  
- **Database Connections**: Verify Supabase integration
- **TypeScript Errors**: No type errors in build
- **Mobile Layout**: Test on small screens

## Deployment Readiness
- Production build completes without warnings
- All environment variables properly configured
- No hardcoded development URLs
- Supabase configuration matches target environment