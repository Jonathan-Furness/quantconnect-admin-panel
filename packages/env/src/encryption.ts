import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const encryptionEnv = () =>
  createEnv({
    server: {
      ENCRYPTION_KEY: z.string(),
    },
    experimental__runtimeEnv: process.env,
  });
