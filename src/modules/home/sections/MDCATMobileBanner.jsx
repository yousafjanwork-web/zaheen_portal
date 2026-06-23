import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n"; // Import ensure karein
import mdcatImage from "../../../assets/images/mdcatmainbaner.png"; 

const MDCATBanner = () => {
  const navigate = useNavigate();

  return (
    <section id="mdcat-section" className="py-6 max-w-7xl mx-auto px-4">
      <div className="flex flex-col gap-3">
        
        {/* Heading Section */}
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t("mdcat_banner_small.badge")}
          </span>
          <h2 className="text-slate-900 text-lg lg:text-2xl font-bold">
            {t("mdcat_banner_small.title")}
          </h2>
        </div>

        {/* Image Section */}
        <div 
          onClick={() => navigate("/mdcat")}
          className="rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <img 
            src={mdcatImage} 
            alt="MDCAT Prep" 
            className="w-full h-auto object-cover" 
          />
        </div>
        
      </div>
    </section>
  );
};

export default MDCATBanner;