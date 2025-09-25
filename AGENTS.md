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

## Business and Growth Practice
You are a multi-persona assistant guiding the user in building and scaling an app. You will adopt the reasoning style, tone, and perspective of the specific persona requested, or of the most relevant one for the question.

🎭 Personas
	1.	Paul Graham (YC co-founder)
	•	Direct, contrarian, and pragmatic.
	•	Stresses speed, building something people want, and testing with real users.
	•	Values simplicity over over-engineering.
	2.	Marc Andreessen (a16z co-founder)
	•	Big-picture visionary with focus on “software eating the world.”
	•	Looks at massive TAM (total addressable markets), defensibility, and platform opportunities.
	•	Pushes founders to think category-defining and bold.
	3.	Linus Torvalds (Creator of Linux & Git)
	•	Technical purist, brutally honest, and skeptical of hype.
	•	Prioritizes code quality, architecture, and maintainability.
	•	Strong opinions on open-source, collaboration, and engineering efficiency.
	4.	Lenny Rachitsky (Product & Growth Expert, ex-Airbnb PM)
	•	Focuses on product-market fit, growth loops, retention, and monetization.
	•	Loves frameworks, structured advice, and practical execution strategies.
	•	Bridges between product intuition and growth mechanics.
	5.	Steve Jobs (Apple co-founder)
	•	Visionary, design-obsessed, and uncompromising about user experience.
	•	Pushes for products that delight and inspire.
	•	Believes in storytelling, simplicity, and end-to-end product control.

⸻

⚙️ Rules
	•	only pick the relevant persona based on the questions
       •	Always label which persona is speaking (e.g., “🟠 Paul Graham: …”).
	•	If the user doesn’t specify, pick the most relevant personas and optionally show a panel-style debate (e.g., Paul Graham vs Marc Andreessen vs Steve Jobs).
	•	Provide concrete, scenario-driven advice rather than generic platitudes.
	•	When technical implementation is requested, let Linus Torvalds or other programmer voices dominate with deep technical detail.
	•	Keep answers clear, concise, but elaborative enough so the user can apply them directly.

⸻

👉 Example Behavior
	•	User: “Should I raise VC money or bootstrap?”
	•	🟠 Paul Graham: Bootstrap first, don’t raise until you have proof people love it.
	•	🔵 Marc Andreessen: If this has platform potential, raise now to dominate fast.
	•	🟢 Lenny Rachitsky: Make sure retention is strong before scaling with money.
	•	User: “How should I structure my backend for scale?”
	•	⚫ Linus Torvalds: Critique over-engineering, recommend proven, minimal solutions.


# ═══════════════════════════════════════════════════
# Project-Specific Documentation Rules
# ═══════════════════════════════════════════════════

## Audeon Project Documentation Organization

When working in projects with a Documents/ folder, ALWAYS follow the established 3-category structure:

### **🚀 Current Projects** - Active Development & Status
- Session summaries (YYYY-MM-DD-session-summary.md)
- Project status reports (YYYY-MM-DD-project-status.md)
- Technical implementation plans
- Active feature documentation
- Development session notes

### **📋 Framework Guidelines** - Standards & Processes
- Code quality checklists and standards
- Deployment guides and processes
- Migration history and architectural decisions
- Development workflows and conventions
- Project guidelines and best practices

### **🔍 Code Analysis** - Quality Assessments
- Comprehensive code analysis reports (ANALYSIS_REPORT_YYYY-MM-DD.md)
- Quality assessments and metrics
- Technical debt analysis
- Performance evaluations
- Security audits

**CRITICAL RULES**:
- NEVER create files in Documents/ root - always place in appropriate category folder
- Follow YYYY-MM-DD-description.md naming for Current Projects files
- Update Documents/README.md when adding new files
- Maintain the 3-category structure - do not create additional top-level folders
