# 🎯 YourPilot — MVP Definition

> **The MVP Question**: If Google said "You have 14 days to build this" — what exactly would we build?

---

## The Golden Rule for MVP

> Ship the ONE thing that makes people say *"Oh wow, I've never seen a productivity app do this before."*

That one thing = **Dynamic Scheduler** (AI Replanning when life happens)

And the second rule: **The user defines everything. Zero hardcoded tasks, zero preset categories, zero assumptions.**

---

## ✅ MVP Screens (14-Day Build)

### Screen 1: Splash / Onboarding (1 screen)
- App name + tagline
- "Life Changes. Your Plan Should Too."
- Get Started button

### Screen 2: Login / Signup (1 screen)
- Email login
- Google login
- Forgot password link

### Screen 3: Onboarding Questions (1 screen)
- "When do you usually wake up?"
- "When do you sleep?"
- That's it — **no asking about goals or work type** (user will add their own tasks)

### Screen 4: Home / Dashboard (1 screen — the most important)
- Today's date + greeting
- Daily Mission summary (AI-generated from USER's own tasks)
- Progress bar (e.g., "2/5 tasks done" — all tasks user-created)
- Current XP + streak counter
- "What should I do now?" button
- If no tasks yet → prompt: "Add your first task to get started"

### Screen 5: Task List (1 screen)
- List of all user-created tasks for today
- Each card: Name (user-set), Duration (user-set), Priority (user-set), Status
- **Empty state**: "No tasks yet. Add one below." — never show example tasks
- + Add Task button (prominent)

### Screen 6: Create / Edit Task (1 screen)
- Task name — **free text, user types anything they want**
- Estimated duration — user picks
- Priority — user picks 1-4 (or High/Medium/Low/Optional)
- Flexible? — user picks Yes/No
  - Yes = AI can defer this to tomorrow
  - No = AI must keep it today
- Optional note — free text
- **No category dropdown, no preset types** — user names their own tasks freely

### Screen 7: Timer (1 screen — second most important)
- Task name at top (exactly as user typed it)
- Big countdown clock
- Start / Pause / Stop buttons
- **"I got interrupted" button** → triggers AI replan
- Progress ring animation

### Screen 8: AI Replan Screen (1 screen — the WOW screen)
- "Life happened. Let me replan your day."
- Shows: What changed and why — based only on user's tasks and their priorities
- Accept / Modify buttons
- Always positive, recovery-focused tone

### Screen 9: Daily Progress / End of Day (1 screen)
- X/Y tasks completed (all user-created tasks)
- Time focused
- XP earned today
- Streak counter
- Tomorrow's preview (top tasks from user's backlog)

### Screen 10: Profile / Stats (1 screen)
- Total XP
- Streak
- Tasks completed this week
- Simple weekly bar chart

---

## 🚫 What's NOT in MVP

### Features to skip:
- ❌ AI Coach (V2)
- ❌ GPS verification (V2)
- ❌ Social features (V3)
- ❌ Voice input (V3)
- ❌ Calendar sync (V3)
- ❌ Reports & analytics (V2)
- ❌ Friends / Challenges (V3)

### Anti-patterns to NEVER build:
- ❌ **Preset task templates** — user starts fresh, always
- ❌ **Suggested tasks** — we don't know what they should work on
- ❌ **Default categories** (Study / Work / Health) — user can create their own labels if needed
- ❌ **Daily task limits** — user decides how much they take on
- ❌ **Productivity scores** — we don't judge, we just help

---

## 📊 MVP Success Metrics

After launch, MVP is a **success** if:
1. User opens the app **3+ days in a row** after install
2. User creates **at least 3 tasks on their own** without guidance
3. User uses the **"I got interrupted" button** at least once
4. User says *"The replan was actually helpful"*
5. At least **70% of users complete at least 1 task** in their first session

---

## 🛠️ MVP Tech Decisions

| Decision | Choice | Why |
|---|---|---|
| Frontend | React (Web) | Faster to build than native app |
| Styling | Tailwind CSS | Fast, consistent UI |
| Backend | Node.js + Express | Simple, fast APIs |
| Database | PostgreSQL | Reliable for relational data |
| Auth | Firebase Auth | Zero setup, trusted |
| AI Engine | Custom algorithm (V1) | Full control + no API cost |
| Hosting | Vercel + Railway | Free tier sufficient for MVP |

> **Note on AI**: For MVP, the Dynamic Scheduler is a **pure algorithm** (no LLM). We add real AI/LLM in V2 for the coaching layer.

---

*Last Updated: July 2026*
