"use strict";

const {
  executeFileCommand,
} = require("../services/file.service");

async function fileController(analysis, context = {}) {
  return executeFileCommand(analysis, context);
}

module.exports = {
  fileController,
};