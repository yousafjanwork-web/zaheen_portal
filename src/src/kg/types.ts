export type VoiceLang = 'ur' | 'pa' | 'ps';
export type SpeechLang = VoiceLang | 'en';
export type LanguageCode = 'en' | 'ur';

export interface Bilingual {
  en: string;
  ur: string;
}

export interface SpeakOptions {
  /** Recorded clip. Played first when present. */
  url?: string;
  /** Text for the browser voice, used only when there is no clip or it fails. */
  text?: string;
  lang?: SpeechLang;
}
