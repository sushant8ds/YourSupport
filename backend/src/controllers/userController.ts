import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';

/**
 * GET /api/user/profile
 * Returns the user's identity profile, XP, streak, and recent stats.
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { clerkId: req.clerkUserId! },
    select: {
      name: true,
      identityStage: true,
      xp: true,
      streakDays: true,
      createdAt: true,
    }
  });

  if (!user) throw createError('User not found', 404);

  // Get total tasks completed
  const totalTasksCompleted = await prisma.task.count({
    where: {
      userId: req.userId!,
      status: 'COMPLETED'
    }
  });

  res.json({
    success: true,
    profile: {
      ...user,
      totalTasksCompleted,
    }
  });
});
