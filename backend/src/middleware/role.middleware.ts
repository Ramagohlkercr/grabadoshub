import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Autenticación requerida.');
    }

    const userRole = req.user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      return sendError(
        res,
        403,
        `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}. Tu rol actual es: ${userRole}.`
      );
    }

    return next();
  };
}
