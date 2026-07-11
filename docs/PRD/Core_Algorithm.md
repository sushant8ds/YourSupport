# 🧠 Dynamic Scheduler — Core Algorithm

> **This is the company.** The UI can change. The backend can change. This algorithm is what YourPilot IS.
>
> **Core Principle**: The algorithm works on ANY tasks the user creates. It has zero knowledge of what a task IS — only its duration, priority, and flexibility. The user is always in full control.

---

## Feature Spec

| Field | Details |
|---|---|
| **Feature Name** | Dynamic Scheduler |
| **Version** | 1.0 (MVP — Pure Algorithm, No LLM) |
| **Priority** | CRITICAL — Build first, everything else second |
| **Author** | YourPilot Team |
| **Status** | Designing |

---

## Purpose

The Dynamic Scheduler is the AI brain that:
1. Creates an **optimal daily plan** from the user's own task list and their available time
2. **Replans in real-time** when an interruption happens
3. Tells the user **exactly what to do next** at any given moment

The scheduler **does not care what the task is**. A task named "Water plants" is treated identically to a task named "Solve differential equations" — what matters is duration, priority, and flexibility as set by the user.

---

## The Problem It Solves

Every other productivity app fails the user the moment life interrupts.

**Example (fully user-defined tasks):**
- User created: Task A (3h, Priority 1, not flexible), Task B (2h, Priority 2, flexible), Task C (1h, Priority 3, flexible)
- User has 6 hours available
- Something comes up → 2 hours lost
- **Other apps**: Plan is broken. Feel guilty.
- **YourPilot**: "No worries. Here's your new plan." ✅

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
      "id": "task_001",
      "name": "[whatever the user typed]",
      "estimated_duration_minutes": 180,
      "priority": 1,
      "is_flexible": false,
      "status": "pending"
    },
    {
      "id": "task_002",
      "name": "[whatever the user typed]",
      "estimated_duration_minutes": 120,
      "priority": 2,
      "is_flexible": true,
      "status": "pending"
    },
    {
      "id": "task_003",
      "name": "[whatever the user typed]",
      "estimated_duration_minutes": 60,
      "priority": 3,
      "is_flexible": true,
      "status": "pending"
    }
  ],
  "interruption_event": {
    "type": "time_lost",
    "duration_lost_minutes": 120,
    "triggered_at": "14:00"
  }
}
```

> Note: The algorithm never reads the `name` field. It only uses `duration`, `priority`, `is_flexible`, and `status`. The task name is purely for display.

---

## Outputs

```json
{
  "available_time_remaining_minutes": 360,
  "scheduled_tasks": [
    {
      "task_id": "task_001",
      "start": "14:00",
      "end": "17:00",
      "action": "keep",
      "note": "Kept — your top priority"
    },
    {
      "task_id": "task_002",
      "action": "defer",
      "note": "Moved to tomorrow — flexible task"
    },
    {
      "task_id": "task_003",
      "action": "drop",
      "note": "Not enough time today — lowest priority"
    }
  ],
  "message": "Life happened. I kept your top priority. The flexible tasks move to tomorrow.",
  "tomorrow_preview": ["task_002", "task_003"]
}
```

---

## 🔧 The Algorithm (Step by Step)

### Phase 1: Initial Plan Generation

```
FUNCTION generate_daily_plan(tasks, wake_time, sleep_time):

  available_minutes = (sleep_time - wake_time) in minutes
  available_minutes -= 60  // buffer for meals, breaks, transitions

  // Sort by user-assigned priority (1 = highest)
  tasks.sort_by(priority ASC)

  plan = []
  remaining_time = available_minutes

  FOR each task in tasks:

    IF task.estimated_duration <= remaining_time:
      plan.add(task, action="keep")
      remaining_time -= task.estimated_duration

    ELSE IF task.is_flexible == false AND remaining_time >= task.estimated_duration * 0.75:
      // Non-flexible: reduce by up to 25%
      reduced = task.estimated_duration * 0.75
      plan.add(task, action="reduce", new_duration=reduced)
      remaining_time -= reduced

    ELSE IF task.is_flexible:
      plan.add(task, action="defer")    // Move to tomorrow

    ELSE:
      plan.add(task, action="reduce", new_duration=max(remaining_time, 20min))
      remaining_time = 0
      BREAK

  RETURN plan
```

### Phase 2: Interruption / Replan

```
FUNCTION replan(current_plan, time_lost_minutes, current_time):

  remaining_time = (sleep_time - current_time) in minutes - 60  // buffer

  // Only look at tasks not yet completed
  pending_tasks = current_plan.filter(status == "pending")

  // Non-flexible tasks get priority boost
  FOR each task in pending_tasks:
    IF task.is_flexible == false:
      task.effective_priority = task.priority - 0.5  // bump up in ranking

  pending_tasks.sort_by(effective_priority ASC)

  new_plan = []

  FOR each task in pending_tasks:

    IF task.estimated_duration <= remaining_time:
      new_plan.add(task, action="keep")
      remaining_time -= task.estimated_duration

    ELSE IF remaining_time >= task.estimated_duration * 0.5 AND task.is_flexible == false:
      new_plan.add(task, action="reduce", new_duration=remaining_time)
      remaining_time = 0
      BREAK

    ELSE IF task.is_flexible:
      new_plan.add(task, action="defer")    // Tomorrow

    ELSE:
      // Non-flexible, not enough time — force a partial session
      new_plan.add(task, action="reduce", new_duration=max(remaining_time, 20min))
      remaining_time = 0
      BREAK

  RETURN new_plan
```

### Phase 3: "What Should I Do Now?"

```
FUNCTION get_next_task(current_plan, current_time):

  // Check for any in-progress task first
  in_progress = current_plan.find(status == "in_progress")
  IF in_progress EXISTS: RETURN in_progress

  // Find next pending task scheduled for now or overdue
  pending = current_plan
    .filter(status == "pending")
    .sort_by(scheduled_start_time ASC)

  IF pending IS EMPTY:
    RETURN { message: "All done! Add more tasks or rest." }

  RETURN pending.first()
```

---

## 📐 Business Rules

| Rule | Description |
|---|---|
| **Priority 1 tasks** | NEVER dropped — only reduced by max 25% |
| **Priority 2 tasks** | Can be reduced up to 30% or deferred |
| **Priority 3–4 tasks** | Can be deferred or dropped freely |
| **Non-flexible tasks** | Can NOT move to tomorrow — only time-reduced |
| **Flexible tasks** | Can always be deferred to tomorrow |
| **Minimum session** | Never schedule less than 20 minutes for any task |
| **Buffer time** | Always reserve 60 min/day for life (meals, breaks) |
| **Overload guard** | Warn user if total task time > 10h in a day |
| **Guilt-free rule** | NEVER show negative messaging — always show recovery |
| **Name-blindness** | Algorithm ignores task names — treats all tasks equally |

---

## 🚨 Edge Cases

| Scenario | How We Handle It |
|---|---|
| User has 0 tasks | Show empty state: "Add your first task to get started" |
| User adds 20 tasks (more than a day can fit) | Schedule top-priority ones, defer rest, warn user |
| User wakes up late | Shorter day → only Priority 1 & 2 tasks fit |
| ALL tasks are non-flexible | Reduce durations proportionally across all |
| User gets interrupted 5+ times | Show: "Tough day? Want to just do ONE task?" |
| Time lost > all remaining time | End-of-day mode: "You gave it your best. Rest up." |
| User pauses timer immediately (< 5 min) | Don't replan — treat as a short break |
| Task duration > whole remaining day | Warn during task creation, suggest splitting |
| User finishes faster than estimated | "Bonus time! Start the next task?" |
| User is consistently late (detected pattern) | Suggest: "Should I add 20% buffer to your estimates?" |
| User has 0 priority-1 tasks | Treat highest user priority as protected |

---

## 🖥️ What the User Sees

### Home Screen (Zero presets, purely user tasks)
```
📅 Monday, July 12
Good morning! 👋

🎯 Today's Plan
━━━━━━━━░░░░░░░ 33%

[Task Name A]    Priority 1  •  3h left   [In Progress]
[Task Name B]    Priority 2  •  2h        [Pending]
[Task Name C]    Priority 3  •  1h        [Flexible]

[▶ Continue A]   [🔀 What now?]
```
> Task names are EXACTLY what the user typed. No labels, no icons assigned by app.

### Replan Screen (After interruption)
```
⚡ Life happened. I've got a new plan.

Original           New
──────────         ──────────
[Task A]  3h  →   [Task A]  3h   ✓ Kept
[Task B]  2h  →   [Task B]  2h   📅 Tomorrow
[Task C]  1h  →   [Task C]  ---  ❌ Today's done

"You'll still finish your #1 priority. That's a win. 💪"

[✓ Looks Good]   [✏️ Let me Adjust]
```

---

## 📈 Future Scope (V2+)

1. **Pattern Learning**: "You usually underestimate your first task. Want me to add a buffer?"
2. **Energy Awareness**: Schedule intensive tasks in user's peak hours
3. **LLM Integration**: Replace algorithm with GPT for more nuanced, conversational replanning
4. **Calendar Awareness**: Detect meetings and auto-plan around them
5. **Mood Input**: "Feeling tired today?" → Reorder tasks to lighter ones first

---

*Status: Ready for implementation | Version: 1.0 Algorithm*
