import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import origamiCampImage from "../../../assets/images/origamimobile.png";

const OrigamiCampMobile = () => {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  if (navigating) return null;

  return (
    <section id="origami-camp-section" className="py-6 max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-3">

        <div className="flex items-center gap-3">
          <span className="bg-yellow-500 text-white text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t("origami_camp_banner_mob.badge")}
          </span>
          <h2 className="text-slate-900 text-lg lg:text-2xl font-bold">
            {t("origami_camp_banner_mob.title")}
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
            src={origamiCampImage}
            alt="Origami Camp"
            className="w-full h-auto object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default OrigamiCampMobile;