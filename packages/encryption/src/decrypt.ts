import { createDecipheriv, createHash } from "node:crypto";
import type { EncryptedData } from "./types";
import { encryptionEnv } from "@repo/env";

export function decryptValue(encryptedData: EncryptedData): string {
  const MASTER_KEY = createHash("sha256")
    .update(encryptionEnv().ENCRYPTION_KEY)
    .digest();

  const iv = Buffer.from(encryptedData.iv, "hex");
  const decipher = createDecipheriv("aes-256-gcm", MASTER_KEY, iv);

  // Set auth tag for authenticated decryption
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

  // Decrypt
  let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
