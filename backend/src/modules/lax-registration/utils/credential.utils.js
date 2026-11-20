"use strict";

const crypto = require("node:crypto");

// Generate unique manufacturing serial number
function generateSerialNumber() {
  return `LAX-SN-${crypto.randomBytes(12).toString("hex").toUpperCase()}`;
}

// Generate manufacturing secret code
function generateManufacturingCode() {
  return crypto.randomBytes(24).toString("hex").toUpperCase();
}

// Generate unique LAX ID
function generateLaxId() {
  return `LAX-${crypto.randomUUID()}`;
}

// Generate device authentication secret
function generateDeviceSecret() {
  return crypto.randomBytes(32).toString("hex");
}

// Hash credentials using SHA-256
function hashCredential(value) {
  if (typeof value !== "string" || !value) {
    throw new Error("Invalid credential.");
  }

  return crypto
    .createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

// Compare hashes safely
function verifyCredential(value, storedHash) {
  if (
    typeof storedHash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(storedHash)
  ) {
    return false;
  }

  const providedHash = Buffer.from(
    hashCredential(value),
    "hex"
  );

  const expectedHash = Buffer.from(
    storedHash,
    "hex"
  );

  return crypto.timingSafeEqual(providedHash, expectedHash);
}

module.exports = Object.freeze({
  generateSerialNumber,
  generateManufacturingCode,
  generateLaxId,
  generateDeviceSecret,
  hashCredential,
  verifyCredential,
});