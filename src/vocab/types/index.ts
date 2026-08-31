export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "parent" | "admin";
  ageGroup: "junior" | "senior";
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  joinedAt: string;
  wordsLearned: number;
  lessonsCompleted: number;
  coins: number;
  pets: PetCompanion[];
  equippedPet: string | null;
  inventory: InventoryItem[];
  customizations: CustomizationSettings;
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  urduDefinition?: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  imageUrl: string;
  funFact?: string;
}

export interface Lesson {
  id: string;
  title: string;
  theme: string;
  ageGroup: "junior" | "senior" | "both";
  videoUrl: string;
  words: VocabularyWord[];
  activity: Activity;
  quiz: Quiz;
  challenge: Challenge;
  xpRewards: {
    video: number;
    activity: number;
    quiz: number;
    challenge: number;
  };
  order: number;
}

export interface Activity {
  type:
    | "drag-drop"
    | "fill-blank"
    | "word-picture"
    | "sentence-build"
    | "synonym-antonym"
    | "choose-meaning";
  title: string;
  instructions: string;
  questions: ActivityQuestion[];
  points: number;
}

export interface ActivityQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string | string[];
  type: "match" | "fill" | "multiple" | "drag";
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  totalPoints: number;
}

export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "match" | "complete-sentence";
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Challenge {
  title: string;
  instructions: string;
  type: "write-sentence" | "describe-object" | "mini-story" | "use-all-words";
  evaluationCriteria: {
    vocabularyUsage: number;
    creativity: number;
    grammar: number;
  };
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  timestamp: string;
  lessonId?: string;
}

export type JuniorLevel =
  | "Beginner Explorer"
  | "Word Adventurer"
  | "Vocabulary Hero"
  | "Story Builder"
  | "Word Master";
export type SeniorLevel =
  | "Word Explorer"
  | "Creative Communicator"
  | "Language Champion"
  | "Story Creator"
  | "Vocabulary Expert";

export interface LearningCalendarDay {
  date: string;
  completed: boolean;
  xpEarned: number;
  lessonId?: string;
}

// ── New gamification systems ─────────────────────────────────

export interface PetCompanion {
  id: string;
  species: "dragon" | "cat" | "fox" | "panda" | "owl" | "unicorn";
  name: string;
  emoji: string;
  level: number;
  xp: number;
  happiness: number; // 0-100
  evolutionStage: 0 | 1 | 2 | 3; // egg → baby → teen → adult
  unlockedAt: string;
}

export interface InventoryItem {
  id: string;
  type: "theme" | "avatar" | "badge-frame" | "word-pack" | "boost" | "pet";
  name: string;
  icon: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  equipped: boolean;
  acquiredAt: string;
}

export interface CustomizationSettings {
  theme: "blue" | "purple" | "green" | "pink" | "midnight";
  avatarFrame: "none" | "gold" | "rainbow" | "fire" | "ice";
  trailEffect: "none" | "sparkles" | "leaves" | "stars";
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  rank: number;
  isCurrentUser?: boolean;
  weeklyXp?: number;
  badgeCount: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  type:
    | "word-sprint"
    | "story-sprint"
    | "memory-match"
    | "spelling-bee"
    | "word-detective";
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  coinReward: number;
}

export interface WordCollection {
  wordId: string;
  word: string;
  theme: string;
  emoji: string;
  definition: string;
  collectedAt: string;
  timesReviewed: number;
  mastery: "new" | "learning" | "familiar" | "mastered";
}

export interface AchievementStory {
  id: string;
  title: string;
  prompt: string;
  theme: string;
  submittedAt: string;
  storyText: string;
  wordCount: number;
  score: number;
  feedback: string;
  published: boolean;
  likes: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "pet" | "theme" | "avatar" | "boost" | "pack";
  cost: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special";
  goal: { target: number; current: number };
  xpReward: number;
  coinReward: number;
  expiresAt: string;
  completed: boolean;
  claimedAt?: string;
  icon: string;
}

export interface FlashcardStudySession {
  startedAt: string;
  totalCards: number;
  known: string[];
  learning: string[];
  completedAt?: string;
}
