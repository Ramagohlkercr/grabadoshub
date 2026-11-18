import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, closeDatabase, getDb, isRemoteMongoUri } from './config/database.js';
import { initAuth } from './auth/auth.js';
import { logger } from './utils/logger.util.js';

async function bootstrap() {
  try {
    let mongoUri = env.MONGODB_URI;

    try {
      await connectToDatabase(mongoUri);
    } catch (dbError) {
      const isRemote = isRemoteMongoUri(mongoUri);

      if (env.NODE_ENV === 'development' && !isRemote) {
        logger.info('MongoDB local no encontrado. Iniciando servidor en memoria para desarrollo...');
        const memModule = 'mongodb-memory-server';
        const { MongoMemoryServer } = (await import(memModule)) as any;
        const memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        await connectToDatabase(mongoUri);
      } else {
        logger.error('Error al conectar con la base de datos MongoDB:', dbError);
        throw dbError;
      }
    }

    const db = getDb();
    initAuth(db);

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`Servidor escuchando en el puerto ${env.PORT}`);
      logger.info(`API Health: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Señal ${signal} recibida, cerrando servidor...`);
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
