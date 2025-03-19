import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const payloadEnv = () =>
  createEnv({
    server: {
      PAYLOAD_SECRET: z.string().min(1),
    },
    experimental__runtimeEnv: process.env,
  });
