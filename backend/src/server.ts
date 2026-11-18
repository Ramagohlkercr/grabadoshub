import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, closeDatabase, getDb } from './config/database.js';
import { initAuth } from './auth/auth.js';
import { logger } from './utils/logger.util.js';

async function bootstrap() {
  try {
    logger.info(`Starting GrabadosHub Backend in ${env.NODE_ENV} mode...`);

    let mongoUri = env.MONGODB_URI;

    // In development mode, if local MongoDB fails to connect, gracefully fallback to in-memory MongoDB
    try {
      await connectToDatabase(mongoUri);
    } catch (dbError) {
      if (env.NODE_ENV === 'development') {
        logger.warn('⚠️ Local MongoDB connection failed. Starting embedded MongoMemoryServer for development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        logger.info(`Embedded MongoDB started at: ${mongoUri}`);
        await connectToDatabase(mongoUri);
      } else {
        throw dbError;
      }
    }

    const db = getDb();
    initAuth(db);
    logger.info('✅ Better Auth initialized with MongoDB adapter');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 GrabadosHub API Server listening on port ${env.PORT}`);
      logger.info(`📡 Health Check endpoint: http://localhost:${env.PORT}/api/health`);
      logger.info(`🔐 Auth Base URL: ${env.BETTER_AUTH_URL}/api/auth`);
      logger.info(`📦 Products endpoint: http://localhost:${env.PORT}/api/products`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await closeDatabase();
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Fatal bootstrap error:', error);
    process.exit(1);
  }
}

bootstrap();
