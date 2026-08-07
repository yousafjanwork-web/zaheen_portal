import React from "react";
import { t } from "@/modules/shared/i18n";
import { useSubscribe } from "@/modules/shared/hooks/useSubscribe";

const CTASection = () => {
  const { handleSubscribe } = useSubscribe();

  const packages = [
    { id: "205", label: "Daily Rs 5+Tax" },
    { id: "206", label: "Weekly Rs 15+Tax" },
    { id: "207", label: "Monthly Rs 50+Tax" },
  ];

  return (
    <section className="py-12 max-w-7xl mx-auto px-4" style={{ background: "#0f172a" }}>
      <div
        className="rounded-[2.5rem] overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}
      >
        {/* Accent bar */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }}
        />

        <div className="p-10 text-center">
          <h3
            className="text-3xl text-white mb-8"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {t("cta.title")}
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={handleSubscribe}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 16px rgba(240,180,41,0.35)",
                }}
              >
                {pkg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;