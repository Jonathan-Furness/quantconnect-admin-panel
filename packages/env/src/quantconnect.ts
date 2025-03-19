import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const quantconnectEnv = () =>
  createEnv({
    server: {
      QC_API_TOKEN: z.string().min(1),
      QC_USER_ID: z.string().min(1),
    },
    experimental__runtimeEnv: process.env,
  });
