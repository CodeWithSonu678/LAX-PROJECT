"use strict";

const User = require("../models/User");

async function authorizeAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
      .select("role isActive");

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive or unavailable.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = user;

    return next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin authorization failed.",
    });
  }
}

module.exports = { authorizeAdmin };