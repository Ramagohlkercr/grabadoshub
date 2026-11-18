import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app.js';
import { connectToDatabase, closeDatabase, getDb } from '../config/database.js';
import { initAuth } from '../auth/auth.js';
import { Express } from 'express';
import { Db, ObjectId } from 'mongodb';

describe('Pruebas E2E de Ciclo Completo', () => {
  let mongod: MongoMemoryServer;
  let app: Express;
  let db: Db;
  let auth: ReturnType<typeof initAuth>;

  const ORIGIN = 'http://localhost:5173';

  // Session variables
  let userCookie: string;
  let userSessionToken: string;
  let adminCookie: string;
  let createdProductId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.BETTER_AUTH_SECRET = 'grabadoshub_super_secret_dev_key_32_chars_min!';
    process.env.BETTER_AUTH_URL = 'http://localhost:4000';
    process.env.FRONTEND_URL = 'http://localhost:5173';
    process.env.GITHUB_CLIENT_ID = 'test_github_client_id_for_e2e';
    process.env.GITHUB_CLIENT_SECRET = 'test_github_client_secret_for_e2e';

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectToDatabase(uri);

    db = getDb();
    auth = initAuth(db);
    app = createApp();
  });

  afterAll(async () => {
    await closeDatabase();
    await mongod.stop();
  });

  describe('1. E2E: Registro de Usuario Regular & Verificación en MongoDB', () => {
    it('Debe registrar un usuario regular y persistirlo en MongoDB con role: "user"', async () => {
      const signupPayload = {
        name: 'Carlos Estudiante UAI',
        email: 'carlos.uai@grabadoshub.com',
        password: 'PasswordSegura2026!',
      };

      const res = await request(app)
        .post('/api/auth/sign-up/email')
        .set('Origin', ORIGIN)
        .send(signupPayload);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(signupPayload.email);
      expect(res.body.user.role).toBe('user');

      // 1.1 Verificar directamente en MongoDB colección 'user'
      const userInDb = await db.collection('user').findOne({ email: signupPayload.email });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.name).toBe(signupPayload.name);
      expect(userInDb?.role).toBe('user');

      // 1.2 Verificar en MongoDB colección 'account' que la contraseña esté hasheada (no texto plano)
      const accountInDb = await db.collection('account').findOne({ userId: userInDb?._id });
      expect(accountInDb).not.toBeNull();
      expect(accountInDb?.password).not.toBe(signupPayload.password);
      expect(accountInDb?.password).toContain(':'); // Formato hash:salt
    });
  });

  describe('2. E2E: Login por Email y Contraseña', () => {
    it('Debe rechazar credenciales incorrectas', async () => {
      const res = await request(app)
        .post('/api/auth/sign-in/email')
        .set('Origin', ORIGIN)
        .send({
          email: 'carlos.uai@grabadoshub.com',
          password: 'ContraseñaErronea123!',
        });

      expect([400, 401]).toContain(res.status);
    });

    it('Debe autenticar correctamente con email y contraseña, emitiendo cookies de sesión', async () => {
      const res = await request(app)
        .post('/api/auth/sign-in/email')
        .set('Origin', ORIGIN)
        .send({
          email: 'carlos.uai@grabadoshub.com',
          password: 'PasswordSegura2026!',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('carlos.uai@grabadoshub.com');

      const setCookies = res.headers['set-cookie'];
      expect(setCookies).toBeDefined();

      userCookie = Array.isArray(setCookies) ? setCookies.join('; ') : setCookies;
      expect(userCookie).toContain('better-auth');

      // Obtener el token de la sesión activa
      const sessionRes = await request(app)
        .get('/api/auth/get-session')
        .set('Cookie', userCookie);

      expect(sessionRes.body?.session?.token).toBeDefined();
      userSessionToken = sessionRes.body.session.token;

      // 2.1 Verificar en MongoDB colección 'session' que la sesión exista
      const sessionInDb = await db.collection('session').findOne({ token: userSessionToken });
      expect(sessionInDb).not.toBeNull();
      expect(sessionInDb?.token).toBe(userSessionToken);
    });
  });

  describe('3. E2E: Persistencia de Sesión', () => {
    it('Debe validar la sesión activa y retornar datos del usuario mediante GET /api/auth/get-session', async () => {
      const res = await request(app)
        .get('/api/auth/get-session')
        .set('Cookie', userCookie);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('carlos.uai@grabadoshub.com');
      expect(res.body.user.role).toBe('user');
      expect(res.body.session.token).toBe(userSessionToken);
    });
  });

  describe('4. E2E: Bloqueo de Usuario Común en Operaciones de Administración (RBAC)', () => {
    it('Usuario común NO puede consultar métricas del dashboard (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/products/metrics')
        .set('Cookie', userCookie);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Acceso denegado');
    });

    it('Usuario común NO puede crear productos (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', userCookie)
        .send({
          name: 'Producto No Autorizado',
          description: 'Intento de creación sin permisos.',
          category: 'Ecocuero',
          price: 5000,
          stock: 10,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Usuario común NO puede editar productos (403 Forbidden)', async () => {
      const dummyId = new ObjectId().toString();
      const res = await request(app)
        .patch(`/api/products/${dummyId}`)
        .set('Cookie', userCookie)
        .send({ price: 9999 });

      expect(res.status).toBe(403);
    });

    it('Usuario común NO puede eliminar productos (403 Forbidden)', async () => {
      const dummyId = new ObjectId().toString();
      const res = await request(app)
        .delete(`/api/products/${dummyId}`)
        .set('Cookie', userCookie);

      expect(res.status).toBe(403);
    });
  });

  describe('5. E2E: Logout y Revocación de Sesión', () => {
    it('Debe cerrar la sesión mediante POST /api/auth/sign-out y revocar el token en MongoDB', async () => {
      const res = await request(app)
        .post('/api/auth/sign-out')
        .set('Origin', ORIGIN)
        .set('Cookie', userCookie);

      expect(res.status).toBe(200);

      // 5.1 Verificar que get-session ya no reconozca la cookie
      const checkRes = await request(app)
        .get('/api/auth/get-session')
        .set('Cookie', userCookie);

      expect(checkRes.body).toBeNull();

      // 5.2 Verificar que la sesión fue eliminada de MongoDB
      const sessionInDb = await db.collection('session').findOne({ token: userSessionToken });
      expect(sessionInDb).toBeNull();
    });
  });

  describe('6. E2E: Administrador Inicial, Login y Acceso al Panel', () => {
    beforeAll(async () => {
      const adminEmail = 'admin.e2e@grabadoshub.com';
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: 'AdminPassword2026!',
          name: 'Super Admin E2E',
        },
      });

      await db.collection('user').updateOne(
        { email: adminEmail },
        { $set: { role: 'admin' } }
      );

      const loginRes = await request(app)
        .post('/api/auth/sign-in/email')
        .set('Origin', ORIGIN)
        .send({
          email: adminEmail,
          password: 'AdminPassword2026!',
        });

      const setCookies = loginRes.headers['set-cookie'];
      adminCookie = Array.isArray(setCookies) ? setCookies.join('; ') : setCookies;
    });

    it('Admin autenticado puede acceder a las métricas del catálogo (200 OK)', async () => {
      const res = await request(app)
        .get('/api/products/metrics')
        .set('Cookie', adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBeDefined();
      expect(res.body.data.available).toBeDefined();
      expect(Array.isArray(res.body.data.categoryStats)).toBe(true);
    });
  });

  describe('7. E2E: Alta de Producto (CRUD Create)', () => {
    it('Rechaza creación si el esquema Zod no cumple las validaciones (400 Bad Request)', async () => {
      const invalidProduct = {
        name: 'X', // Menos de 2 caracteres
        price: -100, // Precio negativo
        stock: -5, // Stock negativo
        category: 'MetalicoInexistente', // Categoría inválida
      };

      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(invalidProduct);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
    });

    it('Admin crea producto exitosamente con 201 Created y persiste en MongoDB', async () => {
      const validProduct = {
        name: 'Placa Conmemorativa Acrílico Grabado E2E',
        description: 'Placa de acrílico cristal colado de 6 mm con grabado láser invertido de alta resolución.',
        category: 'Acrílico',
        price: 28500,
        stock: 12,
        available: true,
        featured: true,
        imageUrl: '/assets/products/cartel-acrilico.svg',
      };

      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(validProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.name).toBe(validProduct.name);
      expect(res.body.data.category).toBe('Acrílico');

      createdProductId = res.body.data._id;

      // Verificar en MongoDB
      const productInDb = await db.collection('products').findOne({ _id: new ObjectId(createdProductId) });
      expect(productInDb).not.toBeNull();
      expect(productInDb?.name).toBe(validProduct.name);
      expect(productInDb?.price).toBe(28500);
    });
  });

  describe('8. E2E: Búsqueda, Filtrado y Paginación en Catálogo', () => {
    beforeAll(async () => {
      await db.collection('products').insertMany([
        {
          name: 'Cuaderno Ecocuero Suave',
          description: 'Cuaderno tamaño A5 ecocuero grabado.',
          category: 'Ecocuero',
          price: 15000,
          stock: 20,
          available: true,
          featured: false,
          imageUrl: '/assets/products/cuaderno-ecocuero.svg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Placa Poliamida Técnica',
          description: 'Identificación industrial en poliamida.',
          category: 'Poliamida',
          price: 9000,
          stock: 0,
          available: false,
          featured: false,
          imageUrl: '/assets/products/placa-poliamida.svg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Mate Acero Térmico',
          description: 'Mate grabado con láser perimetral.',
          category: 'Accesorios',
          price: 22000,
          stock: 35,
          available: true,
          featured: true,
          imageUrl: '/assets/products/mate-accesorios.svg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    });

    it('Filtra productos por categoría (category=Ecocuero)', async () => {
      const res = await request(app).get('/api/products?category=Ecocuero');
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
      res.body.data.products.forEach((p: any) => {
        expect(p.category).toBe('Ecocuero');
      });
    });

    it('Filtra productos por disponibilidad (available=true)', async () => {
      const res = await request(app).get('/api/products?available=true');
      expect(res.status).toBe(200);
      res.body.data.products.forEach((p: any) => {
        expect(p.available).toBe(true);
      });
    });

    it('Busca productos por término de búsqueda (search=Conmemorativa)', async () => {
      const res = await request(app).get('/api/products?search=Conmemorativa');
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(1);
      expect(res.body.data.products[0].name).toContain('Conmemorativa');
    });

    it('Pagina correctamente con limit y page especificados', async () => {
      const res = await request(app).get('/api/products?limit=2&page=1');
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(2);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(2);
      expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(4);
      expect(res.body.data.pagination.totalPages).toBeGreaterThanOrEqual(2);
      expect(res.body.data.pagination.hasNextPage).toBe(true);
    });
  });

  describe('9. E2E: Modificación de Producto (CRUD Update)', () => {
    it('Admin actualiza precio, stock y nombre exitosamente con 200 OK', async () => {
      const updatePayload = {
        name: 'Placa Conmemorativa Acrílico Cristal — EDICIÓN ACTUALIZADA',
        price: 32000,
        stock: 25,
      };

      const res = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(updatePayload.name);
      expect(res.body.data.price).toBe(32000);
      expect(res.body.data.stock).toBe(25);

      const inDb = await db.collection('products').findOne({ _id: new ObjectId(createdProductId) });
      expect(inDb?.name).toBe(updatePayload.name);
      expect(inDb?.price).toBe(32000);
    });
  });

  describe('10. E2E: Eliminación de Producto (CRUD Delete)', () => {
    it('Admin elimina producto con 204 No Content y comprueba ausencia en MongoDB', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Cookie', adminCookie);

      expect(res.status).toBe(204);

      const getRes = await request(app).get(`/api/products/${createdProductId}`);
      expect(getRes.status).toBe(404);

      const inDb = await db.collection('products').findOne({ _id: new ObjectId(createdProductId) });
      expect(inDb).toBeNull();
    });
  });

  describe('11. E2E: GitHub OAuth Sign-In Flow', () => {
    it('Debe generar la URL de autorización hacia GitHub con callbackURL válido', async () => {
      const res = await request(app)
        .post('/api/auth/sign-in/social')
        .set('Origin', ORIGIN)
        .send({
          provider: 'github',
          callbackURL: 'http://localhost:5173/admin/dashboard',
        });

      expect(res.status).toBe(200);
      expect(res.body.url).toBeDefined();
      expect(res.body.url).toContain('https://github.com/login/oauth/authorize');
      expect(res.body.url).toContain('client_id=test_github_client_id_for_e2e');
      expect(res.body.url).toContain('redirect_uri=');
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });
});
