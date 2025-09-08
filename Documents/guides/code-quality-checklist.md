# Code Quality Checklist

**Version:** 1.0  
**Updated:** 2025-09-08  
**Author:** Claude Code  
**Status:** Current  

## Changelog
- v1.0 (2025-09-08): Extracted from MVP code review, updated for current standards

## Pre-Commit Quality Gates

### 🔍 Repository Hygiene
- [ ] **Clean Git Status**: No uncommitted changes mixed with staged files
- [ ] **Feature Branch**: Never work directly on main/master
- [ ] **Meaningful Commits**: Descriptive commit messages, not "fix", "update", "changes"
- [ ] **No Large Files**: Audio, video, images properly managed (use CDN/external storage)
- [ ] **Proper .gitignore**: No build artifacts, node_modules, or sensitive files committed

### 🏗️ Architecture Standards
- [ ] **Single Responsibility**: Each component/function has one clear purpose
- [ ] **No Redundant Code**: Remove duplicate implementations and unused abstractions
- [ ] **Clear Interfaces**: TypeScript interfaces define all component props and data structures
- [ ] **Modular Structure**: Components are composable and reusable
- [ ] **Service Layer**: Database operations through dedicated service files

### ⚡ Code Quality
- [ ] **No TODO Comments**: All implementations complete, no placeholder comments
- [ ] **Error Handling**: Proper try/catch blocks and user-friendly error messages  
- [ ] **Type Safety**: No `any` types, strict TypeScript configuration
- [ ] **Consistent Patterns**: Follow established project conventions
- [ ] **Performance**: No unnecessary re-renders, optimized data loading

### 🧪 Testing Standards
- [ ] **Lint Pass**: `npm run lint` must pass without errors
- [ ] **Build Success**: `npm run build` completes successfully
- [ ] **Type Check**: TypeScript compilation without errors
- [ ] **Manual Testing**: Core functionality tested in browser
- [ ] **Responsive Design**: Mobile-first design verified on multiple screen sizes

### 🔒 Security & Environment
- [ ] **Environment Variables**: No hardcoded secrets or API keys
- [ ] **Production Ready**: Build optimized and deployable
- [ ] **Database Security**: RLS policies configured properly
- [ ] **Input Validation**: All user inputs properly sanitized

## Code Review Questions

### Functionality
- Does this code solve the actual problem?
- Are edge cases handled appropriately?
- Is the user experience intuitive?

### Maintainability  
- Can another developer easily understand this code?
- Are naming conventions clear and consistent?
- Is the code self-documenting?

### Architecture
- Does this fit with existing patterns?
- Are dependencies properly managed?
- Is the component/function properly scoped?

### Performance
- Are there any obvious performance bottlenecks?
- Is data loading optimized?
- Are re-renders minimized?

## Common Anti-Patterns to Avoid

### ❌ Bad Practices
```typescript
// Avoid: TODO comments in production
function authenticate() {
  // TODO: implement proper auth
  return true;
}

// Avoid: Any types
function processData(data: any): any {
  return data.whatever;
}

// Avoid: Hardcoded values
const API_URL = "https://myapp.supabase.co";
```

### ✅ Good Practices  
```typescript
// Good: Complete implementation
function authenticate(token: string): Promise<AuthResult> {
  return authService.validateToken(token);
}

// Good: Proper typing
interface ProcessDataInput {
  id: string;
  name: string;
}

function processData(data: ProcessDataInput): ProcessedResult {
  return { processedId: data.id, displayName: data.name };
}

// Good: Environment variables
const API_URL = process.env.VITE_SUPABASE_URL;
```

## Linus-Style Review Criteria

**"Good Taste" Principles:**
- Reduce edge cases → turn special cases into regular cases
- Simplify condition-heavy code → single straightforward paths
- Minimize abstractions → only abstract what provides real value

**Never Break Userspace:**
- Backward compatibility is sacred
- Changes should enhance, not break existing functionality
- User-facing behavior should remain consistent

**Ruthless Pragmatism:**
- Remove unnecessary complexity
- Focus on maintainable, practical solutions
- Code should serve users, not impress other developers

---

**Use this checklist before every commit and code review to maintain consistent quality standards.**