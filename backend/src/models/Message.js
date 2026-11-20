const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      default: null,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  }
);

messageSchema.index({
  userId: 1,
  conversationId: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Message", messageSchema);


// lax ne kya kya baat kiya uska history rhta h es model mein .


// [
//   {
//     "userId": "user_001",
//     "conversationId": "conv_001",
//     "role": "user",
//     "content": "Mera naam Sonu hai.",
//     "topic": "personal_information"
//   },
//   {
//     "userId": "user_001",
//     "conversationId": "conv_001",
//     "role": "assistant",
//     "content": "Hello Sonu! Aapse milkar achha laga.",
//     "topic": "personal_information"
//   },
//   {
//     "userId": "user_001",
//     "conversationId": "conv_001",
//     "role": "user",
//     "content": "Main SHRA Technology chalata hoon.",
//     "topic": "SHRA Technology"
//   }
// ]