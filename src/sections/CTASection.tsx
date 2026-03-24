import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "@/i18n";
import { useSubscribe } from "@/hooks/useSubscribe";

const CTASection = () => {

  
  const { handleSubscribe } = useSubscribe();
  const packages = [
    { id: "205", label: "Daily Rs 5" },
    { id: "206", label: "Weekly Rs 15" },
    { id: "207", label: "Monthly Rs 50" }
  ];

 

  return (

    <section className="py-12 max-w-7xl mx-auto px-4">

      <div className="bg-primary rounded-[2.5rem] p-10 text-white text-center shadow-xl">

        <h3 className="text-3xl font-bold mb-6">
          {t("cta.title")}
        </h3>

        <div className="flex flex-wrap justify-center gap-4">

          {packages.map(pkg => (

            <button
              key={pkg.id}
              onClick={handleSubscribe}
              className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition shadow"
            >
              {pkg.label}
            </button>

          ))}

        </div>

      </div>

    </section>

  );

};

export default CTASection;