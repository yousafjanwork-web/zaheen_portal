import React, { useEffect, useState } from "react";
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const lang = localStorage.getItem("lang") || "en";

const ProfessionalCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3");
        const data = await res.json();
        setCourses(data);
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
        </Swiper>
      </div>
    </section>
  );
};

export default ProfessionalCourses;