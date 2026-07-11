# 🎯 YourPilot — MVP Definition

> **The 14-Day Question**: What do we build if we only had 14 days?

---

## The Two Rules for MVP

**Rule 1**: The ⚡ "Life Happened" button must exist and must work perfectly. That IS the product.

**Rule 2**: Every screen must reduce a decision the user has to make — not add one.

---

## ✅ MVP Screens

### Screen 1: Splash / Welcome (1 screen)
- App name: **YourPilot**
- Tagline: *"Stop deciding. Start doing."*
- One button: **"Start"** (no Login text, no Signup text — just "Start")

### Screen 2: Login (1 screen)
- **Google Login** (one tap — primary)
- Email option (secondary, smaller)
- Zero other content — no taglines, no feature lists
- After login → straight to dashboard

### Screen 3: Onboarding — Intent Question (1 screen, skippable)
- *"Why did you download YourPilot today?"*
- Options: 📚 Exams / Studying · 💼 Work / Career · 🏋️ Health & Fitness · 🧠 Personal Growth · ✅ Getting stuff done · 🌟 Something else
- Skip button visible — this is optional
- Purpose: personalizes empty state copy only. Nothing else.
- **Does NOT ask for wake time, sleep time, or goal type**

### Screen 4: Dashboard / Home (1 screen — the most important)

**Primary (above the fold):**
- *"What should you do right now?"*
- The ONE next task — large, prominent
- **▶ Start** button
- **⚡ Life Happened** button (always visible, always accessible)

**Secondary (below the fold / smaller):**
- Today's progress (e.g., "2 done · 3 remaining")
- Identity badge (e.g., 🌱 Explorer — Day 4)

**Empty state (no tasks yet):**
- *"What do you want to get done today?"*
- Giant **+ Add Task** button
- Nothing else — no tips, no examples, no suggestions

### Screen 5: Task List (1 screen)
- All user-created tasks for today
- Each card: Task name, duration, importance stars, status
- **+ Add Task** button
- Empty state: *"Nothing here yet. Add your first task."*
- Never shows example tasks or suggested tasks

### Screen 6: Create Task (1 screen — redesigned UX)

```
What do you want to do?
[ Free text input — user types anything ]

How long will it take?
[ 15 min ]  [ 30 min ]  [ 1h ]  [ 2h ]  [ 3h ]  [ 4h+ ]

How important is this?
  ⭐  ⭐⭐  ⭐⭐⭐  ⭐⭐⭐⭐

Must this get done today?
  [ YES ]  [ NO ]

[ Add Task ]
```

**What these map to internally:**
- ⭐ = Priority 4 · ⭐⭐ = Priority 3 · ⭐⭐⭐ = Priority 2 · ⭐⭐⭐⭐ = Priority 1
- YES = `is_flexible: false` · NO = `is_flexible: true`

**Words banned from this screen**: Priority, Flexibility, Duration, Schedule

### Screen 7: Timer (1 screen)
- Task name (exactly as user typed) — large, at top
- Big countdown timer — prominent
- **Pause** / **Stop** buttons
- **⚡ Life Happened** button — always visible here too (this is where users need it most)
- "Session started at [time]" in small gray text

### Screen 8: Plan Again / Replan (1 screen — THE WOW screen)

Triggered by: ⚡ Life Happened button

```
⚡ Life happened.
How much time did you lose?
[ 15 min ]  [ 30 min ]  [ 1h ]  [ 2h+ ]

──────────────────────────────
Before             After
──────────────────────────────
[Task A]  ⭐⭐⭐⭐  → ✓ Kept  (most important)
[Task B]  ⭐⭐⭐   → ✂ Shorter  (reduced by 30 min)
[Task C]  ⭐⭐    → 📅 Tomorrow  (flexible)
[Task D]  ⭐     → ❌ Today's done  (lowest)
──────────────────────────────
"You'll still finish what matters most. 💪"

[ ✓ Looks Good ]   [ Adjust ]
```

**Design rules:**
- Show importance stars (not priority numbers) — user's own language
- Always end with a positive, recovery-focused message
- "Adjust" option lets user drag/reorder if needed

### Screen 9: Decision Mode (1 screen — the magical feature)

Accessible via: "I have some time" button on home screen

```
How much time do you have?
[ 15 min ]  [ 30 min ]  [ 1 hour ]  [ 2+ hours ]

        ↓  (user taps 30 min)

Best thing to do right now:
╔══════════════════════════╗
║  [Their Task Name]       ║
║  ⭐⭐⭐  •  Fits in 28 min ║
╚══════════════════════════╝

[ ▶ Start ]   [ Show other options ]
```

### Screen 10: End of Day / Daily Summary (1 screen)
- Tasks done: X of Y
- Time focused: Xh Ym
- Identity: *"Day 12. You're building something real."*
- Identity badge progress bar (toward next stage)
- Tomorrow preview: top 2 tasks from backlog
- **[ See you tomorrow ]** button

### Screen 11: Profile / Identity (1 screen)
- Current identity stage: 🌱 Explorer → 🔄 Consistent → 🎯 Focused → 🧱 Reliable → 🗿 Unbreakable
- Days active / streak
- Tasks completed this week (simple bar chart)
- XP (shown here, not on home screen)

---

## 🚫 What's NOT in MVP

### Features:
- ❌ AI Coach (V2)
- ❌ Pattern detection / predictions (V2)
- ❌ GPS / photo verification (V2)
- ❌ Calendar sync (V3)
- ❌ Friends / social (V3)
- ❌ Voice input (V3)

### Anti-patterns (never build these):
- ❌ Preset task suggestions or templates
- ❌ "Suggested tasks" based on intent from onboarding
- ❌ Default categories (Study/Work/Health)
- ❌ Asking for wake/sleep time during onboarding
- ❌ XP as the primary reward on the home screen
- ❌ Any negative or guilt-inducing language
- ❌ Calling it AI when it's an algorithm

---

## 📊 MVP Success Metrics

MVP is a success if, after first week of live users:
1. **70%** of users add at least 1 task in their first session
2. **At least 1 user per day** presses ⚡ Life Happened
3. **40%** open the app 3+ days in a row after install
4. **0** users complain "I didn't understand what to do"
5. **At least 5 users** say something like *"the replan was actually helpful"*

---

## 🛠️ Tech Decisions

| Decision | Choice | Why |
|---|---|---|
| Platform | React Web (PWA) | Fastest to build + works on all devices |
| Styling | Tailwind CSS | Consistent, fast |
| Backend | Node.js + Express | Simple REST API |
| Database | PostgreSQL | Task/user relational data fits perfectly |
| Auth | Firebase Auth | One-tap Google login |
| Scheduling Engine | Custom algorithm | Full control, no API cost, honest |
| Hosting | Vercel + Railway | Free tier, deploy in minutes |

---

*Last Updated: July 2026*
