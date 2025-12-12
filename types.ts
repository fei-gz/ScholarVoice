export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface AudioState {
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TTSConfig {
  text: string;
  voice: VoiceName;
}