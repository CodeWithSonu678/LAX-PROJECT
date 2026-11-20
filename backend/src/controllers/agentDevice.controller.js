"use strict";

const deviceService = require("../services/agentDevice.service");

// Laptop starts pairing.
async function startPairing(req, res) {
  try {
    const result = await deviceService.startPairing(
      req.body || {}
    );

    return res.status(201).json({
      success: true,
      message: "Pairing started successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Start pairing error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Authenticated website user claims laptop.
async function claimPairing(req, res) {
  try {
    const result = await deviceService.claimPairing({
      pairingCode: req.body?.pairingCode,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Claim pairing error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Laptop polls for pairing approval.
async function pollPairing(req, res) {
  try {
    const result = await deviceService.pollPairing(
      req.body || {}
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Pairing poll error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Pairing verification failed.",
    });
  }
}

// Laptop confirms that credential was saved securely.
async function acknowledgePairing(req, res) {
  try {
    const result = await deviceService.acknowledgePairing(
      req.body || {}
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Pairing acknowledgement error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Pairing acknowledgement failed.",
    });
  }
}

module.exports = {
  startPairing,
  claimPairing,
  pollPairing,
  acknowledgePairing,
};