import React from "react";
import zaheenAppImage from "../../../assets/images/zaheenappmobile.png";

const ZaheenAppMobile = () => {
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=pk.zaheen.app&pcampaignid=web_share";

  return (
    <section id="zaheen-app-mobile-section" className="py-6 max-w-7xl mx-auto px-4">
      <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="block rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-[1.02]">
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