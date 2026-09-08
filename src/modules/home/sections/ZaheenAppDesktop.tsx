import React from "react";
const zaheenAppImage = "https://cdn.zaheen.com.pk/zaheen-web-img/zaheenplaystore.png";

const ZaheenAppDesktop = () => {
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=pk.zaheen.app&pcampaignid=web_share";

  const handleClick = () => {
    window.open(playStoreUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ background: "#0f172a" }}>
      <section className="py-10 max-w-[1600px] mx-auto px-6 xl:px-10">
        <div
          className="rounded-[2.5rem] overflow-hidden relative flex items-center p-8 lg:p-12 gap-10"
          style={{
            background: "rgba(15,23,42,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #F0B429 0%, #2DD4BF 60%, transparent 100%)",
            }}
          />

          {/* Radial glow top-right */}
          <div
            className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(240,180,41,0.06) 0%, transparent 70%)",
            }}
          />

          {/* LEFT SIDE — image */}
          <div className="w-1/2 flex justify-start z-10">
            <div
              className="relative group"
              style={{ width: "clamp(300px, 42vw, 520px)" }}
            >
              <div
                className="rounded-[1.5rem] overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}
              >
                <img
                  src={zaheenAppImage}
                  alt="Zaheen Learning App"
                  className="w-full h-auto object-contain block transition-all duration-500 group-hover:brightness-105"
                  style={{ maxHeight: "380px" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — text */}
          <div className="w-1/2 flex flex-col justify-center space-y-6 z-10">
            <div className="space-y-3">
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{
                  background: "rgba(240,180,41,0.12)",
                  color: "#F0B429",
                  border: "1px solid rgba(240,180,41,0.25)",
                }}
              >
                Now on Android
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Learn Smarter. <br />
                <span style={{ color: "#F0B429" }}>Grow Faster.</span>
              </h2>

              <p
                className="text-lg lg:text-xl font-medium tracking-wide"
                style={{ color: "rgba(200,215,255,0.7)" }}
              >
                Your complete learning journey, anytime and anywhere.
              </p>
            </div>

            <button
              onClick={handleClick}
              className="w-fit px-8 py-3 rounded-full font-semibold text-base transition-all duration-200"
              style={{
                background: "transparent",
                color: "#ffffff",
                border: "2px solid rgba(255,255,255,0.35)",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.35)";
              }}
            >
              Download on Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZaheenAppDesktop;