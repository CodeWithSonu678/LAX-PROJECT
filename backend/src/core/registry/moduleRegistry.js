"use strict";

const {
  conversationController,
} = require("../../modules/conversation/controllers/conversation.controller");

const {
  fileController,
} = require("../../modules/file/controllers/file.controller");

// Available modules registry
const moduleRegistry = {
  conversation: conversationController,
  file: fileController,
  laptop: null,
  whatsapp: null,
  instagram: null,
  phone: null,
};

// Get module handler
function getModule(serviceName) {
  return moduleRegistry[serviceName] || null;
}

// Register or update module
function registerModule(serviceName, handler) {
  if (!Object.prototype.hasOwnProperty.call(moduleRegistry, serviceName)) {
    throw new Error(`Unknown module: ${serviceName}`);
  }

  if (typeof handler !== "function") {
    throw new Error("Module handler must be a function.");
  }

  moduleRegistry[serviceName] = handler;
}

// Check module availability
function isModuleAvailable(serviceName) {
  return typeof getModule(serviceName) === "function";
}

module.exports = {
  getModule,
  registerModule,
  isModuleAvailable,
};