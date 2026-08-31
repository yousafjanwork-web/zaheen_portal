import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
=======
import { Star, Users, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import sliderImg1 from "../../../assets/images/web-development-s.png";
import sliderImg2 from "../../../assets/images/auto-cad-s.png";
import sliderImg3 from "../../../assets/images/excel-s.png";
import sliderImg4 from "../../../assets/images/video-editing-s.png";
import sliderImg5 from "../../../assets/images/makeup-s.png";
import sliderImg6 from "../../../assets/images/trading-professional-skill-banner-ss.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const V2_BASE = "https://api.zaheen.com.pk/v2/api";

const COURSE_IMAGES: Record<number, string> = {
  1: sliderImg6,
  2: sliderImg1,
  3: sliderImg2,
  4: sliderImg3,
  5: sliderImg4,
  6: sliderImg5,
};

const PARENT_ID_TO_CLASS_ID: Record<number, number> = {
  1: 305,
  2: 300,
  3: 301,
  4: 302,
  5: 303,
  6: 304,
};

const DISPLAY_ORDER: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const lang = localStorage.getItem("lang") || "en";

interface V2Course {
  id: number;
  title_en: string;
  title_ur?: string;
  total_lectures?: number;
  total_duration?: number;
  level?: string;
}

const fetchLectureCount = async (parentId: number): Promise<number> => {
  try {
    const res = await fetch(`${V2_BASE}/videos?content_type=COURSE&parent_id=${parentId}`);
    if (!res.ok) return 0;
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data.length : 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const ProfessionalCourses = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [courses, setCourses] = useState([]);
=======
  const [courses, setCourses] = useState<V2Course[]>([]);
  const [lectureCounts, setLectureCounts] = useState<Record<number, number>>({});
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
<<<<<<< HEAD
        const res = await fetch("https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3");
        const data = await res.json();
        setCourses(data);
=======
        const res = await fetch(`${V2_BASE}/courses`);
        const json = await res.json();
        const data: V2Course[] = Array.isArray(json?.data) ? json.data : [];
        const sorted = [...data].sort(
          (a, b) => (DISPLAY_ORDER[a.id] ?? 99) - (DISPLAY_ORDER[b.id] ?? 99)
        );
        setCourses(sorted);
        const counts = await Promise.all(sorted.map((c) => fetchLectureCount(c.id)));
        const countMap: Record<number, number> = {};
        sorted.forEach((c, i) => { countMap[c.id] = counts[i]; });
        setLectureCounts(countMap);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

<<<<<<< HEAD
  if (loading) return <div className="py-24 text-center text-slate-500">Loading...</div>;

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          {t("professionalCourses.title")}
        </h2>
        <p className="text-slate-500 mt-2">
          {t("professionalCourses.subtitle")}
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10">

        {/* NAVIGATION ARROWS */}
        <button className="prev-btn absolute left-0 md:-left-0 top-1/2 -translate-y-1/2 z-40 
                           bg-indigo-600 text-white shadow-xl p-3 md:p-2 rounded-full 
                           hover:bg-indigo-700 transition-all duration-300 active:scale-90
                           animate-pulse hover:animate-none group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button className="next-btn absolute right-0 md:-right-0 top-1/2 -translate-y-1/2 z-40 
                           bg-indigo-600 text-white shadow-xl p-3 md:p-2 rounded-full 
                           hover:bg-indigo-700 transition-all duration-300 active:scale-90
                           animate-pulse hover:animate-none group">
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* SWIPER SLIDER */}
=======
  if (loading)
    return (
      <div
        className="py-24 text-center text-slate-400"
        style={{ background: "#0f172a" }}
      >
        Loading...
      </div>
    );

  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem" }} />
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t("professionalCourses.title")}
            </h2>
            <p className="text-slate-400 mt-2">
              {t("professionalCourses.subtitle")}
            </p>
          </div>

          <button
            onClick={() => navigate("/all-professional-courses")}
            className="flex items-center gap-2 font-semibold text-sm md:text-base transition-colors group shrink-0 ml-4"
            style={{ color: "#F0B429" }}
          >
            {lang === "ur" ? "تمام کورسز دیکھیں" : "View All Courses"}
            <ArrowRight
              size={18}
              className={`transition-transform
                ${lang === "ur"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
                }`}
            />
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10">

        {/* NAV ARROWS */}
        <button
          className="prev-btn absolute left-0 md:-left-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          className="next-btn absolute right-0 md:-right-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, Pagination]}
          spaceBetween={25}
          slidesPerView={1.2}
          slidesPerGroup={1}
          loop={true}
          grabCursor={true}
          speed={800}
<<<<<<< HEAD
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 20,
            thresholdTime: 400,
          }}
          navigation={{
            prevEl: ".prev-btn",
            nextEl: ".next-btn",
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ height: '100%' }}
          className="pb-12 !px-2"
        >
          {courses.map((course, i) => (
            <SwiperSlide key={i} className="py-5 !h-auto">
              <div
                onClick={() => navigate(`/skills/${course.class_id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer 
                           border border-slate-100 flex flex-col h-full
                           transition-all duration-400 ease-out
                           hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
              >
                {/* IMAGE */}
                <div className="relative h-48 md:h-56 flex-shrink-0">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-5 md:p-6 flex flex-col flex-grow justify-between">
                  <h3 className="font-bold text-slate-900 line-clamp-2 text-lg">
                    {lang === "ur" ? course.urdu_name : course.name}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star size={16} fill="currentColor" className="mr-1" />
                      5.0
                    </div>
                    <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-xs font-medium">
                      <Users size={14} className="mr-1.5" />
                      {course.chapterCount} Chapters
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
=======
          mousewheel={{ forceToAxis: true, sensitivity: 1, thresholdDelta: 20, thresholdTime: 400 }}
          navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
          breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } }}
          style={{ height: "100%" }}
          className="pb-12 !px-2"
        >
          {courses.map((course) => {
            const classId = PARENT_ID_TO_CLASS_ID[course.id];
            const image = COURSE_IMAGES[course.id];
            const lectureCount = lectureCounts[course.id] ?? course.total_lectures ?? 0;

            return (
              <SwiperSlide key={course.id} className="py-5 !h-auto">
                <div
                  onClick={() => classId && navigate(`/skills/${classId}`)}
                  className="rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 25px 50px -12px rgba(240,180,41,0.15)";
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(240,180,41,0.25)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.08)";
                  }}
                >
                  <div className="relative h-48 md:h-56 flex-shrink-0">
                    <img
                      src={image}
                      alt={course.title_en}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  </div>

                  <div className="p-5 md:p-6 flex flex-col flex-grow justify-between">
                    <h3 className="font-bold text-white line-clamp-2 text-lg">
                      {lang === "ur" ? (course.title_ur || course.title_en) : course.title_en}
                    </h3>
                    <div
                      className="flex justify-between items-center text-sm pt-4 mt-4"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <div className="flex items-center font-bold" style={{ color: "#F0B429" }}>
                        <Star size={16} fill="currentColor" className="mr-1" />
                        5.0
                      </div>
                      <div
                        className="flex items-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}
                      >
                        <Users size={14} className="mr-1.5" />
                        {lectureCount} Lectures
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        </Swiper>
      </div>
    </section>
  );
};

export default ProfessionalCourses;