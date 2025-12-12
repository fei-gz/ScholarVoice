import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";
import { base64ToArrayBuffer, createWavBlob } from "./audioUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAcademicSpeech = async (
  text: string,
  voice: VoiceName
): Promise<Blob> => {
  try {
    // We wrap the user text in a prompt to enforce the "Academic" style.
    // The TTS model is instructed via the text prompt itself.
    const prompt = `Read the following text in a clear, formal, and academic tone suitable for a university lecture: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.[0];
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from Gemini.");
    }

    // Convert Base64 to ArrayBuffer
    const pcmBuffer = base64ToArrayBuffer(base64Audio);

    // Convert PCM ArrayBuffer to a playable WAV Blob
    // Gemini 2.5 TTS typically outputs 24kHz.
    const wavBlob = createWavBlob(pcmBuffer, 24000);

    return wavBlob;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};