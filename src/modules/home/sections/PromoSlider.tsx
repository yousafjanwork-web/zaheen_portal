import React from "react";
import { t } from "@/modules/shared/i18n";

const cards = [
  { color: "from-blue-500 to-indigo-600", link: "/grade-view/k-12" },
  { color: "from-purple-500 to-pink-500", link: "/skills/300" },
  { color: "from-green-500 to-emerald-600", link: "ai" },
  { color: "from-orange-400 to-red-500", link: "/grade-view/k-12" },
  { color: "from-cyan-500 to-blue-600", link: "/mdcat?tab=dashboard" }
];

const PromoSlider = () => {
  

  return (
    <section className="py-6 px-4 bg-white">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {t("promo.title")}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {cards.map((card, i) => (
          <a
            key={i}
            href={card.link || "#"}
            onClick={(e) => handleClick(e, card.link)}
          >
            <div className={`
                min-w-[220px] h-[160px] rounded-2xl p-6 text-white shadow-lg
                bg-gradient-to-r ${card.color} flex flex-col
            `}>
              <h3 className="text-lg font-bold mb-2">
                {t(`promo.cards.${i}.title`)}
              </h3>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm opacity-90">
                  {t(`promo.cards.${i}.desc`)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoSlider;