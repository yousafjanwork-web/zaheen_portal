/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpeechLang } from '../types';

export type Lang4 = 'en' | 'ur' | 'pa' | 'ps';
export type Localized = Partial<Record<Lang4, string | null>>;

export interface Ids { boardId: number; classId: number; className: string; classNameUr?: string }
export interface Welcome { text: Localized; audio: Localized }
export interface Chapter {
  id: number; nameEn: string; nameUr?: string; descriptionEn?: string; descriptionUr?: string; thumbnail?: string | null;
}
export interface LessonCard {
  id: number; slug: string; titleEn: string; titleUr?: string; descriptionEn?: string;
  minutes?: number; order: number; chapterId?: number;
}
export interface Video {
  id: number; order: number; role?: string; titleEn?: string; titleUr?: string;
  url: string; thumbnail?: string | null; seconds?: number;
}
export interface QuizOption { id: number; text: string; correct: boolean }
export interface Question {
  id: number; type?: string; prompt: string; explanationEn?: string; explanationUr?: string; options: QuizOption[];
}
export interface Activity {
  id?: number; stage?: string; type: string;
  titleEn?: string; titleUr?: string; instructionsEn?: string; instructionsUr?: string;
  titles: Localized; instructions: Localized; config: Record<string, any>;
  order: number; questions: Question[]; passPercent: number;
}
export interface LessonDetail {
  id: number; slug: string; titleEn: string; titleUr?: string; minutes?: number;
  chapter?: { id: number; nameEn: string; nameUr?: string };
  intro: { text: Localized; audio: Localized };
  concept: { symbol?: string; wordEn?: string; wordUr?: string; phonetic?: string; imageUrl?: string | null };
  explanation: { text: Localized; audio: Localized };
  videos: Video[];
  activities: Activity[];
}
export interface Phrase { key: string; text: Localized; audio: Localized }
export interface Localization { text: string; audio: string | null; lang: SpeechLang }