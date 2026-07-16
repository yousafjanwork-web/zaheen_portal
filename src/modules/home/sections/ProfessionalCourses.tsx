import React, { useEffect, useState } from "react";
import { Star, Users, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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

// v2 course.id (== parent_id) → local slider image
// Matches CLASS_TO_PARENT_ID in SkillsChaptersPage
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
const DISPLAY_ORDER: Record<number, number> = {
  1: 0, // Trading
  2: 1, // Web Development
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

const lang = localStorage.getItem("lang") || "en";

interface V2Course {
  id: number;
  title_en: string;
  title_ur?: string;
  total_lectures?: number;
  total_duration?: number;
  level?: string;
}

// The /v2/api/courses endpoint's total_lectures field isn't reliable (comes
// back 0), so the true lecture count is fetched from the same videos
// endpoint the course sidebar (SkillsChaptersPage.tsx) uses, keyed by
// course.id == parent_id.
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

const ProfessionalCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<V2Course[]>([]);
  const [lectureCounts, setLectureCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${V2_BASE}/courses`);
        const json = await res.json();
        const data: V2Course[] = Array.isArray(json?.data) ? json.data : [];

        const sorted = [...data].sort(
          (a, b) => (DISPLAY_ORDER[a.id] ?? 99) - (DISPLAY_ORDER[b.id] ?? 99)
        );

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
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="py-24 text-center text-slate-500">Loading...</div>;

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {t("professionalCourses.title")}
            </h2>
            <p className="text-slate-500 mt-2">
              {t("professionalCourses.subtitle")}
            </p>
          </div>

          <button
            onClick={() => navigate("/all-professional-courses")}
            className="flex items-center gap-2 text-indigo-600 font-semibold text-sm md:text-base 
                       hover:text-indigo-800 transition-colors group shrink-0 ml-4"
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

        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, Pagination]}
          spaceBetween={25}
          slidesPerView={1.2}
          slidesPerGroup={1}
          loop={true}
          grabCursor={true}
          speed={800}
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
          style={{ height: "100%" }}
          className="pb-12 !px-2"
        >
          {courses.map((course) => {
            const classId = PARENT_ID_TO_CLASS_ID[course.id];
            const image   = COURSE_IMAGES[course.id];
            const lectureCount = lectureCounts[course.id] ?? course.total_lectures ?? 0;

            return (
              <SwiperSlide key={course.id} className="py-5 !h-auto">
                <div
                  onClick={() => classId && navigate(`/skills/${classId}`)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer 
                             border border-slate-100 flex flex-col h-full
                             transition-all duration-400 ease-out
                             hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
                >
                  <div className="relative h-48 md:h-56 flex-shrink-0">
                    <img
                      src={image}
                      alt={course.title_en}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-5 md:p-6 flex flex-col flex-grow justify-between">
                    <h3 className="font-bold text-slate-900 line-clamp-2 text-lg">
                      {lang === "ur" ? (course.title_ur || course.title_en) : course.title_en}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star size={16} fill="currentColor" className="mr-1" />
                        5.0
                      </div>
                      <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-xs font-medium">
                        <Users size={14} className="mr-1.5" />
                        {lectureCount} Lectures
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ProfessionalCourses;