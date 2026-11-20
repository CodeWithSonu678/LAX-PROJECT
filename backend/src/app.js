require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const commandRouter = require("./routes/command.routes");
const audioRouter = require("./routes/audio.routes");
const authRouter = require("./routes/auth.routes");
const agentDeviceRouter = require("./routes/agentDevice.routes");
const manufacturingRoutes = require("./modules/lax-registration/routes/manufacturing.routes");
const enrollmentRoutes = require("./modules/lax-registration/routes/enrollment.routes");
const provisioningRoutes = require("./modules/lax-registration/routes/provisioning.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// auth route api
app.use("/api/auth", authRouter);

// device agent route api

app.use("/api/devices", agentDeviceRouter);

// Common command route
app.use("/lax", commandRouter);

// Audio routes
app.use("/api/audio", audioRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LAX Backend is running",
  });
});

// Manufacturing route
app.use("/api/admin/manufacturing", manufacturingRoutes);

// Enrollment - User authentication required
app.use("/api/lax-devices", enrollmentRoutes);

// lax device send credentials to backend // Provisioning - Hardware authentication
app.use("/api/lax-hardware", provisioningRoutes);

module.exports = app;
