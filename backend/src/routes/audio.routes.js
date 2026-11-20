const express = require("express");
const audioRouter = express.Router();

const {
  transcribe
} = require("../controllers/audio.controller");

// audio router api

audioRouter.post(
  "/transcribe",
  express.raw({
    type: ["audio/wav", "audio/x-wav"],
    limit: "100kb"
  }),
  transcribe
);

module.exports = audioRouter;