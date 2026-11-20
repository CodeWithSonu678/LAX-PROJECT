"use strict";

const crypto = require("node:crypto");

// ============================================
// LAX CREDENTIAL ENCRYPTION SERVICE
// Algorithm: AES-256-GCM
// Purpose: Securely encrypt laptop credentials
// ============================================

// --------------------------------------------
// Get Encryption Key
// --------------------------------------------

function getEncryptionKey() {
  const key = process.env.DEVICE_CREDENTIAL_ENCRYPTION_KEY;

  // AES-256 requires exactly 32 bytes (64 hex characters).
  if (!key || !/^[a-f0-9]{64}$/i.test(key)) {
    throw new Error(
      "Invalid DEVICE_CREDENTIAL_ENCRYPTION_KEY."
    );
  }

  return Buffer.from(key, "hex");
}

// --------------------------------------------
// Encrypt Device Credential
// --------------------------------------------

function encryptCredential(value) {
  if (typeof value !== "string" || !value.length) {
    throw new Error("Invalid credential.");
  }

  // Generate a unique 96-bit IV for every encryption.
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  return {
    encryptedCredential: encrypted.toString("hex"),
    credentialIv: iv.toString("hex"),
    credentialTag: cipher.getAuthTag().toString("hex"),
  };
}

// --------------------------------------------
// Decrypt Device Credential
// --------------------------------------------

function decryptCredential(data) {
  if (
    !data ||
    typeof data.encryptedCredential !== "string" ||
    typeof data.credentialIv !== "string" ||
    typeof data.credentialTag !== "string" ||
    !/^[a-f0-9]{24}$/i.test(data.credentialIv) ||
    !/^[a-f0-9]{32}$/i.test(data.credentialTag) ||
    !/^[a-f0-9]+$/i.test(data.encryptedCredential)
  ) {
    throw new Error("Invalid encrypted credential data.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(data.credentialIv, "hex")
  );

  // Verify authentication tag before accepting decrypted data.
  decipher.setAuthTag(
    Buffer.from(data.credentialTag, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(data.encryptedCredential, "hex")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// --------------------------------------------
// Export Service
// --------------------------------------------

module.exports = Object.freeze({
  encryptCredential,
  decryptCredential,
});