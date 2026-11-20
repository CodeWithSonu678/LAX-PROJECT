"use strict";

const express = require("express");

const authController = require("../controllers/auth.controller");

const {
  authenticateToken,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", authenticateToken, authController.getMe);
router.get("/device-status", authenticateToken, authController.getDeviceStatus);
router.post("/logout", authenticateToken, authController.logout);


module.exports = router;