import React from "react";
import zaheenAppImage from "../../../assets/images/zaheenappdesktop.png";

const ZaheenAppDesktop = () => {
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=pk.zaheen.app&pcampaignid=web_share";

  return (
    <section className="py-10 max-w-7xl mx-auto px-4" style={{ background: "#0f172a" }}>
      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-[2.5rem] overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}
      >
        {/* Accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }}
        />
        <img
          src={zaheenAppImage}
          alt="Zaheen App Desktop"
          className="w-full h-full object-contain"
        />
      </a>
    </section>
  );
};

export default ZaheenAppDesktop;