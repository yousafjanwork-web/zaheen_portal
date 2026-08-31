import {
  Lesson,
  VocabularyWord,
  Activity,
  ActivityQuestion,
  Quiz,
  QuizQuestion,
  Challenge,
  Badge,
  LeaderboardEntry,
} from "../types";

// ============================================================
// VOCAB MODULE — API → APP TYPE MAPPERS
// ============================================================
// The backend returns snake_case (age_group, video_url, ...).
// The app's existing types/components use camelCase (ageGroup,
// videoUrl, ...). Everything below only lives here, so every page
// component keeps working exactly like it did with the old static
// data/lessons.ts — nothing downstream had to change field names.
// ============================================================

// Small helper: try several possible keys (handles minor backend
// naming differences without breaking the whole app).
function pick<T = any>(obj: any, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

// ---- Word -------------------------------------------------
export function mapWord(raw: any): VocabularyWord {
  return {
    id: raw.id,
    word: raw.word,
    pronunciation: raw.pronunciation,
    definition: raw.definition,
    urduDefinition: pick(raw, "urdu_definition", "urduDefinition"),
    partOfSpeech: pick(raw, "part_of_speech", "partOfSpeech") || "",
    synonyms: raw.synonyms || [],
    antonyms: raw.antonyms || [],
    exampleSentence: pick(raw, "example_sentence", "exampleSentence") || "",
    imageUrl: pick(raw, "image_url", "imageUrl") || "",
    funFact: pick(raw, "fun_fact", "funFact"),
  };
}

// ---- Activity question / Quiz question -------------------------------------------------
export function mapActivityQuestion(raw: any): ActivityQuestion {
  return {
    id: raw.id,
    prompt: raw.prompt,
    options: raw.options || [],
    correctAnswer: pick(raw, "correct_answer", "correctAnswer"),
    type: raw.type,
  };
}

export function mapQuizQuestion(raw: any): QuizQuestion {
  return {
    id: raw.id,
    type: raw.type,
    question: raw.question,
    options: raw.options || [],
    correctAnswer: pick(raw, "correct_answer", "correctAnswer"),
  };
}

// ---- Lesson (summary — from GET /vocab/lessons list) -------------------------------------------------
// The list endpoint does NOT include words / activity_questions /
// quiz_questions. Those arrays are filled in separately once the
// full detail is fetched (see LessonsContext), so every consumer
// still gets a fully-populated Lesson just like the old static file.
export function mapLessonSummary(raw: any): Lesson {
  const activity: Activity = {
    type: raw.activity_type,
    title: raw.activity_title,
    instructions: raw.activity_instructions,
    points: raw.activity_points,
    questions: [],
  };

  const quiz: Quiz = {
    title: raw.quiz_title,
    passingScore: raw.quiz_passing_score,
    totalPoints: raw.quiz_total_points,
    questions: [],
  };

  const challenge: Challenge = {
    title: raw.challenge_title,
    instructions: raw.challenge_instructions,
    type: raw.challenge_type,
    evaluationCriteria: {
      vocabularyUsage: raw.challenge_evaluation_criteria?.vocabularyUsage ?? 0,
      creativity: raw.challenge_evaluation_criteria?.creativity ?? 0,
      grammar: raw.challenge_evaluation_criteria?.grammar ?? 0,
    },
    points: raw.challenge_points,
  };

  return {
    id: raw.id,
    title: raw.title,
    theme: raw.theme,
    ageGroup: pick(raw, "age_group", "ageGroup") || "both",
    videoUrl: pick(raw, "video_url", "videoUrl") || "",
    words: [],
    activity,
    quiz,
    challenge,
    xpRewards: {
      video: raw.xp_video ?? 0,
      activity: raw.xp_activity ?? 0,
      quiz: raw.xp_quiz ?? 0,
      challenge: raw.xp_challenge ?? 0,
    },
    order: pick(raw, "lesson_order", "order") ?? 0,
  };
}

// ---- Lesson (full detail — from GET /vocab/lessons/:id) -------------------------------------------------
export function mapLessonDetail(raw: any): Lesson {
  const summary = mapLessonSummary(raw);
  return {
    ...summary,
    words: (raw.words || []).map(mapWord),
    activity: {
      ...summary.activity,
      questions: (raw.activity_questions || []).map(mapActivityQuestion),
    },
    quiz: {
      ...summary.quiz,
      questions: (raw.quiz_questions || []).map(mapQuizQuestion),
    },
  };
}

// ---- Badge -------------------------------------------------
export function mapBadge(raw: any): Badge {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    icon: raw.icon,
    criteria: raw.criteria,
    rarity: raw.rarity,
    unlockedAt: pick(raw, "unlocked_at", "unlockedAt"),
  };
}

// ---- Dashboard -------------------------------------------------
// NOTE: The task only specified WHAT the dashboard contains
// (xp, level, streak, coins, completed lessons, unlocked badges),
// not the exact JSON field names, since sir's backend for this
// endpoint isn't built/documented yet. This mapper is written
// defensively (accepts snake_case or camelCase) — once you see the
// real response in your testing app, double check the `pick(...)`
// keys below match it, and add any that don't.
export interface VocabDashboardData {
  xp: number;
  level: number;
  streak: number;
  coins: number;
  wordsLearned: number;
  lessonsCompleted: number;
  completedLessonIds: string[];
  unlockedBadges: Badge[];
}

export const ZERO_DASHBOARD: VocabDashboardData = {
  xp: 0,
  level: 1,
  streak: 0,
  coins: 0,
  wordsLearned: 0,
  lessonsCompleted: 0,
  completedLessonIds: [],
  unlockedBadges: [],
};

export function mapDashboard(raw: any): VocabDashboardData {
  const data = raw?.data ?? raw ?? {};

  const completedLessons =
    pick<any[]>(data, "completed_lessons", "completedLessons") || [];
  const completedLessonIds: string[] = Array.isArray(completedLessons)
    ? completedLessons.map((l: any) => (typeof l === "string" ? l : l.id ?? l.lesson_id))
    : [];

  const unlockedBadgesRaw =
    pick<any[]>(data, "unlocked_badges", "unlockedBadges", "badges") || [];

  return {
    xp: data.xp ?? 0,
    level: data.level ?? 1,
    streak: data.streak ?? 0,
    coins: data.coins ?? 0,
    wordsLearned: pick(data, "words_learned", "wordsLearned") ?? 0,
    lessonsCompleted:
      pick(data, "lessons_completed", "lessonsCompleted") ??
      completedLessonIds.length,
    completedLessonIds,
    unlockedBadges: Array.isArray(unlockedBadgesRaw)
      ? unlockedBadgesRaw.map(mapBadge)
      : [],
  };
}

// ---- Leaderboard -------------------------------------------------
export function mapLeaderboardEntry(raw: any, index: number): LeaderboardEntry {
  return {
    id: pick(raw, "id", "user_id", "userId") || `entry-${index}`,
    name: raw.name,
    avatar: raw.avatar || "🙂",
    xp: raw.xp ?? 0,
    level: raw.level ?? 1,
    streak: raw.streak ?? 0,
    rank: raw.rank ?? index + 1,
    weeklyXp: pick(raw, "weekly_xp", "weeklyXp"),
    badgeCount: pick(raw, "badge_count", "badgeCount", "badges_count") ?? 0,
  };
}
