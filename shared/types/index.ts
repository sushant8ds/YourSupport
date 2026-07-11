// ============================================
// YourPilot — Shared TypeScript Types
// Used by both frontend and backend
// ============================================

// ─── User ────────────────────────────────────

export type IdentityStage =
  | 'explorer'      // Week 1
  | 'consistent'    // Week 3 streak
  | 'focused'       // Month 2
  | 'reliable'      // Month 4
  | 'unbreakable';  // Month 6

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  downloadIntent?: DownloadIntent;
  identityStage: IdentityStage;
  xp: number;
  streakDays: number;
  createdAt: Date;
}

export type DownloadIntent =
  | 'exams'
  | 'work'
  | 'fitness'
  | 'personal_growth'
  | 'getting_stuff_done'
  | 'other';

// ─── Tasks ───────────────────────────────────

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export type Importance = 1 | 2 | 3 | 4; // 1 = ⭐, 4 = ⭐⭐⭐⭐

export interface Task {
  id: string;
  userId: string;
  name: string;              // Exactly what the user typed — engine never reads this
  durationMinutes: number;
  importance: Importance;    // ⭐ to ⭐⭐⭐⭐ (maps from user stars)
  mustFinishToday: boolean;  // YES = not flexible, NO = flexible
  status: TaskStatus;
  scheduledDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  name: string;
  durationMinutes: number;
  importance: Importance;
  mustFinishToday: boolean;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
}

// ─── Sessions (Timer) ────────────────────────

export type SessionEventType =
  | 'start'
  | 'pause'
  | 'resume'
  | 'stop'
  | 'life_happened'    // ⚡ the signature event
  | 'complete';

export interface Session {
  id: string;
  taskId: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;  // Actual time worked (excluding pauses)
  events: SessionEvent[];
}

export interface SessionEvent {
  id: string;
  sessionId: string;
  type: SessionEventType;
  timestamp: Date;
  timeLostMinutes?: number;  // Only for life_happened events
}

// ─── Pilot Engine (Scheduler) ────────────────

export type PlanAction =
  | 'keep'    // Task stays as-is
  | 'reduce'  // Task duration shortened
  | 'defer'   // Move to tomorrow
  | 'drop';   // Drop for today (lowest priority, flexible)

export interface PlannedTask {
  taskId: string;
  action: PlanAction;
  scheduledStart?: string;    // "HH:MM" format
  scheduledEnd?: string;      // "HH:MM" format
  newDurationMinutes?: number; // Set when action = "reduce"
  note: string;               // User-facing explanation
}

export interface DailyPlan {
  userId: string;
  date: string;               // "YYYY-MM-DD"
  generatedAt: Date;
  availableMinutes: number;
  tasks: PlannedTask[];
  tomorrowQueue: string[];    // task IDs deferred to tomorrow
}

export interface ReplanInput {
  timeLostMinutes: number;
  triggeredAt: string;        // "HH:MM" format
}

export interface ReplanResult {
  previousPlan: PlannedTask[];
  newPlan: PlannedTask[];
  message: string;            // Always positive, recovery-focused
  tomorrowQueue: string[];
}

// ─── Decision Mode ───────────────────────────

export type TimeSlot = 15 | 30 | 60 | 120;  // minutes

export interface DecisionModeInput {
  availableMinutes: TimeSlot;
}

export interface DecisionModeResult {
  task: Task;
  fitsIn: number;             // Actual minutes the task will take
  message: string;
  alternativeTasks?: Task[];  // For "show other options"
}

// ─── Daily Stats ─────────────────────────────

export interface DailyStats {
  userId: string;
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  minutesFocused: number;
  xpEarned: number;
  lifeHappenedCount: number;   // How many times ⚡ was pressed
  identityStage: IdentityStage;
}
