# Audeon Project Overview

## Purpose
Audeon is an audio streaming platform built for content creators and listeners. It allows users to browse content creators, play audio tracks, and maintain personal libraries. The platform focuses on community-driven content with organized categorization.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + PostCSS + Autoprefixer  
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context (PlayerContext)
- **Icons**: Lucide React, Hugeicons, React Icons (FontAwesome)
- **Audio**: HTML5 Audio API with custom controls
- **Build Tool**: Vite with React plugin
- **Package Manager**: npm

## Key Features
- Audio streaming with custom player controls
- Creator profiles with social media links
- Content organization by communities and categories
- Personal library/saved tracks functionality
- Mobile-first responsive design
- Bottom navigation pattern

## Architecture
Single Page Application (SPA) with:
- Component-based React architecture
- TypeScript for type safety
- Context API for global state (audio player)
- Custom hooks for data fetching
- Service layer for database operations
- Utility functions for audio processing