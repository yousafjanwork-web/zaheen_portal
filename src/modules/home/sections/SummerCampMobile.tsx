import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import summerCampImage from "../../../assets/images/summercampmobilebanner.png";

const SummerCampDesktop = () => {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  if (navigating) return null;

  return (
    <section id="summer-camp-section" className="py-6 max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-3">

        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t("summer_camp_banner_mob.badge")}
          </span>
          <h2 className="text-slate-900 text-lg lg:text-2xl font-bold">
            {t("summer_camp_banner_mob.title")}
          </h2>
        </div>

        <div
          onClick={() => {
            window.scrollTo(0, 0);
            setNavigating(true);
            navigate("/vocab");
          }}
          className="rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <img
            src={summerCampImage}
            alt="Summer Camp"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default SummerCampDesktop;