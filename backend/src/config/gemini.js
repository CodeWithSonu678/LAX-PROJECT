const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY missing from backend/.env");
}

const ai = new GoogleGenAI({ apiKey });

const AI_MODEL =
  process.env.AI_MODEL || "gemini-3.5-flash-lite";

module.exports = {
  ai,
  AI_MODEL
};