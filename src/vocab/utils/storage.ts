const STORAGE_KEYS = {
  USER: 'vocab_user',
  COMPLETED_LESSONS: 'vocab_completed_lessons',
  XP_TRANSACTIONS: 'vocab_xp_transactions',
  BADGES: 'vocab_badges',
  STREAK: 'vocab_streak',
  CALENDAR: 'vocab_calendar',
  CHALLENGE_RESPONSES: 'vocab_challenge_responses',
  QUIZ_SCORES: 'vocab_quiz_scores',
  ACTIVITY_PROGRESS: 'vocab_activity_progress',
  WORDS_LEARNED: 'vocab_words_learned',
  DARK_MODE: 'vocab_dark_mode',
  WORD_COLLECTION: 'vocab_word_collection',
  STORIES: 'vocab_stories',
  DAILY_CHALLENGES: 'vocab_daily_challenges',
  QUESTS: 'vocab_quests',
  FLASHCARD_STATS: 'vocab_flashcard_stats',
};

export function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export { STORAGE_KEYS };
