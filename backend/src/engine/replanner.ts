// ============================================================
// Pilot Engine — Phase 2: Replanner
// Triggered by ⚡ "Life Happened" button.
// Re-prioritizes pending tasks given remaining time.
//
// This is THE signature feature of YourPilot.
// The WOW moment. Treat it with care.
// ============================================================

import {
  EngineTask,
  EnginePlannedTask,
  ScoredTask,
} from './types';
import {
  calcAvailableMinutes,
  minutesToTime,
  timeToMinutes,
  MIN_SESSION_MINUTES,
  IMPORTANCE_4_MAX_REDUCTION,
  IMPORTANCE_3_MAX_REDUCTION,
  MUST_FINISH_TODAY_BOOST,
} from './utils';

export interface ReplanOutput {
  previousPlan: EnginePlannedTask[];
  newPlan: EnginePlannedTask[];
  tomorrowQueue: string[];
  message: string;
}

/**
 * Scores pending tasks for replanning.
 * Same logic as planGenerator, but called after interruption.
 */
function scorePendingTasks(tasks: EngineTask[]): ScoredTask[] {
  return tasks
    .filter(t => t.status === 'pending')
    .map(t => ({
      ...t,
      effectiveScore: t.importance + (t.mustFinishToday ? MUST_FINISH_TODAY_BOOST : 0),
    }))
    .sort((a, b) => b.effectiveScore - a.effectiveScore);
}

/**
 * Phase 2: Replan after ⚡ Life Happened.
 *
 * @param allTasks - All tasks for today
 * @param previousPlan - The plan before interruption
 * @param timeLostMinutes - How much time was lost
 * @param currentTime - "HH:MM" current time
 * @param sleepTime - "HH:MM" when user sleeps
 */
export function replan(
  allTasks: EngineTask[],
  previousPlan: EnginePlannedTask[],
  timeLostMinutes: number,
  currentTime: string,
  sleepTime: string
): ReplanOutput {
  const remainingMinutes = calcAvailableMinutes(currentTime, sleepTime);

  // Get only pending tasks — completed ones stay done
  const pendingTaskIds = new Set(
    allTasks.filter(t => t.status === 'pending').map(t => t.id)
  );
  const pendingTasks = allTasks.filter(t => pendingTaskIds.has(t.id));
  const scored = scorePendingTasks(pendingTasks);

  const newPlan: EnginePlannedTask[] = [];
  const tomorrowQueue: string[] = [];
  let remaining = remainingMinutes;
  let currentCursor = timeToMinutes(currentTime);
  let orderIndex = 0;
  let keptCount = 0;
  let reducedCount = 0;
  let deferredCount = 0;

  for (const task of scored) {

    // ── Case 1: Fits perfectly ────────────────────────────────
    if (task.durationMinutes <= remaining) {
      const start = minutesToTime(currentCursor);
      const end = minutesToTime(currentCursor + task.durationMinutes);

      newPlan.push({
        taskId: task.id,
        action: 'keep',
        scheduledStart: start,
        scheduledEnd: end,
        note: replanNote('keep', task.importance, task.mustFinishToday),
        orderIndex: orderIndex++,
      });

      currentCursor += task.durationMinutes;
      remaining -= task.durationMinutes;
      keptCount++;
      continue;
    }

    // ── Case 2: Can fit at least 50% (for high-importance) ────
    const halfDuration = task.durationMinutes * 0.5;
    const maxReduction = task.importance === 4
      ? IMPORTANCE_4_MAX_REDUCTION
      : IMPORTANCE_3_MAX_REDUCTION;
    const minDuration = Math.max(
      MIN_SESSION_MINUTES,
      Math.ceil(task.durationMinutes * (1 - maxReduction))
    );

    if (task.mustFinishToday && remaining >= MIN_SESSION_MINUTES) {
      // Must finish today — force it even if barely any time
      const forcedDuration = Math.min(remaining, task.durationMinutes);
      const start = minutesToTime(currentCursor);
      const end = minutesToTime(currentCursor + forcedDuration);

      newPlan.push({
        taskId: task.id,
        action: 'reduce',
        scheduledStart: start,
        scheduledEnd: end,
        newDurationMinutes: forcedDuration,
        note: replanNote('reduce', task.importance, task.mustFinishToday),
        orderIndex: orderIndex++,
      });

      currentCursor += forcedDuration;
      remaining -= forcedDuration;
      reducedCount++;

      if (remaining <= 0) break;
      continue;
    }

    if (!task.mustFinishToday && remaining >= halfDuration && remaining >= MIN_SESSION_MINUTES) {
      // Not must-finish, but can get a good chunk in
      const reducedDuration = Math.min(remaining, task.durationMinutes);

      if (reducedDuration >= minDuration) {
        const start = minutesToTime(currentCursor);
        const end = minutesToTime(currentCursor + reducedDuration);

        newPlan.push({
          taskId: task.id,
          action: 'reduce',
          scheduledStart: start,
          scheduledEnd: end,
          newDurationMinutes: reducedDuration,
          note: replanNote('reduce', task.importance, task.mustFinishToday),
          orderIndex: orderIndex++,
        });

        currentCursor += reducedDuration;
        remaining -= reducedDuration;
        reducedCount++;
        continue;
      }
    }

    // ── Case 3: Defer or drop ─────────────────────────────────
    if (!task.mustFinishToday) {
      tomorrowQueue.push(task.id);
      newPlan.push({
        taskId: task.id,
        action: 'defer',
        note: replanNote('defer', task.importance, task.mustFinishToday),
        orderIndex: orderIndex++,
      });
      deferredCount++;
    } else {
      // mustFinishToday + truly no time — forced drop (last resort)
      newPlan.push({
        taskId: task.id,
        action: 'drop',
        note: `Today was tough. This goes to the top of tomorrow's list.`,
        orderIndex: orderIndex++,
      });
      tomorrowQueue.unshift(task.id);
    }
  }

  const message = buildReplanMessage(
    timeLostMinutes,
    keptCount,
    reducedCount,
    deferredCount,
    remainingMinutes
  );

  return {
    previousPlan,
    newPlan,
    tomorrowQueue,
    message,
  };
}

/**
 * Builds the user-facing replan message.
 * RULE: Always positive. Never guilt. Always show the recovery path.
 */
function buildReplanMessage(
  timeLostMinutes: number,
  keptCount: number,
  reducedCount: number,
  deferredCount: number,
  remainingMinutes: number
): string {
  // Truly no time left
  if (remainingMinutes <= MIN_SESSION_MINUTES) {
    return `Tough day — you lost ${timeLostMinutes} minutes. But you showed up. Rest up and come back strong tomorrow. 💪`;
  }

  // Most tasks kept
  if (keptCount >= 2 && deferredCount === 0) {
    return `You lost ${timeLostMinutes} minutes, but your plan is mostly intact. You've got this. 💪`;
  }

  // Good recovery despite disruption
  if (keptCount >= 1) {
    const parts: string[] = [];
    if (keptCount > 0) parts.push(`${keptCount} top task${keptCount > 1 ? 's' : ''} protected`);
    if (reducedCount > 0) parts.push(`${reducedCount} shortened to fit`);
    if (deferredCount > 0) parts.push(`${deferredCount} moved to tomorrow`);
    return `Life happened. ${parts.join(', ')}. You'll still finish what matters most. 💪`;
  }

  // Everything deferred — still positive
  return `You lost ${timeLostMinutes} minutes. Your flexible tasks move to tomorrow so they stay fresh. Rest if you need it — consistency matters more than any single day. 💪`;
}

/**
 * User-facing notes for replan actions.
 * Always warm and recovery-focused.
 */
function replanNote(
  action: 'keep' | 'reduce' | 'defer' | 'drop',
  importance: number,
  mustFinishToday: boolean
): string {
  switch (action) {
    case 'keep':
      if (importance === 4) return 'Kept — most important ✓';
      if (importance === 3) return 'Kept — important ✓';
      return 'Kept ✓';

    case 'reduce':
      if (mustFinishToday) return 'Shortened — must finish today ✂';
      return 'Shortened to fit ✂';

    case 'defer':
      return 'Moved to tomorrow 📅';

    case 'drop':
      return 'Top of tomorrow\'s list 📅';
  }
}
