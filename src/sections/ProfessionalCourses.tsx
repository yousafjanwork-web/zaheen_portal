import React from 'react';
import { Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const courses = [
  {
    title: "Advanced Digital Marketing Strategy",
    category: "Marketing",
    rating: 4.9,
    students: "2.4k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJkX_TXxwHq6MZdhOUTBlpd5tp-qkeAjVCE-o59dhmRMnAXnnsB1-DQImobEKS2z2Yn1ZCKU9uk8uFGpf6vlubCJIIsEh5FikJ67JFEEEzvM7FqHctvvZHSNWJIZC4USg2gWsilDW2OLavFD39IMPU-NJR_ZtmIBPHR3Os197CIl-C79vydqJUbF_sbbfmcj6CwlxRTlZpmrxely56vqrhWBPZ5bS0gy306ElzO4xoOsrg9ek33MYfI_HO81kuAQwdvHZp2j5rEaVn",
    color: "bg-primary"
  },
  {
    title: "Mastering Day Trading & Crypto",
    category: "Finance",
    rating: 4.7,
    students: "1.8k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs3SQgxFgjS8u4qG6h7dPOjQh3_lZv3_dVbctjI7_qykNpwvOxQceNjSPI5xyVtJQfr9B3vovKI_S0HZDp690u4cuUyr2YUEzgUzXV9rOQoWb9axJNb1teoSNlCKDL5E9DhM1KnOWmM5hp_JRbzsCo2Q_yAKtBr2dKDbWYi1uFYHqYoL6ZPg-LnjVgoytz9IeBKa08WnBc4L6y4V_tUXN3XGpNw1PXSg6wBFpngWRG-zSkQ67nErXqKzYZetMadGbsE5i_wtRk01B",
    color: "bg-secondary"
  },
  {
    title: "Full-Stack Web Development Bootcamp",
    category: "Development",
    rating: 5.0,
    students: "3.2k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiyEF6B4PIAtfDJYQ4n3gSsGQYM4pt71ui3LrryXFc1IfqTLAvNIyvpF5rcJsvYobto4-XNeG2FbGxQ98V9AH_DTwN5pxHXtHUHwC5_6L9NJx13tO3ut467KPhPQGp36q4il_q70bWH00u0UcYVEW3BfE_uLix3sWuE9aFmg1_aUoN4Wh9kbPBPhR189fli2iNe8n0_0IqFH-GHWaGVQKDLBvg7TiBs9MGti2iqKlClY6ugaUuQs2cPeFKu3YanDz8eGmSb_FBtlbU",
    color: "bg-purple-500"
  }
];

export const ProfessionalCourses: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="professional-courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 dark:text-white">Professional Courses</h2>
            <p className="arabic-text text-lg text-slate-500">پیشہ ورانہ کورسز</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button className="p-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
              <ChevronLeft size={24} />
            </button>
            <button className="p-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100 dark:border-slate-700"
            >
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute top-4 left-4 ${course.color} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                  {course.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 hover:text-primary cursor-pointer transition-colors dark:text-white line-clamp-2 h-14">
                  {course.title}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-amber-500">
                    <Star size={16} fill="currentColor" className="mr-1" />
                    <span className="text-sm font-bold">{course.rating}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.students} Students
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
