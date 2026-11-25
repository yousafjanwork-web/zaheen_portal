import { VoiceLang } from '../types';

export interface VoiceMeta { code: VoiceLang; nameEn: string; nativeName: string; glyph: string }

export const DEFAULT_VOICE: VoiceLang = 'ur';

export const VOICES: VoiceMeta[] = [
  { code: 'ur', nameEn: 'Urdu', nativeName: 'اردو', glyph: 'ا' },
  { code: 'pa', nameEn: 'Punjabi', nativeName: 'پنجابی', glyph: 'پ' },
  { code: 'ps', nameEn: 'Pashto', nativeName: 'پښتو', glyph: 'پښ' },
];

export function getVoice(code: VoiceLang): VoiceMeta {
  return VOICES.find((v) => v.code === code) ?? VOICES[0];
}

export function isVoiceLang(value: unknown): value is VoiceLang {
  return value === 'ur' || value === 'pa' || value === 'ps';
}