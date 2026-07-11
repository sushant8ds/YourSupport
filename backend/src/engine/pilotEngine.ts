// ============================================================
// Pilot Engine — Main Entry Point
// Orchestrates all 4 phases of the engine.
//
// To users: "Plan Again"
// To engineers: Pilot Engine
// Never call it AI. It's a deterministic scheduling algorithm.
// ============================================================

export { generateDailyPlan } from './planGenerator';
export { replan } from './replanner';
export type { ReplanOutput } from './replanner';
export { getNextTask } from './nextTaskFinder';
export type { NextTaskResult } from './nextTaskFinder';
export { decisionMode } from './decisionMode';
export type { DecisionModeResult, TimeSlot } from './decisionMode';
export type {
  EngineTask,
  EngineUser,
  EnginePlannedTask,
  PlanAction,
  EngineResult,
  ReplanInput,
  ScoredTask,
} from './types';
