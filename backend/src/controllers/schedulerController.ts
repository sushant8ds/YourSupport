import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import {
  generateDailyPlan,
  replan,
  getNextTask,
  decisionMode,
  EngineTask,
  EnginePlannedTask,
} from '../engine/pilotEngine';
import { TaskStatus, PlanAction } from '@prisma/client';

// ─── Validation Schemas ───────────────────────────────────────

const replanSchema = z.object({
  timeLostMinutes: z.number().int().min(1).max(480),
  currentTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
  sleepTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
});

const decisionModeSchema = z.object({
  availableMinutes: z.union([
    z.literal(15),
    z.literal(30),
    z.literal(60),
    z.literal(120),
  ]),
});

const generatePlanSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
  sleepTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format'),
});

// ─── Helper: Get DB user by Clerk ID ─────────────────────────

async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw createError('User not found', 404);
  return user;
}

// ─── Helper: Convert DB tasks to engine tasks ─────────────────
// The engine only sees: id, duration, importance, mustFinishToday, status
// It NEVER sees: name, userId, dates, or any other field

function toEngineTasks(dbTasks: {
  id: string;
  durationMinutes: number;
  importance: number;
  mustFinishToday: boolean;
  status: TaskStatus;
}[]): EngineTask[] {
  return dbTasks.map(t => ({
    id: t.id,
    durationMinutes: t.durationMinutes,
    importance: t.importance as 1 | 2 | 3 | 4,
    mustFinishToday: t.mustFinishToday,
    status: t.status.toLowerCase() as EngineTask['status'],
  }));
}

// ─── Helper: Convert DB planned tasks to engine format ────────

function toEnginePlan(dbPlannedTasks: {
  taskId: string;
  action: PlanAction;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  newDurationMinutes: number | null;
  note: string;
  orderIndex: number;
}[]): EnginePlannedTask[] {
  return dbPlannedTasks.map(p => ({
    taskId: p.taskId,
    action: p.action.toLowerCase() as EnginePlannedTask['action'],
    scheduledStart: p.scheduledStart ?? undefined,
    scheduledEnd: p.scheduledEnd ?? undefined,
    newDurationMinutes: p.newDurationMinutes ?? undefined,
    note: p.note,
    orderIndex: p.orderIndex,
  }));
}

// ─── Controllers ─────────────────────────────────────────────

/**
 * POST /api/scheduler/generate
 * Generate the daily plan for a given day.
 * Called on first open each day.
 */
export const generatePlan = asyncHandler(async (req: Request, res: Response) => {
  const parsed = generatePlanSchema.safeParse(req.body);
  if (!parsed.success) throw createError(parsed.error.message, 400);

  const { date, wakeTime, sleepTime } = parsed.data;
  const user = await getUserByClerkId(req.clerkUserId!);

  // Get today's pending tasks
  const dateStart = new Date(date);
  const dateEnd = new Date(date);
  dateEnd.setDate(dateEnd.getDate() + 1);

  const dbTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      scheduledDate: { gte: dateStart, lt: dateEnd },
      status: { in: ['PENDING', 'IN_PROGRESS'] },
    },
    orderBy: { createdAt: 'asc' },
  });

  if (dbTasks.length === 0) {
    res.json({ success: true, plan: null, message: 'No tasks yet. Add your first task!' });
    return;
  }

  const engineTasks = toEngineTasks(dbTasks);
  const { plan, tomorrowQueue, availableMinutes } = generateDailyPlan(
    engineTasks,
    wakeTime,
    sleepTime
  );

  // Upsert the daily plan in DB
  await prisma.dailyPlan.upsert({
    where: { userId_date: { userId: user.id, date: new Date(date) } },
    create: {
      userId: user.id,
      date: new Date(date),
      availableMinutes,
      tomorrowQueue,
      tasks: {
        create: plan.map(p => ({
          taskId: p.taskId,
          action: p.action.toUpperCase() as PlanAction,
          scheduledStart: p.scheduledStart,
          scheduledEnd: p.scheduledEnd,
          newDurationMinutes: p.newDurationMinutes,
          note: p.note,
          orderIndex: p.orderIndex,
        })),
      },
    },
    update: {
      availableMinutes,
      tomorrowQueue,
      tasks: {
        deleteMany: {},
        create: plan.map(p => ({
          taskId: p.taskId,
          action: p.action.toUpperCase() as PlanAction,
          scheduledStart: p.scheduledStart,
          scheduledEnd: p.scheduledEnd,
          newDurationMinutes: p.newDurationMinutes,
          note: p.note,
          orderIndex: p.orderIndex,
        })),
      },
    },
    include: { tasks: { orderBy: { orderIndex: 'asc' } } },
  });

  res.json({ success: true, plan, tomorrowQueue, availableMinutes });
});

/**
 * POST /api/scheduler/replan
 * ⚡ Life Happened — regenerate plan after time loss.
 * The signature feature.
 */
export const replanDay = asyncHandler(async (req: Request, res: Response) => {
  const parsed = replanSchema.safeParse(req.body);
  if (!parsed.success) throw createError(parsed.error.message, 400);

  const { timeLostMinutes, currentTime, sleepTime } = parsed.data;
  const user = await getUserByClerkId(req.clerkUserId!);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's tasks and current plan
  const [dbTasks, currentPlan] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: user.id,
        scheduledDate: { gte: today, lt: tomorrow },
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
    prisma.dailyPlan.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
      include: { tasks: { orderBy: { orderIndex: 'asc' } } },
    }),
  ]);

  if (!currentPlan) throw createError('No plan found for today. Generate a plan first.', 404);

  const engineTasks = toEngineTasks(dbTasks);
  const enginePlan = toEnginePlan(currentPlan.tasks);

  const result = replan(engineTasks, enginePlan, timeLostMinutes, currentTime, sleepTime);

  // Update DB plan with new plan
  await prisma.dailyPlan.update({
    where: { id: currentPlan.id },
    data: {
      tomorrowQueue: result.tomorrowQueue,
      tasks: {
        deleteMany: {},
        create: result.newPlan.map(p => ({
          taskId: p.taskId,
          action: p.action.toUpperCase() as PlanAction,
          scheduledStart: p.scheduledStart,
          scheduledEnd: p.scheduledEnd,
          newDurationMinutes: p.newDurationMinutes,
          note: p.note,
          orderIndex: p.orderIndex,
        })),
      },
    },
  });

  res.json({ success: true, ...result });
});

/**
 * GET /api/scheduler/next
 * "What should I do right now?"
 */
export const getNext = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserByClerkId(req.clerkUserId!);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dbTasks, currentPlan] = await Promise.all([
    prisma.task.findMany({
      where: { userId: user.id, scheduledDate: { gte: today, lt: tomorrow } },
    }),
    prisma.dailyPlan.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
      include: { tasks: { orderBy: { orderIndex: 'asc' } } },
    }),
  ]);

  if (!currentPlan) {
    res.json({ success: true, taskId: null, message: 'Add your first task to get started!', isAllDone: false });
    return;
  }

  const engineTasks = toEngineTasks(dbTasks);
  const enginePlan = toEnginePlan(currentPlan.tasks);
  const result = getNextTask(engineTasks, enginePlan);

  res.json({ success: true, ...result });
});

/**
 * GET /api/scheduler/plan
 * Returns the full daily plan for today, including populated tasks.
 */
export const getPlan = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserByClerkId(req.clerkUserId!);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentPlan = await prisma.dailyPlan.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
    include: { 
      tasks: { 
        orderBy: { orderIndex: 'asc' },
        include: { task: true } // Include the actual task details
      } 
    },
  });

  if (!currentPlan) {
    res.json({ success: true, plan: null });
    return;
  }

  res.json({ success: true, plan: currentPlan });
});

/**
 * POST /api/scheduler/decision-mode
 * User has X minutes — what's the best task?
 */
export const runDecisionMode = asyncHandler(async (req: Request, res: Response) => {
  const parsed = decisionModeSchema.safeParse(req.body);
  if (!parsed.success) throw createError(parsed.error.message, 400);

  const { availableMinutes } = parsed.data;
  const user = await getUserByClerkId(req.clerkUserId!);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dbTasks, currentPlan] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: user.id,
        scheduledDate: { gte: today, lt: tomorrow },
        status: 'PENDING',
      },
    }),
    prisma.dailyPlan.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
      include: { tasks: true },
    }),
  ]);

  if (!currentPlan || dbTasks.length === 0) {
    res.json({ success: true, result: null, message: 'No tasks for today yet. Add some!' });
    return;
  }

  const engineTasks = toEngineTasks(dbTasks);
  const enginePlan = toEnginePlan(currentPlan.tasks);
  const result = decisionMode(availableMinutes, engineTasks, enginePlan);

  res.json({ success: true, result });
});
