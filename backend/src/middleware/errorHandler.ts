import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handler middleware.
 * Must be added LAST in Express middleware chain.
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : 'Something went wrong. Please try again.';

  console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode}: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * Creates a typed operational error.
 * Operational errors are safe to show to users.
 */
export function createError(message: string, statusCode = 400): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

/**
 * Async wrapper to avoid try/catch in every route handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
