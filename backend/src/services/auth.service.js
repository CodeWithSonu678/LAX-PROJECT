"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser({ name, email, mobile, password }) {
  if (!name || !email || !mobile || !password) {
    throw new Error("Name, email, mobile and password are required.");
  }

  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("Email already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    mobile: mobile.trim(),
    passwordHash,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  };
}


// LOGIN
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash");

  if (
    !user ||
    !user.isActive ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw new Error("Invalid email or password.");
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      issuer: "lax-backend",
      audience: "lax-client",
    }
  );

  return {
    token,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
  };
}


// GET CURRENT USER
async function getMe(userId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new Error("User not found or account is inactive.");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  };
}


// LOGOUT
async function logoutUser() {
  // JWT cookie clearing will be handled by the controller.
  return {
    success: true,
    message: "Logout successful.",
  };
}


module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};