# 🔒 03 — Design Decisions (Locked)

> These are non-negotiable product decisions. Before any feature is built, it must not violate these principles. If a new idea conflicts with a decision here — the new idea loses.

---

## Decision 1: This is NOT an AI App (Yet)

**Decision**: Do NOT call the engine "AI" in V1.

**Reason**: The V1 engine is a deterministic algorithm. Calling it AI is misleading. Users are tired of fake AI. It destroys trust.

**What to call it:**
- Internal / Engineering: **Pilot Engine**
- User-facing button: **"Plan Again"**
- Marketing copy: *"Smart scheduling that adapts to your day"*

**When do we call it AI?**
When we integrate an actual LLM (V2+). Not before.

---

## Decision 2: Onboarding = Minimum Friction

**Decision**: User should reach the dashboard in under 60 seconds.

**Old flow (rejected):**
Login → Signup → Wake Time → Sleep Time → Create Tasks → Priority → Duration → Flexibility → Dashboard

**Approved flow:**
```
Open App
  ↓
One button: "Start"
  ↓
Google Login (one tap)
  ↓
Dashboard (empty)
  ↓
One giant button: "+ Add Your First Task"
```

**Deferred to later:**
- Wake time / sleep time → ask on Day 2, or detect from usage patterns
- Goal type → ask in onboarding question 2 (see Decision 9)

---

## Decision 3: No Technical Language in Task Creation

**Decision**: Never use the words "Priority", "Flexibility", or "Duration" in the user interface.

**Approved UX for Create Task:**

| Field | Label | Input Type |
|---|---|---|
| Task name | *"What do you want to do?"* | Free text |
| Duration | *"How long will it take?"* | Time picker (15m, 30m, 1h, 2h, 3h, 4h+) |
| Importance | *"How important is this?"* | ⭐ ⭐⭐ ⭐⭐⭐ ⭐⭐⭐⭐ (tap stars) |
| Must finish today? | *"Must this get done today?"* | YES / NO toggle |

**Maps to internally:**
- Importance stars → Priority 1–4
- Must finish today? YES → `is_flexible: false`, NO → `is_flexible: true`

Users never see the internal model. They just answer questions they understand.

---

## Decision 4: ⚡ "Life Happened" is the Signature Feature

**Decision**: This button IS the product. It should be impossible to miss.

**Design rules for the "Life Happened" button:**
- Always visible on the home screen and timer screen
- Large enough to tap with one thumb
- Takes zero inputs initially (tap first, then asks "How much time did you lose?")
- Triggers the Pilot Engine replan immediately
- Shows the comparison view (old plan vs new plan)
- Uses warm, recovery-focused language — NEVER guilt language

**Marketing angle**: "One tap. New plan. No guilt."

**This button should be in every screenshot, every demo, every ad.**

---

## Decision 5: Home Screen Answers ONE Question

**Decision**: The home screen's sole purpose is to answer: *"What is the best thing I should do RIGHT NOW?"*

**What the home screen shows:**
1. The ONE task the user should start right now (big, prominent)
2. A "Start" button for that task
3. Secondary: progress for the day (small, below)

**What the home screen does NOT show:**
- A full task list (that's the Tasks tab)
- XP/Level prominently (that's the Profile tab)
- Settings, streaks, etc. (secondary screens)

**Key principle**: The moment you open the app, you should know what to do. Zero thinking required.

---

## Decision 6: Identity System Replaces XP as Primary Reward

**Decision**: XP stays (it's fun), but the PRIMARY reward is identity growth.

**Identity stages:**

| Stage | Trigger | Label |
|---|---|---|
| 1 | Week 1 | 🌱 **Explorer** |
| 2 | 3-week streak | 🔄 **Consistent** |
| 3 | Month 2 | 🎯 **Focused** |
| 4 | Month 4 | 🧱 **Reliable** |
| 5 | Month 6 | 🗿 **Unbreakable** |

**Why identity > XP:**
- People remember who they became, not how many points they earned
- Identity is emotional. XP is transactional.
- "I'm a Reliable person" is a story. "I have 5,420 XP" is a number.

**XP is still used** for:
- Leveling up within identity stages
- Small in-session dopamine hits (task completion animation)
- Leaderboard if social features added in V3

---

## Decision 7: Positioning — Human First, Technical Second

**Decision**: Never lead with "Adaptive Productivity Operating System" in marketing or onboarding.

**Approved positioning hierarchy:**

```
Headline (what normal people see first):
"Your personal companion that adapts when life changes."

Subheadline (for curious people):
"Adaptive Productivity OS — powered by the Pilot Engine."
```

**Why**: Normal users buy feelings, not features. Developers and press appreciate the technical depth below.

---

## Decision 8: Pilot Engine Must Be Predictive (V2), Not Just Reactive

**Decision**: V1 engine reacts. V2 engine predicts.

**V1 behavior** (Reactive):
- User presses "Life Happened"
- Engine replans remaining day

**V2 behavior** (Predictive):
```
Pattern detected: User skips "Task C" on Mondays 3 weeks in a row.

Pilot Engine:
"I noticed you usually skip this on Mondays.
Want me to move it to Tuesday evenings?"
```

**Other predictive patterns to detect in V2:**
- User consistently underestimates task duration → auto-suggest buffer
- User works best between 9–11 AM → schedule hard tasks in that window
- User always completes task A before task B → suggest pairing them
- User uses app less on weekends → don't push on weekends

---

## Decision 9: Onboarding Question — Intent Discovery

**Decision**: During onboarding, ask one emotional question.

**Question**: *"Why did you download YourPilot today?"*

**Options** (user picks one):
- 📚 Exams / Studying
- 💼 Work / Career
- 🏋️ Fitness / Health
- 🧠 Personal Growth
- ✅ Just getting things done
- 🌟 Something else

**Purpose**:
- NOT used to categorize tasks or suggest anything
- Used for: analytics, understanding our user base, personalizing empty state copy
- Example: User picks "Exams" → Empty state says "Add your first study task" instead of "Add your first task"
- User can skip this question with no consequence

---

## Decision 10: The Core Problem is Decision Fatigue

**Decision**: YourPilot's real job is to **remove the burden of deciding what to do next**, forever.

**This reframes every feature:**

| Before this decision | After this decision |
|---|---|
| "Add a timer feature" | "Remove the decision of when to stop" |
| "Add a task list" | "Remove the decision of what's important" |
| "Add AI replan" | "Remove the decision of what to do after interruption" |
| "Add notifications" | "Remove the decision of when to start" |

**Marketing headline that captures this:**
> *"Stop deciding. Start doing."*

**Every new feature must answer**: Does this reduce a decision the user currently has to make?
If no → don't build it.

---

## Decision 11: Decision Mode (Bonus Feature for MVP+)

**Decision**: Add a "Quick Pick" mode to the home screen.

**How it works:**
```
User opens app.
Taps "I have some time"

↓

How much time do you have?
[15 min]  [30 min]  [1 hour]  [2+ hours]

↓

User taps "30 min"

↓

Best thing to do right now:
[Their Task Name]
Estimated: 28 min
This fits perfectly.

[▶ Start]   [Show other options]
```

**Why this is magical:**
- User has 0 decisions to make
- App fills dead time with purposeful work
- Works even if user hasn't opened the app in days
- Perfect for "I have 20 minutes, what should I do?" moments

**Priority**: Include in V1 if possible, V2 if not.

---

*These decisions are locked. To change one, create a new document explaining why.*
*Last Updated: July 2026*
