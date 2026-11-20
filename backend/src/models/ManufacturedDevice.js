"use strict";

const mongoose = require("mongoose");

const manufacturedDeviceSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    manufacturingCodeHash: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["unregistered", "provisioning", "registered", "revoked"],
      default: "unregistered",
      index: true,
    },

    registeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ManufacturedDevice",
  manufacturedDeviceSchema
);