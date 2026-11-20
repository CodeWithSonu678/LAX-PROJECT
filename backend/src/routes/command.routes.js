"use strict";

const { Router } = require("express");

const { commandController } = require("../controllers/command.controller");

const { authenticateLaxDevice } = require("../middleware/hmac-auth.middleware");

const commandRouter = Router();

commandRouter.post("/", authenticateLaxDevice, commandController);

module.exports = commandRouter;
