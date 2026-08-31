/**
 * Client-side progress tracking (localStorage-backed).
 *
 * This replaces the previous static `userProfile` object with real numbers
 * derived from what the user has actually done in the app. When a real
 * backend/progress API exists, swap the internals of the functions below
 * for API calls — the function signatures can stay the same, so nothing
 * calling into this module needs to change.
 */

export interface Certificate {
  id: string;
  title: string;
  desc: string;
  date: string;
  emoji: string;
}

export interface UserProgress {
  craftsCompleted: string[];   // craft ids fully completed (all steps checked)
  videosWatched: string[];     // craft ids where the video was played at least once
  activeDates: string[];       // ISO 'YYYY-MM-DD' dates the user did something
  certificates: Certificate[]; // certificates actually earned
  bookmarks: string[];         // craft ids the user favorited
}

const STORAGE_KEY_PREFIX = 'zaheen_user_progress_v1';

// Progress must be scoped to the logged-in user, not shared globally.
// AuthContext stores the logged-in user's identifier under the
// 'msisdn' localStorage key — reuse that to namespace this module's
// storage key. When nobody is logged in, there is no key, so every
// read returns an empty progress and every write is a no-op — nothing
// gets recorded or shown for an anonymous session.
function getCurrentUserStorageKey(): string | null {
  if (typeof window === 'undefined') return null;

  // Try zaheen_auth first — works for ALL login methods
  // (OTP, credentials, Google) since loginWithUser() always writes it.
  try {
    const raw = window.localStorage.getItem('zaheen_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.userId) {
        return `${STORAGE_KEY_PREFIX}:uid_${parsed.userId}`;
      }
    }
  } catch {
    // fall through to msisdn fallback
  }

  // Legacy fallback for OTP users whose zaheen_auth may not have userId yet
  const msisdn = window.localStorage.getItem('msisdn');
  return msisdn ? `${STORAGE_KEY_PREFIX}:${msisdn}` : null;
}
// Tune these to match your real reward design.
const XP_PER_VIDEO = 10;
const XP_PER_CRAFT = 50;
const STARS_PER_CRAFT = 5;
const STARS_PER_VIDEO = 1;
const BADGE_MILESTONES = [1, 5, 10, 20, 50]; // crafts-completed thresholds

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyProgress(): UserProgress {
  return {
    craftsCompleted: [],
    videosWatched: [],
    activeDates: [],
    certificates: [],
    bookmarks: [],
  };
}

function loadProgress(): UserProgress {
  const key = getCurrentUserStorageKey();
  if (!key) return emptyProgress(); // nobody logged in — nothing to show
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

function saveProgress(progress: UserProgress) {
  const key = getCurrentUserStorageKey();
  if (!key) return; // nobody logged in — don't persist anonymous activity
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (e.g. private mode) — fail silently
  }
}

function markActiveToday(progress: UserProgress) {
  const today = todayISO();
  if (!progress.activeDates.includes(today)) {
    progress.activeDates.push(today);
    progress.activeDates.sort();
  }
}

function maybeAwardCertificates(progress: UserProgress) {
  const completedCount = progress.craftsCompleted.length;

  if (completedCount >= 5 && !progress.certificates.some((c) => c.id === 'beginner-folder')) {
    progress.certificates.push({
      id: 'beginner-folder',
      title: 'Beginner Folder',
      desc: 'Completed 5 origami crafts',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      emoji: '🥉',
    });
  }

  if (completedCount >= 15 && !progress.certificates.some((c) => c.id === 'seasoned-folder')) {
    progress.certificates.push({
      id: 'seasoned-folder',
      title: 'Seasoned Folder',
      desc: 'Completed 15 origami crafts',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      emoji: '🥈',
    });
  }

  // Add more certificate rules here as your catalogue grows
  // (e.g. category-specific: "complete all bird crafts" needs the craft's
  // category, which you can pass into recordCraftCompleted if you have it).
}

/** Call when a user presses play on a craft's video. */
export function recordVideoWatched(craftId: string): void {
  const progress = loadProgress();
  markActiveToday(progress);
  if (!progress.videosWatched.includes(craftId)) {
    progress.videosWatched.push(craftId);
  }
  saveProgress(progress);
}

/** Call when a user checks off the final step of a craft. */
export function recordCraftCompleted(craftId: string): void {
  const progress = loadProgress();
  markActiveToday(progress);
  if (!progress.craftsCompleted.includes(craftId)) {
    progress.craftsCompleted.push(craftId);
  }
  maybeAwardCertificates(progress);
  saveProgress(progress);
}

/** Toggle a bookmark; returns the new bookmarked state. */
export function toggleBookmark(craftId: string): boolean {
  const progress = loadProgress();
  const idx = progress.bookmarks.indexOf(craftId);
  if (idx >= 0) {
    progress.bookmarks.splice(idx, 1);
  } else {
    progress.bookmarks.push(craftId);
  }
  saveProgress(progress);
  return progress.bookmarks.includes(craftId);
}

export function isBookmarked(craftId: string): boolean {
  return loadProgress().bookmarks.includes(craftId);
}

/**
 * Consecutive-day streak counting backward from today.
 * If the user hasn't been active yet today, we still count backward from
 * yesterday so the streak doesn't drop to 0 the moment the clock rolls over —
 * it only breaks once an actual gap day is found.
 */
export function computeStreak(progress: UserProgress): number {
  if (progress.activeDates.length === 0) return 0;
  const dates = new Set(progress.activeDates);

  let streak = 0;
  const cursor = new Date();
  if (!dates.has(todayISO())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Merge real, activity-derived stats on top of a base profile object
 * (name, avatar, etc. can stay static — only the *numbers* become real).
 */
export function getComputedProfile<T extends Record<string, any>>(baseProfile: T) {
  const progress = loadProgress();

  const craftsCompleted = progress.craftsCompleted.length;
  const videosWatched = progress.videosWatched.length;
  const streak = computeStreak(progress);

  const totalStars = craftsCompleted * STARS_PER_CRAFT + videosWatched * STARS_PER_VIDEO;
  const xp = craftsCompleted * XP_PER_CRAFT + videosWatched * XP_PER_VIDEO;
  const xpToNext = baseProfile.xpToNext ?? 2000;
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const badges = BADGE_MILESTONES.filter((m) => craftsCompleted >= m).length;
  const certificates = progress.certificates.length;

  return {
    ...baseProfile,
    craftsCompleted,
    totalStars,
    badges,
    certificates,
    streak,
    xp,
    xpToNext,
    level,
    bookmarks: progress.bookmarks,
    certificatesList: progress.certificates,
    weekActivity: getWeekActivity(progress),
  };
}

/**
 * Returns 7 booleans for the current Mon–Sun week, true where the user was
 * actually active on that real calendar date. Index 0 = Monday, 6 = Sunday.
 */
export function getWeekActivity(progress: UserProgress = loadProgress()): boolean[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);

  const activeDates = new Set(progress.activeDates);
  const week: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(activeDates.has(d.toISOString().slice(0, 10)));
  }
  return week;
}

export function getRawProgress(): UserProgress {
  return loadProgress();
}

/** Set of craft ids whose video has been watched at least once. */
export function getWatchedCraftIds(): Set<string> {
  return new Set(loadProgress().videosWatched);
}

/** Dev/testing helper — wipe all tracked progress. */
export function resetProgress(): void {
  saveProgress(emptyProgress());
}