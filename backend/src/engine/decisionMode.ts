// ============================================================
// Pilot Engine — Phase 4: Decision Mode
// The magical feature: user says how much time they have,
// engine instantly picks the perfect task.
// "I have 30 minutes — what should I do?"
// ============================================================

import { EngineTask, EnginePlannedTask } from './types';

export type TimeSlot = 15 | 30 | 60 | 120;

export interface DecisionModeResult {
  taskId: string;
  fitsInMinutes: number;
  message: string;
  alternativeTaskIds: string[];
}

// Tolerance: a task can be up to 10% longer than available time
// and still be recommended (user can stop early)
const FIT_TOLERANCE_PERCENT = 0.10;

/**
 * Phase 4: Decision Mode — given available time, pick the best task.
 *
 * @param availableMinutes - How much time user has (15/30/60/120)
 * @param tasks - All tasks for today
 * @param plan - Current daily plan
 */
export function decisionMode(
  availableMinutes: TimeSlot,
  tasks: EngineTask[],
  plan: EnginePlannedTask[]
): DecisionModeResult | null {
  const pending = tasks.filter(t => t.status === 'pending');

  if (pending.length === 0) {
    return null; // Caller handles the "all done" state
  }

  // Only consider tasks in today's active plan (keep/reduce actions)
  const activeTaskIds = new Set(
    plan
      .filter(p => p.action === 'keep' || p.action === 'reduce')
      .map(p => p.taskId)
  );

  const activePending = pending
    .filter(t => activeTaskIds.has(t.id))
    .sort((a, b) => b.importance - a.importance); // Highest importance first

  const tolerance = availableMinutes * FIT_TOLERANCE_PERCENT;
  const maxDuration = availableMinutes + tolerance;

  // Step 1: Find tasks that fit perfectly within available time
  const perfectFit = activePending.filter(
    t => t.durationMinutes <= maxDuration
  );

  if (perfectFit.length > 0) {
    const best = perfectFit[0]; // Already sorted by importance desc
    const alternatives = perfectFit
      .slice(1, 4) // Up to 3 alternatives
      .map(t => t.id);

    return {
      taskId: best.id,
      fitsInMinutes: Math.min(best.durationMinutes, availableMinutes),
      message: buildDecisionMessage(best.importance, best.durationMinutes, availableMinutes, true),
      alternativeTaskIds: alternatives,
    };
  }

  // Step 2: No perfect fit — return the most important task anyway
  // with a note that it won't be completed but progress counts
  const best = activePending[0];
  const alternatives = activePending.slice(1, 4).map(t => t.id);

  return {
    taskId: best.id,
    fitsInMinutes: availableMinutes, // User will work for available time
    message: buildDecisionMessage(best.importance, best.durationMinutes, availableMinutes, false),
    alternativeTaskIds: alternatives,
  };
}

function buildDecisionMessage(
  importance: number,
  taskDuration: number,
  available: number,
  fits: boolean
): string {
  if (fits) {
    const diff = available - taskDuration;
    if (diff <= 5) {
      return `This fits perfectly in your ${available} minutes. Let\'s go! ⚡`;
    }
    return `This fits in your ${available} minutes with ${diff} min to spare. Perfect timing. ✅`;
  }

  // Doesn't fit completely — still worth starting
  return `This task is longer than ${available} min, but starting it now builds real progress. Begin and stop when your time\'s up. 💪`;
}
