"use strict";

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Read JWT from HttpOnly cookie
  const token = req.cookies?.lax_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "lax-backend",
      audience: "lax-client",
      algorithms: ["HS256"],
    });

    req.user = {
      id: decoded.sub,
      sub: decoded.sub,
    };

    return next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please login again.",
    });
  }
}

module.exports = { authenticateToken };