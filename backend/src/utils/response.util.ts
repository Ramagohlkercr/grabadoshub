import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendCreated<T>(res: Response, data: T, message = 'Recurso creado exitosamente') {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function sendNoContent(res: Response) {
  return res.status(204).send();
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
