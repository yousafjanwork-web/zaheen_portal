import React from "react";
import zaheenAppImage from "../../../assets/images/zaheenappdesktop.png";

const ZaheenAppDesktop = () => {
  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=pk.zaheen.app&pcampaignid=web_share";

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-[2.5rem] overflow-hidden shadow-2xl bg-sky-100"
      >
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