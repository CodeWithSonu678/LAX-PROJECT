"use strict";

const mongoose = require("mongoose");

const enrollmentSessionSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ["pending", "processing", "completed", "expired", "cancelled"],
    default: "pending",
    index: true
  },

  expiresAt: {
    type: Date,
    required: true
  },

  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Expired sessions automatically delete
enrollmentSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// One pending enrollment per hardware
enrollmentSessionSchema.index(
  { serialNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" }
  }
);

module.exports = mongoose.model(
  "EnrollmentSession",
  enrollmentSessionSchema
);