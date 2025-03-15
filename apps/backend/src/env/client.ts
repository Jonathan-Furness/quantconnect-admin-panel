import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_DEV_EMAIL: z.string().email(),
    NEXT_PUBLIC_DEV_PASSWORD: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_DEV_EMAIL: process.env.NEXT_PUBLIC_DEV_EMAIL,
    NEXT_PUBLIC_DEV_PASSWORD: process.env.NEXT_PUBLIC_DEV_PASSWORD,
  },
})
