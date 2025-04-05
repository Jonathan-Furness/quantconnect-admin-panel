import { createCipheriv, randomBytes, createHash } from "node:crypto";
import { encryptionEnv } from "@repo/env";
import type { EncryptedData } from "@/types";

export const encryptValue = (value?: string): EncryptedData => {
  if (!value) {
    throw new Error("Value is required");
  }

  const MASTER_KEY = createHash("sha256")
    .update(encryptionEnv().ENCRYPTION_KEY)
    .digest();

  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", MASTER_KEY, iv);

  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    encrypted: encrypted,
    authTag: authTag,
  };
};
