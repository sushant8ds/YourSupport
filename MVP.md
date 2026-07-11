# 🎯 StudyPilot AI — MVP Definition

> **The MVP Question**: If Google said "You have 14 days to build this" — what exactly would we build?

---

## The Golden Rule for MVP

> Ship the ONE thing that makes people say *"Oh wow, I've never seen a productivity app do this before."*

That one thing = **Dynamic Scheduler** (AI Replanning when life happens)

Everything else is secondary.

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
- "What are your main goals?" (Study / Work / Health / All)

### Screen 4: Home / Dashboard (1 screen — the most important)
- Today's date
- Daily Mission summary (AI-generated)
- Progress bar (e.g., "3/6 tasks done")
- Current XP
- Streak counter
- "What should I do now?" button

### Screen 5: Task List (1 screen)
- List of all today's tasks
- Each task: Name, Duration, Priority, Status
- + Add Task button

### Screen 6: Create / Edit Task (1 screen)
- Task name
- Estimated duration
- Priority (1–4)
- Flexible? (Yes/No)
- Category (Study / Health / Work / Personal)

### Screen 7: Timer (1 screen — second most important)
- Task name at top
- Big countdown clock
- Start / Pause / Stop buttons
- "I got interrupted" button → triggers AI replan
- Progress ring animation

### Screen 8: AI Replan Screen (1 screen — the WOW screen)
- "Life happened. Let me replan your day."
- Shows: Original plan vs New plan
- Explains: "I moved Gym to tomorrow. DSA is still priority. Resume reduced to 1h."
- Accept / Modify buttons

### Screen 9: Daily Progress / End of Day (1 screen)
- Tasks completed: 4/6
- Time studied: 3h 45min
- XP earned today: +120 XP
- Streak: 🔥 7 days
- Tomorrow's preview (top 3 tasks)

### Screen 10: Profile / Stats (1 screen)
- Total XP
- Streak
- Tasks completed this week
- Simple weekly bar chart

---

## 🚫 What's NOT in MVP (Say No)

These are great ideas — but NOT for MVP:
- ❌ AI Coach (V2)
- ❌ GPS verification (V2)
- ❌ Social features (V3)
- ❌ Voice input (V3)
- ❌ Calendar sync (V3)
- ❌ Reports & analytics (V2)
- ❌ Friends / Challenges (V3)
- ❌ Notifications (polish later)

---

## 📊 MVP Success Metrics

After launch, we'll call MVP a **success** if:
1. User opens the app **3+ days in a row** after install
2. User uses the **"I got interrupted" button** at least once
3. User says *"The replan was actually helpful"*
4. At least **70% of users complete at least 1 task** in their first session

---

## 🛠️ MVP Tech Decisions

| Decision | Choice | Why |
|---|---|---|
| Frontend | React (Web) | Faster to build than native app |
| Styling | Tailwind CSS | Fast, consistent UI |
| Backend | Node.js + Express | Simple, fast APIs |
| Database | PostgreSQL | Reliable for relational data |
| Auth | Firebase Auth | Zero setup, trusted |
| AI Engine | Custom algorithm (V1) | Control + no API cost |
| Hosting | Vercel + Railway | Free tier sufficient for MVP |

> **Note on AI**: For MVP, we write the Dynamic Scheduler as a **pure algorithm** (no LLM cost). We add real AI/LLM later in V2.

---

*Last Updated: July 2026*
