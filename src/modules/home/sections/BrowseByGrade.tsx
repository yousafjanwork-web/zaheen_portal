import React from 'react';
import { Baby, BookOpen, FlaskConical, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from "react-router-dom";
import { classSlugFromId } from "@/config/classSlugs";
import { t } from '@/modules/shared/i18n';

const grades = [
  {
    title: t("browseGrade.kgTitle"),
    subtitle: t("browseGrade.kgSubtitle"),
    icon: <Baby size={34} />,
    badgeText: "Games Included",
    link: `/${classSlugFromId(1)}`
  },
  {
    title: t("browseGrade.g1Title"),
    subtitle: t("browseGrade.g1Subtitle"),
    icon: <BookOpen size={34} />,
    link: "/grade-view/1-5"
  },
  {
    title: t("browseGrade.g6Title"),
    subtitle: t("browseGrade.g6Subtitle"),
    icon: <FlaskConical size={34} />,
    link: "/grade-view/6-8"
  },
  {
    title: t("browseGrade.g9Title"),
    subtitle: t("browseGrade.g9Subtitle"),
    icon: <GraduationCap size={34} />,
    link: "/grade-view/9-12"
  }
];

const BrowseByGrade = () => {
  return (
    <section
      className="py-24"
      id="browse-by-grade"
      style={{ background: "#0f172a" }}
    >
     <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              {t("browseGrade.title")}
            </h2>
            <p className="text-lg text-slate-400">
              {t("browseGrade.subtitle")}
            </p>
          </div>

          <a
            href="/grade-view/k-12"
            className="flex items-center mt-4 md:mt-0 font-semibold text-sm transition-colors group"
            style={{ color: "#F0B429" }}
          >
            {t("browseGrade.viewAll")}
            <ArrowRight
              size={16}
              className={`ml-2 transition-transform
                ${localStorage.getItem("lang") === "ur"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
                }`}
            />
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {grades.map((grade, index) => (
            <Link to={grade.link} key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25 }}
                className="group cursor-pointer"
              >
                <div
                  className="relative rounded-3xl p-6 sm:p-10 text-center flex flex-col justify-between h-64 sm:h-auto transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(240,180,41,0.35)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(240,180,41,0.12)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                  }}
                >
                  {/* Badge */}
                  {grade.badgeText && (
                    <span
                      className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}
                    >
                      {grade.badgeText}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className="w-20 h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center rounded-2xl"
                    style={{
                      background: "rgba(240,180,41,0.12)",
                      color: "#F0B429",
                    }}
                  >
                    {grade.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {grade.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-slate-400 text-sm">
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