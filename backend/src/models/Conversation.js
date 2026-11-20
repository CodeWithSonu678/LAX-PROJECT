const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    conversationId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "New Conversation",
      trim: true,
    },

    currentTopic: {
      type: String,
      default: null,
      index: true,
    },

    summary: {
      type: String,
      default: "",
    },

    entities: {
      type: [String],
      default: [],
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Har user ki conversation ID unique honi chahiye.
conversationSchema.index(
  { userId: 1, conversationId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);


//  3. Conversation Model — Abhi kis topic par baat ho rahi hai?

// Kaam: Ek conversation ka title, current topic, short summary aur important entities store karna.

// Isse LAX ko context samajhne mein help milti hai, khaaskar jab user ismein, uska, woh wala jaise words use karta hai.

// Example

// Tum SHRA Technology ke baare mein baat kar rahe ho:

// Sonu: SHRA Technology mein C language course launch karna hai.

// LAX: Theek hai, hum course ka roadmap bana sakte hain.

// Sonu: Ismein kitne din lagenge?

// Yahan ismein ka matlab pichhli conversation mein chal raha C language course ho sakta hai.

// Conversation ki summary aur recent messages reference resolve karne mein help karenge.


// [
//   {
//     "userId": "user_001",
//     "conversationId": "conv_001",
//     "title": "SHRA Technology Course Planning",
//     "currentTopic": "C language course",
//     "summary": "User SHRA Technology ke liye C language course launch aur uska roadmap plan kar raha hai.",
//     "entities": [
//       "SHRA Technology",
//       "C language"
//     ]
//   },
//   {
//     "userId": "user_001",
//     "conversationId": "conv_002",
//     "title": "C++ Constructors",
//     "currentTopic": "C++ programming",
//     "summary": "User C++ constructors ke concept aur examples ko samajhna chahta hai.",
//     "entities": [
//       "C++",
//       "constructor"
//     ]
//   }
// ]