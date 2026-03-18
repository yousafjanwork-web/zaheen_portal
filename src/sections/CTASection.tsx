import React from "react";
import { t } from "@/i18n";




import { handleSubscribe } from "@/services/subscriptionService";
import { useAuth } from "@/context/AuthContext";

export const CTASection = () => {


const { msisdn, login, isLoggedIn } = useAuth();

  return (
    <>
      <section className="py-12 max-w-7xl mx-auto px-4">

        <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-white flex flex-col lg:flex-row items-center justify-between shadow-2xl shadow-primary/20 relative overflow-hidden">

          {/* Background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 text-center lg:text-left mb-8 lg:mb-0">

            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t("cta.title")}
            </h3>

            <p className="text-blue-100 text-lg max-w-xl">
              {t("cta.description")}
            </p>

            {/* Pricing badges */}
            <div className="flex flex-wrap gap-3 mt-5 justify-center lg:justify-start">

              <span className="bg-white/20 px-4 py-2 rounded-xl font-semibold">
                {t("cta.daily")} Rs 5
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-xl font-semibold">
                {t("cta.weekly")} Rs 15
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-xl font-semibold">
                {t("cta.monthly")} Rs 50
              </span>

            </div>

          </div>

          {/* Button */}
           {!isLoggedIn && (
          <button
            onClick={() => handleSubscribe(msisdn, login)}
            className="relative z-10 bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg whitespace-nowrap"
          >
            {t("cta.button")}
          </button>
        )}
        </div>

      </section>

     

    </>
  );
};

export default CTASection;