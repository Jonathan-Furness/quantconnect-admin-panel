import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const supabaseEnv = () =>
  createEnv({
    server: {
      DB_USER: z.string().default("postgres"),
      DB_PASSWORD: z.string(),
      DB_HOST: z.string(),
      DB_PORT: z.coerce.number().default(54322),
      DB_NAME: z.string().default("postgres"),
    },
    experimental__runtimeEnv: process.env,
    skipValidation: true,
  });
