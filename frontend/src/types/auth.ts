export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}
