import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../auth/auth.js';
import { sendError } from '../utils/response.util.js';
import { AuthUser, AuthSession } from '../types/express.js';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = getAuth();
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData || !sessionData.user) {
      return sendError(res, 401, 'Autenticación requerida. Por favor iniciá sesión para continuar.');
    }

    req.user = sessionData.user as unknown as AuthUser;
    req.session = sessionData.session as unknown as AuthSession;
    return next();
  } catch (error) {
    return sendError(res, 401, 'Sesión inválida o expirada.', error instanceof Error ? error.message : undefined);
  }
}
