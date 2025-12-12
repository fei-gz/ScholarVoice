/**
 * Decodes a base64 string into an ArrayBuffer.
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Creates a valid WAV file Blob from raw PCM data.
 * Gemini 2.5 TTS returns raw PCM (usually 24kHz, 1 channel, 16-bit signed integer or float).
 * Based on the guide's decode example, the data is linear PCM.
 * We will wrap it in a RIFF WAV container to make it playable by <audio> tags and downloadable.
 */
export const createWavBlob = (pcmData: ArrayBuffer, sampleRate: number = 24000): Blob => {
  const numChannels = 1;
  const bitsPerSample = 16;
  
  // Input is raw bytes. We assume it is 16-bit PCM (Little Endian) based on standard Gemini output behavior.
  // If the raw output is 32-bit float, we would need to convert. 
  // However, `dataInt16` usage in the guide suggests the raw bytes are effectively interpretable as Int16.
  const dataLength = pcmData.byteLength;
  
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * blockAlign)
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};