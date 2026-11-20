"use strict";

const manufacturingService = require("../services/manufacturing.service");

async function manufactureDevice(req, res) {
  try {
    const device = await manufacturingService.manufactureDevice();

    return res.status(201).json({
      success: true,
      message: "LAX device manufactured successfully.",
      data: device,
    });
  } catch (error) {
    console.error("Manufacturing Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to manufacture LAX device.",
    });
  }
}

async function getManufacturedDevices(req, res) {
  try {
    const devices = await manufacturingService.getManufacturedDevices();

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch manufactured devices.",
    });
  }
}

async function getManufacturedDevice(req, res) {
  try {
    const device = await manufacturingService.getManufacturedDevice(
      req.params.serialNumber
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Manufactured device not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch device.",
    });
  }
}

// revoke controller
async function revokeManufacturedDevice(req, res) {
  try {
    const device = await manufacturingService.revokeManufacturedDevice(
      req.params.serialNumber
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Manufactured device not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Manufactured device revoked successfully.",
      data: device,
    });

  } catch (error) {
    if (
      error.message === "DEVICE_ALREADY_REGISTERED" ||
      error.message === "DEVICE_ALREADY_REVOKED"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to revoke device.",
    });
  }
}

module.exports = {
  manufactureDevice,
  getManufacturedDevices,
  getManufacturedDevice,
  revokeManufacturedDevice
};