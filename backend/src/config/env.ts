import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/grabadoshub'),
  BETTER_AUTH_SECRET: z.string().min(16, 'BETTER_AUTH_SECRET must be at least 16 characters').default('grabadoshub_super_secret_dev_key_32_chars_min!'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:4000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  GITHUB_CLIENT_ID: z.string().optional().default(''),
  GITHUB_CLIENT_SECRET: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment configuration error:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
