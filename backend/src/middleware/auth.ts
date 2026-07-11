import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';
import { createError } from './errorHandler';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Extend Express Request to include our userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      clerkUserId?: string;
    }
  }
}

/**
 * Auth middleware — verifies Clerk JWT from Authorization header.
 * Attaches userId (our DB user id) and clerkUserId to req.
 *
 * Usage: router.get('/tasks', requireAuth, taskController.getAll)
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return next(createError('Authorization token required', 401));
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT with Clerk
    const { verifyToken } = await import('@clerk/backend');
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY ?? '',
    });

    if (!payload?.sub) {
      return next(createError('Invalid token', 401));
    }

    req.clerkUserId = payload.sub;
    req.userId = payload.sub;

    next();
  } catch {
    next(createError('Invalid or expired token', 401));
  }
}
