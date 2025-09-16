# Repository Guidelines

## Project Structure & Module Organization
Core code lives in `src/`: UI in `components/` and `pages/`, providers in `context/`, Supabase calls in `services/`, helpers in `utils/`. Entry points are `main.tsx` and `routes.tsx`; static assets sit in `public/`. Docs live in `Documents/`, Playwright specs in `e2e/`, and Supabase artifacts in `migrations/` and `supabase/`.

## Build, Test, and Development Commands
`npm run dev` starts the Vite dev server. `npm run build` outputs `dist/`; `npm run preview` serves it. `npm run lint` must pass before merging. Use `npm run test` locally, `npm run test:run` in CI, `npm run test:coverage` for instrumentation, and `npm run test:e2e` or `npm run test:e2e:report` for Playwright.

## Coding Style & Naming Conventions
All code is TypeScript-first with `strict` flags; share types via `types/`. Use PascalCase for components (`CreatorCard.tsx`) and camelCase for hooks (`usePlayerState`). Keep Tailwind utility classes inline and overrides in `src/index.css`. ESLint (`eslint.config.js`) enforces Hooks rules and bans unused expressions—run it locally or in your editor. Use 2-space indentation and named exports for reusable modules.

## Testing Guidelines
Vitest with React Testing Library drives units; colocate specs in `__tests__/` and suffix `.test.tsx`. Shared mocks live in `src/test/`; stub Supabase calls for determinism. E2E scenarios in `e2e/` cover listening flows; config resides in `playwright.config.ts`. Validate accessibility via `npm run test:e2e` because @axe-core is prewired.

## Commit & Pull Request Guidelines
Adopt concise, imperative commit subjects (e.g., `Fix Supabase URL construction error`). Bundle related changes per commit and reference tickets in the body when applicable. Pull requests must summarize the change set, list testing (`npm run test:run`, `npm run test:e2e`), and attach UI screenshots. Link relevant `Documents/` files when workflows change.

## Code Analysis Practice
Before opening a PR, apply the Linus Torvalds persona from `Documents/Framework Guidelines/code-quality-checklist.md` and `~/.claude/CLAUDE.md`: collapse special cases, trim abstractions, guard "never break userspace," and note the arguments you will present in review.

## MCP Tooling
SuperClaude MCP helpers live outside the repo but integrate here. Serena’s catalog (`.serena/project.yml`) exposes automation staples like `execute_shell_command`, `replace_lines`, and review-oriented modes for bulk edits. Playwright MCP traces land in `.playwright-mcp/`; include relevant artifacts when reporting flaky scenarios.

## Environment & Configuration
Copy secrets into `.env` and align keys with Supabase settings in `supabase/config`. Keep migrations in sync by applying SQL in `migrations/` via the Supabase CLI. Netlify settings live in `netlify/` and `netlify.toml`; update them when adding environment variables or edge functions.
