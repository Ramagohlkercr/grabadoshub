import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app.js';
import { connectToDatabase, closeDatabase, getDb } from '../config/database.js';
import { initAuth } from '../auth/auth.js';
import { Express } from 'express';

describe('GrabadosHub Backend REST API & Auth Suite', () => {
  let mongod: MongoMemoryServer;
  let app: Express;
  let auth: ReturnType<typeof initAuth>;
  let userCookie: string;
  let adminCookie: string;
  let createdProductId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.BETTER_AUTH_SECRET = 'super-secret-key-for-testing-purposes-12345';
    process.env.BETTER_AUTH_URL = 'http://localhost:4000';

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectToDatabase(uri);

    const db = getDb();
    auth = initAuth(db);
    app = createApp();

    // Register regular user
    await auth.api.signUpEmail({
      body: {
        email: 'user-test@grabadoshub.com',
        password: 'Password123!',
        name: 'Regular Test User',
      },
    });

    // Login regular user to get cookie
    const userLoginRes = await request(app)
      .post('/api/auth/sign-in/email')
      .send({
        email: 'user-test@grabadoshub.com',
        password: 'Password123!',
      });
    const userSetCookies = userLoginRes.headers['set-cookie'];
    userCookie = Array.isArray(userSetCookies) ? userSetCookies.join('; ') : userSetCookies || '';

    // Register admin user
    await auth.api.signUpEmail({
      body: {
        email: 'admin-test@grabadoshub.com',
        password: 'Password123!',
        name: 'Admin Test User',
      },
    });

    // Upgrade to admin role in database
    await db.collection('user').updateOne(
      { email: 'admin-test@grabadoshub.com' },
      { $set: { role: 'admin' } }
    );

    // Login admin user to get cookie
    const adminLoginRes = await request(app)
      .post('/api/auth/sign-in/email')
      .send({
        email: 'admin-test@grabadoshub.com',
        password: 'Password123!',
      });
    const adminSetCookies = adminLoginRes.headers['set-cookie'];
    adminCookie = Array.isArray(adminSetCookies) ? adminSetCookies.join('; ') : adminSetCookies || '';
  });

  afterAll(async () => {
    await closeDatabase();
    await mongod.stop();
  });

  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return 200 with ok status and db connected', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.database).toBe('connected');
    });
  });

  describe('2. Public Products Catalog', () => {
    it('GET /api/products should be public and return empty array initially', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
    });

    it('GET /api/products/:id should return 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/products/invalid-id-123');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/products/:id should return 404 for non-existent valid ObjectId', async () => {
      const res = await request(app).get('/api/products/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Product Creation & Authorization Permissions', () => {
    const validProduct = {
      name: 'Cuaderno Ecocuero Grabado',
      description: 'Cuaderno premium con grabado láser personalizado en bajo relieve.',
      category: 'Ecocuero',
      price: 15000,
      stock: 25,
      available: true,
      featured: true,
      imageUrl: '/assets/products/cuaderno.svg',
    };

    it('POST /api/products without authentication should return 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(validProduct);
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/products with regular user session should return 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', userCookie)
        .send(validProduct);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/products with invalid Zod schema should return 400 Bad Request', async () => {
      const invalidProduct = {
        name: 'A', // too short
        price: -500, // negative price
        stock: -1, // negative stock
        category: 'Inexistente', // invalid category
      };
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(invalidProduct);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('POST /api/products with admin session should return 201 Created', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(validProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(validProduct.name);
      expect(res.body.data.category).toBe('Ecocuero');
      expect(res.body.data._id).toBeDefined();

      createdProductId = res.body.data._id;
    });
  });

  describe('4. Product Details, Updates & Metrics', () => {
    it('GET /api/products/:id should return 200 with product details', async () => {
      const res = await request(app).get(`/api/products/${createdProductId}`);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(createdProductId);
      expect(res.body.data.name).toBe('Cuaderno Ecocuero Grabado');
    });

    it('PATCH /api/products/:id without admin role should return 403 Forbidden', async () => {
      const res = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', userCookie)
        .send({ price: 17500 });
      expect(res.status).toBe(403);
    });

    it('PATCH /api/products/:id with admin role should update and return 200', async () => {
      const res = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie)
        .send({
          price: 18000,
          stock: 30,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(18000);
      expect(res.body.data.stock).toBe(30);
    });

    it('GET /api/products/metrics should return 403 for regular user', async () => {
      const res = await request(app)
        .get('/api/products/metrics')
        .set('Cookie', userCookie);
      expect(res.status).toBe(403);
    });

    it('GET /api/products/metrics should return 200 and real statistics for admin', async () => {
      const res = await request(app)
        .get('/api/products/metrics')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBeGreaterThanOrEqual(1);
      expect(res.body.data.available).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(res.body.data.categoryStats)).toBe(true);
    });
  });

  describe('5. Product Deletion', () => {
    it('DELETE /api/products/:id with regular user should return 403 Forbidden', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Cookie', userCookie);
      expect(res.status).toBe(403);
    });

    it('DELETE /api/products/:id with admin should return 204 No Content', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie);
      expect(res.status).toBe(204);

      // Verify deletion
      const checkRes = await request(app).get(`/api/products/${createdProductId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
