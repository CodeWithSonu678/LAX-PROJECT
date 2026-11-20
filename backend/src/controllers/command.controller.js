"use strict";

const Message = require("../models/Message");
const AgentDevice = require("../models/AgentDevice");

const { analyzeCommand } = require("../core/ai/commandAnalyzer");

const { actionRouter } = require("../core/router/actionRouter");

const { isDeviceConnected } = require("../services/agentConnection.service");

const {
  normalizeOperation,
} = require("../core/normalizers/operationNormalizer");

// --------------------------------------------------
// Pending Delete Confirmations
// --------------------------------------------------

// Temporary in-memory confirmation store.
// Key: userId + conversationId
const pendingDeletions = new Map();

const CONFIRMATION_TIMEOUT = 60 * 1000;

const DELETE_OPERATIONS = ["deleteFile", "deleteFolder"];

// --------------------------------------------------
// Helper: Save Message
// --------------------------------------------------

async function saveMessage(userId, conversationId, role, content) {
  await Message.create({
    userId,
    conversationId,
    role,
    content,
  });
}

// --------------------------------------------------
// Helper: Get Online Device
// --------------------------------------------------

async function getOnlineDevice(userId) {
  const devices = await AgentDevice.find({
    userId,
    revoked: false,
    status: "active",
  }).select("deviceId");

  return (
    devices.find((device) =>
      isDeviceConnected(userId.toString(), device.deviceId),
    )?.deviceId || null
  );
}

// --------------------------------------------------
// Helper: Return Standard Response
// --------------------------------------------------

function sendConfirmationResponse(
  res,
  result,
  command,
  userId,
  conversationId,
) {
  return res.json({
    success: result.status !== "failed",
    type: result.type,
    userId,
    conversationId,
    command,
    reply: result.reply,
    status: result.status || "success",
    data: result.data ?? null,
    topic: result.analysis?.topic || null,
    isFollowUp: result.analysis?.isFollowUp || false,
    memoriesUsed: result.memories?.length || 0,
  });
}

async function commandController(req, res) {
  try {
    const { command, conversationId } = req.body || {};

    if (typeof command !== "string" || !command.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please send a valid command.",
      });
    }

    // Authenticated LAX device se user ID
    const activeUserId = req.laxDevice?.userId;

    if (!activeUserId) {
      return res.status(401).json({
        success: false,
        reply: "LAX device is not associated with a valid user.",
      });
    }

    const userId = activeUserId.toString();
    const cleanCommand = command.trim();
    const activeConversationId = conversationId || "conv_001";

    const confirmationKey = `${req.laxDevice.laxId}:${userId}:${activeConversationId}`;

    console.log("LAX received:", cleanCommand);

    // ------------------------------------------------
    // 1. Check Pending Confirmation
    // ------------------------------------------------

    const pending = pendingDeletions.get(confirmationKey);

    if (pending) {
      // Expired confirmation
      if (Date.now() > pending.expiresAt) {
        pendingDeletions.delete(confirmationKey);

        return res.json({
          success: false,
          status: "confirmation_expired",
          reply: "Confirmation expire ho gaya. Delete command dobara bhejo.",
        });
      }

      const answer = cleanCommand.toLowerCase();

      // User rejected deletion
      if (["no", "n", "cancel", "cancel it", "nope"].includes(answer)) {
        pendingDeletions.delete(confirmationKey);

        await saveMessage(userId, activeConversationId, "user", cleanCommand);

        await saveMessage(
          userId,
          activeConversationId,
          "assistant",
          "Deletion cancelled. Koi file ya folder delete nahi hua.",
        );

        return res.json({
          success: true,
          status: "cancelled",
          reply: "Deletion cancelled. Koi file ya folder delete nahi hua.",
        });
      }

      // User confirmed deletion
      if (
        ["yes", "y", "confirm", "confirm delete", "yes delete"].includes(answer)
      ) {
        pendingDeletions.delete(confirmationKey);

        await saveMessage(userId, activeConversationId, "user", cleanCommand);

        const context = {
          command: pending.command,
          userId,
          deviceId: pending.deviceId,
          conversationId: activeConversationId,

          // Trusted controller-generated confirmation
          deleteConfirmed: true,
        };

        const result = await actionRouter(pending.analysis, context);

        await saveMessage(
          userId,
          activeConversationId,
          "assistant",
          result.reply,
        );

        return sendConfirmationResponse(
          res,
          result,
          pending.command,
          userId,
          activeConversationId,
        );
      }

      // Do not execute another command while confirmation is pending.
      return res.json({
        success: true,
        status: "confirmation_pending",
        reply: "Please reply YES to confirm deletion or NO to cancel it.",
      });
    }

    // ------------------------------------------------
    // 2. Analyze Command
    // ------------------------------------------------

    const rawAnalysis = await analyzeCommand(cleanCommand);

    const commandAnalysis = normalizeOperation(rawAnalysis);

    console.log("RAW ANALYSIS:", rawAnalysis);
    console.log("NORMALIZED ANALYSIS:", commandAnalysis);

    await saveMessage(userId, activeConversationId, "user", cleanCommand);

    // ------------------------------------------------
    // 3. Resolve Online Device
    // ------------------------------------------------

    let deviceId = null;

    if (commandAnalysis.type === "action") {
      deviceId = await getOnlineDevice(userId);
    }

    // ------------------------------------------------
    // 4. Prepare Context
    // ------------------------------------------------

    const context = {
      command: cleanCommand,
      userId,
      deviceId,
      conversationId: activeConversationId,
    };

    // ------------------------------------------------
    // 5. Execute Action
    // ------------------------------------------------

    const result = await actionRouter(commandAnalysis, context);

    // ------------------------------------------------
    // 6. Handle Delete Confirmation
    // ------------------------------------------------

    if (
      result.status === "confirmation_required" &&
      DELETE_OPERATIONS.includes(commandAnalysis.operation)
    ) {
      pendingDeletions.set(confirmationKey, {
        analysis: commandAnalysis,
        command: cleanCommand,
        deviceId,
        expiresAt: Date.now() + CONFIRMATION_TIMEOUT,
      });

      const name = result.data?.name || "selected item";
      const filePath = result.data?.path || ".";

      const reply =
        `Are you sure you want to delete "${name}" from "${filePath}"? ` +
        "Reply YES to confirm or NO to cancel. Confirmation expires in 60 seconds.";

      await saveMessage(userId, activeConversationId, "assistant", reply);

      return res.json({
        success: true,
        type: "confirmation",
        status: "confirmation_required",
        command: cleanCommand,
        reply,
        data: result.data ?? null,
      });
    }

    // ------------------------------------------------
    // 7. Handle Clarification
    // ------------------------------------------------

    if (result.type === "clarification") {
      return res.json({
        success: true,
        type: "clarification",
        reply: result.reply,
      });
    }

    // ------------------------------------------------
    // 8. Handle Unavailable Device
    // ------------------------------------------------

    if (result.status === "not_connected" || result.status === "unavailable") {
      return res.status(503).json({
        success: false,
        type: result.type,
        service: result.service,
        status: result.status,
        reply: result.reply,
      });
    }

    // ------------------------------------------------
    // 9. Validate Response
    // ------------------------------------------------

    if (typeof result.reply !== "string" || !result.reply.trim()) {
      throw new Error("Module returned an invalid response.");
    }

    // ------------------------------------------------
    // 10. Save Assistant Response
    // ------------------------------------------------

    await saveMessage(userId, activeConversationId, "assistant", result.reply);

    
    // ------------------------------------------------
    // 11. Final Response
    // ------------------------------------------------

    return sendConfirmationResponse(
      res,
      result,
      cleanCommand,
      userId,
      activeConversationId,
    );
  } catch (error) {
    console.error("Command Controller Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      reply:
        error.userReply ||
        "Something went wrong while processing your request.",
    });
  }
}

module.exports = {
  commandController,
};
