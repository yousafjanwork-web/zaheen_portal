// ============================================================
// VOCAB MODULE — API CONFIG
// ============================================================
// This is the ONLY place you should need to touch when sir moves
// this from your local testing server to the live server.
//
// While testing locally, this points at your local API
// (http://localhost:2023). When sir gives you the live base URL,
// change VOCAB_API_BASE_URL below (or, better, set
// VITE_VOCAB_API_BASE_URL in your .env file so you don't have to
// touch code at all).
// ============================================================

export const VOCAB_API_BASE_URL: string =
  (import.meta as any)?.env?.VITE_VOCAB_API_BASE_URL ||
  "https://api.zaheen.com.pk/v2";

// All vocab endpoints live under /api/vocab
export const VOCAB_API = {
  lessons: () => `${VOCAB_API_BASE_URL}/api/vocab/lessons`,
  lessonById: (id: string) => `${VOCAB_API_BASE_URL}/api/vocab/lessons/${id}`,
  lessonComplete: (id: string) =>
    `${VOCAB_API_BASE_URL}/api/vocab/lessons/${id}/complete`,
  badges: () => `${VOCAB_API_BASE_URL}/api/vocab/badges`,
  dashboard: () => `${VOCAB_API_BASE_URL}/api/vocab/dashboard`,
  leaderboard: () => `${VOCAB_API_BASE_URL}/api/vocab/leaderboard`,
};
