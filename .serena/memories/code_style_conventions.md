# Audeon Code Style & Conventions

## TypeScript Conventions
- **Strict TypeScript**: All files use TypeScript with proper typing
- **Interface Definitions**: Clear interfaces in `src/types/index.ts`
- **Explicit Return Types**: Functions include return type annotations
- **No Any Types**: Avoid `any`, use proper typing or `unknown`

## React Conventions  
- **Functional Components**: All components use function declarations with FC typing
- **Custom Hooks**: Start with `use` prefix (useAudioTracks, useAudioDurations)
- **Props Interface**: Each component has explicit props interface
- **Default Exports**: Components use default exports with named functions

## File Organization
- **PascalCase**: Component files (CreatorProfilePage.tsx)
- **camelCase**: Utility files (audioUtils.ts, uploadAudio.ts) 
- **Index Files**: Central exports from types/index.ts
- **Colocation**: Related utilities grouped in folders

## CSS/Styling
- **TailwindCSS**: Utility-first CSS classes
- **Responsive Design**: Mobile-first approach
- **Component Scoping**: Styles defined within components
- **Semantic Classes**: Meaningful class combinations

## Naming Conventions
- **Variables**: camelCase (currentTrack, isPlaying)
- **Constants**: UPPER_SNAKE_CASE or camelCase for exports
- **Functions**: camelCase with descriptive names
- **Components**: PascalCase
- **Types/Interfaces**: PascalCase

## Import Organization
```typescript
// External libraries first
import React from 'react';
import { someLib } from 'library';

// Internal imports
import { Component } from '../components';
import { useHook } from '../hooks';
import { type } from '../types';
```

## ESLint Configuration
- TypeScript ESLint recommended rules
- React hooks rules enforcement  
- React refresh plugin for development
- ES2020 target with browser globals