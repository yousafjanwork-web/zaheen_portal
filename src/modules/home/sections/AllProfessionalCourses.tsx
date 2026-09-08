import React, { useEffect, useState } from "react";
const background  = "https://cdn.zaheen.com.pk/zaheen-web-img/Background.png";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  ArrowLeft,
  BookOpen,
  PlayCircle,
  Rocket,
  Award,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { getSlugByClassId } from "@/modules/shared/utils/skillsCourseSlugs";

// Same local card images used on the homepage slider (ProfessionalCourses.tsx)
const sliderImg1 = "https://cdn.zaheen.com.pk/zaheen-web-img/web-development-s.png";
const sliderImg2 = "https://cdn.zaheen.com.pk/zaheen-web-img/auto-cad-s.png";
const sliderImg3 = "https://cdn.zaheen.com.pk/zaheen-web-img/excel-s.png";
const sliderImg4 = "https://cdn.zaheen.com.pk/zaheen-web-img/video-editing-s.png";
const sliderImg5 = "https://cdn.zaheen.com.pk/zaheen-web-img/makeup-s.png";
const sliderImg6 = "https://cdn.zaheen.com.pk/zaheen-web-img/trading-professional-skill-banner-ss.jpeg";

/* ─────────────────────────────────────────
   v2 Courses API
   GET /v2/api/courses → returns all 6 courses at once.
   course.id is guaranteed to equal the parent_id used by
   /v2/api/videos?content_type=COURSE (confirmed by backend team,
   see SkillsChaptersPage.tsx / ProfessionalCourses.tsx), so every
   mapping table below is keyed off that same id (1-6).
───────────────────────────────────────── */
const V2_BASE = "https://api.zaheen.com.pk/v2/api";

interface V2Course {
  id: number; // == parent_id
  title_en: string;
  title_ur?: string;
  total_lectures?: number;
  total_duration?: number;
  level?: string;
}

// v2 course.id (== parent_id) → local card image
// Matches COURSE_IMAGES in ProfessionalCourses.tsx / CLASS_TO_PARENT_ID in SkillsChaptersPage
const COURSE_IMAGES: Record<number, string> = {
  1: sliderImg6, // Trading (parent_id 1)
  2: sliderImg1, // Web Development (parent_id 2)
  3: sliderImg2, // AutoCAD (parent_id 3)
  4: sliderImg3, // Excel (parent_id 4)
  5: sliderImg4, // Video Editing (parent_id 5)
  6: sliderImg5, // Makeup (parent_id 6)
};

// v2 course.id → classId (for navigation)
// Inverse of CLASS_TO_PARENT_ID in SkillsChaptersPage
const PARENT_ID_TO_CLASS_ID: Record<number, number> = {
  1: 305, // Trading
  2: 300, // Web Development
  3: 301, // AutoCAD
  4: 302, // Excel
  5: 303, // Video Editing
  6: 304, // Makeup
};

// Display order: Trading first, Web Dev second, rest after
// Kept identical to ProfessionalCourses.tsx / CoursesMenu.tsx
const DISPLAY_ORDER: Record<number, number> = {
  1: 0, // Trading
  2: 1, // Web Development
  3: 2, // AutoCAD
  4: 3, // Excel
  5: 4, // Video Editing
  6: 5, // Makeup
};

// The /v2/api/courses endpoint's total_lectures field isn't reliable, so the
// true lecture count is fetched from the same videos endpoint the course
// sidebar (SkillsChaptersPage.tsx) and homepage slider (ProfessionalCourses.tsx) use.
const fetchLectureCount = async (parentId: number): Promise<number> => {
  try {
    const res = await fetch(
      `${V2_BASE}/videos?content_type=COURSE&parent_id=${parentId}`
    );
    if (!res.ok) return 0;
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data.length : 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
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

/* ─────────────────────────────────────────
   BADGE LABELS — rotate through these
───────────────────────────────────────── */
const BADGES = ["BESTSELLER", "NEW", "POPULAR", "TOP RATED", "TRENDING", "FEATURED"];

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const AllProfessionalCourses = () => {
  const navigate  = useNavigate();
  const lang      = getLanguage();
  const isUrdu    = lang === "ur";

  const [courses, setCourses] = useState<V2Course[]>([]);
  const [lectureCounts, setLectureCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    (async () => {
      try {
        const sorted = await fetchAllCourses();
        setCourses(sorted);

        // Fetch real lecture counts per course in parallel, keyed by course.id.
        const counts = await Promise.all(
          sorted.map((course) => fetchLectureCount(course.id))
        );
        const countMap: Record<number, number> = {};
        sorted.forEach((course, i) => {
          countMap[course.id] = counts[i];
        });
        setLectureCounts(countMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCourseClick = (courseId: number) => {
    // Use the friendly slug when we have one for this course;
    // fall back to the numeric classId for any course not yet in the slug map.
    const classId = PARENT_ID_TO_CLASS_ID[courseId];
    const slug = classId ? getSlugByClassId(classId) : null;
    navigate(`/skills/${slug ?? classId ?? courseId}`);
  };

  /* ────────────────── RENDER ────────────────── */
  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════
          HERO  — blue gradient
      ══════════════════════════════════════════ */}
      <div className="relative w-full bg-[#1633c0] overflow-hidden">
        {/* subtle radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 60%, #6b8eff 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, #7c3aed 0%, transparent 45%)",
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-xl
                     bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm
                     font-semibold hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={16} />
          {isUrdu ? "واپس" : "Back"}
        </button>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-29 md:pt-32 md:pb-35">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
            {isUrdu
              ? "ماہرین کی رہنمائی میں اپنا مستقبل سنواریں"
              : "Master Your Future with Expert-Led Courses"}
          </h1>

          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
            {isUrdu
              ? "انڈسٹری میں تسلیم شدہ سرٹیفکیشن اور راستوں کے ساتھ اپنی صلاحیتیں نکھاریں جو تیزی سے بدلتی دنیا میں آپ کے کیریئر کو آگے بڑھانے کے لیے تیار کیے گئے ہیں۔"
              : "Unlock your potential with industry-recognized certifications and paths designed to accelerate your career growth in a rapidly changing world."}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-[#1633c0] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-all text-sm shadow-lg"
            >
              {isUrdu ? "کورسز دریافت کریں" : "Explore Courses"}
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("catalog")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white/50 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              {isUrdu ? "راستے دیکھیں" : "View Paths"}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FEATURED COURSE CATALOG  — card grid
      ══════════════════════════════════════════ */}
      <div id="catalog" className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        {/* Section header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
            {isUrdu ? "نمایاں کورس کیٹالاگ" : "Featured Course Catalog"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">
            {isUrdu
              ? "جدید کیریئر کی ترقی کے لیے تیار کردہ پیشہ ورانہ ترقیاتی راستے۔ صنعت کے ماہرین کی قیادت میں اعلیٰ اثر والے سیکھنے کے ماڈیول۔"
              : "Curated professional development paths designed for modern career advancement.\nHigh-impact learning modules led by industry experts."}
          </p>
        </div>

        {/* Loading skeleton — 3 columns */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                  <div className="h-11 bg-slate-200 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <BookOpen size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-black text-slate-700 mb-2">
              {isUrdu ? "کوئی کورس دستیاب نہیں" : "No courses available"}
            </h3>
            <p className="text-slate-400 text-sm">{isUrdu ? "جلد آرہے ہیں۔" : "Check back soon!"}</p>
          </div>
        ) : (
          <>
            {/* ── FIRST ROW: first 3 courses ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {courses.slice(0, 3).map((course, i) => {
                const badge       = BADGES[i % BADGES.length];
                const courseName  = isUrdu ? course.title_ur || course.title_en : course.title_en;
                const image       = COURSE_IMAGES[course.id];
                const lectureCount = lectureCounts[course.id] ?? course.total_lectures ?? 0;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                               shadow-sm hover:shadow-xl cursor-pointer
                               transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <img
                        src={image}
                        alt={courseName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badge */}
                      {/* <div className="absolute top-3 left-3">
                        <span className="bg-[#1633c0] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-sm">
                          {badge}
                        </span>
                      </div> */}
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="font-black text-slate-900 text-[16px] leading-snug mb-1.5 line-clamp-2">
                        {courseName}
                      </h3>

                      {/* Lecture count */}
                      <p className="text-slate-500 text-[13px] mb-3 flex items-center gap-1.5">
                        <Users size={13} />
                        {lectureCount} {isUrdu ? "لیکچرز" : "Lectures"}
                      </p>

                

                      {/* CTA button — pushed to bottom */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCourseClick(course.id); }}
                          className="w-full bg-[#1633c0] hover:bg-[#122ba8] text-white font-bold
                                     py-3 rounded-xl transition-all duration-200 text-[14px]
                                     flex items-center justify-center gap-2 group-hover:gap-3"
                        >
                          <PlayCircle size={16} />
                          {isUrdu ? "سیکھنا شروع کریں" : "Start Learning"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════════════════
                REIMAGINE YOUR CAREER BANNER
                Inserted between row 1 and row 2
            ══════════════════════════════════════════ */}
            {courses.length > 3 && (
              <div className="my-14">
                <div
                  className="relative rounded-3xl overflow-hidden min-h-[420px] md:min-h-[520px] shadow-2xl"
                  style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* dark overlay — left heavy so text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
                  {/* bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center h-full min-h-[420px] md:min-h-[520px]">

                    {/* LEFT — text */}
                    <div className="flex-1 flex flex-col justify-center px-10 md:px-14 py-14">
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
                        {isUrdu ? "اپنا کیریئر نئے سرے سے ترتیب دیں" : "Reimagine\nyour career"}
                      </h2>
                      <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md mb-8">
                        {isUrdu
                          ? "عالمی معیار کے وسائل اور نیٹ ورکنگ کے مواقع تک رسائی حاصل کریں تاکہ آپ اپنے پیشہ ورانہ سفر کو تیز یا نئے سرے سے شروع کر سکیں۔"
                          : "Access world-class resources and networking opportunities to pivot or accelerate your professional journey."}
                      </p>
                      <button
                        onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                        className="w-fit border-2 border-white text-white font-black uppercase
                                   tracking-[0.15em] text-sm px-8 py-4 rounded-xl
                                   hover:bg-white hover:text-slate-900 transition-all duration-200"
                      >
                        {isUrdu ? "مزید جانیں" : "LEARN MORE"}
                      </button>
                    </div>

                    {/* RIGHT — feature grid (glassmorphism tiles) */}
                    <div className="shrink-0 grid grid-cols-2 gap-3 px-8 md:px-10 py-10 md:py-0 w-full md:w-auto">
                      {[
                        { Icon: Rocket,     label: isUrdu ? "تیز مہارتیں"  : "Rapid Skills"    },
                        { Icon: Award,      label: isUrdu ? "سرٹیفکیشن"   : "Certifications"  },
                        { Icon: Users,      label: isUrdu ? "رہنمائی"      : "Mentorship"      },
                        { Icon: TrendingUp, label: isUrdu ? "ترقی ٹریکنگ" : "Growth Tracking" },
                      ].map(({ Icon, label }, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-center gap-3 p-6 md:p-8
                                     bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
                                     hover:bg-white/20 transition-all duration-200 cursor-default
                                     min-w-[130px] md:min-w-[150px]"
                        >
                          <Icon size={30} className="text-white/90" strokeWidth={1.5} />
                          <span className="text-white text-[13px] font-bold text-center leading-snug">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECOND ROW: remaining courses (4th onwards) ── */}
            {courses.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {courses.slice(3).map((course, i) => {
                  const badge       = BADGES[(i + 3) % BADGES.length];
                  const courseName  = isUrdu ? course.title_ur || course.title_en : course.title_en;
                  const image       = COURSE_IMAGES[course.id];
                  const lectureCount = lectureCounts[course.id] ?? course.total_lectures ?? 0;

                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseClick(course.id)}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                                 shadow-sm hover:shadow-xl cursor-pointer
                                 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-52 overflow-hidden flex-shrink-0">
                        <img
                          src={image}
                          alt={courseName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Badge */}
                        {/* <div className="absolute top-3 left-3">
                          <span className="bg-[#1633c0] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-sm">
                            {badge}
                          </span>
                        </div> */}
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="font-black text-slate-900 text-[16px] leading-snug mb-1.5 line-clamp-2">
                          {courseName}
                        </h3>

                        {/* Lecture count */}
                        <p className="text-slate-500 text-[13px] mb-3 flex items-center gap-1.5">
                          <Users size={13} />
                          {lectureCount} {isUrdu ? "لیکچرز" : "Lectures"}
                        </p>

                     
                      

                        {/* CTA button — pushed to bottom */}
                        <div className="mt-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCourseClick(course.id); }}
                            className="w-full bg-[#1633c0] hover:bg-[#122ba8] text-white font-bold
                                       py-3 rounded-xl transition-all duration-200 text-[14px]
                                       flex items-center justify-center gap-2 group-hover:gap-3"
                          >
                            <PlayCircle size={16} />
                            {isUrdu ? "سیکھنا شروع کریں" : "Start Learning"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default AllProfessionalCourses;