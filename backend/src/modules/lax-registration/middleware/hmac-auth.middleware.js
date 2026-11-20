"use strict";

const LaxDevice = require("../../../models/LaxDevice");
const DeviceNonce = require("../../../models/DeviceNonce");

const {
  verifyHmac
} = require("../utils/hmac.utils");

const {
  decryptSecret
} = require("../utils/encryption.utils");

const TIMESTAMP_TOLERANCE = 5 * 60;

async function authenticateLaxDevice(req, res, next) {
  try {
    const laxId = req.headers["x-lax-id"];
    const timestamp = req.headers["x-lax-timestamp"];
    const nonce = req.headers["x-lax-nonce"];
    const signature = req.headers["x-lax-signature"];

    if (!laxId || !timestamp || !nonce || !signature) {
      return res.status(401).json({
        success: false,
        message: "Device authentication headers required."
      });
    }

    // Timestamp validation
    const timestampNumber = Number(timestamp);

    if (!Number.isSafeInteger(timestampNumber)) {
      return res.status(401).json({
        success: false,
        message: "Invalid timestamp."
      });
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (
      Math.abs(currentTimestamp - timestampNumber) >
      TIMESTAMP_TOLERANCE
    ) {
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired."
      });
    }

    // Nonce validation
    if (
      typeof nonce !== "string" ||
      !/^[a-f0-9]{32}$/i.test(nonce)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid nonce."
      });
    }

    // Find device
    const device = await LaxDevice.findOne({
      laxId,
      status: { $in: ["pending", "active"] }
    }).select("+deviceSecretEncrypted");

    if (!device || !device.deviceSecretEncrypted) {
      return res.status(401).json({
        success: false,
        message: "Device not found or unavailable."
      });
    }

    // Decrypt authentication secret
    const secret = decryptSecret(device.deviceSecretEncrypted);

    // Canonical message
    const message = `${laxId}:${timestamp}:${nonce}`;

    // Verify HMAC
    const isValid = verifyHmac(
      secret,
      message,
      signature
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid device signature."
      });
    }

    // Atomically register nonce to prevent replay
    try {
      await DeviceNonce.create({
        laxId,
        nonce,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate request detected."
        });
      }

      throw error;
    }

    req.laxDevice = device;

    return next();

  } catch (error) {
    console.error("LAX Authentication Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Device authentication failed."
    });
  }
}

module.exports = {
  authenticateLaxDevice
};