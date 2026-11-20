"use strict";

const mongoose = require("mongoose");

const deviceNonceSchema = new mongoose.Schema({
  laxId: {
    type: String,
    required: true
  },

  nonce: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

deviceNonceSchema.index(
  { laxId: 1, nonce: 1 },
  { unique: true }
);

deviceNonceSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("DeviceNonce", deviceNonceSchema);