# 📝 CHANGELOG

All notable changes to StudyPilot AI will be documented here.

Format: `[VERSION] - DATE - Description`

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
