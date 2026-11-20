"use strict";

const crypto = require("node:crypto");

function generateHmac(secret, message) {
  return crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");
}

function verifyHmac(secret, message, signature) {
  if (
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expected = Buffer.from(
    generateHmac(secret, message),
    "hex"
  );

  const received = Buffer.from(signature, "hex");

  return crypto.timingSafeEqual(expected, received);
}

function generateNonce() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  generateHmac,
  verifyHmac,
  generateNonce
};