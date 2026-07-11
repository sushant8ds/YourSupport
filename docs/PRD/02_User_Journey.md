# 👤 02 — User Journey

## Primary User: "Ambitious but Overwhelmed"

**Name**: Any person with their own goals — a student, a freelancer, an entrepreneur, a professional.
**Situation**: Has multiple things they want to accomplish each day. Life keeps interrupting.
**Pain**: Plans their day every morning, but one interruption destroys everything. Ends up feeling guilty and unproductive.

> **Key insight**: YourPilot does NOT know what their tasks are. The user brings their own life to the app.

---

## 🗺️ Complete User Journey (MVP)

```
DAY 1 — FIRST OPEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Splash Screen
  ↓
Onboarding (2 questions only)
  → "When do you wake up?" → user picks time
  → "When do you sleep?"   → user picks time
  ↓
Signup (Google or Email)
  ↓
Empty Dashboard
  → "No tasks yet. Add your first task."
  → + Add Task button (prominent)
  ↓
User Creates Their Own Tasks
  → They type whatever matters to them
  → They set duration, priority, flexibility
  → App learns nothing about WHAT the tasks are
  ↓
AI Generates Daily Plan
  → "Here's your plan for today!"
  → Plan is based purely on user's task data
  ↓
Home Dashboard
  → Sees their own tasks scheduled
  → Progress bar: 0%
  → "Start [first task]" button


TYPICAL DAY — NORMAL FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Morning: Opens app → Sees today's plan (all user-created tasks)
  ↓
Taps "Start [Task Name]"
  ↓
Timer starts (countdown set to their estimated duration)
  ↓
Works for their planned time
  ↓
Finishes → Marks complete → +XP animation 🎉
  ↓
Moves to next task automatically
  ↓
End of day: "X/Y tasks done! 🔥 Streak: N days"
  → All X and Y numbers = user's own tasks


INTERRUPTION DAY — THE WOW MOMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Something comes up → User taps "I got interrupted"
  ↓
"How much time did you lose?" → user inputs time
  ↓
AI Replan screen:
  "No worries. Here's your new plan:"
  ✓ [Their Task A] — Kept (it's Priority 1)
  ✂ [Their Task B] — Reduced by 30 min
  📅 [Their Task C] — Moved to tomorrow (flexible)
  ❌ [Their Task D] — Dropped today (lowest priority)
  ↓
User taps "Looks good" or adjusts manually
  ↓
Continues with updated plan
  ↓
End of day: "You handled a tough day. Still got your top priority done. +XP"


STREAKS & MOMENTUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 7:  "🔥 7-day streak! Whatever you're working on — keep going."
Day 30: "🏆 30-day consistency badge unlocked!"
```

---

## Emotional Journey

| Moment | Without YourPilot | With YourPilot |
|---|---|---|
| Plan falls apart | 😣 Guilty, defeated | 💪 "AI has a new plan" |
| Missed a task | 😔 Broken streak | 😌 "Recovery mode — just do 1 thing" |
| Completed a day | 😑 Moved on | 🎉 XP, streak, celebration |
| Opened app | 😰 "What do I do today?" | 😊 "AI already planned it" |
| Adding tasks | 😑 Forced into preset categories | 😊 "I can add anything I want" |
