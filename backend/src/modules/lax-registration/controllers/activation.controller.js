"use strict";

const {
  activateDevice
} = require("../services/activation.service");

async function activate(req, res) {
  try {
    const result = await activateDevice(
      req.laxDevice._id
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("Activation Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Device activation failed."
    });
  }
}

module.exports = {
  activate
};