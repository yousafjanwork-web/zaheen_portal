/**
 * crafts.ts — Types and static UI-only data.
 * 
 * All craft/category/difficulty data now comes from the API.
 * Only non-dynamic constants (whyOrigami, ageGroups, achievements, userProfile)
 * remain here since they are not served by the backend.
 */

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface Craft {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ageRange: string;
  duration: string;
  paperSize: string;
  thumbnail: string;
  videoUrl: string;
  pdfUrl: string;
  likes: number;
  views: string;
  steps: CraftStep[];
  tags: string[];
  featured?: boolean;
  isTodaysCraft?: boolean;
}

export interface CraftStep {
  stepNumber: number;
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  count: number;
  ageRange: string;
  gradient: string;
  description: string;
}

// ─── Static UI Data (not in DB) ───────────────────────────────────────────────

export const ageGroups = [
  {
    range: '4-6 Years',
    emoji: '🧒',
    color: 'sky',
    description: 'Simple shapes and animals',
    count: 28,
  },
  {
    range: '7-9 Years',
    emoji: '👦',
    color: 'green',
    description: 'More detailed creations',
    count: 35,
  },
  {
    range: '10-12 Years',
    emoji: '🧑',
    color: 'amber',
    description: 'Complex models and modular',
    count: 30,
  },
  {
    range: '13+ Years',
    emoji: '🎓',
    color: 'primary',
    description: 'Expert-level masterpieces',
    count: 22,
  },
];

export const whyOrigami = [
  {
    title: 'Improves Creativity',
    icon: '🎨',
    description: 'Transform flat paper into 3D art and develop creative thinking.',
  },
  {
    title: 'Better Focus',
    icon: '🎯',
    description: 'Following step-by-step instructions builds concentration skills.',
  },
  {
    title: 'Fine Motor Skills',
    icon: '✋',
    description: 'Precise folding strengthens hand-eye coordination.',
  },
  {
    title: 'Problem Solving',
    icon: '🧩',
    description: 'Figure out spatial relationships and sequential thinking.',
  },
  {
    title: 'Fun Learning',
    icon: '🎉',
    description: 'Learn geometry, fractions, and symmetry while having fun!',
  },
  {
    title: 'Mindfulness',
    icon: '🧘',
    description: 'Calming, meditative activity that reduces stress and anxiety.',
  },
];

export const achievements = [
  { id: 'first-fold', title: 'First Fold', emoji: '📄', description: 'Complete your first origami', xp: 10, unlocked: true },
  { id: 'five-crafts', title: 'Paper Starter', emoji: '⭐', description: 'Complete 5 crafts', xp: 50, unlocked: true },
  { id: 'ten-crafts', title: 'Fold Master', emoji: '🌟', description: 'Complete 10 crafts', xp: 100, unlocked: true },
  { id: 'bird-lover', title: 'Bird Watcher', emoji: '🐦', description: 'Complete all bird origami', xp: 200, unlocked: false },
  { id: 'streak-7', title: 'Week Warrior', emoji: '🔥', description: '7-day folding streak', xp: 150, unlocked: false },
  { id: 'all-beginner', title: 'Beginner Boss', emoji: '🏆', description: 'Complete all beginner crafts', xp: 300, unlocked: false },
  { id: 'speed-folder', title: 'Speed Folder', emoji: '⚡', description: 'Finish a craft in under 3 min', xp: 75, unlocked: true },
  { id: 'collector', title: 'Collector', emoji: '📚', description: 'Try crafts from 5 categories', xp: 125, unlocked: false },
];

export const userProfile = {
  name: 'Zaheen',
  avatar: '🦊',
  level: 7,
  xp: 1250,
  xpToNext: 2000,
  streak: 5,
  craftsCompleted: 23,
  totalStars: 145,
  badges: 4,
  bookmarks: ['paper-crane', 'paper-butterfly', 'origami-flower'],
  recentlyWatched: ['paper-crane', 'paper-airplane', 'paper-dog'],
  certificates: 2,
};
