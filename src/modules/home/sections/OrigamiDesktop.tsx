import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import origamiCampImage from "../../../assets/images/origami.png";

const OrigamiCampBanner = () => {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);

  if (navigating) return null; // instantly clears current page, no flash

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <div className="bg-yellow-100 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-8 lg:p-12 gap-8">
        <div className="w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {t("origami_camp_banner.title_part1")} <br />
              <span className="text-yellow-600">
                {t("origami_camp_banner.title_part2")}
              </span>
            </h2>
            <p className="text-yellow-800 text-lg lg:text-xl font-medium tracking-wide">
              {t("origami_camp_banner.tagline")}
            </p>
          </div>

          <button
            onMouseEnter={() => import("../../../vocab/VocabApp")} // preload on hover
            onClick={() => {
              window.scrollTo(0, 0);
              setNavigating(true); // instantly wipes current page
              navigate("/origami");
            }}
            className="w-fit bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t("origami_camp_banner.button")}
          </button>
        </div>

        <div className="w-1/2 flex justify-end">
          <img
            src={origamiCampImage}
            alt="Origami Learning Adventure"
            className="w-full h-auto object-contain max-h-[300px] lg:max-h-[350px]"
          />
        </div>
      </div>
    </section>
  );
};

export default OrigamiCampBanner;