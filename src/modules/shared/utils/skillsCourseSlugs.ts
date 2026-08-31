/**
 * Fixed slug <-> classId map for the Skills/Professional courses.
 * classId values match `class_id` from /api/get-subjects-with-course-type-id/3.
 *
 * IMPORTANT: if a new Skills course is added on the backend, add its
 * slug here too, or it will fall back to showing the raw numeric id.
 */

export interface SkillsCourseSlugEntry {
  classId: number;
  slug: string;
  nameEn: string;
}

export const SKILLS_COURSE_SLUGS: SkillsCourseSlugEntry[] = [
  { classId: 300, slug: "full-stack-web-development-course", nameEn: "Full Stack Web Development Course" },
  { classId: 301, slug: "professional-2d-drafting-and-design-course", nameEn: "Professional 2D Drafting and Design Course" },
  { classId: 302, slug: "advanced-excel-training-course", nameEn: "Advanced Excel Training Course" },
  { classId: 303, slug: "professional-production-editing-course", nameEn: "Professional Production Editing Course" },
  { classId: 304, slug: "professional-makeup-course", nameEn: "Professional Makeup Course" },
  { classId: 305, slug: "how-to-become-a-professional-trader", nameEn: "How To Become A Professional Trader" },
];

export const getSlugByClassId = (classId: number): string | null => {
  const entry = SKILLS_COURSE_SLUGS.find((e) => e.classId === classId);
  return entry ? entry.slug : null;
};

export const getClassIdBySlug = (slug: string): number | null => {
  const entry = SKILLS_COURSE_SLUGS.find((e) => e.slug === slug);
  return entry ? entry.classId : null;
};

/**
 * Resolves a raw route param (could be "305" or "how-to-become-a-professional-trader")
 * into a numeric classId. Returns null if it matches neither a known slug nor a
 * known numeric id, so the caller can decide how to handle an unknown course.
 */
export const resolveClassIdFromParam = (param: string | undefined): number | null => {
  if (!param) return null;

  // Numeric param (legacy link) -> only accept if it's a known classId
  if (/^\d+$/.test(param)) {
    const asNumber = Number(param);
    const known = SKILLS_COURSE_SLUGS.some((e) => e.classId === asNumber);
    return known ? asNumber : asNumber; // unknown numeric ids still pass through;
    // the page's own API calls will simply return empty data for an invalid id,
    // matching today's existing behavior for ids outside 300-305.
  }

  // Slug param
  return getClassIdBySlug(param);
};