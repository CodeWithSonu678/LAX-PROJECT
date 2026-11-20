"use strict";

require("dotenv").config();

const http = require("http");
const crypto = require("node:crypto");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { WebSocketServer, WebSocket } = require("ws");

const { authenticateDevice } = require("./src/services/agentDevice.service");

const {
  registerConnection,
  handleCommandResult,
} = require("./src/services/agentConnection.service");

const {
  cleanupExpiredEnrollments,
} = require("./src/modules/lax-registration/services/enrollment-cleanup.service");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
const HEARTBEAT_INTERVAL_MS = 30_000;
const APP_PING_INTERVAL_MS = 10_000;

const server = http.createServer(app);

const wss = new WebSocketServer({
  noServer: true,
  maxPayload: 64 * 1024,
});

// ========================================
// WebSocket Authentication
// ========================================

server.on("upgrade", async (request, socket, head) => {
  socket.on("error", (error) => {
    console.error("WebSocket upgrade socket error:", error.code);
  });

  try {
    const url = new URL(request.url, "http://localhost");

    if (url.pathname !== "/agent") {
      socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    const deviceId = request.headers["x-device-id"];
    const authorization = request.headers.authorization;

    if (typeof deviceId !== "string" || !authorization?.startsWith("Bearer ")) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    const device = await authenticateDevice(deviceId, token);

    if (!device || socket.destroyed) {
      if (!socket.destroyed) {
        socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
        socket.destroy();
      }
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.device = {
        deviceId: device.deviceId,
        userId: device.userId.toString(),
      };

      wss.emit("connection", ws, request);
    });
  } catch (error) {
    console.error("WebSocket authentication failed:", error.message);

    if (!socket.destroyed) {
      socket.destroy();
    }
  }
});

// ========================================
// Authenticated Agent Connection
// ========================================

wss.on("connection", (ws) => {
  console.log("Authenticated Local Agent connected:", ws.device.deviceId);

  ws.isAlive = true;

  // Register authenticated device in connection service.
  try {
    registerConnection(ws);
  } catch (error) {
    console.error("Agent connection registration failed:", error.message);

    ws.close(1011, "Connection registration failed");
    return;
  }

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // Confirm authentication.
  ws.send(
    JSON.stringify({
      type: "connection",
      success: true,
      message: "Device authenticated successfully.",
    }),
  );

  // ========================================
  // Incoming Messages
  // ========================================

  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      ws.close(1003, "Binary messages not supported");
      return;
    }

    let message;

    try {
      message = JSON.parse(data.toString());
    } catch {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid JSON",
        }),
      );
      return;
    }

    if (!message || typeof message !== "object" || Array.isArray(message)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message structure",
        }),
      );
      return;
    }

    // WebSocket protocol heartbeat response.
    if (message.type === "pong") {
      ws.isAlive = true;

      console.log(
        "Pong received from:",
        ws.device.deviceId,
        "| Request ID:",
        message.requestId,
      );

      return;
    }

    // Application-level ping.
    if (message.type === "ping") {
      if (
        typeof message.requestId !== "string" ||
        message.requestId.length > 100
      ) {
        return;
      }

      ws.send(
        JSON.stringify({
          type: "pong",
          requestId: message.requestId,
        }),
      );

      return;
    }

    // ========================================
    // Command Result from Local Agent
    // ========================================

    if (message.type === "command_result") {
      const matched = handleCommandResult(ws, message);

      if (matched) {
        console.log(
          "Command result received:",
          message.requestId,
          "| Device:",
          ws.device.deviceId,
          "| Success:",
          message.success === true,
        );
      } else {
        console.warn(
          "Unmatched command result:",
          message.requestId,
          "| Device:",
          ws.device.deviceId,
        );
      }

      return;
    }

    console.warn("Unsupported message type:", message.type);
  });

  // ========================================
  // Application Ping
  // ========================================

  const pingTimer = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(pingTimer);
      return;
    }

    ws.send(
      JSON.stringify({
        type: "ping",
        requestId: crypto.randomUUID(),
      }),
      (error) => {
        if (error) {
          console.error("Application ping failed:", error.message);
        }
      },
    );
  }, APP_PING_INTERVAL_MS);

  ws.on("error", (error) => {
    console.error("Agent WebSocket error:", error.message);
  });

  ws.on("close", () => {
    clearInterval(pingTimer);

    console.log("Local Agent disconnected:", ws.device.deviceId);
  });
});

// ========================================
// Heartbeat: Detect Dead Connections
// ========================================

const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.readyState !== WebSocket.OPEN) {
      continue;
    }

    if (ws.isAlive === false) {
      console.warn("Terminating unresponsive agent:", ws.device?.deviceId);

      ws.terminate();
      continue;
    }

    ws.isAlive = false;
    ws.ping();
  }
}, HEARTBEAT_INTERVAL_MS);

heartbeat.unref();

// ========================================
// Graceful Shutdown
// ========================================

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down LAX backend...`);

  clearInterval(heartbeat);

  for (const ws of wss.clients) {
    ws.close(1001, "Server shutting down.");
  }

  server.close(() => {
    wss.close(() => {
      console.log("LAX backend stopped.");
      process.exit(0);
    });
  });

  setTimeout(() => {
    for (const ws of wss.clients) {
      ws.terminate();
    }

    process.exit(1);
  }, 10_000).unref();
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

// ========================================
// Start Server
// ========================================

async function startServer() {
  try {
    await connectDB();

    // Run cleanup immediately
    await cleanupExpiredEnrollments();

    // Run cleanup every minute
    const enrollmentCleanupTimer = setInterval(
      cleanupExpiredEnrollments,
      60 * 1000,
    );

    enrollmentCleanupTimer.unref();

    server.listen(PORT, HOST, () => {
      console.log(`LAX Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);

    process.exitCode = 1;
  }
}

server.on("error", (error) => {
  console.error("LAX Server Error:", error.message);
});

startServer();
