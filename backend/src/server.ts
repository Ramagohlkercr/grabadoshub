import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase, closeDatabase, getDb, isRemoteMongoUri } from './config/database.js';
import { initAuth } from './auth/auth.js';
import { logger } from './utils/logger.util.js';

async function bootstrap() {
  try {
    logger.info(`Iniciando GrabadosHub Backend en modo: ${env.NODE_ENV.toUpperCase()}...`);

    let mongoUri = env.MONGODB_URI;

    // Strict rule: in production or with MongoDB Atlas, a real persistent database is mandatory.
    // Silent fallback to an in-memory database in production is strictly prevented.
    try {
      await connectToDatabase(mongoUri);
    } catch (dbError) {
      const isRemote = isRemoteMongoUri(mongoUri);

      if (env.NODE_ENV === 'development' && !isRemote) {
        logger.warn('⚠️ No se detectó un daemon local de MongoDB en localhost:27017.');
        logger.info('Iniciando MongoMemoryServer embebido para desarrollo local...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        logger.info(`Base de datos en memoria iniciada en: ${mongoUri}`);
        await connectToDatabase(mongoUri);
      } else {
        logger.error(
          '❌ Error fatal al conectar con MongoDB. En producción o al usar MongoDB Atlas se exige una base persistente real.'
        );
        logger.error('Verifique MONGODB_URI y la lista de acceso de red (IP Access List 0.0.0.0/0) en MongoDB Atlas.');
        throw dbError;
      }
    }

    const db = getDb();
    initAuth(db);
    logger.info('✅ Better Auth inicializado con adaptador nativo de MongoDB');

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Servidor GrabadosHub API escuchando en el puerto ${env.PORT}`);
      logger.info(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
      logger.info(`🔐 Auth Base URL: ${env.BETTER_AUTH_URL}/api/auth`);
      logger.info(`📦 Catálogo de Productos: http://localhost:${env.PORT}/api/products`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Señal ${signal} recibida. Cerrando conexiones de forma segura...`);
      server.close(async () => {
        await closeDatabase();
        logger.info('Servidor finalizado exitosamente.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Error fatal durante el inicio de la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
