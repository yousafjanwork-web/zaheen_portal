const BASE_STORAGE_KEYS = {
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

// Returns userId from zaheen_auth in localStorage
function getCurrentUserId(): string {
  try {
    const raw = localStorage.getItem('zaheen_auth');
    if (!raw) return 'guest';
    const parsed = JSON.parse(raw);
    return parsed?.userId ? String(parsed.userId) : 'guest';
  } catch {
    return 'guest';
  }
}

// All keys are namespaced by userId so each user has their own data
function makeKeys(userId: string) {
  const prefix = `u${userId}_`;
  return Object.fromEntries(
    Object.entries(BASE_STORAGE_KEYS).map(([k, v]) => [k, `${prefix}${v}`])
  ) as typeof BASE_STORAGE_KEYS;
}

// STORAGE_KEYS is a getter — always returns keys for the current user
export const STORAGE_KEYS: typeof BASE_STORAGE_KEYS = new Proxy(
  {} as typeof BASE_STORAGE_KEYS,
  {
    get(_target, prop: string) {
      const userId = getCurrentUserId();
      const keys = makeKeys(userId);
      return keys[prop as keyof typeof BASE_STORAGE_KEYS];
    },
  }
);

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

// Call this on logout to clear only the current user's vocab data
export function clearVocabStorageForUser(userId: string): void {
  const keys = makeKeys(userId);
  Object.values(keys).forEach(key => localStorage.removeItem(key));
}