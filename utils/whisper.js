const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const transcribeAudio = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("model", "whisper-1");
  form.append("response_format", "text");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    return response.data; // plain text transcript
  } catch (error) {
    console.error(
      "❌ Error transcribing with Whisper:",
      error.response?.data || error.message
    );
    throw new Error("Failed to transcribe audio");
  }
};

module.exports = transcribeAudio;
