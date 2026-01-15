/**
 * Global Type Definitions for Browser APIs and External Libraries
 */

interface Window {
  TTSManager: any;
  ProgressManager: any;
  TextSizeManager: any;
  ThemeManager: any;
  VoiceSearchManager: any;
  dictionaryData: any[];
  lessonsData: any[];
  cognatesData: any[];
  grammarData: any[];
  wordConnectData: any[];
  speakText: (text: string, lang?: string) => void;
  speakSwedish: (text: string) => void;
  speakArabic: (text: string) => void;
}

// Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  stop(): void;
  start(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported';
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Device Motion Permission
interface DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
