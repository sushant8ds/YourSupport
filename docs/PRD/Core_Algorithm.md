# 🧠 Dynamic Scheduler — Core Algorithm

> **This is the company.** The UI can change. The backend can change. This algorithm is what StudyPilot AI IS.

---

## Feature Spec

| Field | Details |
|---|---|
| **Feature Name** | Dynamic Scheduler |
| **Version** | 1.0 (MVP — Pure Algorithm, No LLM) |
| **Priority** | CRITICAL — Build first, everything else second |
| **Author** | StudyPilot AI Team |
| **Status** | Designing |

---

## Purpose

The Dynamic Scheduler is the AI brain that:
1. Creates an **optimal daily plan** from a user's task list and available time
2. **Replans in real-time** when an interruption happens
3. Tells the user **exactly what to do next** at any given moment

---

## The Problem It Solves

Every other productivity app fails the user the moment life interrupts.

Example:
- You planned: DSA (4h), Resume (2h), Gym (1h), Reading (1h) = 8h of work
- Friend arrives at 2 PM → 2 hours wasted
- Now you only have 6 hours left
- **Other apps**: Your plan is broken. You feel guilty.
- **StudyPilot AI**: "No worries. Here's your new plan." ✅

---

## Inputs

```
User Data:
  - wake_time: "07:00"
  - sleep_time: "23:00"
  - current_time: "14:00" (dynamic)

Task List:
  [
    {
      id: 1,
      name: "DSA Practice",
      estimated_duration: 240,  // minutes
      priority: 1,              // 1 = highest
      is_flexible: false,       // cannot be moved to tomorrow
      category: "study",
      status: "pending"
    },
    {
      id: 2,
      name: "Resume Update",
      estimated_duration: 120,
      priority: 2,
      is_flexible: false,
      category: "work",
      status: "pending"
    },
    {
      id: 3,
      name: "Gym",
      estimated_duration: 60,
      priority: 3,
      is_flexible: true,        // can be moved to tomorrow
      category: "health",
      status: "pending"
    },
    {
      id: 4,
      name: "Reading",
      estimated_duration: 60,
      priority: 4,
      is_flexible: true,
      category: "personal",
      status: "pending"
    }
  ]

Interruption Event:
  - type: "time_lost"
  - duration_lost: 120   // minutes
  - reason: "friend_visit"  // optional context
  - triggered_at: "14:00"
```

---

## Outputs

```
Replan Result:
  {
    "available_time_remaining": 360,  // minutes
    "scheduled_tasks": [
      { "task_id": 1, "start": "14:00", "end": "18:00", "action": "keep" },
      { "task_id": 2, "start": "18:00", "end": "19:30", "action": "reduce", "note": "Reduced from 2h to 1.5h" },
      { "task_id": 3, "action": "defer", "note": "Moved to tomorrow" },
      { "task_id": 4, "action": "drop", "note": "Dropped for today — not critical" }
    ],
    "message": "Life happened. I replanned your day. DSA stays (it's your top priority). Resume is trimmed to 1.5h. Gym moves to tomorrow.",
    "xp_impact": -10,   // small XP penalty for lost time (not punishing, just honest)
    "tomorrow_preview": ["Gym", "Leftover Resume"]
  }
```

---

## 🔧 The Algorithm (Step by Step)

### Phase 1: Initial Plan Generation

```
FUNCTION generate_daily_plan(tasks, wake_time, sleep_time):
  
  available_minutes = (sleep_time - wake_time) * 60
  available_minutes -= 60  // subtract buffer time (meals, breaks, transitions)
  
  // Sort tasks by priority (1 is highest)
  tasks.sort_by(priority)
  
  plan = []
  remaining_time = available_minutes
  
  FOR each task in tasks:
    IF task.estimated_duration <= remaining_time:
      plan.add(task)
      remaining_time -= task.estimated_duration
    ELSE IF task.is_flexible == false:
      // Must include — reduce duration by up to 25%
      reduced_duration = task.estimated_duration * 0.75
      IF reduced_duration <= remaining_time:
        plan.add(task, duration=reduced_duration, note="Time reduced")
        remaining_time -= reduced_duration
    // else: skip task, defer to tomorrow
  
  RETURN plan, tomorrow_deferrals
```

### Phase 2: Interruption Handling (The Replan)

```
FUNCTION replan(current_plan, time_lost, current_time):
  
  // Step 1: Calculate what time is actually left
  remaining_time = (sleep_time - current_time) * 60 - 60  // minus buffer
  
  // Step 2: Get only pending tasks (not completed ones)
  pending_tasks = current_plan.filter(status == "pending")
  
  // Step 3: Sort by priority, then by flexibility
  // Non-flexible tasks get priority boost
  FOR each task in pending_tasks:
    IF task.is_flexible == false:
      task.effective_priority = task.priority - 0.5  // bump up
  
  pending_tasks.sort_by(effective_priority)
  
  // Step 4: Fit tasks into remaining time
  new_plan = []
  
  FOR each task in pending_tasks:
    IF task.estimated_duration <= remaining_time:
      new_plan.add(task, action="keep")
      remaining_time -= task.estimated_duration
    ELSE IF remaining_time > task.estimated_duration * 0.5:
      // Can fit at least half the task
      new_plan.add(task, action="reduce", new_duration=remaining_time)
      remaining_time = 0
      BREAK
    ELSE IF task.is_flexible:
      new_plan.add(task, action="defer")   // move to tomorrow
    ELSE:
      new_plan.add(task, action="reduce", new_duration=remaining_time * 0.7)
      remaining_time = 0
      BREAK
  
  RETURN new_plan
```

### Phase 3: "What Should I Do Now?" 

```
FUNCTION get_next_task(current_plan, current_time):
  
  // Find any in-progress task first
  in_progress = current_plan.find(status == "in_progress")
  IF in_progress: RETURN in_progress
  
  // Else find next pending task
  pending = current_plan.filter(status == "pending")
  IF pending.empty: RETURN "All done! Rest or add more tasks."
  
  next_task = pending.sort_by(scheduled_start_time).first()
  RETURN next_task
```

---

## 📐 Business Rules

| Rule | Description |
|---|---|
| **Priority 1 tasks** | NEVER dropped. Only reduced by max 25% |
| **Priority 2 tasks** | Can be reduced by max 30% or deferred to tomorrow |
| **Priority 3-4 tasks** | Can be deferred or dropped freely |
| **Non-flexible tasks** | Cannot be moved to tomorrow — only reduced |
| **Flexible tasks** | Can always be deferred to tomorrow |
| **Minimum session** | Never schedule less than 20 minutes for any task |
| **Buffer time** | Always reserve 60 min/day for meals/breaks |
| **Overload protection** | Never schedule more than 10 hours of tasks in a day |
| **Guilt-free rule** | Never show negative messaging. Always show recovery path |

---

## 🚨 Edge Cases

| Scenario | How We Handle It |
|---|---|
| User has 0 tasks | Show "Add your first task" onboarding |
| User has 20 tasks in one day | Cap at 10h, defer rest to tomorrow |
| User wakes up at 2 PM | Shorter day → only Priority 1 & 2 tasks |
| ALL tasks are non-flexible | Reduce durations proportionally across all |
| User keeps getting interrupted (5+ times) | Show "Tough day? Want to just do ONE thing?" |
| Time lost > remaining time | End-of-day mode: "You gave it your best. Rest up." |
| User pauses timer immediately | Treat as 5 min lost, don't replan yet |
| Task duration exceeds available day | Warn user during task creation |
| User completes task faster than estimated | Add freed time to next task or show "Bonus time!" |
| User is always late (pattern detection) | Suggest: "Should I add 20% buffer to your estimates?" |

---

## 🖥️ UI (What the User Sees)

### Normal State (Home Screen)
```
📅 Today: Monday, July 12

🎯 Your Mission
━━━━━━━━━━━━░░░░░░ 45%

📚 DSA Practice       Priority 1   2h left
📝 Resume Update      Priority 2   2h
🏋️ Gym               Priority 3   1h

[▶ Start DSA]  [🔀 What should I do now?]
```

### After Interruption
```
⚡ Life happened. I've got a new plan.

Before           After
──────────────   ──────────────
DSA     4h   →  DSA     4h   ✓ Kept (Priority 1)
Resume  2h   →  Resume  1.5h ✂ Reduced
Gym     1h   →  Gym     ---  📅 Tomorrow
Reading 1h   →  Reading ---  ❌ Dropped today

[✓ Looks good]  [✏️ Let me adjust]
```

---

## 📈 Future Scope (V2+)

1. **Pattern Learning**: "You always underestimate DSA. Want me to auto-add 30 min?"
2. **Energy Awareness**: "Schedule deep work in morning, light tasks in evening"
3. **LLM Integration**: Replace pure algorithm with GPT for more nuanced replanning
4. **Calendar Awareness**: Detect meetings and auto-plan around them
5. **Mood Input**: "Feeling tired today?" → Switch to light-task mode

---

*Status: Ready for implementation | Version: 1.0 Algorithm*
