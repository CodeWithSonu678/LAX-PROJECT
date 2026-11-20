"use strict";

const express = require("express");

const {
  authenticateToken,
} = require("../middleware/auth.middleware");

const {
  startPairing,
  claimPairing,
  pollPairing,
  acknowledgePairing,
} = require("../controllers/agentDevice.controller");

const router = express.Router();

// Local Agent requests a pairing code.
router.post("/pairing/start", startPairing);

// Authenticated user approves laptop pairing.
router.post(
  "/pairing/claim",
  authenticateToken,
  claimPairing
);

// Local Agent checks pairing approval.
router.post("/pairing/poll", pollPairing);

// Local Agent acknowledges secure credential storage.
router.post(
  "/pairing/acknowledge",
  acknowledgePairing
);

module.exports = router;