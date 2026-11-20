"use strict";

const EnrollmentSession = require("../../../models/EnrollmentSession");
const ManufacturedDevice = require("../../../models/ManufacturedDevice");

async function cleanupExpiredEnrollments() {
  try {
    const now = new Date();

    // Find expired pending sessions
    const expiredSessions = await EnrollmentSession.find({
      status: "pending",
      expiresAt: { $lte: now }
    }).select("serialNumber");

    for (const session of expiredSessions) {

      // Expire enrollment session
      await EnrollmentSession.updateOne(
        {
          _id: session._id,
          status: "pending"
        },
        {
          $set: { status: "expired" }
        }
      );

      // Reset hardware status
      await ManufacturedDevice.updateOne(
        {
          serialNumber: session.serialNumber,
          status: "provisioning"
        },
        {
          $set: { status: "unregistered" }
        }
      );
    }

    if (expiredSessions.length > 0) {
      console.log(
        `Expired enrollments cleaned: ${expiredSessions.length}`
      );
    }

  } catch (error) {
    console.error("Enrollment cleanup failed:", error.message);
  }
}

module.exports = { cleanupExpiredEnrollments };