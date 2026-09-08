import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
const mdcatImage = "https://cdn.zaheen.com.pk/zaheen-web-img/mdcatmainbaner.png";

const MDCATBanner = () => {
  const navigate = useNavigate();

  return (
    <section
      id="mdcat-section"
      className="py-6 max-w-7xl mx-auto px-4"
      style={{ background: "#0f172a" }}
    >
      <div className="flex flex-col gap-3">

        {/* Heading */}
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg,#F0B429,#f59e0b)",
              color: "#0f172a",
            }}
          >
            {t("mdcat_banner_small.badge")}
          </span>
          <h2 className="text-white text-lg lg:text-2xl font-bold">
            {t("mdcat_banner_small.title")}
          </h2>
        </div>

        {/* Image card */}
        <div
          onClick={() => navigate("/mdcat")}
          className="rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300"
          style={{
            border: "1px solid rgba(240,180,41,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(240,180,41,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
          }}
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