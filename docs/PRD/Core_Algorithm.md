# 🧠 Pilot Engine — Core Algorithm

> **This is the company.** Everything else can change. This stays.
>
> To engineers: it's the **Pilot Engine**.
> To users: it's just **"Plan Again"**.
> We do NOT call it AI in V1. It is a deterministic scheduling algorithm. Honest tech only.

---

## Feature Spec

| Field | Details |
|---|---|
| **Feature Name** | Pilot Engine |
| **User-Facing Name** | "Plan Again" |
| **Version** | 1.0 (Pure Algorithm — No LLM) |
| **Priority** | CRITICAL — Build first, everything else second |
| **Status** | Designing |

---

## The One Question This Engine Answers

> **"What is the best thing you should do right now?"**

Everything the Pilot Engine does flows from this question.

---

## Core Principle: Task-Name-Blindness

The Pilot Engine **never reads task names**. It only operates on:

| Data | Set by |
|---|---|
| `duration_minutes` | User |
| `importance` (1–4 stars) | User |
| `must_finish_today` (bool) | User |
| `status` (pending/done/in_progress) | System |

A task named "Water plants" is treated identically to "Prepare for surgery". The engine doesn't judge what the task is — only what the user said about it.

---

## Inputs

```json
{
  "user": {
    "wake_time": "07:00",
    "sleep_time": "23:00",
    "current_time": "14:00"
  },
  "tasks": [
    {
      "id": "t001",
      "name": "[user typed this — engine ignores it]",
      "duration_minutes": 180,
      "importance": 4,
      "must_finish_today": true,
      "status": "pending"
    },
    {
      "id": "t002",
      "name": "[user typed this — engine ignores it]",
      "duration_minutes": 90,
      "importance": 3,
      "must_finish_today": false,
      "status": "pending"
    },
    {
      "id": "t003",
      "name": "[user typed this — engine ignores it]",
      "duration_minutes": 60,
      "importance": 2,
      "must_finish_today": false,
      "status": "pending"
    }
  ],
  "event": {
    "type": "interruption",
    "time_lost_minutes": 120,
    "triggered_at": "14:00"
  }
}
```

---

## Outputs

```json
{
  "remaining_minutes": 300,
  "plan": [
    { "task_id": "t001", "action": "keep",   "note": "Most important — protected" },
    { "task_id": "t002", "action": "reduce",  "new_duration": 60, "note": "Shortened to fit" },
    { "task_id": "t003", "action": "defer",   "note": "Moved to tomorrow — flexible" }
  ],
  "message": "Life happened. You'll still finish what matters most. 💪",
  "tomorrow_queue": ["t003"]
}
```

---

## 🔧 Algorithm — Phase 1: Generate Daily Plan

```
FUNCTION generate_daily_plan(tasks, wake_time, sleep_time):

  available_minutes = (sleep_time - wake_time) - 60   // 60 min daily buffer

  // Sort: most important first, must_finish_today tasks get a boost
  FOR each task:
    effective_score = task.importance
    IF task.must_finish_today: effective_score += 0.5

  tasks.sort_by(effective_score DESC)

  plan = []
  remaining = available_minutes

  FOR each task in tasks:

    IF task.duration <= remaining:
      plan.add(task, action="keep")
      remaining -= task.duration

    ELSE IF task.must_finish_today AND remaining >= task.duration * 0.75:
      reduced = task.duration * 0.75
      plan.add(task, action="reduce", new_duration=reduced)
      remaining -= reduced

    ELSE IF NOT task.must_finish_today:
      plan.add(task, action="defer")        // Goes to tomorrow queue

    ELSE:
      // must_finish_today but can't fit — force minimum session
      min_session = max(20, remaining)
      plan.add(task, action="reduce", new_duration=min_session)
      remaining = 0
      BREAK

  RETURN plan, tomorrow_queue
```

---

## 🔧 Algorithm — Phase 2: Plan Again (Replan After ⚡ Life Happened)

```
FUNCTION plan_again(current_plan, time_lost, current_time):

  remaining = (sleep_time - current_time) - 60    // buffer

  pending = current_plan.filter(status == "pending")

  // Re-score with must_finish_today boost
  FOR each task in pending:
    effective_score = task.importance
    IF task.must_finish_today: effective_score += 0.5

  pending.sort_by(effective_score DESC)

  new_plan = []

  FOR each task in pending:

    IF task.duration <= remaining:
      new_plan.add(task, action="keep")
      remaining -= task.duration

    ELSE IF remaining >= task.duration * 0.5 AND task.must_finish_today:
      new_plan.add(task, action="reduce", new_duration=remaining)
      remaining = 0
      BREAK

    ELSE IF NOT task.must_finish_today:
      new_plan.add(task, action="defer")

    ELSE:
      // must_finish_today, barely any time left
      force_min = max(20, remaining)
      new_plan.add(task, action="reduce", new_duration=force_min)
      remaining = 0
      BREAK

  RETURN new_plan
```

---

## 🔧 Algorithm — Phase 3: "What Should I Do Now?"

```
FUNCTION get_next_task(plan, current_time):

  // First: any in-progress task
  in_progress = plan.find(status == "in_progress")
  IF in_progress: RETURN in_progress

  // Second: highest importance pending task
  pending = plan
    .filter(status == "pending" AND action != "defer")
    .sort_by(importance DESC, must_finish_today DESC)

  IF pending.empty:
    RETURN { message: "All done for today! Add more or rest." }

  RETURN pending.first()
```

---

## 🔧 Algorithm — Phase 4: Decision Mode

```
FUNCTION decision_mode(available_minutes, plan):

  // Filter tasks that can fit in available_minutes
  candidates = plan
    .filter(status == "pending")
    .filter(duration <= available_minutes + 10)   // 10 min tolerance
    .sort_by(importance DESC)

  IF candidates.empty:
    best = plan.filter(status == "pending").sort_by(importance DESC).first()
    RETURN {
      task: best,
      note: "This won't fit perfectly, but it's your most important remaining task"
    }

  best = candidates.first()
  RETURN {
    task: best,
    fits_in: best.duration,
    message: "This fits perfectly in your time."
  }
```

---

## 📐 Business Rules

| Rule | Spec |
|---|---|
| ⭐⭐⭐⭐ tasks (importance 4) | NEVER dropped — max 25% reduction only |
| ⭐⭐⭐ tasks (importance 3) | Can be reduced up to 30% or deferred |
| ⭐⭐ tasks (importance 2) | Can be deferred freely |
| ⭐ tasks (importance 1) | Can be dropped today if time runs out |
| `must_finish_today = true` | Cannot move to tomorrow — only reduced |
| `must_finish_today = false` | Can always defer to tomorrow |
| Minimum session | Never schedule less than 20 minutes |
| Daily buffer | Always reserve 60 min (meals, life, transitions) |
| Overload guard | Warn user if total tasks > 10 hours in one day |
| Language rule | NEVER show guilt. Always show recovery path. |
| Name rule | Engine never reads or uses task name in logic |

---

## 🚨 Edge Cases

| Scenario | Response |
|---|---|
| 0 tasks | Empty state: "What do you want to get done today?" |
| All tasks are `must_finish_today` | Reduce durations proportionally, warn user |
| Time lost > all remaining time | "Tough day. You gave it your best. Rest up." |
| User presses ⚡ after only 5 min | Treat as short break, don't replan yet |
| Task duration > full day | Warn during creation: "This might need to be split across days" |
| User finishes faster than estimated | "Bonus time! Tap to start your next task." |
| User interrupted 5+ times in one day | "Tough day? Want to just do ONE thing for 30 minutes?" |
| Pattern: user skips same task repeatedly | (V2) Surface insight: "Want to move this to a different time?" |

---

## 🖥️ What the User Sees

### Home Screen
```
What should you do right now?

╔══════════════════════════════╗
║  [Their Task Name]  ⭐⭐⭐⭐   ║
║  2h remaining                ║
╚══════════════════════════════╝
  [ ▶ Start ]   [ ⚡ Life Happened ]

Today: 2 done · 3 remaining
🌱 Explorer · Day 5
```

### Plan Again Screen (after ⚡)
```
⚡ Life happened.
Here's your new plan:

Before             After
─────────────────────────────
[Task A]  ⭐⭐⭐⭐  →  ✓ Kept  (most important)
[Task B]  ⭐⭐⭐   →  ✂ Shorter  (fits now)
[Task C]  ⭐⭐    →  📅 Tomorrow  (flexible)
[Task D]  ⭐     →  ❌ Today done  (lowest)

"You'll still finish what matters most. 💪"

[ ✓ Looks Good ]   [ ✏️ Adjust ]
```

---

## 📈 V2: Predictive Layer (Post-MVP)

In V2, the Pilot Engine gains memory and pattern detection:

```
Pattern Storage:
  - Task skip history
  - Time-of-day completion patterns
  - Consistent duration underestimates

Prediction Examples:

  "I noticed you usually don't finish [task type] on Mondays.
   Want me to move it to Tuesday?"

  "You always finish your first task faster than estimated.
   Should I adjust your estimates automatically?"

  "You work best between 9–11 AM based on your history.
   Want me to schedule your most important task there?"
```

The predictive layer SUGGESTS. It never silently changes anything. The user always confirms.

---

## 🔮 V3: LLM Integration (When It's Real)

In V3, we replace parts of the algorithm with GPT for:
- More conversational replan explanations
- Understanding context ("I have a headache today")
- Nuanced scheduling decisions

**We will announce this clearly** when it happens. We don't call it AI before then.

---

*Status: Algorithm designed. Ready to implement. | Version: 1.0*
