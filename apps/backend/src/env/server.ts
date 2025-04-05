import { createEnv } from '@t3-oss/env-nextjs'
import {
  supabaseEnv,
  vercelEnv,
  payloadEnv,
  quantconnectEnv,
  encryptionEnv,
  brokers,
} from '@repo/env'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.string(),
    PORT: z.coerce.number().default(3000),
    CRON_SECRET: z.string(),
  },
  experimental__runtimeEnv: process.env,
  extends: [
    supabaseEnv(),
    payloadEnv(),
    quantconnectEnv(),
    vercelEnv(),
    encryptionEnv(),
    brokers.interactiveBrokersEnv(),
  ],
})
