interface Window {
  matchMedia(query: string): MediaQueryList;
  speechSynthesis: SpeechSynthesis;
}

interface SpeechSynthesis {
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  getVoices(): SpeechSynthesisVoice[];
}

interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

interface SpeechSynthesisUtterance {
  text: string;
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

declare var SpeechSynthesisUtterance: {
  prototype: SpeechSynthesisUtterance;
  new(text?: string): SpeechSynthesisUtterance;
}

declare global {
  interface Window {
    matchMedia(query: string): MediaQueryList;
    speechSynthesis: SpeechSynthesis;
  }
}
