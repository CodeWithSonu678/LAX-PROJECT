"use strict";

const ManufacturedDevice = require("../../../models/ManufacturedDevice");
const EnrollmentSession = require("../../../models/EnrollmentSession");

const {
  verifyCredential
} = require("../utils/credential.utils");

const SESSION_DURATION = 10 * 60 * 1000;

async function startEnrollment({
  serialNumber,
  manufacturingCode,
  userId
}) {
  if (!serialNumber || !manufacturingCode || !userId) {
    const error = new Error("Serial number, manufacturing code and user ID are required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedSerial = serialNumber.trim().toUpperCase();

  // 1. Find manufactured device
  const manufacturedDevice = await ManufacturedDevice
    .findOne({ serialNumber: normalizedSerial })
    .select("+manufacturingCodeHash");

  if (!manufacturedDevice) {
    const error = new Error("Invalid device credentials.");
    error.statusCode = 401;
    throw error;
  }

  // 2. Verify manufacturing code
  const isValid = verifyCredential(
    manufacturingCode.trim(),
    manufacturedDevice.manufacturingCodeHash
  );

  if (!isValid) {
    const error = new Error("Invalid device credentials.");
    error.statusCode = 401;
    throw error;
  }

  // 3. Check device status
  if (manufacturedDevice.status !== "unregistered") {
    const error = new Error(
      `Device cannot be registered. Current status: ${manufacturedDevice.status}`
    );
    error.statusCode = 409;
    throw error;
  }

  // 4. Atomically claim device
  const claimedDevice = await ManufacturedDevice.findOneAndUpdate(
    {
      _id: manufacturedDevice._id,
      status: "unregistered"
    },
    {
      $set: { status: "provisioning" }
    },
    { returnDocument: "after" }
  );

  if (!claimedDevice) {
    const error = new Error("Device registration is already in progress.");
    error.statusCode = 409;
    throw error;
  }

  try {
    // 5. Create enrollment session
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    const session = await EnrollmentSession.create({
      serialNumber: normalizedSerial,
      userId,
      status: "pending",
      expiresAt
    });

    return {
      success: true,
      message: "Device enrollment started. Connect your LAX device to Wi-Fi.",
      enrollment: {
        sessionId: session._id,
        serialNumber: session.serialNumber,
        status: session.status,
        expiresAt: session.expiresAt
      }
    };

  } catch (error) {
    // Roll back device status if session creation fails
    await ManufacturedDevice.updateOne(
      {
        _id: manufacturedDevice._id,
        status: "provisioning"
      },
      {
        $set: { status: "unregistered" }
      }
    );

    if (error.code === 11000) {
      const conflict = new Error("An enrollment session already exists for this device.");
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  }
}

module.exports = {
  startEnrollment
};