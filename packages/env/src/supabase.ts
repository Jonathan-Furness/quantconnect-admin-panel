import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const supabase = () =>
  createEnv({
    server: {
      DB_USER: z.string().default('postgres'),
      DB_PASSWORD: z.string(),
      DB_HOST: z.string(),
      DB_PORT: z.coerce.number().default(5432),
      DB_NAME: z.string().default('postgres'),
    },
    runtimeEnv: process.env as Record<string, string>,
  });
