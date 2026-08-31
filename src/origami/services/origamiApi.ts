/**
 * Origami API Service
 * Base URL: http://localhost:2023/api/origami  (swap when deploying)
 *
 * API envelope shape (from real response):
 *   { success: true, total: 12, data: [...] }   — list endpoints
 *   { success: true, data: { ...craft } }        — single-item endpoints
 */

import type { Craft, Category } from "../data/crafts";

const BASE_URL = "https://api.zaheen.com.pk/v2/api/origami";

// ─── Response Types ───────────────────────────────────────────────────────────

export interface DifficultyLevel {
  level: string;
  emoji: string;
  description: string;
  count: number;
  color: string;
}

// ─── Gradient map ─────────────────────────────────────────────────────────────

const GRADIENT_MAP: Record<string, string> = {
  orange: "from-orange-400 to-orange-500",
  blue: "from-blue-400 to-blue-600",
  teal: "from-teal-400 to-teal-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  pink: "from-pink-400 to-pink-600",
  red: "from-red-400 to-red-600",
  yellow: "from-yellow-400 to-yellow-500",
  amber: "from-amber-400 to-amber-500",
  sky: "from-sky-400 to-sky-600",
  indigo: "from-indigo-400 to-indigo-600",
  violet: "from-violet-400 to-violet-600",
  cyan: "from-cyan-400 to-cyan-600",
  lime: "from-lime-400 to-lime-600",
  rose: "from-rose-400 to-rose-600",
};

function resolveGradient(raw: string | undefined | null): string {
  if (!raw) return "from-primary to-pink";
  if (raw.includes("from-")) return raw;
  return GRADIENT_MAP[raw.toLowerCase()] ?? "from-primary to-pink";
}

// ─── Envelope unwrappers ──────────────────────────────────────────────────────

/**
 * Extract the data array from any envelope shape:
 *   [...]                        bare array
 *   { data: [...], ... }         wrapped (success/total keys ignored)
 *   { crafts: [...], ... }       any other key holding an array
 */
function unwrapArray(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    // Prefer the explicit "data" key that the API actually uses
    if (Array.isArray(obj["data"]))
      return obj["data"] as Record<string, unknown>[];

    // Fall back: first array value found
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) return val as Record<string, unknown>[];
    }
  }

  return [];
}

/**
 * Extract a single object from any envelope shape:
 *   { ...craft }                 bare object (no envelope)
 *   { data: { ...craft }, ... }  wrapped with "data" key  ← what the API uses
 *   { craft: { ...craft } }      any other single-object key
 */
function unwrapObject(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const obj = raw as Record<string, unknown>;

  // Prefer explicit "data" key — this is what the real API returns
  if (
    obj["data"] &&
    typeof obj["data"] === "object" &&
    !Array.isArray(obj["data"])
  ) {
    return obj["data"] as Record<string, unknown>;
  }

  // If the object looks like a craft itself (has an "id" field), return as-is
  if (obj["id"] !== undefined) return obj;

  // Last resort: first value that is a plain object
  for (const val of Object.values(obj)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return val as Record<string, unknown>;
    }
  }

  return obj;
}

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeCategory(raw: Record<string, unknown>): Category {
  return {
    id: String(raw["id"] ?? ""),
    name: String(raw["name"] ?? ""),
    emoji: String(raw["emoji"] ?? "📄"),
    count: Number(raw["count"] ?? 0),
    ageRange: String(raw["ageRange"] ?? raw["age_range"] ?? ""),
    description: String(raw["description"] ?? ""),
    gradient: resolveGradient(String(raw["gradient"] ?? raw["color"] ?? "")),
  };
}

function normalizeCraft(raw: Record<string, unknown>): Craft {
  // Normalize steps: map step_number → stepNumber, fall back to array index
  const rawSteps = Array.isArray(raw["steps"]) ? raw["steps"] : [];
  const steps = rawSteps.map((s: Record<string, unknown>, i: number) => ({
    id: Number(s["id"] ?? i),
    stepNumber: Number(s["step_number"] ?? s["stepNumber"] ?? i + 1),
    title: String(s["title"] ?? ""),
    description: String(s["description"] ?? ""),
    image: String(s["image"] ?? ""),
  }));
  const tags = Array.isArray(raw["tags"]) ? raw["tags"] : [];

  // Video URL — treat "#" and "" as "no video"
  const rawVideo = String(raw["videoUrl"] ?? raw["video_url"] ?? "").trim();
  const videoUrl = rawVideo === "#" ? "" : rawVideo;

  // PDF URL — treat "#" and "" as "no pdf"
  const rawPdf = String(raw["pdfUrl"] ?? raw["pdf_url"] ?? "").trim();
  const pdfUrl = rawPdf === "#" ? "" : rawPdf;

  return {
    id: String(raw["id"] ?? ""),
    title: String(raw["title"] ?? ""),
    category: String(raw["category"] ?? raw["category_id"] ?? ""),
    difficulty: (raw["difficulty"] as Craft["difficulty"]) ?? "Beginner",
    ageRange: String(raw["ageRange"] ?? raw["age_range"] ?? ""),
    duration: String(raw["duration"] ?? ""),
    paperSize: String(raw["paperSize"] ?? raw["paper_size"] ?? ""),
    thumbnail: String(raw["thumbnail"] ?? ""),
    videoUrl,
    pdfUrl,
    likes: Number(raw["likes"] ?? 0),
    views: String(raw["views"] ?? "0"),
    steps,
    tags,
    featured: Boolean(raw["featured"]),
    isTodaysCraft: Boolean(raw["isTodaysCraft"] ?? raw["is_todays_craft"]),
  };
}

// ─── Generic fetch ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${path}`);
  }
  return res.json() as Promise<T>;
}

// ─── Public API methods ───────────────────────────────────────────────────────

export const fetchCategories = (): Promise<Category[]> =>
  apiFetch<unknown>("/categories").then((r) =>
    unwrapArray(r).map(normalizeCategory),
  );

export const fetchAllCrafts = (): Promise<Craft[]> =>
  apiFetch<unknown>("/crafts").then((r) => unwrapArray(r).map(normalizeCraft));

export const fetchFeaturedCrafts = (): Promise<Craft[]> =>
  apiFetch<unknown>("/crafts/featured").then((r) =>
    unwrapArray(r).map(normalizeCraft),
  );

export const fetchTodaysCraft = (): Promise<Craft> =>
  apiFetch<unknown>("/crafts/today").then((r) =>
    normalizeCraft(unwrapObject(r)),
  );

export const fetchCraftById = (id: string): Promise<Craft> =>
  apiFetch<unknown>(`/crafts/${id}`).then((r) =>
    normalizeCraft(unwrapObject(r)),
  );

export const fetchCraftsByCategory = (categoryId: string): Promise<Craft[]> =>
  apiFetch<unknown>(`/crafts/category/${categoryId}`).then((r) =>
    unwrapArray(r).map(normalizeCraft),
  );

export const searchCrafts = (query: string): Promise<Craft[]> =>
  apiFetch<unknown>(`/crafts/search?q=${encodeURIComponent(query)}`).then((r) =>
    unwrapArray(r).map(normalizeCraft),
  );

export const fetchDifficultyLevels = (): Promise<DifficultyLevel[]> =>
  apiFetch<unknown>("/difficulty-levels").then(
    (r) => unwrapArray(r) as DifficultyLevel[],
  );
