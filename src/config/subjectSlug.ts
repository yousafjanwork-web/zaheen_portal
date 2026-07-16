/**
 * Maps a subject's raw API name (which may include grade suffixes,
 * e.g. "English Grade 1", "Physics IX") to a clean, stable slug
 * shared across all grades — "english", "physics", etc.
 */
const SUBJECT_KEYWORDS: { keyword: string; slug: string }[] = [
  { keyword: "english", slug: "english" },
  { keyword: "urdu", slug: "urdu" },
  { keyword: "math", slug: "math" },
  { keyword: "physic", slug: "physics" },
  { keyword: "chem", slug: "chemistry" },
  { keyword: "bio", slug: "biology" },
  { keyword: "islamic", slug: "islamic" },
  { keyword: "pakistan", slug: "pakistan" },
  { keyword: "computer", slug: "computer" },
  { keyword: "cs", slug: "computer" },
  { keyword: "general", slug: "general-knowledge" },
  { keyword: "art", slug: "art" },
  { keyword: "music", slug: "music" },
];

export const slugifySubject = (name: string): string => {
  const n = name.trim().toLowerCase();
  const match = SUBJECT_KEYWORDS.find(({ keyword }) => n.includes(keyword));
  if (match) return match.slug;
  // Fallback for anything unrecognized: plain slugify of the raw name
  return n.replace(/\s+/g, "-");
};

export const findSubjectBySlug = (subjects: any[], slug: string) =>
  subjects?.find((s) => slugifySubject(s.name) === slug);