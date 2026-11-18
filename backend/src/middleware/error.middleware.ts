import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.util.js';
import { sendError } from '../utils/response.util.js';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  logger.error('Unhandled request error:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 400, 'Datos de solicitud inválidos', formattedErrors);
  }

  const message = err instanceof Error ? err.message : 'Error interno del servidor';
  const errorDetails = env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined;

  return sendError(res, 500, message, errorDetails);
}
