import React from 'react';
import { Baby, BookOpen, FlaskConical, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const grades = [
  {
    title: "KG Grade",
    subtitle: "Foundation Years",
    icon: <Baby size={40} />,
    color: "amber",
    hasBadge: true,
    badgeText: "Games Included"
  },
  {
    title: "Grade 1-5",
    subtitle: "Primary Level",
    icon: <BookOpen size={40} />,
    color: "blue"
  },
  {
    title: "Grade 6-8",
    subtitle: "Middle School",
    icon: <FlaskConical size={40} />,
    color: "green"
  },
  {
    title: "Grade 9-12",
    subtitle: "High School",
    icon: <GraduationCap size={40} />,
    color: "purple"
  }
];

const colorClasses: Record<string, string> = {
  amber: "bg-amber-50 dark:bg-amber-900/10 hover:border-amber-400 text-amber-500 bg-amber-100 dark:bg-amber-900/30",
  blue: "bg-blue-50 dark:bg-blue-900/10 hover:border-primary text-primary bg-blue-100 dark:bg-blue-900/30",
  green: "bg-green-50 dark:bg-green-900/10 hover:border-secondary text-secondary bg-green-100 dark:bg-green-900/30",
  purple: "bg-purple-50 dark:bg-purple-900/10 hover:border-purple-400 text-purple-500 bg-purple-100 dark:bg-purple-900/30"
};

export const BrowseByGrade = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="browse-by-grade">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2 dark:text-white">Browse by Grade</h2>
          <p className="arabic-text text-lg text-slate-500">گریڈ کے لحاظ سے تلاش کریں</p>
        </div>
        <a href="#" className="text-primary font-semibold flex items-center hover:underline mt-4 md:mt-0 group">
          View All Grades 
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {grades.map((grade, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
          >
            <div className={`relative p-8 rounded-[2rem] border-2 border-transparent transition-all text-center h-full flex flex-col items-center justify-center ${colorClasses[grade.color].split(' ').slice(0,3).join(' ')}`}>
              {grade.hasBadge && (
                <span className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {grade.badgeText}
                </span>
              )}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colorClasses[grade.color].split(' ').slice(3).join(' ')}`}>
                {grade.icon}
              </div>
              <h3 className="text-xl font-bold mb-1 dark:text-white">{grade.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{grade.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default BrowseByGrade;