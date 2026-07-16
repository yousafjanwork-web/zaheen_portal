const CLASS_SLUGS: Record<number, string> = {
  1: "kg",
  2: "grade-1", 3: "grade-2", 4: "grade-3", 5: "grade-4", 6: "grade-5",
  7: "grade-6", 8: "grade-7", 9: "grade-8",
  10: "grade-9", 11: "grade-10", 12: "grade-11", 13: "grade-12",
};

export const classSlugFromId = (id: number): string => CLASS_SLUGS[id] ?? String(id);

export const classIdFromSlug = (slug: string): number | undefined => {
  const entry = Object.entries(CLASS_SLUGS).find(([, s]) => s === slug);
  return entry ? Number(entry[0]) : undefined;
};
export const gradeNumberFromSlug = (slug: string): number | null => {
  // Handles both "grade7" and "grade-7" formats
  const m = slug.match(/^grade-?(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
};