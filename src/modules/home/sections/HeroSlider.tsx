import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";

/* ── Shared spark positions (mirrors LoginPage) ── */
const sparks = [
  { top: "12%", left: "8%",  delay: "0s",   dur: "2.6s" },
  { top: "22%", left: "88%", delay: "0.7s", dur: "2.1s" },
  { top: "72%", left: "14%", delay: "1.2s", dur: "2.8s" },
  { top: "80%", left: "90%", delay: "0.4s", dur: "2.3s" },
  { top: "10%", left: "55%", delay: "1.5s", dur: "2.0s" },
  { top: "62%", left: "47%", delay: "0.9s", dur: "2.5s" },
];

const slides = [
  { id: 1, image: "https://cdn.zaheen.com.pk/zaheen-web-img/kgbanr.png" },
  { id: 2, image: "https://cdn.zaheen.com.pk/zaheen-web-img/grade1-5banr.png" },
  { id: 3, image: "https://cdn.zaheen.com.pk/zaheen-web-img/tradbannew.png" },
  { id: 4, image: "https://cdn.zaheen.com.pk/zaheen-web-img/webdevbaners.png" },
  { id: 5, image: "https://cdn.zaheen.com.pk/zaheen-web-img/kgbannr2.png" },
  { id: 6, image: "https://cdn.zaheen.com.pk/zaheen-web-img/grade1-5newban2.png" },
  { id: 7, image: "https://cdn.zaheen.com.pk/zaheen-web-img/webbanner2.png" },
  { id: 8, image: "https://cdn.zaheen.com.pk/zaheen-web-img/mdcatbanrr.png" },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
  };

  const resetAutoSlide = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  const next = () => { setCurrent(prev => (prev + 1) % slides.length); resetAutoSlide(); };
  const prev = () => { setCurrent(prev => (prev - 1 + slides.length) % slides.length); resetAutoSlide(); };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const slideKey = `hero.slide${slides[current].id}`;

  return (
    <section
      className="relative overflow-hidden h-[600px] lg:h-[700px] group"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
    >
      {/* Ambient glow — mirrors login page radial */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(251,191,36,0.06) 0%, transparent 70%)",
        }}
      />

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

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-10"
        >
         <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

              {/* TEXT */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight">
                  {t(`${slideKey}.title`)}{" "}
                  <br />
                  <span style={{ color: "#F0B429" }}>
                    {t(`${slideKey}.highlight`)}
                  </span>
                </h1>

                <p className="text-lg text-slate-300 mb-8 max-w-lg">
                  {t(`${slideKey}.description`)}
                </p>

                {/* Yellow button — matches LoginPage PrimaryBtn */}
                <button
                  onClick={() => navigate(t(`${slideKey}.link`))}
                  className="px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #F0B429, #f59e0b)",
                    color: "#0f172a",
                    boxShadow: "0 4px 20px rgba(240,180,41,0.4)",
                  }}
                >
                  {t(`${slideKey}.button`)}
                </button>
              </motion.div>

              {/* IMAGE */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:block"
              >
                <img src={slides[current].image} className="rounded-3xl w-full" alt="slide" />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LEFT ARROW */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={prev}
          className="p-3 rounded-full transition"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      {/* RIGHT ARROW */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={next}
          className="p-3 rounded-full transition"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetAutoSlide(); }}
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: current === i ? 32 : 12,
              background: current === i ? "#F0B429" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;