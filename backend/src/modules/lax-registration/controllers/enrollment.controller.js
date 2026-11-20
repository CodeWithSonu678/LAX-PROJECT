"use strict";

const {
  startEnrollment
} = require("../services/enrollment.service");

async function enrollDevice(req, res) {
  try {
    const { serialNumber, manufacturingCode } = req.body;

    const result = await startEnrollment({
      serialNumber,
      manufacturingCode,
      userId: req.user.id
    });

    return res.status(201).json(result);

  } catch (error) {
    console.error("Enrollment Controller Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Device enrollment failed."
    });
  }
}

module.exports = {
  enrollDevice
};