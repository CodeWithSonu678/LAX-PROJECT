"use strict";

const crypto = require("node:crypto");
const WebSocket = require("ws");

const COMMAND_TIMEOUT_MS = 30_000;
const connections = new Map();
const pendingCommands = new Map();

// Register authenticated connection
function registerConnection(ws) {
  const { deviceId, userId } = ws.device;

  const previous = connections.get(deviceId);

  if (previous && previous !== ws) {
    previous.close(4001, "Connection replaced");
  }

  connections.set(deviceId, ws);

  ws.on("close", () => {
    if (connections.get(deviceId) === ws) {
      connections.delete(deviceId);
    }

    for (const [requestId, pending] of pendingCommands) {
      if (pending.ws === ws) {
        clearTimeout(pending.timer);
        pendingCommands.delete(requestId);

        pending.reject(
          new Error("Local Agent disconnected before responding."),
        );
      }
    }
  });

  return { deviceId, userId };
}

// Check whether user's device is online
function isDeviceConnected(userId, deviceId) {
  const ws = connections.get(deviceId);

  return Boolean(
    ws &&
      ws.readyState === WebSocket.OPEN &&
      ws.device.userId === userId,
  );
}

// Handle command result
function handleCommandResult(ws, message) {
  if (
    !message ||
    message.type !== "command_result" ||
    typeof message.requestId !== "string"
  ) {
    return false;
  }

  const pending = pendingCommands.get(message.requestId);

  if (!pending || pending.ws !== ws) {
    return false;
  }

  clearTimeout(pending.timer);
  pendingCommands.delete(message.requestId);
  pending.resolve(message);

  return true;
}

// Send command to authenticated Local Agent
function sendCommand({
  userId,
  deviceId,
  handler,
  operation,
  parameters = {},
}) {
  if (
    typeof userId !== "string" ||
    typeof deviceId !== "string" ||
    typeof handler !== "string" ||
    typeof operation !== "string" ||
    !parameters ||
    typeof parameters !== "object" ||
    Array.isArray(parameters)
  ) {
    return Promise.reject(new Error("Invalid command arguments."));
  }

  if (!isDeviceConnected(userId, deviceId)) {
    return Promise.reject(
      new Error("Authorized Local Agent is not connected."),
    );
  }

  const ws = connections.get(deviceId);
  const requestId = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingCommands.delete(requestId);
      reject(new Error("Local Agent command timed out."));
    }, COMMAND_TIMEOUT_MS);

    pendingCommands.set(requestId, {
      ws,
      resolve,
      reject,
      timer,
    });

    ws.send(
      JSON.stringify({
        type: "command",
        requestId,
        handler,
        operation,
        parameters,
      }),
      (error) => {
        if (!error) return;

        const pending = pendingCommands.get(requestId);

        if (pending) {
          clearTimeout(pending.timer);
          pendingCommands.delete(requestId);
          pending.reject(
            new Error("Failed to send command to Local Agent."),
          );
        }
      },
    );
  });
}

module.exports = {
  registerConnection,
  handleCommandResult,
  sendCommand,
  isDeviceConnected,
};