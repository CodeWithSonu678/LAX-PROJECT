"use strict";

const ManufacturedDevice = require("../../../models/ManufacturedDevice");
const EnrollmentSession = require("../../../models/EnrollmentSession");
const LaxDevice = require("../../../models/LaxDevice");

const {
  verifyCredential,
  generateLaxId,
  generateDeviceSecret,
  hashCredential
} = require("../utils/credential.utils");

const {encryptSecret} = require("../utils/encryption.utils");

async function provisionDevice({ serialNumber, manufacturingCode }) {
  if (!serialNumber || !manufacturingCode) {
    const error = new Error("Serial number and manufacturing code are required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedSerial = serialNumber.trim().toUpperCase();

  // 1. Find manufactured device
  const manufacturedDevice = await ManufacturedDevice
    .findOne({
      serialNumber: normalizedSerial,
      status: "provisioning"
    })
    .select("+manufacturingCodeHash");

  if (!manufacturedDevice) {
    const error = new Error("Device is not available for provisioning.");
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify manufacturing code
  if (!verifyCredential(
    manufacturingCode.trim(),
    manufacturedDevice.manufacturingCodeHash
  )) {
    const error = new Error("Invalid device credentials.");
    error.statusCode = 401;
    throw error;
  }

  // 3. Find active enrollment session
  const session = await EnrollmentSession.findOne({
    serialNumber: normalizedSerial,
    status: "pending",
    expiresAt: { $gt: new Date() }
  });

  if (!session) {
    const error = new Error("No valid enrollment session found.");
    error.statusCode = 404;
    throw error;
  }

  // 4. Atomically claim enrollment session
  const claimedSession = await EnrollmentSession.findOneAndUpdate(
    {
      _id: session._id,
      status: "pending",
      expiresAt: { $gt: new Date() }
    },
    {
      $set: { status: "processing" }
    },
    { returnDocument: "after" }
  );

  if (!claimedSession) {
    const error = new Error("Enrollment is already being processed.");
    error.statusCode = 409;
    throw error;
  }

  let createdDevice = null;

  try {
    // 5. Generate credentials
    const laxId = generateLaxId();
    const deviceSecret = generateDeviceSecret();

    // 6. Create LAX device
    createdDevice = await LaxDevice.create({
      laxId,
      serialNumber: normalizedSerial,
      userId: claimedSession.userId,
      deviceSecretHash: hashCredential(deviceSecret),
      deviceSecretEncrypted: encryptSecret(deviceSecret),
      status: "pending",
      registeredAt: new Date()
    });

    // 7. Update manufactured device
    const updatedManufacturedDevice = await ManufacturedDevice.updateOne(
      {
        _id: manufacturedDevice._id,
        status: "provisioning"
      },
      {
        $set: {
          status: "registered",
          registeredAt: new Date()
        }
      }
    );

    if (updatedManufacturedDevice.modifiedCount !== 1) {
      throw new Error("Unable to finalize device registration.");
    }

    // 8. Complete enrollment
    await EnrollmentSession.updateOne(
      {
        _id: claimedSession._id,
        status: "processing"
      },
      {
        $set: {
          status: "completed",
          completedAt: new Date()
        }
      }
    );

    // 9. Return credentials directly to hardware
    return {
      success: true,
      message: "Device provisioned successfully.",
      credentials: {
        laxId,
        deviceSecret
      }
    };

  } catch (error) {
    // Rollback on failure
    if (createdDevice) {
      await LaxDevice.deleteOne({ _id: createdDevice._id });
    }

    await ManufacturedDevice.updateOne(
      {
        _id: manufacturedDevice._id,
        status: "registered"
      },
      {
        $set: { status: "provisioning" },
        $unset: { registeredAt: 1 }
      }
    );

    await EnrollmentSession.updateOne(
      {
        _id: claimedSession._id,
        status: "processing"
      },
      {
        $set: { status: "pending" }
      }
    );

    throw error;
  }
}

module.exports = {
  provisionDevice
};