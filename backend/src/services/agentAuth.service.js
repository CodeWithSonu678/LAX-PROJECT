"use strict";

const crypto = require("node:crypto");

function generateDeviceToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function verifyToken(token, storedHash) {
  if (
    typeof token !== "string" ||
    typeof storedHash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(storedHash)
  ) {
    return false;
  }

  const actualHash = Buffer.from(hashToken(token), "hex");
  const expectedHash = Buffer.from(storedHash, "hex");

  return crypto.timingSafeEqual(actualHash, expectedHash);
}

module.exports = Object.freeze({
  generateDeviceToken,
  hashToken,
  verifyToken,
});