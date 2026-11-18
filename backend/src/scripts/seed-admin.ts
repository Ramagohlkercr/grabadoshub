import { connectToDatabase, closeDatabase, getDb } from '../config/database.js';
import { initAuth } from '../auth/auth.js';
import { logger } from '../utils/logger.util.js';
import { env } from '../config/env.js';

async function seedAdmin() {
  try {
    logger.info('🌱 Starting admin user seed process...');

    let mongoUri = env.MONGODB_URI;
    try {
      await connectToDatabase(mongoUri);
    } catch {
      logger.warn('⚠️ Starting embedded MongoMemoryServer for seed...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      await connectToDatabase(mongoUri);
    }

    const db = getDb();
    const auth = initAuth(db);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@grabadoshub.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminGrabados2026!';
    const adminName = process.env.ADMIN_NAME || 'Administrador General';

    // Check if admin already exists
    const existingAdmin = await db.collection('user').findOne({ email: adminEmail });

    if (existingAdmin) {
      logger.info(`ℹ️ Admin user already exists with ID: ${existingAdmin._id}. Ensuring role='admin'...`);
      await db.collection('user').updateOne({ _id: existingAdmin._id }, { $set: { role: 'admin' } });
      logger.info('✅ Existing user confirmed as admin.');
    } else {
      logger.info(`Creating initial administrator: ${adminEmail}...`);
      const userRes = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      if (userRes && userRes.user) {
        // Upgrade role to admin in database
        await db.collection('user').updateOne(
          { email: adminEmail },
          { $set: { role: 'admin' } }
        );
        logger.info(`✅ Administrator created successfully: ${adminEmail}`);
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
      logger.info(`✅ Evaluation test regular user created: ${userEmail}`);
    } else {
      logger.info(`ℹ️ Test regular user ${userEmail} already exists.`);
    }

    logger.info('--------------------------------------------------');
    logger.info('🎉 Seed completed successfully!');
    logger.info('ADMIN CREDENTIALS:');
    logger.info(`  Email:    ${adminEmail}`);
    logger.info(`  Password: ${adminPassword}`);
    logger.info(`  Role:     admin`);
    logger.info('REGULAR USER CREDENTIALS:');
    logger.info(`  Email:    ${userEmail}`);
    logger.info(`  Password: ${userPassword}`);
    logger.info(`  Role:     user`);
    logger.info('--------------------------------------------------');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
