import { Request, Response } from 'express';
import { getMongoClient } from '../config/database.js';
import { env } from '../config/env.js';
import { sendSuccess } from '../utils/response.util.js';

export class HealthController {
  static async check(req: Request, res: Response) {
    let dbStatus = 'disconnected';

    try {
      const client = getMongoClient();
      await client.db().command({ ping: 1 });
      dbStatus = 'connected';
    } catch {
      dbStatus = 'error';
    }

    return sendSuccess(res, {
      status: 'ok',
      service: 'GrabadosHub API REST',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
    });
  }
}
