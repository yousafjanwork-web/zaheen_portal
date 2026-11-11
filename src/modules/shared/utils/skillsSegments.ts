import { SKILLS_COURSE_SLUGS } from "./skillsCourseSlugs";

export interface SkillItem {
  label: string;
  to: string;
}

export interface SkillSegment {
  titleKey: string;
  items: SkillItem[];
}

// Builds a menu item from a classId, using the same slug as the course pages
const course = (classId: number): SkillItem => {
  const entry = SKILLS_COURSE_SLUGS.find((e) => e.classId === classId);
  return {
    label: entry ? entry.nameEn : `Course ${classId}`,
    to: `/skills/${entry ? entry.slug : classId}`,
  };
};

export const SKILL_SEGMENTS: SkillSegment[] = [
  {
    titleKey: "skills.technical",
    items: [course(301), course(300), course(302), course(303), course(306)],
  },
  {
    titleKey: "skills.women",
    items: [course(304), course(307)],
  },
  {
    titleKey: "skills.trading",
    items: [course(305), course(302)], // Excel (302) is in both Technical and Trading
  },
];