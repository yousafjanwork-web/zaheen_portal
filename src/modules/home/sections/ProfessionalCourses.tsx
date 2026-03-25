import React, { useEffect, useState } from "react";
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";

const lang = localStorage.getItem("lang") || "en";

const ProfessionalCourses = () => {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true
    },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        const response = await fetch(
          "https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3"
        );

        const data = await response.json();

        setCourses(data);

      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchCourses();

  }, []);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const openCourse = (course) => {
    navigate(`/skills/${course.class_id}`);
  };

  return (
    <section className="py-24 bg-slate-50 relative">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}

        <div className="flex justify-between items-center mb-12">

          <div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {t("professionalCourses.title")}
            </h2>

            <p className="text-slate-500 mt-2">
              {t("professionalCourses.subtitle")}
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={scrollPrev}
              className="p-3 rounded-full bg-white shadow hover:scale-105 transition"
            >
              {lang === "ur"
                ? <ChevronRight size={20} />
                : <ChevronLeft size={20} />}
            </button>

            <button
              onClick={scrollNext}
              className="p-3 rounded-full bg-white shadow hover:scale-105 transition"
            >
              {lang === "ur"
                ? <ChevronLeft size={20} />
                : <ChevronRight size={20} />}
            </button>

          </div>

        </div>

        {/* Carousel */}

        <div className="relative">

          {/* Gradient edges */}

          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>

          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-hidden" ref={emblaRef}>

            <div className="flex gap-6">

              {loading
                ? [...Array(5)].map((_, i) => (

                    <div
                      key={i}
                      className="min-w-[260px] md:min-w-[300px] bg-white rounded-2xl shadow animate-pulse"
                    >
                      <div className="h-44 bg-slate-200 rounded-t-2xl"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>

                  ))
                : courses.map((course) => (

                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => openCourse(course)}
                      className="min-w-[260px] md:min-w-[300px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer group"
                    >

                      {/* Image */}

                      <div className="relative overflow-hidden">

                        <img
                          src={course.thumbnailUrl}
                          alt={course.name}
                          className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
                        />

                        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                          Professional
                        </div>

                      </div>

                      {/* Content */}

                      <div className="p-5">

                        <h3 className="font-bold text-slate-900 line-clamp-2 mb-3">
                          {lang === "ur"
                            ? course.urdu_name
                            : course.name}
                        </h3>

                        <div className="flex items-center justify-between text-sm text-slate-500">

                          <div className="flex items-center text-amber-500">
                            <Star
                              size={15}
                              fill="currentColor"
                              className="mr-1"
                            />
                            5.0
                          </div>

                          <div className="flex items-center">
                            <Users size={15} className="mr-1" />
                            {course.chapterCount} {t("professionalCourses.students")}
                          </div>

                        </div>

                      </div>

                    </motion.div>

                  ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ProfessionalCourses;