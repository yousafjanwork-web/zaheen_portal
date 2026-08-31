import React from "react";
import { t } from "@/modules/shared/i18n";

const cards = [
<<<<<<< HEAD
  {
    title: "KG to Grade 12",
    desc: "Complete school learning with videos, quizzes and tests.",
    color: "from-blue-500 to-indigo-600",
    link: "/grade-view/k-12"
  },
  {
    title: "Professional Skills",
    desc: "Digital Marketing, Web Development and Trading courses.",
    color: "from-purple-500 to-pink-500",
    link: "/skills/300"
  },
  {
    title: "AI Tutor",
    desc: "Ask questions and learn instantly with AI assistance.",
    color: "from-green-500 to-emerald-600",
    link: "ai"
  },
  {
    title: "Unlimited Learning",
    desc: "Access all courses with one subscription.",
    color: "from-orange-400 to-red-500",
    link: "/grade-view/k-12"
  },
  {
    title: "Affordable Plan",
    desc: "Start learning today with only Rs 5 / Day.",
    color: "from-cyan-500 to-blue-600",
    link: "pricing" // 👈 scroll target
  }
];

const PromoSlider = () => {

  const handleClick = (e, link) => {
    if (link === "pricing") {
      e.preventDefault();

      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-6 px-4 bg-white">

      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Explore Learning
=======
  { color: "from-blue-500 to-indigo-600",   link: "/grade-view/k-12" },
  { color: "from-purple-500 to-pink-500",    link: "/skills/300" },
  { color: "from-green-500 to-emerald-600",  link: "ai" },
  { color: "from-orange-400 to-red-500",     link: "/grade-view/k-12" },
  { color: "from-cyan-500 to-blue-600",      link: "/mdcat?tab=dashboard" },
];

const PromoSlider = () => {
  return (
    <section
      className="py-6 px-4"
      style={{ background: "#0f172a" }}
    >
  
      <h2 className="text-xl font-bold text-white mb-4">
        {t("promo.title")}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      </h2>

   <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar items-stretch">
        {cards.map((card, i) => (
<<<<<<< HEAD
          <a
            key={i}
            href={card.link || "#"}
            onClick={(e) => handleClick(e, card.link)}
          >
            <div
              className={`
                  min-w-[220px]
                  h-[160px]
                  rounded-2xl
                  p-6
                  text-white
                  shadow-lg
                  bg-gradient-to-r ${card.color}
                  flex flex-col
                `}
            >
              <h3 className="text-lg font-bold mb-2">
                {card.title}
              </h3>

              <div className="flex-1 overflow-hidden">
                <p className="text-sm opacity-90">
                  {card.desc}
                </p>
              </div>
=======
          <a key={i} href={card.link || "#"}>
            <div
           className="min-w-[220px] h-[180px] rounded-2xl p-6 flex flex-col justify-between
                         transition-all duration-300 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(240,180,41,0.3)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(240,180,41,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Amber accent dot */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(240,180,41,0.15)" }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#F0B429" }}
                />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {t(`promo.cards.${i}.title`)}
              </h3>
             <p className="text-sm text-slate-400 line-clamp-2 flex-1">
                {t(`promo.cards.${i}.desc`)}
              </p>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoSlider;