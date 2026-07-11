// ============================================================
// Pilot Engine — Phase 3: Next Task Finder
// Answers the core question: "What should I do right now?"
// ============================================================

import { EngineTask, EnginePlannedTask } from './types';

export interface NextTaskResult {
  taskId: string | null;
  message: string;
  isAllDone: boolean;
}

/**
 * Phase 3: Find the single best task to do right now.
 *
 * Logic:
 *   1. If any task is in_progress → continue that
 *   2. Else → return the highest-importance pending task
 *      that is scheduled for today (action = keep | reduce)
 *
 * @param tasks - All tasks for today
 * @param plan - Current daily plan
 */
export function getNextTask(
  tasks: EngineTask[],
  plan: EnginePlannedTask[]
): NextTaskResult {

  // Step 1: Any task currently in progress?
  const inProgress = tasks.find(t => t.status === 'in_progress');
  if (inProgress) {
    return {
      taskId: inProgress.id,
      message: 'Keep going — you\'re in the middle of something. 🔥',
      isAllDone: false,
    };
  }

  // Step 2: Find the best pending task from today's plan
  // Only consider tasks with action 'keep' or 'reduce' (not deferred/dropped)
  const activeTaskIds = new Set(
    plan
      .filter(p => p.action === 'keep' || p.action === 'reduce')
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(p => p.taskId)
  );

  const pendingInPlan = tasks
    .filter(t => t.status === 'pending' && activeTaskIds.has(t.id))
    .sort((a, b) => {
      // Sort by plan order
      const aOrder = plan.find(p => p.taskId === a.id)?.orderIndex ?? 999;
      const bOrder = plan.find(p => p.taskId === b.id)?.orderIndex ?? 999;
      return aOrder - bOrder;
    });

  if (pendingInPlan.length === 0) {
    // All tasks done or deferred
    const anyPending = tasks.some(t => t.status === 'pending');
    if (anyPending) {
      return {
        taskId: null,
        message: 'All scheduled tasks done! Want to add more or call it a day? 🎉',
        isAllDone: false,
      };
    }
    return {
      taskId: null,
      message: 'All done for today! Amazing work. Rest up. 🏆',
      isAllDone: true,
    };
  }

  const next = pendingInPlan[0];
  return {
    taskId: next.id,
    message: buildNextTaskMessage(next.importance, next.mustFinishToday),
    isAllDone: false,
  };
}

function buildNextTaskMessage(importance: number, mustFinishToday: boolean): string {
  if (importance === 4) return 'This is your most important task. Time to focus. 🎯';
  if (importance === 3 && mustFinishToday) return 'Important task — and it needs to get done today. Let\'s go.';
  if (importance === 3) return 'This one matters. Let\'s make progress.';
  if (importance === 2) return 'Good time to knock this out.';
  return 'Easy one. Get it done and build momentum.';
}
