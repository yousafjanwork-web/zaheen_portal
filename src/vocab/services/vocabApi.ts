import { VOCAB_API } from "../config/apiConfig";

// ============================================================
// VOCAB MODULE — RAW API CLIENT
// ============================================================
// Thin wrappers around fetch(). Nothing in here knows about the
// app's TS types (Lesson, Badge, etc.) — that translation happens
// in services/mappers.ts. Keeping the two separate means if sir's
// backend response shape shifts slightly, you only fix one file.
// ============================================================

export class VocabApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "VocabApiError";
    this.status = status;
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    // Network error / server not reachable
    throw new VocabApiError(
      `Could not reach the vocab API at ${url}. Is the server running?`,
    );
  }

  if (!res.ok) {
    let message = `Request to ${url} failed with status ${res.status}`;
    try {
      const errBody = await res.json();
      if (errBody?.message) message = errBody.message;
    } catch {
      // ignore — body wasn't JSON
    }
    throw new VocabApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

function authHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---- 1. Lessons list -------------------------------------------------
export function fetchLessonsRaw(ageGroup?: "junior" | "senior") {
  const url = new URL(VOCAB_API.lessons());
  if (ageGroup) url.searchParams.set("age_group", ageGroup);
  return request<any>(url.toString());
}

// ---- 2. Single lesson -------------------------------------------------
export function fetchLessonByIdRaw(id: string) {
  return request<any>(VOCAB_API.lessonById(id));
}

// ---- 3. Badges -------------------------------------------------
export function fetchBadgesRaw() {
  return request<any>(VOCAB_API.badges());
}

// ---- 4. Student dashboard (requires auth) -------------------------------------------------
export function fetchDashboardRaw(token: string) {
  return request<any>(VOCAB_API.dashboard(), {
    headers: authHeaders(token),
  });
}

// ---- 5. Complete a lesson (requires auth) -------------------------------------------------
export interface CompleteLessonPayload {
  score: number;
  xp_earned: number;
  words_count: number;
}

export function completeLessonRaw(
  lessonId: string,
  token: string,
  payload: CompleteLessonPayload,
) {
  return request<any>(VOCAB_API.lessonComplete(lessonId), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

// ---- 6. Leaderboard -------------------------------------------------
export function fetchLeaderboardRaw() {
  return request<any>(VOCAB_API.leaderboard());
}
