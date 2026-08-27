import React from "react";
import { t } from "@/modules/shared/i18n";

const cards = [
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
      </h2>

   <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar items-stretch">
        {cards.map((card, i) => (
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
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoSlider;