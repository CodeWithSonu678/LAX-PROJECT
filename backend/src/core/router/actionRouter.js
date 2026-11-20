// Selects and executes modules using moduleRegistry.

const {
  getModule,
  isModuleAvailable,
} = require("../registry/moduleRegistry");

const ALLOWED_SERVICES = [
  "conversation",
  "file",
  "laptop",
  "whatsapp",
  "instagram",
  "phone",
];

async function actionRouter(analysis, context = {}) {
  // 1. Validate analysis
  if (!analysis || typeof analysis !== "object") {
    throw new Error("Invalid command analysis.");
  }

  // 2. Handle clarification
  if (
    analysis.needsClarification ||
    analysis.type === "clarification"
  ) {
    return {
      type: "clarification",
      reply:
        analysis.clarificationQuestion ||
        "Please clarify what you want me to do.",
    };
  }

  // 3. Determine service
  let serviceName;

  if (
    analysis.type === "conversation" ||
    analysis.type === "question"
  ) {
    serviceName = "conversation";
  } else if (analysis.type === "action") {
    serviceName = analysis.service;
  } else {
    throw new Error("Unsupported command type.");
  }

  // 4. Validate service
  if (
    typeof serviceName !== "string" ||
    !ALLOWED_SERVICES.includes(serviceName)
  ) {
    throw new Error("Invalid service.");
  }

  // 5. Validate action details
  if (analysis.type === "action") {
    if (
      typeof analysis.operation !== "string" ||
      !analysis.operation.trim()
    ) {
      throw new Error("Invalid action operation.");
    }

    if (
      !analysis.parameters ||
      typeof analysis.parameters !== "object" ||
      Array.isArray(analysis.parameters)
    ) {
      throw new Error("Invalid action parameters.");
    }
  }

  // 6. Get handler from registry
  if (!isModuleAvailable(serviceName)) {
    return {
      type: analysis.type,
      service: serviceName,
      operation: analysis.operation || null,
      status: "not_connected",
      reply: `${serviceName} module is not implemented yet.`,
    };
  }

  const serviceHandler = getModule(serviceName);

  // 7. Execute selected module
  return await serviceHandler(analysis, context);
}

module.exports = {
  actionRouter,
};