import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import mdcatImage from "../../../assets/images/mdcatnewbanerdesk.png";

const MDCATDesktopBanner = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#0f172a" }}>
      <section className="py-10 max-w-[1600px] mx-auto px-6 xl:px-10">
        <div
          className="rounded-[2.5rem] overflow-hidden relative flex items-center p-8 lg:p-12 gap-8"
          style={{
            background: "rgba(15,23,42,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(240,180,41,0.06) 0%, transparent 70%)",
            }}
          />

          {/* LEFT SIDE */}
          <div className="w-1/2 flex flex-col justify-center space-y-6 z-10">
            <div className="space-y-3">
              <h2 className="text-4xl lg:text-5xl  font-bold text-white leading-tight">
                {t("mdcat_banner.title_part1")} <br />
                <span style={{ color: "#F0B429" }}>
                  {t("mdcat_banner.title_part2")}
                </span>
              </h2>
              <p
                className="text-lg lg:text-xl font-medium tracking-wide"
                style={{ color: "rgba(200,215,255,0.7)" }}
              >
                {t("mdcat_banner.tagline")}
              </p>
            </div>

            <button
              onClick={() => navigate("/mdcat")}
              className="w-fit px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F0B429, #f59e0b)",
                color: "#0f172a",
                boxShadow: "0 4px 20px rgba(240,180,41,0.4)",
              }}
            >
              {t("mdcat_banner.button")}
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-1/2 flex justify-end z-10">
            <div
              className="relative group"
              style={{ width: "clamp(300px, 42vw, 520px)" }}
            >
              <div
                className="rounded-[1.5rem] overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
              >
                <img
                  src={mdcatImage}
                  alt="MDCAT Prep Desktop"
                  className="w-full h-auto object-contain block transition-all duration-500 group-hover:brightness-105"
                  style={{ maxHeight: "380px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MDCATDesktopBanner;