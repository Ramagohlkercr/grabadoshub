import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins/admin';
import { Db } from 'mongodb';
import { env } from '../config/env.js';

let authInstance: ReturnType<typeof initAuth> | null = null;

export function initAuth(db: Db) {
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  const auth = betterAuth({
    database: mongodbAdapter(db),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
      env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:4000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4000',
    ],
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
    throw new Error('Auth not initialized. Call initAuth(db) first.');
  }
  return authInstance;
}
