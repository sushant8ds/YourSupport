// ============================================================
// Pilot Engine — Phase 1: Plan Generator
// Generates the initial daily plan from the user's task list.
//
// Rules:
//   - ⭐⭐⭐⭐ (importance 4): Never drop, max 25% reduction
//   - ⭐⭐⭐  (importance 3): Can reduce up to 30% or defer
//   - ⭐⭐   (importance 2): Can defer freely
//   - ⭐    (importance 1): Can drop if no time
//   - mustFinishToday=true: Cannot defer, only reduce
//   - mustFinishToday=false: Can always defer to tomorrow
//   - Min session: 20 minutes
//   - Buffer: 60 min/day reserved for life
// ============================================================

import {
  EngineTask,
  EnginePlannedTask,
  ScoredTask,
} from './types';
import {
  calcDayAvailableMinutes,
  minutesToTime,
  timeToMinutes,
  MIN_SESSION_MINUTES,
  IMPORTANCE_4_MAX_REDUCTION,
  IMPORTANCE_3_MAX_REDUCTION,
  MUST_FINISH_TODAY_BOOST,
} from './utils';

/**
 * Scores and sorts tasks by priority.
 * Higher score = scheduled first.
 * mustFinishToday tasks get a boost so they're protected.
 */
function scoreTasks(tasks: EngineTask[]): ScoredTask[] {
  return tasks
    .filter(t => t.status === 'pending')
    .map(t => ({
      ...t,
      effectiveScore: t.importance + (t.mustFinishToday ? MUST_FINISH_TODAY_BOOST : 0),
    }))
    .sort((a, b) => b.effectiveScore - a.effectiveScore); // Highest first
}

/**
 * Phase 1: Generate the initial daily plan.
 *
 * @param tasks - All pending tasks for today (engine never reads their names)
 * @param wakeTime - "HH:MM" when user wakes up
 * @param sleepTime - "HH:MM" when user plans to sleep
 * @returns planned tasks and tomorrow queue
 */
export function generateDailyPlan(
  tasks: EngineTask[],
  wakeTime: string,
  sleepTime: string
): { plan: EnginePlannedTask[]; tomorrowQueue: string[]; availableMinutes: number } {
  const availableMinutes = calcDayAvailableMinutes(wakeTime, sleepTime);
  const scored = scoreTasks(tasks);

  const plan: EnginePlannedTask[] = [];
  const tomorrowQueue: string[] = [];
  let remaining = availableMinutes;
  let currentCursor = timeToMinutes(wakeTime);
  let orderIndex = 0;

  for (const task of scored) {

    // ── Case 1: Task fits perfectly ──────────────────────────
    if (task.durationMinutes <= remaining) {
      const start = minutesToTime(currentCursor);
      const end = minutesToTime(currentCursor + task.durationMinutes);

      plan.push({
        taskId: task.id,
        action: 'keep',
        scheduledStart: start,
        scheduledEnd: end,
        note: buildNote('keep', task.importance, task.mustFinishToday),
        orderIndex: orderIndex++,
      });

      currentCursor += task.durationMinutes;
      remaining -= task.durationMinutes;
      continue;
    }

    // ── Case 2: Not enough time — try to reduce ───────────────
    const maxReduction = task.importance === 4
      ? IMPORTANCE_4_MAX_REDUCTION
      : task.importance === 3
        ? IMPORTANCE_3_MAX_REDUCTION
        : 0.5; // Lower importance tasks can be cut more aggressively

    const minAllowedDuration = Math.max(
      MIN_SESSION_MINUTES,
      Math.ceil(task.durationMinutes * (1 - maxReduction))
    );

    if (remaining >= minAllowedDuration) {
      // Can fit a reduced version
      const reducedDuration = Math.min(remaining, task.durationMinutes);
      const actualDuration = Math.max(minAllowedDuration, reducedDuration);

      if (actualDuration <= remaining) {
        const start = minutesToTime(currentCursor);
        const end = minutesToTime(currentCursor + actualDuration);

        plan.push({
          taskId: task.id,
          action: 'reduce',
          scheduledStart: start,
          scheduledEnd: end,
          newDurationMinutes: actualDuration,
          note: buildNote('reduce', task.importance, task.mustFinishToday),
          orderIndex: orderIndex++,
        });

        currentCursor += actualDuration;
        remaining -= actualDuration;
        continue;
      }
    }

    // ── Case 3: Cannot fit — defer or drop ────────────────────
    if (!task.mustFinishToday) {
      // Flexible task: defer to tomorrow
      tomorrowQueue.push(task.id);
      plan.push({
        taskId: task.id,
        action: 'defer',
        note: buildNote('defer', task.importance, task.mustFinishToday),
        orderIndex: orderIndex++,
      });
    } else {
      // mustFinishToday but truly no time: force minimum session
      if (remaining >= MIN_SESSION_MINUTES) {
        const forcedDuration = remaining;
        const start = minutesToTime(currentCursor);
        const end = minutesToTime(currentCursor + forcedDuration);

        plan.push({
          taskId: task.id,
          action: 'reduce',
          scheduledStart: start,
          scheduledEnd: end,
          newDurationMinutes: forcedDuration,
          note: `Time is tight. Starting with ${forcedDuration} minutes — it's your must-do task.`,
          orderIndex: orderIndex++,
        });

        remaining = 0;
      } else {
        // Truly no time left even for minimum session
        plan.push({
          taskId: task.id,
          action: 'drop',
          note: `No time left today. This will move to first priority tomorrow.`,
          orderIndex: orderIndex++,
        });
        tomorrowQueue.unshift(task.id); // Goes to front of tomorrow queue
      }

      // Once we've exhausted time, stop scheduling
      if (remaining <= 0) break;
    }
  }

  return { plan, tomorrowQueue, availableMinutes };
}

/**
 * Builds a user-facing note for a planned task action.
 * RULE: Always positive, always recovery-focused. Never guilt.
 */
function buildNote(
  action: 'keep' | 'reduce' | 'defer' | 'drop',
  importance: number,
  mustFinishToday: boolean
): string {
  switch (action) {
    case 'keep':
      if (importance === 4) return 'Your top priority — fully protected.';
      if (importance === 3) return 'Important task — scheduled for today.';
      return 'Scheduled for today.';

    case 'reduce':
      if (mustFinishToday) return 'Must-do today — time reduced to fit your schedule.';
      return 'Slightly shortened to fit your available time.';

    case 'defer':
      return 'Moved to tomorrow — flexible task, no problem.';

    case 'drop':
      return 'No time today — bumped to top of tomorrow.';
  }
}
