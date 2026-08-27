import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type PackageId = "basic" | "standard" | "premium";

interface Package {
  id: PackageId;
  name: string;
  price: string;
  period: string;
  tag?: string;
  features: string[];
}

const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    price: "—",
    period: "/ month",
    features: [
      "Access to core lessons",
      "Practice sets",
      "Progress tracking",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "—",
    period: "/ month",
    tag: "Popular",
    features: [
      "Everything in Basic",
      "AI Tutor access",
      "Past papers",
      "Games & worksheets",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "—",
    period: "/ month",
    features: [
      "Everything in Standard",
      "Live sessions",
      "Priority support",
      "All mini-apps",
    ],
  },
];

const sparks = [
  { top: "10%", left: "6%",  delay: "0s",   dur: "2.6s" },
  { top: "20%", left: "90%", delay: "0.7s", dur: "2.1s" },
  { top: "74%", left: "12%", delay: "1.2s", dur: "2.8s" },
  { top: "82%", left: "88%", delay: "0.4s", dur: "2.3s" },
  { top: "8%",  left: "55%", delay: "1.5s", dur: "2.0s" },
  { top: "60%", left: "46%", delay: "0.9s", dur: "2.5s" },
];

const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PackageId>("basic");

  const handleContinue = () => {
    const pkg = packages.find((p) => p.id === selected)!;
    navigate("/payment", { state: { package: pkg } });
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4 py-16">

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            Step 2 of 2
          </p>
          <h1
            className="text-3xl text-white"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Choose your plan
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Select a package — you can upgrade any time.
          </p>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg) => {
            const active = selected === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                className="relative text-left p-6 rounded-2xl transition-all duration-200 w-full"
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(240,180,41,0.12), rgba(45,212,191,0.08))",
                        border: "1.5px solid rgba(240,180,41,0.55)",
                        boxShadow: "0 0 24px rgba(240,180,41,0.12)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1.5px solid rgba(255,255,255,0.07)",
                      }
                }
              >
                {/* Popular tag */}
                {pkg.tag && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}
                  >
                    {pkg.tag}
                  </span>
                )}

                {/* Selected indicator */}
                {active && (
                  <div
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#F0B429" }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: active ? "#F0B429" : "#e2e8f0" }}
                >
                  {pkg.name}
                </p>
                <p className="text-2xl font-bold text-white mb-0.5">
                  {pkg.price}
                  <span className="text-sm font-normal text-slate-500 ml-1">{pkg.period}</span>
                </p>
                <p className="text-[10px] text-slate-600 mb-4 uppercase tracking-widest">
                  Price TBC
                </p>

                <div className="space-y-2">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span style={{ color: active ? "#2DD4BF" : "#334155" }}>✓</span>
                      <span className="text-xs" style={{ color: active ? "#94a3b8" : "#475569" }}>
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: "linear-gradient(135deg, #F0B429, #f59e0b)",
            color: "#0f172a",
            boxShadow: "0 4px 20px rgba(240,180,41,0.35)",
          }}
        >
          Continue with {packages.find((p) => p.id === selected)?.name} →
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">
          Prices shown will be confirmed before payment.
        </p>
      </div>
    </div>
  );
};

export default PackagesPage;