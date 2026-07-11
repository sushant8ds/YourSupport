# 📁 Folder Structure — YourPilot

> Every folder exists for a reason. No "misc" or "stuff" folders. If you can't explain why a folder exists, it shouldn't exist.

---

## Top-Level Structure

```
YourPilot/                        ← Root / monorepo
├── frontend/                     ← React + TypeScript app
├── backend/                      ← Node.js + Express API
├── shared/                       ← Types and utils shared between frontend & backend
├── docs/                         ← All planning and architecture docs
├── database/                     ← Prisma schema, migrations, seed data
├── design/                       ← UI mockups, design tokens, wireframes
├── .github/                      ← GitHub Actions CI/CD workflows
├── README.md
├── ROADMAP.md
├── MVP.md
└── CHANGELOG.md
```

---

## Frontend Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/               ← Reusable UI components
│   │   ├── ui/                   ← shadcn/ui components (auto-generated, owned by us)
│   │   ├── layout/               ← Layout components (Navbar, Sidebar, etc.)
│   │   └── shared/               ← App-specific shared components
│   │
│   ├── pages/                    ← One file per screen
│   │   ├── Home.tsx              ← "What should I do right now?"
│   │   ├── Tasks.tsx             ← Task list
│   │   ├── CreateTask.tsx        ← Create / edit task
│   │   ├── Timer.tsx             ← Active timer screen
│   │   ├── PlanAgain.tsx         ← ⚡ Life Happened replan screen
│   │   ├── DecisionMode.tsx      ← Time-picker → best task
│   │   ├── EndOfDay.tsx          ← Daily summary
│   │   ├── Profile.tsx           ← Identity stage + stats
│   │   ├── Login.tsx             ← Auth screen
│   │   └── Onboarding.tsx        ← Intent question
│   │
│   ├── store/                    ← Zustand state stores
│   │   ├── taskStore.ts          ← Task state
│   │   ├── timerStore.ts         ← Active timer state
│   │   └── userStore.ts          ← User / identity state
│   │
│   ├── hooks/                    ← Custom React hooks
│   │   ├── useTasks.ts           ← TanStack Query hooks for tasks
│   │   ├── useTimer.ts           ← Timer logic hook
│   │   └── usePilotEngine.ts     ← Replan trigger hook
│   │
│   ├── api/                      ← API call functions (used by React Query)
│   │   ├── tasks.ts
│   │   ├── sessions.ts
│   │   └── scheduler.ts
│   │
│   ├── lib/                      ← Utility functions
│   │   ├── utils.ts              ← shadcn utils (cn function)
│   │   └── formatters.ts         ← Time, date, duration formatters
│   │
│   ├── types/                    ← Frontend-specific TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx                   ← Root component + React Router setup
│   ├── main.tsx                  ← Entry point
│   └── index.css                 ← Tailwind base + custom CSS vars
│
├── .env.local                    ← Local env vars (never commit)
├── .env.example                  ← Template for env vars (commit this)
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Backend Structure

```
backend/
├── src/
│   ├── routes/                   ← Express route definitions
│   │   ├── auth.ts               ← Auth endpoints (Clerk webhooks)
│   │   ├── tasks.ts              ← CRUD for tasks
│   │   ├── sessions.ts           ← Timer session endpoints
│   │   ├── scheduler.ts          ← Pilot Engine API endpoints
│   │   └── users.ts              ← User profile endpoints
│   │
│   ├── controllers/              ← Business logic (called by routes)
│   │   ├── taskController.ts
│   │   ├── sessionController.ts
│   │   ├── schedulerController.ts
│   │   └── userController.ts
│   │
│   ├── engine/                   ← The Pilot Engine (core algorithm)
│   │   ├── pilotEngine.ts        ← Main engine entry point
│   │   ├── planGenerator.ts      ← Phase 1: Generate daily plan
│   │   ├── replanner.ts          ← Phase 2: Plan Again (replan)
│   │   ├── nextTaskFinder.ts     ← Phase 3: What should I do now?
│   │   └── decisionMode.ts       ← Phase 4: Time-based recommendation
│   │
│   ├── middleware/               ← Express middleware
│   │   ├── auth.ts               ← Clerk JWT verification
│   │   ├── validation.ts         ← Request body validation
│   │   └── errorHandler.ts       ← Global error handler
│   │
│   ├── lib/                      ← Shared backend utilities
│   │   ├── prisma.ts             ← Prisma client singleton
│   │   └── logger.ts             ← Logging utility
│   │
│   ├── types/                    ← Backend-specific types
│   │   └── index.ts
│   │
│   └── index.ts                  ← Express app entry point
│
├── .env                          ← Backend env vars (never commit)
├── .env.example                  ← Template (commit this)
├── tsconfig.json
└── package.json
```

---

## Shared Structure

```
shared/                           ← Shared between frontend and backend
└── types/
    ├── task.ts                   ← Task type definitions
    ├── user.ts                   ← User type definitions
    ├── session.ts                ← Session type definitions
    ├── scheduler.ts              ← Pilot Engine input/output types
    └── index.ts                  ← Re-exports all types
```

> **Why shared/?** The Task type should be identical on frontend and backend. Define it once, import it in both places. No drift.

---

## Database Structure

```
database/
└── prisma/
    ├── schema.prisma             ← Single source of truth for data model
    ├── migrations/               ← Auto-generated migration files
    └── seed.ts                   ← Seed data for development
```

---

## Docs Structure

```
docs/
├── PRD/                          ← Product Requirements
│   ├── 01_Executive_Summary.md
│   ├── 02_User_Journey.md
│   ├── 03_Design_Decisions.md
│   └── Core_Algorithm.md
├── Architecture/
│   ├── Tech_Stack.md             ← This layer's decisions
│   ├── Folder_Structure.md       ← This file
│   ├── API_Design.md             ← REST API endpoints (to be written)
│   └── Database_Schema.md        ← Prisma schema explained (to be written)
├── UI/
│   └── Screen_Flows.md           ← Screen navigation map (to be written)
└── Research/
    └── Competitor_Analysis.md    ← (to be written)
```

---

## Design Structure

```
design/
├── mockups/                      ← AI-generated or Figma screen mockups
│   ├── 01_Home_Dashboard.png
│   ├── 02_AI_Replan.png
│   ├── 03_Timer.png
│   ├── 04_End_Of_Day.png
│   └── 05_Onboarding.png
├── tokens/                       ← Design system tokens (colors, spacing, type)
│   └── tokens.md
└── brand/                        ← Logo, icon, color palette
```

---

## GitHub Actions

```
.github/
└── workflows/
    ├── frontend-ci.yml           ← Lint, type-check, build on PR
    └── backend-ci.yml            ← Lint, type-check, build on PR
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | camelCase | `taskStore.ts`, `pilotEngine.ts` |
| Components | PascalCase | `TaskCard.tsx`, `TimerRing.tsx` |
| Folders | camelCase | `components/`, `hooks/` |
| API routes | kebab-case | `/api/plan-again`, `/api/tasks` |
| DB tables | snake_case | `task_sessions`, `daily_plans` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL`, `CLERK_SECRET_KEY` |
| Git branches | kebab-case | `feature/pilot-engine`, `fix/timer-bug` |

---

*Last Updated: July 2026*
