const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "personal_fact",
        "preference",
        "project_fact",
        "learning_context",
        "conversation_summary",
        "other",
      ],
      required: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    entities: {
      type: [String],
      default: [],
      index: true,
    },

    source: {
      type: String,
      enum: ["user", "assistant", "external"],
      required: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 1,
    },

    conversationId: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Same user ke liye ek key ki ek active memory.
// Inactive memories history ke liye rakhi ja sakti hain.
memorySchema.index(
  { userId: 1, key: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
  }
);

memorySchema.index({
  userId: 1,
  topic: 1,
  isActive: 1,
});

module.exports = mongoose.model("Memory", memorySchema);

// yah model user ke personal info save ke liye rkha gya h.

// example of which type data store in this model

// {
//   "userId": "user_001",
//   "type": "personal_fact",
//   "key": "name",
//   "value": "Sonu",
//   "topic": "personal_information",
//   "entities": ["Sonu"],
//   "source": "user",
//   "confidence": 1,
//   "isActive": true
// }