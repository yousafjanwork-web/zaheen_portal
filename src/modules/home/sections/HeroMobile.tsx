import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { t } from "@/modules/shared/i18n";
import { useSubscribe } from "@/modules/shared/hooks/useSubscribe";


/* ── Sparks (mirrors LoginPage) ── */
const sparks = [
  { top: "8%",  left: "6%",  delay: "0s",   dur: "2.6s" },
  { top: "18%", left: "85%", delay: "0.7s", dur: "2.1s" },
  { top: "70%", left: "10%", delay: "1.2s", dur: "2.8s" },
  { top: "78%", left: "88%", delay: "0.4s", dur: "2.3s" },
];

const slides = [
  { key: "slide1", image: "https://cdn.zaheen.com.pk/zaheen-web-img/banner1.jpeg", plan: "205" },
  { key: "slide2", image: "https://cdn.zaheen.com.pk/zaheen-web-img/banner2.jpeg", plan: "206" },
  { key: "slide3", image: "https://cdn.zaheen.com.pk/zaheen-web-img/banner3.jpeg", plan: "207" },
  { key: "slide4", image: "https://cdn.zaheen.com.pk/zaheen-web-img/MDCAT.png", plan: "208" },
];

const HeroMobile = () => {
  const [current, setCurrent] = useState(0);
  const { handleSubscribe } = useSubscribe();
  const { isLoggedIn } = useAuth();

  const mzaActive = sessionStorage.getItem("mzaStatus") === "ACTIVE";
  const isSubscribed = isLoggedIn || mzaActive;

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="lg:hidden pb-6 relative overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/50 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(251,191,36,0.05) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          {/* IMAGE */}
          <img
            src={slides[current].image}
            alt="Zaheen"
            className="w-full h-[230px] object-cover"
            style={{ opacity: 0.85 }}
          />

          {/* CONTENT */}
          <div
            className="px-5 py-6 mx-4 mt-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
              Zaheen Learning
            </p>

            <h2 className="text-2xl font-bold text-white mb-2">
              {t(`${slides[current].key}.title`)}{" "}
              <span style={{ color: "#F0B429" }}>
                {t(`${slides[current].key}.highlight`)}
              </span>
            </h2>

            <p className="text-slate-400 text-sm mb-6">
              {t(`${slides[current].key}.description`)}
            </p>

            {/* SUBSCRIBE BUTTON */}
            {!isSubscribed && (
              <button
                onClick={handleSubscribe}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 20px rgba(240,180,41,0.35)",
                }}
              >
                {t(`${slides[current].key}.button`)}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* INDICATORS */}
      <div className="flex justify-center gap-2 mt-5 relative z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: current === i ? 32 : 12,
              background: current === i ? "#F0B429" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroMobile;