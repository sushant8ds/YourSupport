# 🏗️ Tech Stack — YourPilot

> **The Rule**: One language everywhere. That language is **TypeScript**.
> Frontend → TypeScript. Backend → TypeScript. Types shared across both. Less switching, faster development, better AI-generated code.

---

## ⭐ Final Stack (Locked)

| Layer | Technology | Why |
|---|---|---|
| Frontend Framework | React + TypeScript | Industry standard, huge community, great AI support |
| Styling | Tailwind CSS | Faster than Bootstrap, cleaner, pairs perfectly with shadcn |
| UI Components | shadcn/ui | Beautiful components you own and can customize — not a dependency |
| State Management | Zustand | Tiny, simple, no boilerplate — enough for this app |
| API / Data Fetching | TanStack Query (React Query) | Handles loading, caching, refreshing automatically |
| Routing | React Router | Standard React navigation |
| Backend Runtime | Node.js | Fast, TypeScript-native |
| Backend Framework | Express.js | Simple, stable, AI writes it well |
| ORM | Prisma | Clean schema, great TypeScript support, AI understands it perfectly |
| Database | PostgreSQL | Relational data fits perfectly (users → tasks → sessions → rewards) |
| Auth | Clerk | Better DX than Firebase Auth, one-tap Google built-in |
| Frontend Hosting | Vercel | Free tier, instant deploys |
| Backend Hosting | Railway | Simple, reliable |
| Database Hosting | Neon PostgreSQL | Amazing free tier, serverless Postgres |
| Charts | Recharts | Simple, React-native charting |
| AI V1 | Custom Algorithm (Pilot Engine) | No API cost, full control, honest |
| AI V2+ | OpenAI / Gemini / Claude | Decide when we get there |
| Mobile V2 | React Native | Same TypeScript knowledge, same codebase patterns |
| File Storage (V2) | Cloudinary | If users upload photos for task verification |
| Notifications (V2) | Firebase Cloud Messaging | Push notifications |
| Monitoring (V2) | Sentry | Error tracking when we go live |

---

## 🧠 Why These Specific Choices

### React + TypeScript (not Vue, not Next.js, not Svelte)
- Industry standard for hiring
- Massive community + ecosystem
- AI tools trained on more React code than anything else
- TypeScript adds types = fewer bugs = faster debugging

### Tailwind CSS (not Bootstrap, not styled-components)
- Zero opinion on design — you control everything
- Utility classes = faster iteration
- Works perfectly with shadcn/ui
- Bootstrap's class names are memorizable but limiting

### shadcn/ui (not MUI, not Chakra)
- You **own the components** — they're copied into your project, not a black-box dependency
- Built on Radix UI (accessible by default)
- Styled with Tailwind — perfect fit
- Beautiful out of the box, fully customizable

### Zustand (not Redux, not Context API)
- Redux is overkill for this app
- Context API causes unnecessary re-renders
- Zustand is 1KB, dead simple, TypeScript-first

### TanStack Query (not Axios alone, not SWR)
- Handles caching automatically (don't re-fetch what you already have)
- Handles loading and error states automatically
- Handles background refresh automatically
- Works beautifully with TypeScript

### Prisma (not raw SQL, not TypeORM)
- Schema-first: define data model → Prisma generates types
- Type-safe queries — catch errors at compile time, not runtime
- Auto-generates TypeScript types for all models
- AI writes Prisma code very well

### PostgreSQL (not MongoDB)
- Our data IS relational: Users → Tasks → Sessions → Rewards → Statistics
- SQL is more powerful for analytics queries (future reports feature)
- MongoDB's flexibility is a liability when your schema is well-defined
- Neon gives us serverless Postgres with a great free tier

### Clerk (not Firebase Auth)
- One-tap Google login is native, polished
- Pre-built UI components (not custom forms)
- User management dashboard out of the box
- Webhooks for syncing user data to our DB
- Better developer experience than Firebase Auth

---

## 📊 The Data Relationships (Why PostgreSQL Makes Sense)

```
User
 └── Tasks (many)
      └── Sessions (many per task)
           └── Session Events (pause, resume, interrupt)
 └── DailyPlan (one per day)
 └── Rewards (many)
 └── IdentityStage (current stage)
 └── Statistics (aggregated per week/month)
```

This is a **relational model**. SQL handles joins like this naturally. MongoDB would require manual denormalization and repeated data.

---

## 🗓️ Version Timeline

| Version | New Tech Added |
|---|---|
| V1 (MVP) | React, TS, Tailwind, shadcn, Zustand, React Query, Node, Express, Prisma, Postgres, Clerk, Vercel, Railway, Neon |
| V2 (Smart) | OpenAI/Gemini API, Sentry, Firebase Cloud Messaging |
| V2 (Mobile) | React Native (reuse business logic from V1) |
| V3 (Storage) | Cloudinary (if photo verification added) |

---

## 🚫 What We're NOT Using (and Why)

| Rejected | Reason |
|---|---|
| MongoDB | Our data is relational — wrong tool |
| Redux | Overkill — Zustand is enough |
| Bootstrap | Old, opinionated, fights with custom design |
| Next.js | We don't need SSR for V1 — adds complexity |
| Python backend | One language = TypeScript everywhere |
| Firebase Firestore | SQL is better for our data model |
| MUI / Chakra UI | shadcn is cleaner and you own the code |

---

## 🔧 Development Environment

| Tool | Purpose |
|---|---|
| VS Code | Primary editor |
| ESLint + Prettier | Code quality and formatting |
| Husky | Pre-commit hooks (lint before push) |
| GitHub | Version control — every feature gets its own branch |
| Postman / Thunder Client | API testing |
| Prisma Studio | Visual database explorer |

### Git Branch Convention
```
main          → production-ready code only
dev           → development integration branch
feature/login
feature/task-creation
feature/timer
feature/pilot-engine
feature/decision-mode
feature/identity-system
```

---

## ⚡ Quick Commands (Reference)

```bash
# Frontend
cd frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint

# Backend
cd backend
npm run dev       # Start with hot reload (ts-node-dev)
npm run build     # Compile TypeScript
npm start         # Run compiled JS

# Database
npx prisma studio         # Visual DB explorer
npx prisma db push        # Push schema changes
npx prisma generate       # Regenerate Prisma client
npx prisma migrate dev    # Create migration
```

---

*Locked: July 2026 | Review at V2 planning*
