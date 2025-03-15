import { createEnv } from '@t3-oss/env-nextjs'
import { supabaseEnv, vercelEnv, payloadEnv, quantconnectEnv } from '@repo/env'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.string(),
  },
  runtimeEnv: process.env,
  extends: [supabaseEnv(), payloadEnv(), quantconnectEnv()],
})
