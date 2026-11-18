import { connectToDatabase, closeDatabase, getDb, isRemoteMongoUri } from '../config/database.js';
import { initAuth } from '../auth/auth.js';
import { logger } from '../utils/logger.util.js';
import { env } from '../config/env.js';

async function seedAdmin() {
  try {
    logger.info('🌱 Iniciando script de inicialización de usuarios (Seed Admin & User)...');

    let mongoUri = env.MONGODB_URI;
    try {
      await connectToDatabase(mongoUri);
    } catch (dbError) {
      const isRemote = isRemoteMongoUri(mongoUri);

      if (env.NODE_ENV === 'development' && !isRemote) {
        logger.warn('⚠️ MongoDB local no disponible. Iniciando MongoMemoryServer temporal para seed local...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const memoryServer = await MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
        await connectToDatabase(mongoUri);
      } else {
        logger.error(
          '❌ Error conectando a MongoDB para el seed. En producción o con MongoDB Atlas se requiere una conexión persistente real.'
        );
        logger.error('Verifique que MONGODB_URI sea correcta y que la IP esté habilitada en MongoDB Atlas (Network Access).');
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
      logger.info(`ℹ️ El usuario administrador ya existe con ID: ${existingAdmin._id}. Confirmando rol='admin'...`);
      await db.collection('user').updateOne({ _id: existingAdmin._id }, { $set: { role: 'admin' } });
      logger.info('✅ Rol admin verificado y confirmado.');
    } else {
      logger.info(`Creando usuario administrador inicial: ${adminEmail}...`);
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
      logger.info(`✅ Usuario regular de evaluación creado: ${userEmail} (Rol: user)`);
    } else {
      logger.info(`ℹ️ El usuario regular de prueba ${userEmail} ya existe.`);
    }

    logger.info('--------------------------------------------------');
    logger.info('🎉 Seed de usuarios finalizado con éxito');
    logger.info('CREDENCIALES DE EVALUACIÓN:');
    logger.info(`  [ADMIN] Email:    ${adminEmail}`);
    logger.info(`          Password: ${adminPassword}`);
    logger.info(`          Rol:      admin (Acceso completo a /admin)`);
    logger.info(`  [USER]  Email:    ${userEmail}`);
    logger.info(`          Password: ${userPassword}`);
    logger.info(`          Rol:      user (Solo lectura de catálogo)`);
    logger.info('--------------------------------------------------');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error durante la ejecución del seed de usuarios:', error);
    process.exit(1);
  }
}

seedAdmin();
