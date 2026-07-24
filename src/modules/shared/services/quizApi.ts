/**
 * quizApi.ts
 *
 * Zaheen v2 Quiz API — all endpoints, types, and grade mappings.
 *
 * HOW GRADES GET DIFFERENT QUESTIONS:
 * ─────────────────────────────────────────────────────────────────
 * • Primary quiz  (KG–Grade 5)  → each grade has its own videoId
 *   API: GET /api/get-quiz-questions/:videoId
 *
 * • Adaptive quiz (Grade 6–12)  → each grade group has its own chapterId
 *   API: GET /api/quiz/adaptive/next?userId=&chapterId=
 *
 * Both mappings live in GRADE_CONFIG below. Update the IDs to match
 * your actual database values.
 * ─────────────────────────────────────────────────────────────────
 *
 * Base URL (local dev):  http://localhost:2023
 * Base URL (production): https://api.zaheen.com.pk/v2
 *
 * Switch by changing BASE_URL below or via an env variable.
 */

export const BASE_URL = "https://api.zaheen.com.pk/v2"

/* ═══════════════════════════════════════════════════════════════
   GRADE CONFIG — THE SINGLE SOURCE OF TRUTH FOR GRADE → IDs
   Update these values to match your DB.
   ═══════════════════════════════════════════════════════════════ */

/**
 * Primary grades (KG–5): slug → videoId
 * The videoId maps to a set of questions in the DB for that grade.
 */
export const PRIMARY_GRADE_VIDEO_IDS: Record<string, number> = {
  "kg":      1,   // KG      → videoId 1  (its own questions)
  "class-1": 2,   // Grade 1 → videoId 2  (its own questions)
  "class-2": 3,   // Grade 2 → videoId 3
  "class-3": 4,   // Grade 3 → videoId 4
  "class-4": 5,   // Grade 4 → videoId 5
  "class-5": 6,   // Grade 5 → videoId 6
};

/**
 * Adaptive grades (6–12): grade group slug → chapterId
 * The chapterId selects which chapter's questions the adaptive
 * engine will serve for that grade group.
 */
export const ADAPTIVE_GRADE_CHAPTER_IDS: Record<string, number> = {
  "grades-6-8":  1,   // Grades 6–8  → chapterId 1 (its own question set)
  "grades-9-12": 2,   // Grades 9–12 → chapterId 2 (its own question set)
  // Add more grade groups here as needed:
  // "grade-6":  3,
  // "grade-7":  4,
};

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

export interface AdaptiveQuestion {
  id: number;
  type: "mcq" | "mcq_multi" | "numeric" | "text";
  difficulty?: string;
  prompt: string;
  image_url?: string | null;
  hint_audio_url?: string | null;
  explanation_en?: string | null;
  explanation_ur?: string | null;
  options: { id: number; option_text: string; image_url?: string | null }[];
}

export interface SubmitPayload {
  userId: number;
  questionId: number;
  timeTaken?: number;
  selectedOptionId?: number;    // MCQ only
  selectedOptionIds?: number[]; // MCQ multi only
  submittedAnswer?: string;     // text / numeric only
}

export interface SubmitResult {
  correct: boolean;
  masteryScore: number;
  streak: number;
  message_en?: string | null;
  message_ur?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  explanation?: {
    message_en?: string | null;
    message_ur?: string | null;
    image_url?: string | null;
    video_url?: string | null;
    audio_url?: string | null;
  } | null;
}

export interface SkillProgress {
  skillId: number;
  masteryScore: number;
  totalQuestions: number;
  attemptedQuestions: number;
  accuracy: number;
  status: "not_started" | "progressing" | "mastered";
}

export interface PrimaryQuestion {
  id: number;
  videoid: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  status: number;
  datecreated: string;
}

/* ═══════════════════════════════════════════════════════════════
   ADAPTIVE QUIZ API  (Grades 6–8 and 9–12)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get the next adaptive question for a user + chapter.
 * Returns { status: "completed" } when there are no more questions.
 *
 * Usage:
 *   const chapterId = ADAPTIVE_GRADE_CHAPTER_IDS["grades-6-8"];
 *   const res = await getNextAdaptiveQuestion(userId, chapterId);
 */
export async function getNextAdaptiveQuestion(
  userId: number,
  chapterId: number
): Promise<{ status?: string; data?: AdaptiveQuestion }> {
  const res = await fetch(
    `${BASE_URL}/api/quiz/adaptive/next?userId=${userId}&chapterId=${chapterId}`
  );
  if (!res.ok) throw new Error(`GET /api/quiz/adaptive/next → HTTP ${res.status}`);
  return res.json();
}

/**
 * Submit an answer.
 * Supports MCQ, MCQ multi-select, and text/numeric types.
 *
 * MCQ:       pass selectedOptionId
 * MCQ multi: pass selectedOptionIds (array)
 * Text/num:  pass submittedAnswer (string)
 */
export async function submitAdaptiveAnswer(
  payload: SubmitPayload
): Promise<SubmitResult> {
  const res = await fetch(`${BASE_URL}/api/quiz/adaptive/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST /api/quiz/adaptive/submit → HTTP ${res.status}`);
  const json = await res.json();
  return json.data as SubmitResult;
}

/**
 * Get skill-by-skill mastery progress for a user + chapter.
 * Returns [] on failure (non-fatal — sidebar just stays empty).
 *
 * Status thresholds (from API guide):
 *   not_started  → mastery = 0
 *   progressing  → 0 < mastery < 90
 *   mastered     → mastery >= 90
 */
export async function getSkillProgress(
  userId: number,
  chapterId: number
): Promise<SkillProgress[]> {
  const res = await fetch(
    `${BASE_URL}/api/quiz/adaptive/skills?userId=${userId}&chapterId=${chapterId}`
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []) as SkillProgress[];
}

/**
 * Get all available skills (useful for admin/debug).
 * GET /api/quiz/adaptive/all-skills
 */
export async function getAllSkills(): Promise<
  { id: number; name: string; description: string | null; created_at: string }[]
> {
  const res = await fetch(`${BASE_URL}/api/quiz/adaptive/all-skills`);
  if (!res.ok) throw new Error(`GET /api/quiz/adaptive/all-skills → HTTP ${res.status}`);
  const json = await res.json();
  return json.data ?? [];
}

/* ═══════════════════════════════════════════════════════════════
   PRIMARY QUIZ API  (KG – Grade 5)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get quiz questions for a specific grade.
 *
 * Usage:
 *   const videoId = PRIMARY_GRADE_VIDEO_IDS["class-3"]; // → 4
 *   const questions = await getPrimaryQuizQuestions(videoId);
 */
export async function getPrimaryQuizQuestions(
  videoId: number
): Promise<PrimaryQuestion[]> {
  const res = await fetch(`${BASE_URL}/api/get-quiz-questions/${videoId}`);
  if (!res.ok)
    throw new Error(`GET /api/get-quiz-questions/${videoId} → HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error("API returned success: false");
  return (json.data ?? []) as PrimaryQuestion[];
}

/* ═══════════════════════════════════════════════════════════════
   QUESTION MANAGEMENT  (admin / import use)
   ═══════════════════════════════════════════════════════════════ */

export interface ImportQuestionPayload {
  chapterId: number;
  skillId: number;
  type: "mcq" | "mcq_multi" | "numeric" | "text";
  difficulty?: "easy" | "medium" | "hard";
  prompt: string;
  correctAnswer: string; // letter A/B/C/D for MCQ
  options: { letter: string; optionText: string }[];
}

/**
 * Import a question via JSON (no file uploads).
 * POST /api/quiz/questions/import
 */
export async function importQuestion(
  payload: ImportQuestionPayload
): Promise<{ questionId: number }> {
  const res = await fetch(`${BASE_URL}/api/quiz/questions/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`POST /api/quiz/questions/import → HTTP ${res.status}`);
  const json = await res.json();
  return json.data as { questionId: number };
}