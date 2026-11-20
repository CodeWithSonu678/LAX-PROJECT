"use strict";

const express = require("express");

const router = express.Router();

const { authenticateToken } = require(
  "../../../middleware/auth.middleware"
);

const { authorizeAdmin } = require(
  "../../../middleware/admin.middleware"
);

const controller = require("../controllers/manufacturing.controller");

router.use(authenticateToken, authorizeAdmin);

// register lax 
router.post("/", controller.manufactureDevice);

// get all registered lax device
router.get("/", controller.getManufacturedDevices);

// get specific lax device data
router.get("/:serialNumber", controller.getManufacturedDevice);

// kisi lax device ko disable/revoke karna.
router.patch(
  "/:serialNumber/revoke",
  controller.revokeManufacturedDevice
);

module.exports = router;