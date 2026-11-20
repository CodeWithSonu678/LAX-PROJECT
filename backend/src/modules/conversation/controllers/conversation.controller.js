const Message = require("../../../models/Message");
const Conversation = require("../../../models/Conversation");

const {
  buildContext,
} = require("../../../services/contextService");

const {
  extractMemories,
} = require("../../../services/memoryExtractor");

const {
  generateReply,
} = require("../services/conversation.service");

// Conversation module handler
async function conversationController(analysis, context = {}) {
  const { command, userId, conversationId } = context;

  if (
    typeof command !== "string" ||
    !command.trim() ||
    !userId ||
    !conversationId
  ) {
    throw new Error("Invalid conversation context.");
  }

  const cleanCommand = command.trim();

  // 1. Prepare conversation context
  const contextResult = await buildContext({
    userId,
    conversationId,
    command: cleanCommand,
  });

  // 2. Generate AI response
  const reply = await generateReply({
    command: cleanCommand,
    context: contextResult.context,
  });

  if (!reply) {
    throw new Error("No reply was generated.");
  }

  // 4. Prepare conversation metadata
  const conversationAnalysis = contextResult.analysis || {};

  const previousConversation = await Conversation.findOne({
    userId,
    conversationId,
  }).lean();

  const mergedEntities = [
    ...new Set([
      ...(previousConversation?.entities || []),
      ...(conversationAnalysis.entities || []),
    ]),
  ].slice(-20);

  // 5. Update conversation metadata
  await Conversation.findOneAndUpdate(
    {
      userId,
      conversationId,
    },
    {
      $setOnInsert: {
        title: cleanCommand.slice(0, 60),
        summary: "",
      },
      $set: {
        currentTopic:
          conversationAnalysis.topic ||
          previousConversation?.currentTopic ||
          null,
        entities: mergedEntities,
        lastMessageAt: new Date(),
      },
    },
    {
      upsert: true,
      runValidators: true,
    },
  );

  // 6. Extract useful memories in the background
  const extractionTasks = [
    {
      userMessage: cleanCommand,
      source: "user",
    },
    {
      userMessage: `
            Original user question:
            ${cleanCommand}

            Assistant answer:
            ${reply}

            Extract useful reusable educational knowledge only.
            `,
            source: "assistant",
      },
  ];

  // Memory extraction failures should not block the response.
  Promise.allSettled(
    extractionTasks.map((task) =>
      extractMemories({
        userId,
        conversationId,
        userMessage: task.userMessage,
        source: task.source,
      }),
    ),
  ).then((results) => {
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Memory extraction failed (${extractionTasks[index].source}):`,
          result.reason?.message || result.reason,
        );
      }
    });
  });

  // 7. Return result to commandController
  return {
    type: "conversation",
    reply,
    analysis: conversationAnalysis,
    memories: contextResult.memories || [],
  };
}

module.exports = {
  conversationController,
};