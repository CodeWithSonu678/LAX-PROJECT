"use strict";

const crypto = require("node:crypto");

const ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const key = process.env.LAX_ENCRYPTION_KEY;

  if (!key || !/^[a-f0-9]{64}$/i.test(key)) {
    throw new Error("Invalid LAX_ENCRYPTION_KEY");
  }

  return Buffer.from(key, "hex");
}

function encryptSecret(secret) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex")
  ].join(":");
}

function decryptSecret(encryptedData) {
  const [ivHex, authTagHex, encryptedHex] =
    encryptedData.split(":");

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivHex, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}

module.exports = {
  encryptSecret,
  decryptSecret
};