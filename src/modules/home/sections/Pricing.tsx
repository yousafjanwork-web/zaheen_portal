import React from "react";
import { CheckCircle2, Users, ShieldCheck, RefreshCw } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";
import { t } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";

import { handleSubscribe } from "@/modules/shared/services/subscriptionService";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useSubscribe } from "@/modules/shared/hooks/useSubscribe";

/* ── Shared spark positions (same as LoginPage) ── */
const sparks = [
  { top: "18%", left: "5%",  delay: "0s",   dur: "2.6s" },
  { top: "30%", left: "92%", delay: "0.7s", dur: "2.1s" },
  { top: "65%", left: "10%", delay: "1.2s", dur: "2.8s" },
  { top: "75%", left: "88%", delay: "0.4s", dur: "2.3s" },
  { top: "8%",  left: "60%", delay: "1.5s", dur: "2.0s" },
  { top: "55%", left: "50%", delay: "0.9s", dur: "2.5s" },
];

const Pricing = () => {
  const { msisdn, login, isLoggedIn } = useAuth();
  const { handleSubscribe } = useSubscribe();

  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
    t("pricing.feature4"),
    t("pricing.feature5"),
  ];

  return (
    <section
      className="relative py-24 overflow-hidden"
      id="pricing"
      style={{ background: "#0f172a" }}
    >
      {/* Ambient sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/40 animate-pulse"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
              animationDuration: s.dur,
            }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

    <div className="relative z-10 max-w-[1600px] mx-auto px-6 xl:px-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
         
          <h2
            className="text-4xl text-white mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-slate-400 mb-2">{t("pricing.subtitle")}</p>
          <p className="text-slate-500 text-sm">{t("pricing.description")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Pricing Card ── */}
          <div
            className="rounded-2xl overflow-hidden"
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

            <div className="p-10">
              {/* Logo + Title */}
              <div className="flex items-center gap-4 mb-10">
                <img src={logo} alt="Zaheen Logo" className="h-10" />
                <h3 className="text-2xl font-bold text-white">
                  {t("pricing.plan")}
                </h3>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-300">
                    <CheckCircle2
                      size={20}
                      className="mr-3 flex-shrink-0"
                      style={{ color: "#2DD4BF" }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-8">
                <span
                  className="text-5xl font-extrabold"
                  style={{ color: "#F0B429" }}
                >
                  Rs 5+Tax
                </span>
                <span className="text-slate-400">{t("pricing.perDay")}</span>
              </div>

              {/* Subscribe Button */}
              {!isLoggedIn && (
                <button
                  onClick={handleSubscribe}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                    color: "#0f172a",
                    boxShadow: "0 4px 16px rgba(240,180,41,0.35)",
                  }}
                >
                  {t("pricing.subscribe")}
                </button>
              )}
            </div>
          </div>

          {/* ── Right Info Section ── */}
          <div className="space-y-10">

            {/* Item 1 */}
            <div className="flex gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                <Users size={28} style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1 text-white">
                  {t("pricing.familyTitle")}
                </h4>
                <p className="text-slate-400">{t("pricing.familyDesc")}</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)" }}
              >
                <ShieldCheck size={28} style={{ color: "#2DD4BF" }} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1 text-white">
                  {t("pricing.commitmentTitle")}
                </h4>
                <p className="text-slate-400">{t("pricing.commitmentDesc")}</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(240,180,41,0.12)", border: "1px solid rgba(240,180,41,0.2)" }}
              >
                <RefreshCw size={28} style={{ color: "#F0B429" }} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1 text-white">
                  {t("pricing.updateTitle")}
                </h4>
                <p className="text-slate-400">{t("pricing.updateDesc")}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;