import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { env } from './config/env.js';
import { getAuth } from './auth/auth.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.middleware.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Trust reverse proxy (Essential on Render, Heroku and cloud deployments for secure cookies and accurate client IP)
  app.set('trust proxy', 1);

  // Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    env.BETTER_AUTH_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow server-to-server, mobile or same-origin requests with no origin header
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith('.onrender.com') ||
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
      exposedHeaders: ['Set-Cookie'],
    })
  );

  // Better Auth Route Handler - mounted before generic json parsers
  app.all('/api/auth/*', authLimiter, (req, res) => {
    const auth = getAuth();
    return toNodeHandler(auth)(req, res);
  });

  // Body parsers for application routes
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Rate Limiting for API routes
  app.use('/api', apiLimiter);

  // Application REST API Routes
  app.use('/api', apiRoutes);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
