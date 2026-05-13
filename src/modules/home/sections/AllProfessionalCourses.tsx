import React, { useEffect, useState } from "react";
import background from "@/assets/images/Background.png"
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

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface ClassInfo {
  class_id: number;
  name: string;
  urdu_name?: string;
  thumbnailUrl?: string;
  chapterCount?: number;
}

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

  const [courses, setCourses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    (async () => {
      try {
        const res  = await fetch("https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCourseClick = (classId: number) => {
    navigate(`/skills/${classId}`);
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
                const badge      = BADGES[i % BADGES.length];
                const courseName = isUrdu ? course.urdu_name || course.name : course.name;

                return (
                  <div
                    key={course.class_id}
                    onClick={() => handleCourseClick(course.class_id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                               shadow-sm hover:shadow-xl cursor-pointer
                               transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <img
                        src={course.thumbnailUrl || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(courseName)}`}
                        alt={courseName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#1633c0] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-sm">
                          {badge}
                        </span>
                      </div>
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="font-black text-slate-900 text-[16px] leading-snug mb-1.5 line-clamp-2">
                        {courseName}
                      </h3>

                      {/* Instructor placeholder */}
                      <p className="text-slate-500 text-[13px] mb-3">
                        {isUrdu ? "پیشہ ور انسٹرکٹر" : "Professional Instructor"}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="text-amber-500 font-black text-[14px]">4.8</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              size={13}
                              className={si < 5 ? "text-amber-400" : "text-slate-300"}
                              fill={si < 5 ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-slate-400 text-[12px]">
                          ({((i + 1) * 1240).toLocaleString()})
                        </span>
                      </div>

                      {/* CTA button — pushed to bottom */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCourseClick(course.class_id); }}
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
                  const badge      = BADGES[(i + 3) % BADGES.length];
                  const courseName = isUrdu ? course.urdu_name || course.name : course.name;

                  return (
                    <div
                      key={course.class_id}
                      onClick={() => handleCourseClick(course.class_id)}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200
                                 shadow-sm hover:shadow-xl cursor-pointer
                                 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-52 overflow-hidden flex-shrink-0">
                        <img
                          src={course.thumbnailUrl || `https://placehold.co/600x400/1e293b/ffffff?text=${encodeURIComponent(courseName)}`}
                          alt={courseName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#1633c0] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-sm">
                            {badge}
                          </span>
                        </div>
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="font-black text-slate-900 text-[16px] leading-snug mb-1.5 line-clamp-2">
                          {courseName}
                        </h3>

                        {/* Instructor placeholder */}
                        <p className="text-slate-500 text-[13px] mb-3">
                          {isUrdu ? "پیشہ ور انسٹرکٹر" : "Professional Instructor"}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <span className="text-amber-500 font-black text-[14px]">4.8</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star
                                key={si}
                                size={13}
                                className={si < 5 ? "text-amber-400" : "text-slate-300"}
                                fill={si < 5 ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <span className="text-slate-400 text-[12px]">
                            ({((i + 4) * 1240).toLocaleString()})
                          </span>
                        </div>

                        {/* CTA button — pushed to bottom */}
                        <div className="mt-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCourseClick(course.class_id); }}
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