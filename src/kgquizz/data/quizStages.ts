/**
 * Progressive Quiz Test Stages for Zaheen Kindergarten Portal
 * Each test presents 5 letters or numbers at a time.
 * When the first test is completed, the next test is unlocked and shown!
 */

import { QuizQuestion, SubjectId, QUIZ_QUESTIONS } from './quizData';
import { IllustrationId } from '../components/illustrations/ItemIllustration';

export interface QuizTestStage {
  id: string;
  subject: SubjectId;
  stageNumber: number;
  title: string;
  titleUrdu: string;
  subtitle: string;
  subtitleUrdu: string;
  badge: string;
  badgeUrdu: string;
  previewItems: string[];
  previewIllustration: IllustrationId;
  questions: QuizQuestion[];
}

// Helper to look up questions by id with fallback
const getQ = (id: string): QuizQuestion => {
  const q = QUIZ_QUESTIONS.find((item) => item.id === id);
  if (!q) {
    throw new Error(`Question ${id} not found in QUIZ_QUESTIONS`);
  }
  return q;
};

// ====================================================
// ADDITIONAL SUPPLEMENTARY QUESTIONS (FOR NUMBERS 1-20)
// ====================================================
const SUPPLEMENTARY_QUESTIONS: Record<string, QuizQuestion> = {
  // Urdu Numbers 2, 3, 4
  'ur-num-2': {
    id: 'ur-num-2',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۲" (دو) پر ٹیپ کریں! دو آنکھیں، دو کان!',
    promptUrdu: 'اردو ہندسہ "۲" (دو) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ دو پر ٹیپ کریں۔ دو',
    speechLang: 'ur',
    featuredNumber: 2,
    options: [
      { id: 'opt-ur-2', label: '۲ (دو)', subLabel: 'Two', isCorrect: true },
      { id: 'opt-ur-1', label: '۱ (ایک)', subLabel: 'One', isCorrect: false },
      { id: 'opt-ur-3', label: '۳ (تین)', subLabel: 'Three', isCorrect: false },
    ],
    hint: 'دو کے اوپر تھوڑا مڑا ہوا سر ہوتا ہے: "۲"!',
  },
  'ur-num-3': {
    id: 'ur-num-3',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۳" (تین) پر ٹیپ کریں! تین دندانوں والا تین!',
    promptUrdu: 'اردو ہندسہ "۳" (تین) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ تین پر ٹیپ کریں۔ تین',
    speechLang: 'ur',
    featuredNumber: 3,
    options: [
      { id: 'opt-ur-3', label: '۳ (تین)', subLabel: 'Three', isCorrect: true },
      { id: 'opt-ur-2', label: '۲ (دو)', subLabel: 'Two', isCorrect: false },
      { id: 'opt-ur-4', label: '۴ (چار)', subLabel: 'Four', isCorrect: false },
    ],
    hint: 'اوپر دو دندانے ہوں تو وہ "۳" (تین) ہوتا ہے!',
  },
  'ur-num-4': {
    id: 'ur-num-4',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۴" (چار) تلاش کریں! گاڑی کے چار پہیے!',
    promptUrdu: 'اردو ہندسہ "۴" (چار) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ چار پر ٹیپ کریں۔ چار',
    speechLang: 'ur',
    featuredNumber: 4,
    options: [
      { id: 'opt-ur-4', label: '۴ (چار)', subLabel: 'Four', isCorrect: true },
      { id: 'opt-ur-3', label: '۳ (تین)', subLabel: 'Three', isCorrect: false },
      { id: 'opt-ur-5', label: '۵ (پانچ)', subLabel: 'Five', isCorrect: false },
    ],
    hint: 'اردو کا "۴" (چار) الٹے دل کی طرح ہوتا ہے!',
  },

  // Urdu Numbers 6, 7, 8, 9
  'ur-num-6': {
    id: 'ur-num-6',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۶" (چھ) پر ٹیپ کریں!',
    promptUrdu: 'اردو ہندسہ "۶" (چھ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ چھ پر ٹیپ کریں۔ چھ',
    speechLang: 'ur',
    featuredNumber: 6,
    options: [
      { id: 'opt-ur-6', label: '۶ (چھ)', subLabel: 'Six', isCorrect: true },
      { id: 'opt-ur-7', label: '۷ (سات)', subLabel: 'Seven', isCorrect: false },
      { id: 'opt-ur-2', label: '۲ (دو)', subLabel: 'Two', isCorrect: false },
    ],
    hint: 'دو کے الٹ رخ والا ہندسہ "۶" (چھ) ہے!',
  },
  'ur-num-7': {
    id: 'ur-num-7',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۷" (سات) تلاش کریں! V کی شکل والا سات!',
    promptUrdu: 'اردو ہندسہ "۷" (سات) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ سات پر ٹیپ کریں۔ سات',
    speechLang: 'ur',
    featuredNumber: 7,
    options: [
      { id: 'opt-ur-7', label: '۷ (سات)', subLabel: 'Seven', isCorrect: true },
      { id: 'opt-ur-8', label: '۸ (آٹھ)', subLabel: 'Eight', isCorrect: false },
      { id: 'opt-ur-6', label: '۶ (چھ)', subLabel: 'Six', isCorrect: false },
    ],
    hint: 'جس کا رخ نیچے کی طرف ہو: "۷" (سات)!',
  },
  'ur-num-8': {
    id: 'ur-num-8',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۸" (آٹھ) تلاش کریں! اوپر جانے والا پہاڑ!',
    promptUrdu: 'اردو ہندسہ "۸" (آٹھ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ آٹھ پر ٹیپ کریں۔ آٹھ',
    speechLang: 'ur',
    featuredNumber: 8,
    options: [
      { id: 'opt-ur-8', label: '۸ (آٹھ)', subLabel: 'Eight', isCorrect: true },
      { id: 'opt-ur-7', label: '۷ (سات)', subLabel: 'Seven', isCorrect: false },
      { id: 'opt-ur-9', label: '۹ (نو)', subLabel: 'Nine', isCorrect: false },
    ],
    hint: 'جس کی چوٹی اوپر اٹھی ہو: "۸" (آٹھ)!',
  },
  'ur-num-9': {
    id: 'ur-num-9',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۹" (نو) تلاش کریں! نو ستارے!',
    promptUrdu: 'اردو ہندسہ "۹" (نو) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ نو پر ٹیپ کریں۔ نو',
    speechLang: 'ur',
    featuredNumber: 9,
    options: [
      { id: 'opt-ur-9', label: '۹ (نو)', subLabel: 'Nine', isCorrect: true },
      { id: 'opt-ur-10', label: '۱۰ (دس)', subLabel: 'Ten', isCorrect: false },
      { id: 'opt-ur-8', label: '۸ (آٹھ)', subLabel: 'Eight', isCorrect: false },
    ],
    hint: 'اوپر گول چکر والا ہندسہ "۹" (نو) ہے!',
  },

  // Urdu Numbers 11, 12, 13, 14
  'ur-num-11': {
    id: 'ur-num-11',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۱" (گیارہ) تلاش کریں! دو الف ساتھ ساتھ!',
    promptUrdu: 'اردو ہندسہ "۱۱" (گیارہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ گیارہ پر ٹیپ کریں۔ گیارہ',
    speechLang: 'ur',
    featuredNumber: 11,
    options: [
      { id: 'opt-ur-11', label: '۱۱ (گیارہ)', subLabel: 'Eleven', isCorrect: true },
      { id: 'opt-ur-12', label: '۱۲ (بارہ)', subLabel: 'Twelve', isCorrect: false },
      { id: 'opt-ur-10', label: '۱۰ (دس)', subLabel: 'Ten', isCorrect: false },
    ],
    hint: 'ایک اور ایک مل کر "۱۱" (گیارہ) بناتے ہیں!',
  },
  'ur-num-12': {
    id: 'ur-num-12',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۲" (بارہ) تلاش کریں! ایک اور دو!',
    promptUrdu: 'اردو ہندسہ "۱۲" (بارہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ بارہ پر ٹیپ کریں۔ بارہ',
    speechLang: 'ur',
    featuredNumber: 12,
    options: [
      { id: 'opt-ur-12', label: '۱۲ (بارہ)', subLabel: 'Twelve', isCorrect: true },
      { id: 'opt-ur-11', label: '۱۱ (گیارہ)', subLabel: 'Eleven', isCorrect: false },
      { id: 'opt-ur-13', label: '۱۳ (تیرہ)', subLabel: 'Thirteen', isCorrect: false },
    ],
    hint: 'ایک اور دو مل کر "۱۲" (بارہ) بناتے ہیں!',
  },
  'ur-num-13': {
    id: 'ur-num-13',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۳" (تیرہ) تلاش کریں!',
    promptUrdu: 'اردو ہندسہ "۱۳" (تیرہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ تیرہ پر ٹیپ کریں۔ تیرہ',
    speechLang: 'ur',
    featuredNumber: 13,
    options: [
      { id: 'opt-ur-13', label: '۱۳ (تیرہ)', subLabel: 'Thirteen', isCorrect: true },
      { id: 'opt-ur-14', label: '۱۴ (چودہ)', subLabel: 'Fourteen', isCorrect: false },
      { id: 'opt-ur-12', label: '۱۲ (بارہ)', subLabel: 'Twelve', isCorrect: false },
    ],
    hint: 'ایک اور تین مل کر "۱۳" (تیرہ) بناتے ہیں!',
  },
  'ur-num-14': {
    id: 'ur-num-14',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۴" (چودہ) تلاش کریں! چودہویں کا چاند!',
    promptUrdu: 'اردو ہندسہ "۱۴" (چودہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ چودہ پر ٹیپ کریں۔ چودہ',
    speechLang: 'ur',
    featuredNumber: 14,
    options: [
      { id: 'opt-ur-14', label: '۱۴ (چودہ)', subLabel: 'Fourteen', isCorrect: true },
      { id: 'opt-ur-15', label: '۱۵ (پندرہ)', subLabel: 'Fifteen', isCorrect: false },
      { id: 'opt-ur-13', label: '۱۳ (تیرہ)', subLabel: 'Thirteen', isCorrect: false },
    ],
    hint: 'ایک اور چار مل کر "۱۴" (چودہ) بناتے ہیں!',
  },

  // Urdu Numbers 16, 17, 18, 19
  'ur-num-16': {
    id: 'ur-num-16',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۶" (سولہ) تلاش کریں!',
    promptUrdu: 'اردو ہندسہ "۱۶" (سولہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ سولہ پر ٹیپ کریں۔ سولہ',
    speechLang: 'ur',
    featuredNumber: 16,
    options: [
      { id: 'opt-ur-16', label: '۱۶ (سولہ)', subLabel: 'Sixteen', isCorrect: true },
      { id: 'opt-ur-17', label: '۱۷ (سترہ)', subLabel: 'Seventeen', isCorrect: false },
      { id: 'opt-ur-15', label: '۱۵ (پندرہ)', subLabel: 'Fifteen', isCorrect: false },
    ],
    hint: 'ایک اور چھ مل کر "۱۶" (سولہ) بناتے ہیں!',
  },
  'ur-num-17': {
    id: 'ur-num-17',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۷" (سترہ) تلاش کریں!',
    promptUrdu: 'اردو ہندسہ "۱۷" (سترہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ سترہ پر ٹیپ کریں۔ سترہ',
    speechLang: 'ur',
    featuredNumber: 17,
    options: [
      { id: 'opt-ur-17', label: '۱۷ (سترہ)', subLabel: 'Seventeen', isCorrect: true },
      { id: 'opt-ur-18', label: '۱۸ (اٹھارہ)', subLabel: 'Eighteen', isCorrect: false },
      { id: 'opt-ur-16', label: '۱۶ (سولہ)', subLabel: 'Sixteen', isCorrect: false },
    ],
    hint: 'ایک اور سات مل کر "۱۷" (سترہ) بناتے ہیں!',
  },
  'ur-num-18': {
    id: 'ur-num-18',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۸" (اٹھارہ) تلاش کریں!',
    promptUrdu: 'اردو ہندسہ "۱۸" (اٹھارہ) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ اٹھارہ پر ٹیپ کریں۔ اٹھارہ',
    speechLang: 'ur',
    featuredNumber: 18,
    options: [
      { id: 'opt-ur-18', label: '۱۸ (اٹھارہ)', subLabel: 'Eighteen', isCorrect: true },
      { id: 'opt-ur-19', label: '۱۹ (انیس)', subLabel: 'Nineteen', isCorrect: false },
      { id: 'opt-ur-17', label: '۱۷ (سترہ)', subLabel: 'Seventeen', isCorrect: false },
    ],
    hint: 'ایک اور آٹھ مل کر "۱۸" (اٹھارہ) بناتے ہیں!',
  },
  'ur-num-19': {
    id: 'ur-num-19',
    subject: 'urdu',
    activityType: 'ur-numbers',
    prompt: 'اردو ہندسہ "۱۹" (انیس) تلاش کریں! بیس سے ایک پہلے!',
    promptUrdu: 'اردو ہندسہ "۱۹" (انیس) پر ٹیپ کریں!',
    speechText: 'اردو ہندسہ انیس پر ٹیپ کریں۔ انیس',
    speechLang: 'ur',
    featuredNumber: 19,
    options: [
      { id: 'opt-ur-19', label: '۱۹ (انیس)', subLabel: 'Nineteen', isCorrect: true },
      { id: 'opt-ur-20', label: '۲۰ (بیس)', subLabel: 'Twenty', isCorrect: false },
      { id: 'opt-ur-18', label: '۱۸ (اٹھارہ)', subLabel: 'Eighteen', isCorrect: false },
    ],
    hint: 'ایک اور نو مل کر "۱۹" (انیس) بناتے ہیں!',
  },

  // Maths Numbers 1, 2, 3, 4
  'math-num-1': {
    id: 'math-num-1',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Can you spot NUMBER 1 (One)? Tap number 1!',
    speechText: 'Can you spot number 1? One shining sun!',
    speechLang: 'en',
    featuredNumber: 1,
    options: [
      { id: 'opt-m-1', label: '1', subLabel: 'One Sun ☀️', illustration: 'sun', isCorrect: true },
      { id: 'opt-m-2', label: '2', subLabel: 'Two', isCorrect: false },
      { id: 'opt-m-3', label: '3', subLabel: 'Three', isCorrect: false },
    ],
    hint: 'Number 1 is tall and straight! Tap 1!',
  },
  'math-num-2': {
    id: 'math-num-2',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 2 (Two)! Two cute little ducklings!',
    speechText: 'Can you tap the number 2?',
    speechLang: 'en',
    featuredNumber: 2,
    options: [
      { id: 'opt-m-2', label: '2', subLabel: 'Two Ducks 🦆', illustration: 'duck', isCorrect: true },
      { id: 'opt-m-1', label: '1', subLabel: 'One', isCorrect: false },
      { id: 'opt-m-4', label: '4', subLabel: 'Four', isCorrect: false },
    ],
    hint: 'Number 2 curls like a swan! Tap 2!',
  },
  'math-num-3': {
    id: 'math-num-3',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 3 (Three)! Three juicy apples!',
    speechText: 'Where is number 3?',
    speechLang: 'en',
    featuredNumber: 3,
    options: [
      { id: 'opt-m-3', label: '3', subLabel: 'Three Apples 🍎', illustration: 'apple', isCorrect: true },
      { id: 'opt-m-2', label: '2', subLabel: 'Two', isCorrect: false },
      { id: 'opt-m-5', label: '5', subLabel: 'Five', isCorrect: false },
    ],
    hint: 'Number 3 has two curves! Tap 3!',
  },
  'math-num-4': {
    id: 'math-num-4',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 4 (Four)! Four wheels on a wagon!',
    speechText: 'Can you find number 4?',
    speechLang: 'en',
    featuredNumber: 4,
    options: [
      { id: 'opt-m-4', label: '4', subLabel: 'Four Balls ⚽', illustration: 'ball', isCorrect: true },
      { id: 'opt-m-3', label: '3', subLabel: 'Three', isCorrect: false },
      { id: 'opt-m-5', label: '5', subLabel: 'Five', isCorrect: false },
    ],
    hint: 'Down, across, and down some more! Tap 4!',
  },

  // Maths Numbers 6, 7, 8, 9, 10
  'math-num-6': {
    id: 'math-num-6',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Can you find and tap NUMBER 6 (Six)?',
    speechText: 'Can you find number 6?',
    speechLang: 'en',
    featuredNumber: 6,
    options: [
      { id: 'opt-m-6', label: '6', subLabel: 'Six', isCorrect: true },
      { id: 'opt-m-9', label: '9', subLabel: 'Nine', isCorrect: false },
      { id: 'opt-m-5', label: '5', subLabel: 'Five', isCorrect: false },
    ],
    hint: 'Curve around and make a loop: that is 6!',
  },
  'math-num-7': {
    id: 'math-num-7',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Find NUMBER 7 (Seven)! Across the sky and down from heaven!',
    speechText: 'Can you find number 7?',
    speechLang: 'en',
    featuredNumber: 7,
    options: [
      { id: 'opt-m-7', label: '7', subLabel: 'Seven Stars ⭐', illustration: 'star', isCorrect: true },
      { id: 'opt-m-1', label: '1', subLabel: 'One', isCorrect: false },
      { id: 'opt-m-8', label: '8', subLabel: 'Eight', isCorrect: false },
    ],
    hint: 'Across and diagonal down! Tap 7!',
  },
  'math-num-8': {
    id: 'math-num-8',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 8 (Eight)! Two round circles together!',
    speechText: 'Where is number 8?',
    speechLang: 'en',
    featuredNumber: 8,
    options: [
      { id: 'opt-m-8', label: '8', subLabel: 'Eight', isCorrect: true },
      { id: 'opt-m-6', label: '6', subLabel: 'Six', isCorrect: false },
      { id: 'opt-m-3', label: '3', subLabel: 'Three', isCorrect: false },
    ],
    hint: 'Make an S and close the gate! Tap 8!',
  },
  'math-num-9': {
    id: 'math-num-9',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 9 (Nine)! A circle on top of a tall line!',
    speechText: 'Can you tap number 9?',
    speechLang: 'en',
    featuredNumber: 9,
    options: [
      { id: 'opt-m-9', label: '9', subLabel: 'Nine Balloons 🎈', illustration: 'gubbara', isCorrect: true },
      { id: 'opt-m-6', label: '6', subLabel: 'Six', isCorrect: false },
      { id: 'opt-m-10', label: '10', subLabel: 'Ten', isCorrect: false },
    ],
    hint: 'Circle on top and line down! Tap 9!',
  },
  'math-num-10': {
    id: 'math-num-10',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Ten in all! Tap NUMBER 10 (Ten: 1 and 0 together)!',
    speechText: 'Tap number 10, Ten fingers high!',
    speechLang: 'en',
    featuredNumber: 10,
    options: [
      { id: 'opt-m-10', label: '10', subLabel: 'Ten', isCorrect: true },
      { id: 'opt-m-1', label: '1', subLabel: 'One', isCorrect: false },
      { id: 'opt-m-20', label: '20', subLabel: 'Twenty', isCorrect: false },
    ],
    hint: '1 and 0 make 10! Tap 10!',
  },

  // Maths Numbers 11, 13, 14, 15
  'math-num-11': {
    id: 'math-num-11',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 11 (Eleven: 1 and 1)!',
    speechText: 'Can you tap number 11, Eleven?',
    speechLang: 'en',
    featuredNumber: 11,
    options: [
      { id: 'opt-m-11', label: '11', subLabel: 'Eleven', isCorrect: true },
      { id: 'opt-m-12', label: '12', subLabel: 'Twelve', isCorrect: false },
      { id: 'opt-m-1', label: '1', subLabel: 'One', isCorrect: false },
    ],
    hint: 'Two ones side by side make 11! Tap 11!',
  },
  'math-num-13': {
    id: 'math-num-13',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 13 (Thirteen: 1 and 3)!',
    speechText: 'Where is number 13, Thirteen?',
    speechLang: 'en',
    featuredNumber: 13,
    options: [
      { id: 'opt-m-13', label: '13', subLabel: 'Thirteen', isCorrect: true },
      { id: 'opt-m-31', label: '31', isCorrect: false },
      { id: 'opt-m-14', label: '14', isCorrect: false },
    ],
    hint: '1 followed by 3 is 13! Tap 13!',
  },
  'math-num-14': {
    id: 'math-num-14',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 14 (Fourteen: 1 and 4)!',
    speechText: 'Can you find number 14?',
    speechLang: 'en',
    featuredNumber: 14,
    options: [
      { id: 'opt-m-14', label: '14', subLabel: 'Fourteen', isCorrect: true },
      { id: 'opt-m-15', label: '15', subLabel: 'Fifteen', isCorrect: false },
      { id: 'opt-m-41', label: '41', isCorrect: false },
    ],
    hint: '1 and 4 make 14! Tap 14!',
  },
  'math-num-15': {
    id: 'math-num-15',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 15 (Fifteen: 1 and 5)!',
    speechText: 'Can you tap number 15, Fifteen?',
    speechLang: 'en',
    featuredNumber: 15,
    options: [
      { id: 'opt-m-15', label: '15', subLabel: 'Fifteen', isCorrect: true },
      { id: 'opt-m-50', label: '50', isCorrect: false },
      { id: 'opt-m-12', label: '12', isCorrect: false },
    ],
    hint: '1 followed by 5 is 15! Tap 15!',
  },

  // Maths Numbers 17, 19
  'math-num-17': {
    id: 'math-num-17',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 17 (Seventeen: 1 and 7)!',
    speechText: 'Can you tap number 17, Seventeen?',
    speechLang: 'en',
    featuredNumber: 17,
    options: [
      { id: 'opt-m-17', label: '17', subLabel: 'Seventeen', isCorrect: true },
      { id: 'opt-m-71', label: '71', isCorrect: false },
      { id: 'opt-m-16', label: '16', isCorrect: false },
    ],
    hint: '1 and 7 make 17! Tap 17!',
  },
  'math-num-19': {
    id: 'math-num-19',
    subject: 'maths',
    activityType: 'math-numbers',
    prompt: 'Tap NUMBER 19 (Nineteen: 1 and 9)!',
    speechText: 'Can you tap number 19, Nineteen?',
    speechLang: 'en',
    featuredNumber: 19,
    options: [
      { id: 'opt-m-19', label: '19', subLabel: 'Nineteen', isCorrect: true },
      { id: 'opt-m-91', label: '91', isCorrect: false },
      { id: 'opt-m-20', label: '20', isCorrect: false },
    ],
    hint: '1 and 9 make 19! Tap 19!',
  },

  // Addition sums to 10 and 20
  'math-add-2': {
    id: 'math-add-2',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '3 ducks + 2 ducks = How many swimming ducks altogether?',
    speechText: 'Three ducks plus two ducks. How many ducks in all?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'duck', count: 3 },
      { illustration: 'duck', count: 2 },
    ],
    options: [
      { id: 'opt-a-5d', label: '5 Ducks', isCorrect: true },
      { id: 'opt-a-4d', label: '4 Ducks', isCorrect: false },
      { id: 'opt-a-6d', label: '6 Ducks', isCorrect: false },
    ],
    hint: '3 + 2 = 5 ducks! Tap 5!',
  },
  'math-add-3': {
    id: 'math-add-3',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '4 balls + 1 ball = How many colorful balls altogether?',
    speechText: 'Four balls plus one ball. How many balls altogether?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'ball', count: 4 },
      { illustration: 'ball', count: 1 },
    ],
    options: [
      { id: 'opt-a-5b', label: '5 Balls', isCorrect: true },
      { id: 'opt-a-3b', label: '3 Balls', isCorrect: false },
      { id: 'opt-a-6b', label: '6 Balls', isCorrect: false },
    ],
    hint: '4 + 1 = 5 balls! Tap 5!',
  },
  'math-add-4': {
    id: 'math-add-4',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '2 stars + 2 stars = How many stars shining together?',
    speechText: 'Two stars plus two stars. How many stars in all?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'star', count: 2 },
      { illustration: 'star', count: 2 },
    ],
    options: [
      { id: 'opt-a-4s', label: '4 Stars', isCorrect: true },
      { id: 'opt-a-3s', label: '3 Stars', isCorrect: false },
      { id: 'opt-a-5s', label: '5 Stars', isCorrect: false },
    ],
    hint: '2 + 2 = 4 stars! Tap 4!',
  },
  'math-add-5': {
    id: 'math-add-5',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '5 apples + 3 apples = How many delicious apples?',
    speechText: 'Five apples plus three apples. How many apples in all?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'apple', count: 5 },
      { illustration: 'apple', count: 3 },
    ],
    options: [
      { id: 'opt-a-8ap', label: '8 Apples', isCorrect: true },
      { id: 'opt-a-7ap', label: '7 Apples', isCorrect: false },
      { id: 'opt-a-9ap', label: '9 Apples', isCorrect: false },
    ],
    hint: '5 + 3 = 8 apples! Tap 8!',
  },
  'math-add-10': {
    id: 'math-add-10',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '5 stars + 5 stars = How many stars shining together?',
    speechText: 'Five stars plus five stars. How many stars in all?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'star', count: 5 },
      { illustration: 'star', count: 5 },
    ],
    options: [
      { id: 'opt-a-9', label: '9', isCorrect: false },
      { id: 'opt-a-10', label: '10 Stars!', isCorrect: true },
      { id: 'opt-a-11', label: '11', isCorrect: false },
    ],
    hint: '5 + 5 = 10 stars! Tap 10!',
  },
  'math-add-12': {
    id: 'math-add-12',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '10 apples + 2 apples = How many delicious apples?',
    speechText: 'Ten apples plus two apples. How many apples?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'apple', count: 10 },
      { illustration: 'apple', count: 2 },
    ],
    options: [
      { id: 'opt-a-12', label: '12 Apples', isCorrect: true },
      { id: 'opt-a-11', label: '11', isCorrect: false },
      { id: 'opt-a-13', label: '13', isCorrect: false },
    ],
    hint: '10 + 2 = 12! Tap 12!',
  },
  'math-add-14': {
    id: 'math-add-14',
    subject: 'maths',
    activityType: 'math-addition',
    prompt: '10 balls + 4 balls = How many bouncy balls altogether?',
    speechText: 'Ten balls plus four balls. How many balls altogether?',
    speechLang: 'en',
    additionGroups: [
      { illustration: 'ball', count: 10 },
      { illustration: 'ball', count: 4 },
    ],
    options: [
      { id: 'opt-a-14', label: '14 Balls', isCorrect: true },
      { id: 'opt-a-13', label: '13', isCorrect: false },
      { id: 'opt-a-15', label: '15', isCorrect: false },
    ],
    hint: '10 + 4 = 14! Tap 14!',
  },
};

// Aliases for question IDs
const ID_ALIASES: Record<string, string> = {
  'eng-ph-1': 'eng-pho-1',
  'eng-ph-2': 'eng-pho-2',
  'eng-ph-3': 'eng-pho-3',
  'eng-ph-4': 'eng-pho-4',
  'eng-ph-5': 'eng-pho-5',
};

// Safe getter that checks QUIZ_QUESTIONS first then SUPPLEMENTARY_QUESTIONS with fallback
const resolveQ = (id: string): QuizQuestion => {
  const targetId = ID_ALIASES[id] || id;
  const existing = QUIZ_QUESTIONS.find((q) => q.id === targetId || q.id === id);
  if (existing) return existing;
  const supp = SUPPLEMENTARY_QUESTIONS[targetId] || SUPPLEMENTARY_QUESTIONS[id];
  if (supp) return supp;

  // Safe fallback to prevent app crash
  console.warn(`Question ID "${id}" could not be resolved. Using safe fallback.`);
  return QUIZ_QUESTIONS[0];
};

// ====================================================
// 1. ENGLISH PROGRESSIVE TEST STAGES (5 Letters / Questions per Test)
// ====================================================
export const QUIZ_STAGES_ENGLISH: QuizTestStage[] = [
  {
    id: 'eng-test-1',
    subject: 'english',
    stageNumber: 1,
    title: 'Test 1: Letters A to E',
    titleUrdu: 'ٹیسٹ ۱: حروف A تا E',
    subtitle: 'Learn letters A, B, C, D, E with playful animal friends!',
    subtitleUrdu: 'اے تا ای (A - E) حروف اور تصاویر سیکھیں!',
    badge: '5 Letters (A-E)',
    badgeUrdu: '۵ حروف (A-E)',
    previewItems: ['A', 'B', 'C', 'D', 'E'],
    previewIllustration: 'apple',
    questions: [
      resolveQ('eng-let-a'),
      resolveQ('eng-let-b'),
      resolveQ('eng-let-c'),
      resolveQ('eng-let-d'),
      resolveQ('eng-let-e'),
    ],
  },
  {
    id: 'eng-test-2',
    subject: 'english',
    stageNumber: 2,
    title: 'Test 2: Letters F to J',
    titleUrdu: 'ٹیسٹ ۲: حروف F تا J',
    subtitle: 'Explore letters F, G, H, I, J with swimming fish and sweet treats!',
    subtitleUrdu: 'ایف تا جے (F - J) حروف اور تصاویر سیکھیں!',
    badge: '5 Letters (F-J)',
    badgeUrdu: '۵ حروف (F-J)',
    previewItems: ['F', 'G', 'H', 'I', 'J'],
    previewIllustration: 'fish',
    questions: [
      resolveQ('eng-let-f'),
      resolveQ('eng-let-g'),
      resolveQ('eng-let-h'),
      resolveQ('eng-let-i'),
      resolveQ('eng-let-j'),
    ],
  },
  {
    id: 'eng-test-3',
    subject: 'english',
    stageNumber: 3,
    title: 'Test 3: Letters K to O',
    titleUrdu: 'ٹیسٹ ۳: حروف K تا O',
    subtitle: 'Fly kites, roar with lions, and see the moon with K, L, M, N, O!',
    subtitleUrdu: 'کے تا او (K - O) حروف اور تصاویر سیکھیں!',
    badge: '5 Letters (K-O)',
    badgeUrdu: '۵ حروف (K-O)',
    previewItems: ['K', 'L', 'M', 'N', 'O'],
    previewIllustration: 'kite',
    questions: [
      resolveQ('eng-let-k'),
      resolveQ('eng-let-l'),
      resolveQ('eng-let-m'),
      resolveQ('eng-let-n'),
      resolveQ('eng-let-o'),
    ],
  },
  {
    id: 'eng-test-4',
    subject: 'english',
    stageNumber: 4,
    title: 'Test 4: Letters P to T',
    titleUrdu: 'ٹیسٹ ۴: حروف P تا T',
    subtitle: 'Waddle with penguins, hop with rabbits, and enjoy the sun with P, Q, R, S, T!',
    subtitleUrdu: 'پی تا ٹی (P - T) حروف اور تصاویر سیکھیں!',
    badge: '5 Letters (P-T)',
    badgeUrdu: '۵ حروف (P-T)',
    previewItems: ['P', 'Q', 'R', 'S', 'T'],
    previewIllustration: 'rabbit',
    questions: [
      resolveQ('eng-let-p'),
      resolveQ('eng-let-q'),
      resolveQ('eng-let-r'),
      resolveQ('eng-let-s'),
      resolveQ('eng-let-t'),
    ],
  },
  {
    id: 'eng-test-5',
    subject: 'english',
    stageNumber: 5,
    title: 'Test 5: Letters U to Z',
    titleUrdu: 'ٹیسٹ ۵: حروف U تا Z',
    subtitle: 'Open colorful umbrellas, play tunes, and spot zebras with U, V, W, X, Y, Z!',
    subtitleUrdu: 'یو تا زی (U - Z) آخری حروف سیکھیں!',
    badge: '6 Letters (U-Z)',
    badgeUrdu: '۶ حروف (U-Z)',
    previewItems: ['U', 'V', 'W', 'X', 'Y', 'Z'],
    previewIllustration: 'zebra',
    questions: [
      resolveQ('eng-let-u'),
      resolveQ('eng-let-v'),
      resolveQ('eng-let-w'),
      resolveQ('eng-let-x'),
      resolveQ('eng-let-y'),
      resolveQ('eng-let-z'),
    ],
  },
  {
    id: 'eng-test-6',
    subject: 'english',
    stageNumber: 6,
    title: 'Test 6: Letter Sounds (Phonics A-E)',
    titleUrdu: 'ٹیسٹ ۶: صوتیات (A تا E کی آوازیں)',
    subtitle: 'Listen closely to letter sounds /æ/, /b/, /k/, /d/, /e/ and tap matches!',
    subtitleUrdu: 'حروف کی پیاری آوازیں سنیں اور پہچانیں!',
    badge: 'Phonics 1',
    badgeUrdu: 'صوتیات ۱',
    previewItems: ['/æ/', '/b/', '/k/', '/d/', '/e/'],
    previewIllustration: 'cat',
    questions: [
      resolveQ('eng-pho-1'),
      resolveQ('eng-pho-2'),
      resolveQ('eng-pho-3'),
      resolveQ('eng-pho-4'),
      resolveQ('eng-pho-5'),
    ],
  },
  {
    id: 'eng-test-7',
    subject: 'english',
    stageNumber: 7,
    title: 'Test 7: Phonics Mastery Challenge',
    titleUrdu: 'ٹیسٹ ۷: صوتیات کا مکمل امتحان',
    subtitle: 'Blend sounds together, spot short vowels, and discover rhyming words!',
    subtitleUrdu: 'صوتیات کا دلچسپ چیلنج اور رائمز!',
    badge: 'Phonics Whiz ★',
    badgeUrdu: 'صوتیات ماہر',
    previewItems: ['Vowels', 'Blends', 'Rhymes', 'Endings', 'Words'],
    previewIllustration: 'duck',
    questions: [
      resolveQ('eng-test-1'),
      resolveQ('eng-test-2'),
      resolveQ('eng-test-3'),
      resolveQ('eng-test-4'),
      resolveQ('eng-test-5'),
    ],
  },
  {
    id: 'eng-test-8',
    subject: 'english',
    stageNumber: 8,
    title: 'Test 8: Simple Words Match',
    titleUrdu: 'ٹیسٹ ۸: آسان الفاظ اور تصویریں',
    subtitle: 'Match pictures to words like Cat, Sun, Fish, Ball, and Tree!',
    subtitleUrdu: 'تصویریں دیکھ کر الفاظ ملائیں!',
    badge: 'Word Master',
    badgeUrdu: 'الفاظ چیمپئن',
    previewItems: ['Cat', 'Sun', 'Ice Cream', 'Ball', 'Tree'],
    previewIllustration: 'sun',
    questions: [
      resolveQ('eng-word-1'),
      resolveQ('eng-word-2'),
      resolveQ('eng-word-3'),
      resolveQ('eng-word-4'),
      resolveQ('eng-word-5'),
    ],
  },
];

// ====================================================
// 2. URDU PROGRESSIVE TEST STAGES (5 Letters/Numbers per Test)
// ====================================================
export const QUIZ_STAGES_URDU: QuizTestStage[] = [
  {
    id: 'ur-test-1',
    subject: 'urdu',
    stageNumber: 1,
    title: 'ٹیسٹ ۱: حروف ا، ب، پ، ت، ٹ',
    titleUrdu: 'ٹیسٹ ۱: حروف ا، ب، پ، ت، ٹ',
    subtitle: 'الف سے انار، بے سے بلی، پے سے پتنگ، تے سے تتلی اور ٹے سے ٹماٹر!',
    subtitleUrdu: 'الف، بے، پے، تے، ٹے — پہلے ۵ حروف سیکھیں!',
    badge: '۵ حروف (ا تا ٹ)',
    badgeUrdu: '۵ حروف (ا تا ٹ)',
    previewItems: ['ا', 'ب', 'پ', 'ت', 'ٹ'],
    previewIllustration: 'anar',
    questions: [
      resolveQ('ur-all-1'),
      resolveQ('ur-all-2'),
      resolveQ('ur-all-3'),
      resolveQ('ur-all-4'),
      resolveQ('ur-all-5'),
    ],
  },
  {
    id: 'ur-test-2',
    subject: 'urdu',
    stageNumber: 2,
    title: 'ٹیسٹ ۲: حروف ث، ج، چ، ح، خ',
    titleUrdu: 'ٹیسٹ ۲: حروف ث، ج، چ، ح، خ',
    subtitle: 'ث سے ثمر، جیم سے جہاز، چے سے چاند، حے سے حوض اور خے سے خربوزہ!',
    subtitleUrdu: 'ثے، جیم، چے، حے، خے — ۵ مزید حروف سیکھیں!',
    badge: '۵ حروف (ث تا خ)',
    badgeUrdu: '۵ حروف (ث تا خ)',
    previewItems: ['ث', 'ج', 'چ', 'ح', 'خ'],
    previewIllustration: 'chand',
    questions: [
      resolveQ('ur-all-6'),
      resolveQ('ur-all-7'),
      resolveQ('ur-all-8'),
      resolveQ('ur-all-9'),
      resolveQ('ur-all-10'),
    ],
  },
  {
    id: 'ur-test-3',
    subject: 'urdu',
    stageNumber: 3,
    title: 'ٹیسٹ ۳: حروف د، ڈ، ذ، ر، ڑ',
    titleUrdu: 'ٹیسٹ ۳: حروف د، ڈ، ذ، ر، ڑ',
    subtitle: 'دال سے درخت، ڈال سے ڈھول، ذال سے ذخیرہ، رے سے ریل گاڑی اور ڑے سے پہاڑ!',
    subtitleUrdu: 'دال، ڈال، ذال، رے، ڑے — دال اور رے کا خاندان!',
    badge: '۵ حروف (د تا ڑ)',
    badgeUrdu: '۵ حروف (د تا ڑ)',
    previewItems: ['د', 'ڈ', 'ذ', 'ر', 'ڑ'],
    previewIllustration: 'darakht',
    questions: [
      resolveQ('ur-all-11'),
      resolveQ('ur-all-12'),
      resolveQ('ur-all-13'),
      resolveQ('ur-all-14'),
      resolveQ('ur-all-15'),
    ],
  },
  {
    id: 'ur-test-4',
    subject: 'urdu',
    stageNumber: 4,
    title: 'ٹیسٹ ۴: حروف ز، ژ، س، ش، ص',
    titleUrdu: 'ٹیسٹ ۴: حروف ز، ژ، س، ش، ص',
    subtitle: 'زے سے زرافہ، ژے سے ژالہ باری، سین سے سیب، شین سے شیر اور صواد سے صابن!',
    subtitleUrdu: 'زے، ژے، سین، شین، صواد — ۵ حروف کی مکمل مشق!',
    badge: '۵ حروف (ز تا ص)',
    badgeUrdu: '۵ حروف (ز تا ص)',
    previewItems: ['ز', 'ژ', 'س', 'ش', 'ص'],
    previewIllustration: 'saib',
    questions: [
      resolveQ('ur-all-16'),
      resolveQ('ur-all-17'),
      resolveQ('ur-all-18'),
      resolveQ('ur-all-19'),
      resolveQ('ur-all-20'),
    ],
  },
  {
    id: 'ur-test-5',
    subject: 'urdu',
    stageNumber: 5,
    title: 'ٹیسٹ ۵: حروف ض، ط، ظ، ع، غ',
    titleUrdu: 'ٹیسٹ ۵: حروف ض، ط، ظ، ع، غ',
    subtitle: 'طوئے سے طوطا، عین سے عینک، غین سے رنگین غبارہ!',
    subtitleUrdu: 'ضواد، طوئے، ظوئے، عین، غین — ۵ اہم حروف!',
    badge: '۵ حروف (ض تا غ)',
    badgeUrdu: '۵ حروف (ض تا غ)',
    previewItems: ['ض', 'ط', 'ظ', 'ع', 'غ'],
    previewIllustration: 'tota',
    questions: [
      resolveQ('ur-all-21'),
      resolveQ('ur-all-22'),
      resolveQ('ur-all-23'),
      resolveQ('ur-all-24'),
      resolveQ('ur-all-25'),
    ],
  },
  {
    id: 'ur-test-6',
    subject: 'urdu',
    stageNumber: 6,
    title: 'ٹیسٹ ۶: حروف ف، ق، ک، گ، ل',
    titleUrdu: 'ٹیسٹ ۶: حروف ف، ق، ک، گ، ل',
    subtitle: 'فوارہ، قلم، کتاب، گیند اور لٹو! ۵ مزید حروف!',
    subtitleUrdu: 'فے، قاف، کاف، گاف، لام — ۵ خوبصورت حروف!',
    badge: '۵ حروف (ف تا ل)',
    badgeUrdu: '۵ حروف (ف تا ل)',
    previewItems: ['ف', 'ق', 'ک', 'گ', 'ل'],
    previewIllustration: 'kitaab',
    questions: [
      resolveQ('ur-all-26'),
      resolveQ('ur-all-27'),
      resolveQ('ur-all-28'),
      resolveQ('ur-all-29'),
      resolveQ('ur-all-30'),
    ],
  },
  {
    id: 'ur-test-7',
    subject: 'urdu',
    stageNumber: 7,
    title: 'ٹیسٹ ۷: حروف م، ن، و، ہ، ی',
    titleUrdu: 'ٹیسٹ ۷: حروف م، ن، و، ہ، ی',
    subtitle: 'میم سے مچھلی، نون سے نلکا، ہے سے ہاتھی اور یے!',
    subtitleUrdu: 'حروفِ تہجی کے آخری ۵ حروف کی شاندار پہچان!',
    badge: '۵ حروف (م تا ی)',
    badgeUrdu: '۵ حروف (م تا ی)',
    previewItems: ['م', 'ن', 'و', 'ہ', 'ی'],
    previewIllustration: 'machhli',
    questions: [
      resolveQ('ur-pic-4'),
      resolveQ('ur-all-2'),
      resolveQ('ur-pic-1'),
      resolveQ('ur-pic-5'),
      resolveQ('ur-snd-1'),
    ],
  },
  {
    id: 'ur-test-8',
    subject: 'urdu',
    stageNumber: 8,
    title: 'ٹیسٹ ۸: اردو گنتی ۱ تا ۵',
    titleUrdu: 'ٹیسٹ ۸: اردو گنتی ۱ تا ۵',
    subtitle: 'ایک، دو، تین، چار، پانچ — اردو ہندسوں کی پہچان!',
    subtitleUrdu: '۱، ۲، ۳، ۴، ۵ — پہلی ۵ اردو گنتی!',
    badge: 'گنتی ۱ تا ۵',
    badgeUrdu: '۱ تا ۵ ہندسے',
    previewItems: ['۱', '۲', '۳', '۴', '۵'],
    previewIllustration: 'titli',
    questions: [
      resolveQ('ur-num-1'),
      resolveQ('ur-num-2'),
      resolveQ('ur-num-3'),
      resolveQ('ur-num-4'),
      resolveQ('ur-num-5'),
    ],
  },
  {
    id: 'ur-test-9',
    subject: 'urdu',
    stageNumber: 9,
    title: 'ٹیسٹ ۹: اردو گنتی ۶ تا ۱۰',
    titleUrdu: 'ٹیسٹ ۹: اردو گنتی ۶ تا ۱۰',
    subtitle: 'چھ، سات، آٹھ، نو، دس — دس تک گنتی مکمل!',
    subtitleUrdu: '۶، ۷، ۸، ۹، ۱۰ — دس تک اردو ہندسے!',
    badge: 'گنتی ۶ تا ۱۰',
    badgeUrdu: '۶ تا ۱۰ ہندسے',
    previewItems: ['۶', '۷', '۸', '۹', '۱۰'],
    previewIllustration: 'chand',
    questions: [
      resolveQ('ur-num-6'),
      resolveQ('ur-num-7'),
      resolveQ('ur-num-8'),
      resolveQ('ur-num-9'),
      resolveQ('ur-num-10'),
    ],
  },
  {
    id: 'ur-test-10',
    subject: 'urdu',
    stageNumber: 10,
    title: 'ٹیسٹ ۱۰: اردو گنتی ۱۱ تا ۱۵',
    titleUrdu: 'ٹیسٹ ۱۰: اردو گنتی ۱۱ تا ۱۵',
    subtitle: 'گیارہ، بارہ، تیرہ، چودہ، پندرہ!',
    subtitleUrdu: '۱۱، ۱۲، ۱۳، ۱۴، ۱۵ — پندرہ تک گنتی!',
    badge: 'گنتی ۱۱ تا ۱۵',
    badgeUrdu: '۱۱ تا ۱۵ ہندسے',
    previewItems: ['۱۱', '۱۲', '۱۳', '۱۴', '۱۵'],
    previewIllustration: 'anar',
    questions: [
      resolveQ('ur-num-11'),
      resolveQ('ur-num-12'),
      resolveQ('ur-num-13'),
      resolveQ('ur-num-14'),
      resolveQ('ur-num-15'),
    ],
  },
  {
    id: 'ur-test-11',
    subject: 'urdu',
    stageNumber: 11,
    title: 'ٹیسٹ ۱۱: اردو گنتی ۱۶ تا ۲۰',
    titleUrdu: 'ٹیسٹ ۱۱: اردو گنتی ۱۶ تا ۲۰',
    subtitle: 'سولہ، سترہ، اٹھارہ، انیس، بیس — بیس تک مکمل گنتی!',
    subtitleUrdu: '۱۶، ۱۷، ۱۸، ۱۹، ۲۰ — بیس تک مہارت حاصل کریں!',
    badge: 'گنتی ۱۶ تا ۲۰',
    badgeUrdu: '۱۶ تا ۲۰ ہندسے',
    previewItems: ['۱۶', '۱۷', '۱۸', '۱۹', '۲۰'],
    previewIllustration: 'billi',
    questions: [
      resolveQ('ur-num-16'),
      resolveQ('ur-num-17'),
      resolveQ('ur-num-18'),
      resolveQ('ur-num-19'),
      resolveQ('ur-num-20'),
    ],
  },
];

// ====================================================
// 3. MATHS PROGRESSIVE TEST STAGES (5 Numbers/Questions per Test)
// ====================================================
export const QUIZ_STAGES_MATHS: QuizTestStage[] = [
  {
    id: 'math-test-1',
    subject: 'maths',
    stageNumber: 1,
    title: 'Test 1: Numbers 1 to 5',
    titleUrdu: 'ٹیسٹ ۱: ہندسے 1 تا 5',
    subtitle: 'Spot numbers 1, 2, 3, 4, 5 with colorful blocks and friendly visuals!',
    subtitleUrdu: 'ایک سے پانچ (1 to 5) ہندسوں کی پہچان!',
    badge: '5 Numbers (1-5)',
    badgeUrdu: '۵ ہندسے (1-5)',
    previewItems: ['1', '2', '3', '4', '5'],
    previewIllustration: 'duck',
    questions: [
      resolveQ('math-num-1'),
      resolveQ('math-num-2'),
      resolveQ('math-num-3'),
      resolveQ('math-num-4'),
      resolveQ('math-num-5'),
    ],
  },
  {
    id: 'math-test-2',
    subject: 'maths',
    stageNumber: 2,
    title: 'Test 2: Numbers 6 to 10',
    titleUrdu: 'ٹیسٹ ۲: ہندسے 6 تا 10',
    subtitle: 'Find numbers 6, 7, 8, 9, 10! You are counting higher!',
    subtitleUrdu: 'چھ سے دس (6 to 10) ہندسے سیکھیں!',
    badge: '5 Numbers (6-10)',
    badgeUrdu: '۵ ہندسے (6-10)',
    previewItems: ['6', '7', '8', '9', '10'],
    previewIllustration: 'star',
    questions: [
      resolveQ('math-num-6'),
      resolveQ('math-num-7'),
      resolveQ('math-num-8'),
      resolveQ('math-num-9'),
      resolveQ('math-num-10'),
    ],
  },
  {
    id: 'math-test-3',
    subject: 'maths',
    stageNumber: 3,
    title: 'Test 3: Numbers 11 to 15',
    titleUrdu: 'ٹیسٹ ۳: ہندسے 11 تا 15',
    subtitle: 'Recognize double-digit teen numbers 11, 12, 13, 14, 15!',
    subtitleUrdu: 'گیارہ سے پندرہ (11 to 15) ہندسے!',
    badge: '5 Numbers (11-15)',
    badgeUrdu: '۵ ہندسے (11-15)',
    previewItems: ['11', '12', '13', '14', '15'],
    previewIllustration: 'apple',
    questions: [
      resolveQ('math-num-11'),
      resolveQ('math-num-12'),
      resolveQ('math-num-13'),
      resolveQ('math-num-14'),
      resolveQ('math-num-15'),
    ],
  },
  {
    id: 'math-test-4',
    subject: 'maths',
    stageNumber: 4,
    title: 'Test 4: Numbers 16 to 20',
    titleUrdu: 'ٹیسٹ ۴: ہندسے 16 تا 20',
    subtitle: 'Master numbers 16, 17, 18, 19, and the big 20!',
    subtitleUrdu: 'سولہ سے بیس (16 to 20) ہندسوں میں مہارت!',
    badge: '5 Numbers (16-20)',
    badgeUrdu: '۵ ہندسے (16-20)',
    previewItems: ['16', '17', '18', '19', '20'],
    previewIllustration: 'ball',
    questions: [
      resolveQ('math-num-16'),
      resolveQ('math-num-17'),
      resolveQ('math-num-18'),
      resolveQ('math-num-19'),
      resolveQ('math-num-20'),
    ],
  },
  {
    id: 'math-test-5',
    subject: 'maths',
    stageNumber: 5,
    title: 'Test 5: Interactive Counting Garden',
    titleUrdu: 'ٹیسٹ ۵: چیزیں چھو کر گنیں',
    subtitle: 'Tap each swimming duck, shiny apple, and star to count up to 20!',
    subtitleUrdu: 'تصویروں کو انگلی سے چھو کر گنیں!',
    badge: 'Counting Fun',
    badgeUrdu: 'گنتی مشق',
    previewItems: ['3 Ducks', '7 Stars', '10 Apples', '15 Fish', '20 Balls'],
    previewIllustration: 'duck',
    questions: [
      resolveQ('math-cnt-3'),
      resolveQ('math-cnt-7'),
      resolveQ('math-cnt-10'),
      resolveQ('math-cnt-15'),
      resolveQ('math-cnt-20'),
    ],
  },
  {
    id: 'math-test-6',
    subject: 'maths',
    stageNumber: 6,
    title: 'Test 6: Fun Addition up to 10',
    titleUrdu: 'ٹیسٹ ۶: جمع کرنا (10 تک)',
    subtitle: 'Put friendly items together to solve addition sums up to 10!',
    subtitleUrdu: 'چیزیں ملا کر دیکھیں کل کتنی ہو گئیں!',
    badge: 'Sums to 10',
    badgeUrdu: 'جمع ۱۰ تک',
    previewItems: ['2+1', '3+2', '4+1', '2+2', '5+5'],
    previewIllustration: 'apple',
    questions: [
      resolveQ('math-add-1'),
      resolveQ('math-add-2'),
      resolveQ('math-add-3'),
      resolveQ('math-add-4'),
      resolveQ('math-add-10'),
    ],
  },
  {
    id: 'math-test-7',
    subject: 'maths',
    stageNumber: 7,
    title: 'Test 7: Addition Sums up to 20',
    titleUrdu: 'ٹیسٹ ۷: بڑی جمع (20 تک)',
    subtitle: 'Put bigger groups together to solve addition sums all the way to 20!',
    subtitleUrdu: 'بیس (20) تک جمع کے سوال حل کریں!',
    badge: 'Sums to 20 ★',
    badgeUrdu: 'جمع ۲۰ تک',
    previewItems: ['5+3', '10+2', '10+4', '10+5', '10+10'],
    previewIllustration: 'star',
    questions: [
      resolveQ('math-add-5'),
      resolveQ('math-add-12'),
      resolveQ('math-add-14'),
      resolveQ('math-add-15'),
      resolveQ('math-add-20'),
    ],
  },
];

// Mapping from subject to stage list
export const ALL_QUIZ_STAGES: Record<SubjectId, QuizTestStage[]> = {
  english: QUIZ_STAGES_ENGLISH,
  urdu: QUIZ_STAGES_URDU,
  maths: QUIZ_STAGES_MATHS,
};

export function getTestStagesForSubject(subject: SubjectId): QuizTestStage[] {
  return ALL_QUIZ_STAGES[subject] || [];
}

export function getTestStageById(stageId: string): QuizTestStage | undefined {
  for (const list of Object.values(ALL_QUIZ_STAGES)) {
    const found = list.find((s) => s.id === stageId);
    if (found) return found;
  }
  return undefined;
}

export function getNextTestStage(currentStageId: string): QuizTestStage | null {
  for (const list of Object.values(ALL_QUIZ_STAGES)) {
    const idx = list.findIndex((s) => s.id === currentStageId);
    if (idx !== -1 && idx < list.length - 1) {
      return list[idx + 1];
    }
  }
  return null;
}
