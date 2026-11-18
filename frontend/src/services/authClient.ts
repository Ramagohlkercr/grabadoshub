import { createAuthClient } from 'better-auth/react';
import { adminClient } from 'better-auth/client/plugins';

// In development, Vite proxies /api to http://localhost:4000
// In production on Render, Render rewrite /api/* routes to the backend Web Service
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  plugins: [adminClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
