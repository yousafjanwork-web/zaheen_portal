import React from "react";
import zaheenAppImage from "../../../assets/images/zaheenappmobile.png";

const ZaheenAppMobile = () => {
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=pk.zaheen.app&pcampaignid=web_share";

  return (
    <section
      id="zaheen-app-mobile-section"
      className="py-6 max-w-7xl mx-auto px-4"
      style={{ background: "#0f172a" }}
    >
      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          border: "1px solid rgba(240,180,41,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 40px rgba(240,180,41,0.2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
        }}
      >
        <img
          src={zaheenAppImage}
          alt="Zaheen App"
          className="w-full h-auto object-cover"
        />
      </a>
    </section>
  );
};

export default ZaheenAppMobile;