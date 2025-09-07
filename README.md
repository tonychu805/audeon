# Audeon

Audio streaming platform built with React, TypeScript, and Supabase.

## Features

- 🎵 **Audio Streaming** - Play tracks with HTML5 audio player
- 👨‍🎨 **Creator Profiles** - Browse content creators and their tracks
- 📚 **Content Library** - Organized by communities and categories
- 💾 **Save Tracks** - Personal library functionality
- 📱 **Mobile-First** - Responsive design with bottom navigation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Audio**: HTML5 with custom controls
- **Icons**: Lucide React

## Quick Start

```bash
# Install
npm install

# Environment setup
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## Project Structure

```
src/
├── components/    # UI components
├── pages/         # Main views
├── context/       # React Context (audio player)
├── services/      # Database layer
├── hooks/         # Custom React hooks
└── types/         # TypeScript interfaces
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Code quality check

See [Development Workflow](./Documents/Development_Workflow.md) for detailed guidelines.

## Database

Supabase PostgreSQL with:
- Communities (6 platforms)
- Creators (9 profiles) 
- Audio Tracks (11 tracks)

See [Database Schema](./Documents/Database_Schema.md) for complete details.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Submit pull request

## License

MIT
