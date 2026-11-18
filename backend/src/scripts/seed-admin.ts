import { connectToDatabase, closeDatabase, getDb, isRemoteMongoUri } from '../config/database.js';
import { initAuth } from '../auth/auth.js';
import { logger } from '../utils/logger.util.js';
import { env } from '../config/env.js';

async function seedAdmin() {
  try {
    logger.info('Iniciando seed de usuarios...');

    let mongoUri = env.MONGODB_URI;
    try {
      await connectToDatabase(mongoUri);
    } catch (dbError) {
      const isRemote = isRemoteMongoUri(mongoUri);

      if (env.NODE_ENV === 'development' && !isRemote) {
        logger.info('Iniciando base de datos en memoria para el seed...');
        const memModule = 'mongodb-memory-server';
        const { MongoMemoryServer } = (await import(memModule)) as any;
        const memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        await connectToDatabase(mongoUri);
      } else {
        logger.error('Error conectando a MongoDB:', dbError);
        throw dbError;
      }
    }

    const db = getDb();
    const auth = initAuth(db);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@grabadoshub.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminGrabados2026!';
    const adminName = process.env.ADMIN_NAME || 'Administrador General';

    // Check if admin already exists
    const existingAdmin = await db.collection('user').findOne({ email: adminEmail });

    if (existingAdmin) {
      logger.info(`El usuario admin ya existe (${adminEmail}). Actualizando rol...`);
      await db.collection('user').updateOne({ _id: existingAdmin._id }, { $set: { role: 'admin' } });
      logger.info('Rol admin confirmado.');
    } else {
      logger.info(`Creando usuario admin: ${adminEmail}...`);
      const userRes = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      if (userRes && userRes.user) {
        // Upgrade role to admin in database securely
        await db.collection('user').updateOne(
          { email: adminEmail },
          { $set: { role: 'admin' } }
        );
        logger.info(`✅ Administrador creado exitosamente: ${adminEmail} (Rol: admin)`);
      }
    }

    // Also seed a test regular user for evaluation
    const userEmail = 'usuario@grabadoshub.com';
    const userPassword = 'UserGrabados2026!';
    const userName = 'Cliente Demo';

    const existingUser = await db.collection('user').findOne({ email: userEmail });
    if (!existingUser) {
      await auth.api.signUpEmail({
        body: {
          email: userEmail,
          password: userPassword,
          name: userName,
        },
      });
      logger.info(`Usuario común creado: ${userEmail}`);
    } else {
      logger.info(`El usuario ${userEmail} ya existe.`);
    }

    logger.info('Seed de usuarios completado.');
    logger.info(`Admin: ${adminEmail} | User: ${userEmail}`);

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error durante la ejecución del seed de usuarios:', error);
    process.exit(1);
  }
}

seedAdmin();
