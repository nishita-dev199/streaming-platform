import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

// apps/api/.env first, then the optional monorepo root .env for values not already set.
loadEnv();
loadEnv({ path: resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().startsWith('/').default('/api'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
