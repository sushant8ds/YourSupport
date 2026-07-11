// ============================================================
// Pilot Engine — Utilities
// Shared helper functions for time math
// ============================================================

/**
 * Converts "HH:MM" string to total minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts total minutes since midnight to "HH:MM" string
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Calculates available minutes between now and sleep time,
 * minus a 60-minute daily buffer for meals, breaks, transitions.
 */
export function calcAvailableMinutes(
  currentTime: string,
  sleepTime: string,
  bufferMinutes = 60
): number {
  const current = timeToMinutes(currentTime);
  const sleep = timeToMinutes(sleepTime);
  const raw = sleep - current;
  return Math.max(0, raw - bufferMinutes);
}

/**
 * Calculates total available minutes for a full day
 * (from wake time to sleep time, minus buffer)
 */
export function calcDayAvailableMinutes(
  wakeTime: string,
  sleepTime: string,
  bufferMinutes = 60
): number {
  const wake = timeToMinutes(wakeTime);
  const sleep = timeToMinutes(sleepTime);
  return Math.max(0, sleep - wake - bufferMinutes);
}

/**
 * The minimum session length we ever schedule.
 * Never schedule less than this — it's not worth starting.
 */
export const MIN_SESSION_MINUTES = 20;

/**
 * Max importance reduction for ⭐⭐⭐⭐ tasks (25% max cut)
 */
export const IMPORTANCE_4_MAX_REDUCTION = 0.25;

/**
 * Max importance reduction for ⭐⭐⭐ tasks (30% max cut)
 */
export const IMPORTANCE_3_MAX_REDUCTION = 0.30;

/**
 * The score boost given to mustFinishToday tasks during sorting.
 * This ensures they get scheduled before flexible lower-priority tasks.
 */
export const MUST_FINISH_TODAY_BOOST = 0.5;
