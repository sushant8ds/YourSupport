import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { TaskStatus } from '@prisma/client';

// ─── Validation Schemas ───────────────────────────────────────

const createTaskSchema = z.object({
  name: z.string().trim().min(1, 'Task name cannot be empty').max(100),
  durationMinutes: z.number().int().min(15, 'Minimum task duration is 15 minutes').max(720),
  importance: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]),
  mustFinishToday: z.boolean(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').optional(),
});

const updateTaskSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  durationMinutes: z.number().int().min(15).max(720).optional(),
  importance: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
  ]).optional(),
  mustFinishToday: z.boolean().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

// ─── Helper: Resolve user ─────────────────────────────────────

async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw createError('User not found', 404);
  return user;
}

// ─── Controllers ─────────────────────────────────────────────

/**
 * GET /api/tasks
 * Retrieve tasks for a specific date (defaults to today)
 */
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserByClerkId(req.clerkUserId!);
  
  const dateStr = req.query.date as string;
  let targetDate = new Date();
  
  if (dateStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw createError('Date must be in YYYY-MM-DD format', 400);
    }
    targetDate = new Date(dateStr);
  }

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      scheduledDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ success: true, tasks });
});

/**
 * POST /api/tasks
 * Create a new task
 */
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createError(parsed.error.message, 400);
  }

  const user = await getUserByClerkId(req.clerkUserId!);
  const { name, durationMinutes, importance, mustFinishToday, scheduledDate } = parsed.data;

  // Default to today if scheduledDate not provided
  let taskDate = new Date();
  if (scheduledDate) {
    taskDate = new Date(scheduledDate);
  }
  taskDate.setHours(0, 0, 0, 0);

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      name,
      durationMinutes,
      importance,
      mustFinishToday,
      scheduledDate: taskDate,
      status: TaskStatus.PENDING,
    },
  });

  res.status(201).json({ success: true, task });
});

/**
 * PATCH /api/tasks/:id
 * Update a task details or status
 */
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw createError(parsed.error.message, 400);
  }

  const user = await getUserByClerkId(req.clerkUserId!);

  // Verify task ownership
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: user.id },
  });

  if (!existingTask) {
    throw createError('Task not found or unauthorized', 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: parsed.data,
  });

  res.json({ success: true, task: updatedTask });
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUserByClerkId(req.clerkUserId!);

  // Verify task ownership
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: user.id },
  });

  if (!existingTask) {
    throw createError('Task not found or unauthorized', 404);
  }

  await prisma.task.delete({
    where: { id },
  });

  res.json({ success: true, message: 'Task deleted successfully' });
});
