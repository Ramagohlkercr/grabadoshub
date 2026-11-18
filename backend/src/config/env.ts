import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const defaultProtocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

const normalizeUrl = (val: string, defProto = defaultProtocol) => {
  if (!val || val.trim() === '') return val;
  const trimmed = val.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `${defProto}${trimmed}`;
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/grabadoshub'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(16, 'BETTER_AUTH_SECRET debe tener al menos 16 caracteres')
    .default('grabadoshub_super_secret_dev_key_32_chars_min!'),
  BETTER_AUTH_URL: z
    .string()
    .transform((val) => normalizeUrl(val))
    .pipe(z.string().url())
    .default('http://localhost:4000'),
  FRONTEND_URL: z
    .string()
    .transform((val) => normalizeUrl(val))
    .default('http://localhost:5173'),
  GITHUB_CLIENT_ID: z.string().optional().default(''),
  GITHUB_CLIENT_SECRET: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error crítico en variables de entorno:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
