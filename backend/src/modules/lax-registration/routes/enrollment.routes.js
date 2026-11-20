"use strict";

const express = require("express");
const router = express.Router();

const {
  authenticateToken
} = require("../../../middleware/auth.middleware");

const {
  enrollDevice
} = require("../controllers/enrollment.controller");

// All enrollment routes require authentication
router.use(authenticateToken);

router.post("/enroll", enrollDevice);

module.exports = router;