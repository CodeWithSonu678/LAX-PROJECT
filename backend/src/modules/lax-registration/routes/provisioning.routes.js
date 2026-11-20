"use strict";

const express = require("express");
const router = express.Router();

const {
  provision
} = require("../controllers/provisioning.controller");

const {
  activate
} = require("../controllers/activation.controller");

const {
  authenticateLaxDevice
} = require("../middleware/hmac-auth.middleware");

// Initial hardware provisioning
router.post("/provision", provision);

// Secure hardware activation
router.post(
  "/activate",
  authenticateLaxDevice,
  activate
);

module.exports = router;