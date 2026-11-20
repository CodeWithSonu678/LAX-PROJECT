const { GoogleGenAI } = require("@google/genai");

const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const { retrieveRelevantMemories } = require("./memoryService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const AI_MODEL = "gemini-3.5-flash-lite";

// ========================================
// 1. ANALYZE TOPIC AND FOLLOW-UP
// ========================================

async function analyzeContext({
  command,
  recentMessages,
  previousTopic,
  previousEntities,
}) {
  const prompt = `
You are the context analyzer for LAX AI.

Analyze the conversation and the latest user message.

PREVIOUS TOPIC:
${previousTopic || "Unknown"}

PREVIOUS ENTITIES:
${JSON.stringify(previousEntities || [])}

RECENT CONVERSATION:
${JSON.stringify(recentMessages)}

LATEST USER MESSAGE:
${command}

Return valid JSON only in this format:
{
  "topic": "short topic name",
  "entities": ["entity1", "entity2"],
  "isFollowUp": false,
  "needsPreviousContext": false,
  "resolvedReference": null
}

RULES:
1. Understand Hindi, Hinglish and English.
2. Detect when the user changes the topic.
3. If the user returns to an earlier topic, identify that topic.
4. Resolve references like "ismein", "uska", "uske baare mein",
   "that", "it" using recent conversation.
5. Do not assume that every question belongs to the previous topic.
6. Extract entities only when supported by the conversation.
7. If a reference is ambiguous, set resolvedReference to null.
8. Never invent facts.
9. topic should describe the latest question's actual topic.
10. isFollowUp must be true only when the question depends on
    earlier conversation.
11. needsPreviousContext must be true when earlier messages
    are needed to understand the question.
`;

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const result = JSON.parse(response.text);

  return {
    topic: typeof result.topic === "string" ? result.topic : null,

    entities: Array.isArray(result.entities)
      ? result.entities.filter((item) => typeof item === "string").slice(0, 10)
      : [],

    isFollowUp: result.isFollowUp === true,

    needsPreviousContext: result.needsPreviousContext === true,

    resolvedReference:
      typeof result.resolvedReference === "string"
        ? result.resolvedReference
        : null,
  };
}

// ========================================
// 2. BUILD RELEVANT CONTEXT
// ========================================

async function buildContext({ userId, conversationId, command }) {
  if (!userId || !conversationId || !command) {
    throw new Error("userId, conversationId and command are required.");
  }

  // Load current conversation and recent messages.
  const [conversation, messages] = await Promise.all([
    Conversation.findOne({
      userId,
      conversationId,
    }).lean(),

    Message.find({
      userId,
      conversationId,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  messages.reverse();

  // Current command has already been saved by the controller.
  const previousMessages = messages.slice(0, -1);

  let analysis;

  try {
    analysis = await analyzeContext({
      command,
      recentMessages: previousMessages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      previousTopic: conversation?.currentTopic,
      previousEntities: conversation?.entities || [],
    });
  } catch (error) {
    console.error("Context analysis failed:", error.message);

    // Safe fallback if Gemini context analysis fails.
    analysis = {
      topic: conversation?.currentTopic || null,
      entities: conversation?.entities || [],
      isFollowUp: false,
      needsPreviousContext: true,
      resolvedReference: null,
    };
  }

  // Retrieve memories relevant to this question.
  let memories = [];

  try {
    memories = await retrieveRelevantMemories({
      userId,
      query: command,
      topic: analysis.topic || undefined,
      entities: analysis.entities,
      limit: 5,
    });
  } catch (error) {
    console.error("Memory retrieval failed:", error.message);
  }

  // Select recent context only when it is needed.
  const historyLimit = analysis.needsPreviousContext ? 6 : 3;

  const history = previousMessages
    .slice(-historyLimit)
    .map((message) => {
      const role = message.role === "assistant" ? "LAX" : "User";

      return `${role}: ${message.content}`;
    })
    .join("\n");

  const memoryContext = memories
    .map((memory) => {
      return [
        `Key: ${memory.key}`,
        `Value: ${memory.value}`,
        `Topic: ${memory.topic}`,
        `Source: ${memory.source}`,
      ].join(" | ");
    })
    .join("\n");

  const context = `
CURRENT QUESTION TOPIC:
${analysis.topic || "Unknown"}

FOLLOW-UP:
${analysis.isFollowUp}

RESOLVED REFERENCE:
${analysis.resolvedReference || "None"}

RELEVANT SAVED MEMORIES:
${memoryContext || "No relevant memories found."}

RECENT CONVERSATION:
${history || "No previous messages."}

IMPORTANT:
- Answer the current question.
- Use earlier context only when relevant.
- Do not mix unrelated topics.
- Do not invent missing facts.
`;

  return {
    context,
    analysis,
    memories,
  };
}

module.exports = {
  analyzeContext,
  buildContext,
};
