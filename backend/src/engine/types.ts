// ============================================================
// Pilot Engine — Types
// Internal types used by the engine (separate from shared types
// to allow internal scoring/sorting without leaking to API)
// ============================================================

export interface EngineTask {
  id: string;
  // name is intentionally NOT here — engine is name-blind
  durationMinutes: number;
  importance: 1 | 2 | 3 | 4;   // 1=⭐, 4=⭐⭐⭐⭐
  mustFinishToday: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
}

export interface EngineUser {
  wakeTime: string;    // "HH:MM"
  sleepTime: string;   // "HH:MM"
  currentTime: string; // "HH:MM"
}

export type PlanAction = 'keep' | 'reduce' | 'defer' | 'drop';

export interface EnginePlannedTask {
  taskId: string;
  action: PlanAction;
  scheduledStart?: string;
  scheduledEnd?: string;
  newDurationMinutes?: number;
  note: string;
  orderIndex: number;
}

export interface EngineResult {
  plan: EnginePlannedTask[];
  tomorrowQueue: string[];
  availableMinutes: number;
  message: string;
}

export interface ReplanInput {
  timeLostMinutes: number;
  triggeredAt: string; // "HH:MM"
}

export interface DecisionModeResult {
  taskId: string;
  fitsInMinutes: number;
  message: string;
  alternativeTaskIds: string[];
}

// Internal scoring — never exposed to user
export interface ScoredTask extends EngineTask {
  effectiveScore: number;
}
