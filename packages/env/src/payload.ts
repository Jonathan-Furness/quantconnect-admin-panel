import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const payloadEnv = () =>
  createEnv({
    server: {
      PAYLOAD_SECRET: z.string().min(1),
    },
    runtimeEnv: process.env as Record<string, string>,
  });
