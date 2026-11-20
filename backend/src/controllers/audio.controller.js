const { transcribeAudio } = require("../services/transcription.service");

async function transcribe(req, res) {
  try {
    const audioBuffer = req.body;

    if (!Buffer.isBuffer(audioBuffer) || audioBuffer.length < 100) {
      return res.status(400).json({
        success: false,
        message: "Valid WAV audio is required"
      });
    }

    const text = await transcribeAudio(audioBuffer);

    return res.status(200).json({
      success: true,
      text
    });

  } catch (error) {
    console.error("Audio transcription error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Audio transcription failed"
    });
  }
}

module.exports = { transcribe };