"use strict";

const ManufacturedDevice = require("../../../models/ManufacturedDevice");

const {
  generateSerialNumber,
  generateManufacturingCode,
  hashCredential,
} = require("../utils/credential.utils");

async function manufactureDevice() {
  const serialNumber = generateSerialNumber();
  const manufacturingCode = generateManufacturingCode();

  const manufacturingCodeHash = hashCredential(
    manufacturingCode
  );

  const device = await ManufacturedDevice.create({
    serialNumber,
    manufacturingCodeHash,
    status: "unregistered",
  });

  return {
    serialNumber: device.serialNumber,
    manufacturingCode,
    status: device.status,
    manufacturedAt: device.createdAt,
  };
}

async function getManufacturedDevices() {
  return ManufacturedDevice.find()
    .select("serialNumber status createdAt registeredAt")
    .sort({ createdAt: -1 })
    .lean();
}

async function getManufacturedDevice(serialNumber) {
  return ManufacturedDevice.findOne({
    serialNumber: serialNumber.toUpperCase(),
  })
    .select("serialNumber status createdAt registeredAt")
    .lean();
}

// Revoke ka matlab hota hai kisi device ki permission ya authorization permanently cancel kar dena.

async function revokeManufacturedDevice(serialNumber) {
  const device = await ManufacturedDevice.findOne({
    serialNumber: serialNumber.toUpperCase(),
  });

  if (!device) {
    return null;
  }

  if (device.status === "registered") {
    throw new Error("DEVICE_ALREADY_REGISTERED");
  }

  if (device.status === "revoked") {
    throw new Error("DEVICE_ALREADY_REVOKED");
  }

  device.status = "revoked";
  await device.save();

  return {
    serialNumber: device.serialNumber,
    status: device.status,
  };
}

module.exports = Object.freeze({
  manufactureDevice,
  getManufacturedDevices,
  getManufacturedDevice,
  revokeManufacturedDevice
});
