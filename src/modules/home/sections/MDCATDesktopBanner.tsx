import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import mdcatImage from "../../../assets/images/mdcatdesktopbanner.png";

const MDCATDesktopBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 max-w-7xl mx-auto px-4" style={{ background: "#0f172a" }}>
      <div
        className="rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-8 lg:p-12 gap-8"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}
      >
        {/* Accent bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-[2.5rem]"
          style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }}
        />

        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t("mdcat_banner.title_part1")} <br />
              <span style={{ color: "#F0B429" }}>
                {t("mdcat_banner.title_part2")}
              </span>
            </h2>
            <p className="text-slate-300 text-lg lg:text-xl font-medium tracking-wide">
              {t("mdcat_banner.tagline")}
            </p>
          </div>

          {/* Yellow button */}
          <button
            onClick={() => navigate("/mdcat")}
            className="w-fit px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#F0B429,#f59e0b)",
              color: "#0f172a",
              boxShadow: "0 4px 20px rgba(240,180,41,0.4)",
            }}
          >
            {t("mdcat_banner.button")}
          </button>
        </div>

        {/* RIGHT SIDE */}
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