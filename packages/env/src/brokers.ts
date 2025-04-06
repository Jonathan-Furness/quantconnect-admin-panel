import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const interactiveBrokersEnv = () =>
  createEnv({
    server: {
      IB_API_KEY: z.string(),
    },
    experimental__runtimeEnv: process.env,
    skipValidation: process.env.NODE_ENV === "test",
  });

export default {
  interactiveBrokersEnv,
};
