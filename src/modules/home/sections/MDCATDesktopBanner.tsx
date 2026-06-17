import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n"; // i18n import
import mdcatImage from "../../../assets/images/mdcatdesktopbanner.png";

const MDCATDesktopBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-8 lg:p-12 gap-8">
        
        {/* LEFT SIDE: Heading, Tagline, aur Button */}
        <div className="w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
           <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
  {t("mdcat_banner.title_part1")} <br />
  <span className="text-indigo-400">
    {t("mdcat_banner.title_part2")}
  </span>
</h2>
            <p className="text-indigo-200 text-lg lg:text-xl font-medium tracking-wide">
              {t("mdcat_banner.tagline")}
            </p>
          </div>

          <button 
            onClick={() => navigate("/mdcat?tab=dashboard")}
            className="w-fit bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t("mdcat_banner.button")}
          </button>
        </div>

        {/* RIGHT SIDE: Image */}
        <div className="w-1/2 flex justify-end">
          <img 
            src={mdcatImage} 
            alt="MDCAT Prep Desktop" 
            className="w-full h-auto object-contain max-h-[300px] lg:max-h-[350px]" 
          />
        </div>
      </div>
    </section>
  );
};

export default MDCATDesktopBanner;