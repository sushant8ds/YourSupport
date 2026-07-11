# 📝 CHANGELOG

All notable changes to StudyPilot AI will be documented here.

Format: `[VERSION] - DATE - Description`

---

## [0.0.8] — July 12, 2026 — Full Local MVP Frontend Implementation

### Added
- Local auth bypass in `backend/src/middleware/auth.ts` to skip Clerk and use a seeded DB user (`dev_user_1`) for rapid local testing.
- Created `backend/prisma/seed.ts` and successfully seeded `dev_user_1`.
- Built out `AppLayout` with a sticky header and mobile-first bottom navigation bar.
- Implemented `PlanDay.tsx` for adding tasks and generating daily plans via the Pilot Engine.
- Implemented `Home.tsx` (Dashboard) for displaying the active "Up Next" task and the full daily flight path.
- Implemented `DecisionMode.tsx` with a timer selection grid hitting the engine's decision-mode endpoint.
- Implemented `Timer.tsx` for the active focus session UI, including a progress ring and state managed by Zustand.
- Manually created shadcn UI components (`Button`, `Card`, `Input`) to circumvent Node v18 CLI limitations.

---

## [0.0.7] — July 12, 2026 — Frontend Setup

### Added
- Complete React + TypeScript skeleton in `/frontend` using Vite
- Configured Tailwind CSS, shadcn/ui, and generic CSS variables
- Integrated `@tanstack/react-query`, `zustand`, `react-router-dom`
- Added `@clerk/clerk-react` Provider wrapper
- Set up absolute path aliases (`@/*` and `@shared/*`)

---

## [0.0.6] — July 12, 2026 — Task CRUD API

### Added
- Completed endpoints for Task CRUD mapping `/api/tasks` (`getTasks`, `createTask`, `updateTask`, `deleteTask`)
- Full Zod schema validation for task creation and updates
- Verified TypeScript compilation for newly added modules

---

## [0.0.5] — July 12, 2026 — Database Connected & Neon Setup

### Added
- Real Neon PostgreSQL integration (`DATABASE_URL` configured in `backend/.env`)
- Successful push of `prisma/schema.prisma` to database using `prisma db push`
- Generated TypeScript Prisma Client for application models

---

## [0.0.4] — July 12, 2026 — Tech Stack Locked + Project Skeleton

### Added
- `docs/Architecture/Tech_Stack.md` — full tech stack with rationale for every choice
- `docs/Architecture/Folder_Structure.md` — complete folder map with naming conventions
- `shared/types/index.ts` — all TypeScript types shared between frontend and backend
- `.github/workflows/frontend-ci.yml` — GitHub Actions: type check + lint + build on PR
- `.github/workflows/backend-ci.yml` — GitHub Actions: type check + lint + build on PR
- `design/` folder — mockups, tokens, brand assets
- `shared/` folder — cross-stack shared types

### Tech Stack Locked
- **Frontend**: React + TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Router
- **Backend**: Node.js + Express + TypeScript, Prisma ORM
- **Database**: PostgreSQL hosted on Neon
- **Auth**: Clerk (replaces Firebase Auth)
- **Hosting**: Vercel (FE) + Railway (BE)
- **V2 Mobile**: React Native
- **One language**: TypeScript everywhere

### Design Decisions
- Prisma ORM over raw SQL — type-safe queries, AI-friendly
- shadcn/ui over MUI/Chakra — owned components, Tailwind-native
- Zustand over Redux — 1KB, zero boilerplate, enough for this app
- Clerk over Firebase Auth — better DX, one-tap Google built-in
- Neon over Supabase — serverless Postgres with great free tier

---

## [0.0.3] — July 12, 2026 — Product Philosophy Upgrade

### Changed
- Engine renamed: `Dynamic Scheduler` → **Pilot Engine** (internal) / **"Plan Again"** (user-facing)
- Tagline updated: `"Life Changes. Your Plan Should Too."` → **`"Stop deciding. Start doing."`**
- Positioning updated: human-first headline, technical subtitle
- Onboarding simplified: 5+ steps → **2 steps** (Start → Google Login → Dashboard)
- Task creation UX: Priority/Flexibility technical terms → **Stars + YES/NO plain language**
- Primary reward system: XP → **Identity System** (Explorer → Consistent → Focused → Reliable → Unbreakable)

### Added
- `docs/PRD/03_Design_Decisions.md` — 11 locked product decisions
- **Decision Mode**: time-based task recommendation (15/30/60/120 min)
- **⚡ Life Happened** formalized as the signature feature
- Predictive engine design documented for V2
- Honest Tech principle: "We don't call it AI if it isn't AI"
- New company value: "Remove Decisions" — every feature must reduce what user has to think

### Design Decisions Locked
- Home screen answers ONE question: `"What should I do right now?"`
- Task name is never read by the algorithm (name-blindness)
- No preset tasks, no suggested tasks, no default categories — ever
- No guilt language anywhere in the product
- V3 LLM integration announced clearly when it happens

---

## [0.0.2] — July 12, 2026

### Changed
- **App renamed**: `StudyPilot AI` → `YourPilot`
- **Core Design Principle added**: App is 100% user-defined — no preset tasks, no default categories, no template tasks
- Updated README, ROADMAP, MVP, Core Algorithm, and all PRD docs to reflect new name and philosophy
- Algorithm spec updated to be truly task-name-blind (only duration, priority, flexibility matter)

### Design Decisions
- Removed any reference to specific task types (study, gym, etc.) from all documentation
- Added "Name-blindness" rule to the algorithm: treat all tasks identically regardless of what they're called
- Added to MVP anti-patterns: never suggest tasks, never show preset categories

---

## [0.0.1] — July 11, 2026 — Planning Phase

### Added
- Project folder structure initialized
- README.md with vision and tech stack
- ROADMAP.md with V1/V2/V3 feature breakdown
- MVP.md with 14-day build scope
- docs/PRD/ folder with all planning documents
- Core Algorithm design for Dynamic Scheduler
- User Journey mapping complete
- Executive Summary drafted

---

*This file will be updated with every meaningful change to the product.*
