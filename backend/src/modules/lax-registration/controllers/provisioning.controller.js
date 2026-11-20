"use strict";

const {
  provisionDevice
} = require("../services/provisioning.service");

async function provision(req, res) {
  try {
    const { serialNumber, manufacturingCode } = req.body;

    const result = await provisionDevice({
      serialNumber,
      manufacturingCode
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error("Provisioning Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Device provisioning failed."
    });
  }
}

module.exports = { provision };