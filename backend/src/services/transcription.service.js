const { ai, AI_MODEL } = require("../config/gemini");

async function transcribeAudio(audioBuffer) {
  if (!Buffer.isBuffer(audioBuffer) || audioBuffer.length < 100) {
    throw new Error("Valid audio buffer is required");
  }

  const audioBase64 = audioBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      {
        text: [
          "Transcribe the spoken words exactly.",
          "The speaker may speak Hindi or Hinglish.",
          "Return only the recognized words.",
          "Do not answer the command."
        ].join(" ")
      },
      {
        inlineData: {
          mimeType: "audio/wav",
          data: audioBase64
        }
      }
    ]
  });

  return (response.text || "").trim();
}

module.exports = { transcribeAudio };