import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const quantconnectEnv = () =>
  createEnv({
    server: {
      QC_API_TOKEN: z.string().min(1),
      QC_USER_ID: z.string().min(1),
    },
    experimental__runtimeEnv: process.env,
    skipValidation: process.env.NODE_ENV === "test",
  });
