import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins/admin';
import { Db } from 'mongodb';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.util.js';

let authInstance: ReturnType<typeof initAuth> | null = null;

export function initAuth(db: Db) {
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  const githubClientId = process.env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || env.GITHUB_CLIENT_SECRET;

  if (githubClientId && githubClientSecret) {
    socialProviders.github = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    };
    logger.info('GitHub OAuth activado.');
  } else {
    logger.warn('GitHub OAuth no configurado (falta GITHUB_CLIENT_ID o GITHUB_CLIENT_SECRET).');
  }

  const trustedOrigins = [
    env.FRONTEND_URL,
    env.BETTER_AUTH_URL,
    'http://localhost:5173',
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4000',
    '*.onrender.com',
    'https://*.onrender.com',
  ];

  const auth = betterAuth({
    database: mongodbAdapter(db),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: true,
    },
    socialProviders,
    plugins: [
      admin({
        defaultRole: 'user',
        adminRole: 'admin',
      }),
    ],
  });

  authInstance = auth;
  return auth;
}

export function getAuth() {
  if (!authInstance) {
    throw new Error('Auth no inicializado. Debe invocar initAuth(db) previamente.');
  }
  return authInstance;
}
