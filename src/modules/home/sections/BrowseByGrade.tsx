import React from 'react';
import { Baby, BookOpen, FlaskConical, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from "react-router-dom";
import { t } from '@/modules/shared/i18n';

const grades = [
  {
    title: t("browseGrade.kgTitle"),
    subtitle: t("browseGrade.kgSubtitle"),
    //badgeText: t("browseGrade.kgBadge"),
    icon: <Baby size={34} />,
    cardBg: "bg-[#F4EFE2]",
    iconBg: "bg-[#F8E7B0]",
    iconColor: "text-orange-500",
    badgeText: "Games Included",
    link: "/grade-view/kg"
  },
  {
    title: t("browseGrade.g1Title"),
    subtitle: t("browseGrade.g1Subtitle"),
    icon: <BookOpen size={34} />,
    cardBg: "bg-[#E7EEF7]",
    iconBg: "bg-[#D4E1F3]",
    iconColor: "text-blue-600",
    link: "/grade-view/1-5"
  },
  {
    title: t("browseGrade.g6Title"),
    subtitle: t("browseGrade.g6Subtitle"),
    icon: <FlaskConical size={34} />,
    cardBg: "bg-[#E8F3EC]",
    iconBg: "bg-[#CFE7D8]",
    iconColor: "text-green-600",
    link: "/grade-view/6-8"
  },
  {
    title: t("browseGrade.g9Title"),
    subtitle: t("browseGrade.g9Subtitle"),
    icon: <GraduationCap size={34} />,
    cardBg: "bg-[#F1EAF8]",
    iconBg: "bg-[#E2D6F4]",
    iconColor: "text-purple-600",
    link: "/grade-view/9-12"
  }
];

const BrowseByGrade = () => {

  return (
    <section className="py-24 bg-slate-50" id="browse-by-grade">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
              {t("browseGrade.title")}
            </h2>

            <p className="text-lg text-slate-500">
              {t("browseGrade.subtitle")}
            </p>
          </div>

          <a
            href="#"
            className="text-primary font-semibold flex items-center hover:underline mt-4 md:mt-0 group"
          >
            {t("browseGrade.viewAll")}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
          </a>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {grades.map((grade, index) => (

            <Link to={grade.link} key={index}>

              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="group cursor-pointer"
              >

                <div className={`relative rounded-3xl p-10 text-center transition shadow-sm hover:shadow-lg ${grade.cardBg}`}>

                  {/* Badge */}
                  {grade.badgeText && (
                    <span className="absolute top-4 right-4 bg-lime-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {grade.badgeText}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-2xl ${grade.iconBg} ${grade.iconColor}`}
                  >
                    {grade.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {grade.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-500 text-sm">
                    {grade.subtitle}
                  </p>

                </div>

              </motion.div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default BrowseByGrade;