import { Request, Response } from 'express';
import { sendError } from '../utils/response.util.js';

export function notFoundHandler(req: Request, res: Response) {
  return sendError(
    res,
    404,
    `Ruta no encontrada: ${req.method} ${req.originalUrl}. Verifique el endpoint solicitado.`
  );
}
