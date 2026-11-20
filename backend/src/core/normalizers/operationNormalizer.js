
"use strict";

// All supported operation aliases.
const OPERATION_ALIASES = Object.freeze({
  file: Object.freeze({
    create_folder: "createFolder",
    createFolder: "createFolder",

    create: "createFile",
    create_file: "createFile",
    createFile: "createFile",

    read: "readFile",
    read_file: "readFile",
    readFile: "readFile",

    list: "listDirectory",
    list_directory: "listDirectory",
    listDirectory: "listDirectory",

    delete: "deleteFile",
    delete_file: "deleteFile",
    deleteFile: "deleteFile",

    remove: "deleteFile",
    remove_file: "deleteFile",

    delete_folder: "deleteFolder",
    deleteFolder: "deleteFolder",

    remove_folder: "deleteFolder",
    remove_directory: "deleteFolder",

    // Rename operations
    rename_file: "renameFile",
    renameFile: "renameFile",

    rename_folder: "renameFolder",
    renameFolder: "renameFolder",

    // Move operations
    move_file: "moveFile",
    moveFile: "moveFile",

    move_folder: "moveFolder",
    moveFolder: "moveFolder",
  }),
});

// Parameter aliases.
const PARAMETER_ALIASES = Object.freeze({
  file: Object.freeze({
    name: [
      "name",
      "target",
      "oldName",
      "old_name",
      "filename",
      "fileName",
      "folderName",
      "folder_name",
      "file_name",
      "sourceName",
      "source_name",
    ],

    newName: [
      "newName",
      "new_name",
      "newFilename",
      "new_filename",
      "destinationName",
      "destination_name",
      "targetName",
      "target_name",
    ],

    path: [
      "path",
      "parent_directory",
      "parentDirectory",
      "directory",
      "location",
      "sourcePath",
      "source_path",
      "sourceDirectory",
      "source_directory",
    ],

    destinationPath: [
      "destinationPath",
      "destination_path",
      "targetPath",
      "target_path",
      "destinationDirectory",
      "destination_directory",
      "targetDirectory",
      "target_directory",
    ],
  }),
});

// Normalize Windows and Unix paths.
function normalizePath(value) {
  return String(value)
    .replace(/\\/g, "/")
    .replace(/\/+$/, "");
}

// Split a full path into parent directory and item name.
function splitSourcePath(sourcePath) {
  const normalizedPath = normalizePath(sourcePath);
  const lastSlash = normalizedPath.lastIndexOf("/");

  if (lastSlash === -1) {
    return {
      name: normalizedPath,
      path: ".",
    };
  }

  return {
    name: normalizedPath.substring(lastSlash + 1),
    path: normalizedPath.substring(0, lastSlash) || ".",
  };
}

function normalizeOperation(analysis) {
  if (!analysis || typeof analysis !== "object") {
    throw new Error("Invalid command analysis.");
  }

  const service = analysis.service;
  const operation = analysis.operation;

  const aliases = OPERATION_ALIASES[service];

  if (!aliases || typeof operation !== "string") {
    return analysis;
  }

  const normalizedOperation = aliases[operation];

  if (!normalizedOperation) {
    return analysis;
  }

  const parameters = {
    ...(analysis.parameters || {}),
  };

  const parameterAliases = PARAMETER_ALIASES[service] || {};

  // Normalize parameter names.
  for (const [target, sources] of Object.entries(parameterAliases)) {
    if (
      parameters[target] !== undefined &&
      parameters[target] !== null &&
      parameters[target] !== ""
    ) {
      continue;
    }

    for (const source of sources) {
      const value = parameters[source];

      if (value !== undefined && value !== null && value !== "") {
        parameters[target] = value;
        break;
      }
    }
  }

  // Normalize full source and destination paths for move operations.
  if (
    service === "file" &&
    ["moveFile", "moveFolder"].includes(normalizedOperation)
  ) {
    if (parameters.source) {
      const sourceParts = splitSourcePath(parameters.source);

      parameters.name = sourceParts.name;
      parameters.path = sourceParts.path;
    }

    if (parameters.destination) {
      const destination = normalizePath(parameters.destination);

      // A full destination path may include the new item name.
      if (
        destination &&
        destination.toLowerCase() !== "root" &&
        destination.includes("/")
      ) {
        const destinationParts = splitSourcePath(destination);

        parameters.destinationPath = destinationParts.path;
        parameters.newName = parameters.newName || destinationParts.name;
      } else {
        parameters.destinationPath = destination || ".";
      }
    }
  }

  // Split full source paths when name is not separately provided.
  const pathBasedOperations = [
    "createFile",
    "readFile",
    "deleteFile",
    "renameFile",
    "moveFile",
    "deleteFolder",
    "renameFolder",
    "moveFolder",
  ];

  if (
    service === "file" &&
    pathBasedOperations.includes(normalizedOperation) &&
    !parameters.name &&
    parameters.path
  ) {
    const sourceParts = splitSourcePath(parameters.path);

    parameters.name = sourceParts.name;
    parameters.path = sourceParts.path;
  }

  // Normalize paths.
  if (service === "file") {
    if (parameters.path !== undefined) {
      parameters.path = normalizePath(parameters.path) || ".";
    }

    if (parameters.destinationPath !== undefined) {
      parameters.destinationPath =
        normalizePath(parameters.destinationPath) || ".";
    }
  }

  // Rename destination defaults to the same parent directory.
  if (
    service === "file" &&
    ["renameFile", "renameFolder"].includes(normalizedOperation)
  ) {
    parameters.destinationPath =
      parameters.destinationPath || parameters.path || ".";
  }

  // Move destination defaults to workspace root.
  if (
    service === "file" &&
    ["moveFile", "moveFolder"].includes(normalizedOperation)
  ) {
    parameters.destinationPath =
      parameters.destinationPath || ".";
  }

  // Workspace root aliases.
  if (service === "file" && normalizedOperation === "listDirectory") {
    const requestedPath = String(parameters.path || "")
      .trim()
      .toLowerCase();

    const workspaceAliases = [
      "lax workspace",
      "my workspace",
      "workspace",
      "lax folder",
      "root",
      "main folder",
    ];

    if (!requestedPath || workspaceAliases.includes(requestedPath)) {
      parameters.path = ".";
    }
  }

  return {
    ...analysis,
    operation: normalizedOperation,
    parameters,
  };
}

module.exports = Object.freeze({
  normalizeOperation,
});
