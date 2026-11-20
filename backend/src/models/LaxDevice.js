"use strict";

const mongoose = require("mongoose");

const laxDeviceSchema = new mongoose.Schema(
  {
    laxId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deviceSecretHash: {
      type: String,
      required: true,
      select: false,
    },

    deviceSecretEncrypted: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["pending", "active", "revoked"],
      default: "pending",
      index: true,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    registeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("LaxDevice", laxDeviceSchema);
