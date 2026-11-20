"use strict";

const LaxDevice = require("../models/LaxDevice");

const {
  verifyHmac,
} = require("../modules/lax-registration/utils/hmac.utils");

const {
  decryptSecret,
} = require("../modules/lax-registration/utils/encryption.utils");

const DeviceNonce = require("../models/DeviceNonce");

const TIMESTAMP_TOLERANCE = 5 * 60; // 5 minutes

async function authenticateLaxDevice(req, res, next) {
  try {
    // -----------------------------------------
    // 1. Read Authentication Headers
    // -----------------------------------------

    const laxId = req.headers["x-lax-id"];
    const timestamp = req.headers["x-lax-timestamp"];
    const nonce = req.headers["x-lax-nonce"];
    const signature = req.headers["x-lax-signature"];

    if (!laxId || !timestamp || !nonce || !signature) {
      return res.status(401).json({
        success: false,
        message: "Missing LAX authentication headers.",
      });
    }

    // -----------------------------------------
    // 2. Validate Header Formats
    // -----------------------------------------

    if (
      typeof timestamp !== "string" ||
      !/^\d+$/.test(timestamp)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid timestamp.",
      });
    }

    if (!/^[a-f0-9]{32}$/i.test(nonce)) {
      return res.status(401).json({
        success: false,
        message: "Invalid nonce.",
      });
    }

    if (!/^[a-f0-9]{64}$/i.test(signature)) {
      return res.status(401).json({
        success: false,
        message: "Invalid signature format.",
      });
    }

    // -----------------------------------------
    // 3. Verify Timestamp
    // -----------------------------------------

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const requestTimestamp = Number(timestamp);

    if (
      !Number.isSafeInteger(requestTimestamp) ||
      Math.abs(currentTimestamp - requestTimestamp) >
        TIMESTAMP_TOLERANCE
    ) {
      return res.status(401).json({
        success: false,
        message: "Request timestamp expired.",
      });
    }

    // -----------------------------------------
    // 4. Find Active LAX Device
    // -----------------------------------------

    const device = await LaxDevice.findOne({
      laxId,
      status: "active",
    }).select("+deviceSecretEncrypted");

    if (!device) {
      return res.status(403).json({
        success: false,
        message: "LAX device is not active or registered.",
      });
    }

    // -----------------------------------------
    // 5. Decrypt Device Secret
    // -----------------------------------------

    const deviceSecret = decryptSecret(
      device.deviceSecretEncrypted
    );

    if (!deviceSecret) {
      return res.status(401).json({
        success: false,
        message: "Device authentication failed.",
      });
    }

    // -----------------------------------------
    // 6. Generate Canonical Message
    // -----------------------------------------

    const message = `${laxId}:${timestamp}:${nonce}`;

    // -----------------------------------------
    // 7. Verify HMAC Signature
    // -----------------------------------------

    const isValid = verifyHmac(
      deviceSecret,
      message, 
      signature
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid HMAC signature.",
      });
    }

    // -----------------------------------------
    // 8. Replay Attack Protection
    // -----------------------------------------

    try {
      await DeviceNonce.create({
        laxId,
        nonce,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10min baad delete ho jayega
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate request detected.",
        });
      }

      throw error;
    }

    // -----------------------------------------
    // 9. Attach Authenticated Device
    // -----------------------------------------

    req.laxDevice = device;

    next();

  } catch (error) {
    console.error("LAX Authentication Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "LAX device authentication failed.",
    });
  }
}

module.exports = {
  authenticateLaxDevice,
};