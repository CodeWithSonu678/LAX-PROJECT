"use strict";

const LaxDevice = require("../../../models/LaxDevice");

async function activateDevice(deviceId) {

  const device = await LaxDevice.findOneAndUpdate(
    {
      _id: deviceId,
      status: "pending"
    },
    {
      $set: {
        status: "active",
        lastSeen: new Date()
      }
    },
    {
      returnDocument: "after"
    }
  );

  if (!device) {
    const error = new Error(
      "Device is already active or unavailable."
    );
    error.statusCode = 409;
    throw error;
  }

  return {
    success: true,
    message: "LAX device activated successfully.",
    device: {
      laxId: device.laxId,
      status: device.status,
      activatedAt: device.updatedAt
    }
  };
}

module.exports = {
  activateDevice
};