import React from "react";
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { t } from "@/i18n";
const lang = localStorage.getItem("lang") || "en";

const courses = [
  {
    title: t("professionalCourses.course1"),
    category: t("professionalCourses.marketing"),
    rating: 4.9,
    students: "2.4k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJkX_TXxwHq6MZdhOUTBlpd5tp-qkeAjVCE-o59dhmRMnAXnnsB1-DQImobEKS2z2Yn1ZCKU9uk8uFGpf6vlubCJIIsEh5FikJ67JFEEEzvM7FqHctvvZHSNWJIZC4USg2gWsilDW2OLavFD39IMPU-NJR_ZtmIBPHR3Os197CIl-C79vydqJUbF_sbbfmcj6CwlxRTlZpmrxely56vqrhWBPZ5bS0gy306ElzO4xoOsrg9ek33MYfI_HO81kuAQwdvHZp2j5rEaVn",
    color: "bg-blue-500"
  },
  {
    title: t("professionalCourses.course2"),
    category: t("professionalCourses.finance"),
    rating: 4.7,
    students: "1.8k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs3SQgxFgjS8u4qG6h7dPOjQh3_lZv3_dVbctjI7_qykNpwvOxQceNjSPI5xyVtJQfr9B3vovKI_S0HZDp690u4cuUyr2YUEzgUzXV9rOQoWb9axJNb1teoSNlCKDL5E9DhM1KnOWmM5hp_JRbzsCo2Q_yAKtBr2dKDbWYi1uFYHqYoL6ZPg-LnjVgoytz9IeBKa08WnBc4L6y4V_tUXN3XGpNw1PXSg6wBFpngWRG-zSkQ67nErXqKzYZetMadGbsE5i_wtRk01B",
    color: "bg-green-500"
  },
  {
    title: t("professionalCourses.course3"),
    category: t("professionalCourses.development"),
    rating: 5.0,
    students: "3.2k",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiyEF6B4PIAtfDJYQ4n3gSsGQYM4pt71ui3LrryXFc1IfqTLAvNIyvpF5rcJsvYobto4-XNeG2FbGxQ98V9AH_DTwN5pxHXtHUHwC5_6L9NJx13tO3ut467KPhPQGp36q4il_q70bWH00u0UcYVEW3BfE_uLix3sWuE9aFmg1_aUoN4Wh9kbPBPhR189fli2iNe8n0_0IqFH-GHWaGVQKDLBvg7TiBs9MGti2iqKlClY6ugaUuQs2cPeFKu3YanDz8eGmSb_FBtlbU",
    color: "bg-purple-500"
  }
  
];

const ProfessionalCourses = () => {
  return (
    <section className="py-24 bg-slate-50" id="professional-courses">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-14">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {t("professionalCourses.title")}
            </h2>

            <p className="text-slate-500">
              {t("professionalCourses.subtitle")}
            </p>
          </div>

          <div className="flex gap-3">

  <button className="p-3 rounded-full border border-slate-200 hover:bg-white shadow-sm">
    {lang === "ur" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
  </button>

  <button className="p-3 rounded-full border border-slate-200 hover:bg-white shadow-sm">
    {lang === "ur" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
  </button>

</div>

        </div>

        {/* Courses */}
        <div className="grid md:grid-cols-3 gap-8">

          {courses.map((course, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition"
            >

              <div className="relative">

                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-52 object-cover"
                />

                <span
                  className={`absolute top-4 left-4 ${course.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                >
                  {course.category}
                </span>

              </div>

              <div className="p-6">

                <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center gap-5 text-sm text-slate-500">

                  <div className="flex items-center text-amber-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    {course.rating}
                  </div>

                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.students} {t("professionalCourses.students")}
                  </div>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ProfessionalCourses;