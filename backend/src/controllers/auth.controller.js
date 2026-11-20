"use strict";

const authService = require("../services/auth.service");
const LaxDevice = require("../models/LaxDevice");

// REGISTER
async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    const knownErrors = [
      "Name, email, mobile and password are required.",
      "Password must be at least 12 characters.",
      "Email already registered.",
    ];

    const status = knownErrors.includes(error.message) ? 400 : 500;

    return res.status(status).json({
      success: false,
      message: status === 500 ? "Internal server error." : error.message,
    });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body);

    // Set JWT cookie (7 Days)
    res.cookie("lax_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: result.user,
        expiresIn: result.expiresIn,
      },
    });
  } catch (error) {
    const status = [
      "Email and password are required.",
      "Invalid email or password.",
    ].includes(error.message)
      ? 400
      : 500;

    return res.status(status).json({
      success: false,
      message: status === 500 ? "Internal server error." : error.message,
    });
  }
}

// GET CURRENT USER
async function getMe(req, res) {
  try {
    const userId = req.user?.sub;

    const user = await authService.getMe(userId);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: { user },
    });
  } catch (error) {
    const status =
      error.message === "User not found or account is inactive." ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: status === 500 ? "Internal server error." : error.message,
    });
  }
}

// LOGOUT
async function logout(req, res) {
  try {
    await authService.logoutUser();

    res.clearCookie("lax_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// GET USER DEVICE STATUS
async function getDeviceStatus(req, res) {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    

    const device = await LaxDevice.findOne({
      userId,
      status: "active",
    })
      .select("laxId serialNumber status lastSeen registeredAt")
      .lean();

    return res.status(200).json({
      success: true,
      message: device
        ? "LAX device registered."
        : "No active LAX device found.",
      data: {
        isDevicePaired: !!device,
        device: device || null,
      },
    });

  } catch (error) {
    console.error("Get Device Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  getDeviceStatus,
};
