import React, { JSX, useEffect, useState } from "react";
import { BookOpen, Code, BarChart3, Brain } from "lucide-react";
import { t, getLanguage } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";
import { classSlugFromId } from "@/config/classSlugs";
import { getSlugByClassId } from "@/modules/shared/utils/skillsCourseSlugs";

interface CoursesMenuProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  "Website Development": <Code size={18} />,
  "Auto Cad 2D": <BarChart3 size={18} />,
  "Microsoft Excel": <BarChart3 size={18} />,
  "Video Editing": <BarChart3 size={18} />,
  "Beautify Yourself": <Brain size={18} />,
};

/* ─────────────────────────────────────────────────────────────
   v2 Courses API
   GET /v2/api/courses → returns all 6 courses at once.
   CONFIRMED (backend team, 2026-07-15): course.id is guaranteed to
   equal the parent_id used by /v2/api/videos?content_type=COURSE,
   and this same id also equals classId - ... no — id does NOT equal
   classId directly. We map course.id -> classId via
   CLASS_TO_PARENT_ID's inverse (see SkillsChaptersPage.tsx), so this
   menu uses the same known id set (1-6) and looks up the matching
   classId from skillsCourseSlugs.ts's SKILLS_COURSE_SLUGS list by
   name/slug rather than assuming a numeric formula.
──────────────────────────────────────────────────────────────── */
const V2_BASE = "https://api.zaheen.com.pk/v2/api";

interface V2Course {
  id: number; // == parent_id
  title_en: string;
  title_ur?: string;
  thumbnail_url?: string;
}

// Confirmed mapping (backend-verified 2026-07-15) — course.id (== parent_id) -> classId.
// Kept in one place; if backend later exposes classId directly on /v2/api/courses,
// this table can be deleted and course.class_id used instead.
const COURSE_ID_TO_CLASS_ID: Record<number, number> = {
  1: 305, // Trading
  2: 300, // Full Stack Web Development
  3: 301, // AutoCAD 2D
  4: 302, // Microsoft Excel
  5: 303, // Video Editing
  6: 304, // Makeup/Beautify
};

// Display order: Trading first, Web Dev second, rest after.
// Kept identical to ProfessionalCourses.tsx's DISPLAY_ORDER so the
// homepage slider and this dropdown menu always show courses in
// the same order.
const DISPLAY_ORDER: Record<number, number> = {
  1: 0, // Trading
  2: 1, // Web Development
  3: 2, // AutoCAD
  4: 3, // Excel
  5: 4, // Video Editing
  6: 5, // Makeup
};

const fetchAllCourses = async (): Promise<V2Course[]> => {
  const res = await fetch(`${V2_BASE}/courses`);
  if (!res.ok) throw new Error("Courses fetch failed");
  const json = await res.json();
  const data: V2Course[] = Array.isArray(json?.data) ? json.data : [];

  return [...data].sort(
    (a, b) => (DISPLAY_ORDER[a.id] ?? 99) - (DISPLAY_ORDER[b.id] ?? 99)
  );
};

const CoursesMenu: React.FC<CoursesMenuProps> = ({ open, onClose }) => {
  const [courses, setCourses] = useState<V2Course[]>([]);
  const navigate = useNavigate();

  const isUrdu = getLanguage() === "ur";

  useEffect(() => {
    const load = async () => {
      try {
<<<<<<< HEAD
        const res = await fetch(
          `https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3?ts=${Date.now()}`
        );
        const data = await res.json();
        setProfessionalSkills(data);
=======
        const data = await fetchAllCourses();
        setCourses(data);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    load();
  }, []);

  if (!open) return null;

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className={`
        absolute top-10 z-50
        ${isUrdu ? "right-0" : "left-0"}
        w-[90vw] md:w-[650px] max-w-[95vw]
        bg-white shadow-xl border rounded-2xl p-6
      `}
    >
      <div className="grid grid-cols-2 gap-8">

        {/* K12 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.k12")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">

            {[
<<<<<<< HEAD
              { link: "/grade-view/kg", label: t("courses.kg") },
=======
          {
               label: t("courses.kg"),
              onClick: () => navigate(`/${classSlugFromId(1)}`, { state: { gradeType: "kg" } })
              },
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
              { link: "/grade-view/1-5", label: t("courses.grade1to5") },
              { link: "/grade-view/6-8", label: t("courses.grade6to8") },
              { link: "/grade-view/9-12", label: t("courses.grade9to12") },
            ].map((item, i) => (
<<<<<<< HEAD
              <li
                key={i}
                onClick={onClose}
                className="flex items-center gap-2 hover:text-primary cursor-pointer"
              >
                <span className="flex-shrink-0">
                  <BookOpen size={18} />
                </span>

                <a href={item.link}>
                  {item.label}
                </a>
              </li>
=======
             <li
                key={i}
                 onClick={() => {
                     if (item.onClick) {
                 item.onClick();
                    } else {
                navigate(item.link);
              }
                 onClose();
          }}
            className="flex items-center gap-2 hover:text-primary cursor-pointer"
           >
                   <BookOpen size={18} />
                 {item.label}
            </li>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            ))}

          </ul>
        </div>

        {/* Professional */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.professional")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600"
            dir={isUrdu ? "rtl" : "ltr"}
          >
<<<<<<< HEAD
            {professionalSkills.length > 0 ? (
              professionalSkills.map((skill) => (
                <li
                  key={skill.id}
                  onClick={() => {
                    navigate(`skills/${skill.class_id}`);
                    onClose();
                  }}
                  className={`
    flex items-center hover:text-primary cursor-pointer
    ${isUrdu ? "flex-row-reverse text-right" : ""}
  `}
                >
                  <span className={`${isUrdu ? "mr-2" : "mr-3"} flex-shrink-0`}>
                    {iconMap[skill.name] || <BarChart3 size={18} />}
                  </span>

                  {isUrdu ? skill.urdu_name || skill.name : skill.name}
                </li>
              ))
=======
            {courses.length > 0 ? (
              courses.map((course) => {
                const classId = COURSE_ID_TO_CLASS_ID[course.id];
                const slug = classId ? getSlugByClassId(classId) : null;
                const target = slug ? `/skills/${slug}` : `/skills/${classId ?? course.id}`;

                return (
                  <li
                    key={course.id}
                    onClick={() => {
                      navigate(target);
                      onClose();
                    }}
                    className={`
    flex items-center hover:text-primary cursor-pointer
    ${isUrdu ? "flex-row-reverse text-right" : ""}
  `}
                  >
                    <span className={`${isUrdu ? "mr-2" : "mr-3"} flex-shrink-0`}>
                      {iconMap[course.title_en] || <BarChart3 size={18} />}
                    </span>

                    {isUrdu ? course.title_ur || course.title_en : course.title_en}
                  </li>
                );
              })
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            ) : (
              <li className="text-gray-400">
                {t("common.loading") || "Loading..."}
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CoursesMenu;