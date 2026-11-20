"use strict";

const { sendCommand } = require("../../../services/agentConnection.service");

const OPERATION_MAP = Object.freeze({
  createFolder: "create_folder",
  createFile: "create_file",
  readFile: "read_file",
  listDirectory: "list_directory",
  deleteFile: "delete_file",
  deleteFolder: "delete_folder",
  renameFile: "rename_file",
  renameFolder: "rename_folder",
  moveFile: "move_file",
  moveFolder: "move_folder",
});

// --------------------------------------------------
// Normalize Parameters
// --------------------------------------------------

function normalizeParameters(operation, parameters) {
  const normalized = { ...parameters };

  switch (operation) {
    case "createFolder":
    case "deleteFolder":
      normalized.name =
        parameters.name ||
        parameters.folderName ||
        parameters.folder_name;
      break;

    case "createFile":
    case "readFile":
    case "deleteFile":
      normalized.name =
        parameters.name ||
        parameters.fileName ||
        parameters.file_name ||
        parameters.filename;
      break;

    case "renameFile":
    case "renameFolder":
    case "moveFile":
    case "moveFolder":
      normalized.name =
        parameters.name ||
        parameters.sourceName ||
        parameters.source_name;

      normalized.newName =
        parameters.newName ||
        parameters.new_name ||
        parameters.destinationName ||
        parameters.destination_name ||
        normalized.name;

      normalized.path =
        parameters.path ??
        parameters.sourcePath ??
        parameters.source_path ??
        ".";

      normalized.destinationPath =
        parameters.destinationPath ??
        parameters.destination_path ??
        parameters.targetPath ??
        parameters.target_path ??
        normalized.path;
      break;

    case "listDirectory":
      normalized.path = parameters.path ?? ".";
      break;
  }

  if (
    typeof normalized.name === "string" &&
    normalized.name.trim()
  ) {
    normalized.name = normalized.name.trim();
  }

  if (
    typeof normalized.newName === "string" &&
    normalized.newName.trim()
  ) {
    normalized.newName = normalized.newName.trim();
  }

  return normalized;
}

// --------------------------------------------------
// Execute File Command
// --------------------------------------------------

async function executeFileCommand(analysis, context = {}) {
  const { operation, parameters } = analysis || {};

  const agentOperation = OPERATION_MAP[operation];

  if (!agentOperation) {
    return {
      type: "action",
      service: "file",
      operation: operation || null,
      status: "unsupported",
      reply: "Ye file operation supported nahi hai.",
    };
  }

  const { userId, deviceId } = context;

  if (
    typeof userId !== "string" ||
    typeof deviceId !== "string"
  ) {
    return {
      type: "action",
      service: "file",
      operation,
      status: "not_connected",
      reply: "Authorized Local Agent online nahi hai.",
    };
  }

  if (
    !parameters ||
    typeof parameters !== "object" ||
    Array.isArray(parameters)
  ) {
    return {
      type: "action",
      service: "file",
      operation,
      status: "failed",
      reply: "File command ke parameters invalid hain.",
    };
  }

  const normalizedParameters = normalizeParameters(
    operation,
    parameters
  );

  // ------------------------------------------------
  // Required Parameter Validation
  // ------------------------------------------------

  const nameRequiredOperations = [
    "createFolder",
    "createFile",
    "readFile",
    "deleteFile",
    "deleteFolder",
    "renameFile",
    "renameFolder",
    "moveFile",
    "moveFolder",
  ];

  if (
    nameRequiredOperations.includes(operation) &&
    (
      typeof normalizedParameters.name !== "string" ||
      !normalizedParameters.name
    )
  ) {
    return {
      type: "action",
      service: "file",
      operation,
      status: "failed",
      reply: "File ya folder ka naam provide karo.",
    };
  }

  const renameMoveOperations = [
    "renameFile",
    "renameFolder",
    "moveFile",
    "moveFolder",
  ];

  if (
    renameMoveOperations.includes(operation) &&
    (
      typeof normalizedParameters.newName !== "string" ||
      !normalizedParameters.newName
    )
  ) {
    return {
      type: "action",
      service: "file",
      operation,
      status: "failed",
      reply: "Naya file ya folder naam provide karo.",
    };
  }

  // ------------------------------------------------
  // Delete Confirmation
  // ------------------------------------------------

  const isDeleteOperation = [
    "deleteFile",
    "deleteFolder",
  ].includes(operation);

  if (isDeleteOperation) {
    if (context.deleteConfirmed !== true) {
      return {
        type: "action",
        service: "file",
        operation,
        status: "confirmation_required",
        reply: "Delete karne se pehle confirmation zaroori hai.",
        data: {
          name: normalizedParameters.name,
          path: normalizedParameters.path ?? ".",
          operation,
        },
      };
    }

    normalizedParameters.confirmed = true;
  }

  // ------------------------------------------------
  // Send Command to Local Agent
  // ------------------------------------------------

  try {
    const result = await sendCommand({
      userId,
      deviceId,
      handler: "file",
      operation: agentOperation,
      parameters: normalizedParameters,
    });

    if (result.success !== true) {
      return {
        type: "action",
        service: "file",
        operation,
        status: "failed",
        reply:
          result.error?.message ||
          result.message ||
          "File operation complete nahi hua.",
      };
    }

    return {
      type: "action",
      service: "file",
      operation,
      status: "success",
      reply:
        result.message ||
        "File operation complete ho gaya.",
      data: result.data ?? null,
    };
  } catch (error) {
    console.error("File Service Error:", error.message);

    return {
      type: "action",
      service: "file",
      operation,
      status: "failed",
      reply: "Local Agent se command execute nahi ho payi.",
    };
  }
}

module.exports = {
  executeFileCommand,
};