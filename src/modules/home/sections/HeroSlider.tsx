import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
import tradeBanner from "@/assets/images/tradin-banner.png";
import kgBanner from "@/assets/images/kg-banner.png";
import onetofiveBanner from "@/assets/images/grade-1-5.png";
import webBanner from "@/assets/images/web-banner.png";
import kgbanner2 from "@/assets/images/kg-banner-2.png";
import bannerontofive2 from "@/assets/images/grade-1-5-banner-2.png";
import webBanner2 from "@/assets/images/web-banner-2.png";


const slides = [
  { id: 1, image: kgBanner, accentColor: "text-primary", bgColor: "bg-primary" },
  { id: 2, image: onetofiveBanner, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 3, image: tradeBanner, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 4, image: webBanner, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 5, image: kgbanner2, accentColor: "text-primary", bgColor: "bg-primary" },
  { id: 6, image: bannerontofive2, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 7, image: webBanner2, accentColor: "text-secondary", bgColor: "bg-secondary" },

=======
import tradeBanner from "@/assets/images/tradbannew.png";
import kgBanner from "@/assets/images/kgbanr.png";
import onetofiveBanner from "@/assets/images/grade1-5banr.png";
import webBanner from "@/assets/images/webdevbaners.png";
import kgbanner2 from "@/assets/images/kgbannr2.png";
import bannerontofive2 from "@/assets/images/grade1-5newban2.png";
import webBanner2 from "@/assets/images/webbanner2.png";
import mdcat from "@/assets/images/mdcatbanrr.png";

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
  { id: 1, image: kgBanner },
  { id: 2, image: onetofiveBanner },
  { id: 3, image: tradeBanner },
  { id: 4, image: webBanner },
  { id: 5, image: kgbanner2 },
  { id: 6, image: bannerontofive2 },
  { id: 7, image: webBanner2 },
  { id: 8, image: mdcat },
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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

<<<<<<< HEAD
  const next = () => {
    setCurrent(prev => (prev + 1) % slides.length);
    resetAutoSlide();
  };

  const prev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    resetAutoSlide();
  };
=======
  const next = () => { setCurrent(prev => (prev + 1) % slides.length); resetAutoSlide(); };
  const prev = () => { setCurrent(prev => (prev - 1 + slides.length) % slides.length); resetAutoSlide(); };
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

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
<<<<<<< HEAD
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                  {t(`${slideKey}.title`)}{" "} <br></br>
                  <span className={slides[current].accentColor}>
=======
              

                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight">
                  {t(`${slideKey}.title`)}{" "}
                  <br />
                  <span style={{ color: "#F0B429" }}>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
                    {t(`${slideKey}.highlight`)}
                  </span>
                </h1>

                <p className="text-lg text-slate-300 mb-8 max-w-lg">
                  {t(`${slideKey}.description`)}
                </p>

                {/* Yellow button — matches LoginPage PrimaryBtn */}
                <button
<<<<<<< HEAD
                  className={`px-8 py-4 ${slides[current].bgColor} rounded-xl font-bold shadow-xl hover:scale-105 transition`}
                  onClick={() => navigate(t(`${slideKey}.link`))}
=======
                  onClick={() => navigate(t(`${slideKey}.link`))}
                  className="px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #F0B429, #f59e0b)",
                    color: "#0f172a",
                    boxShadow: "0 4px 20px rgba(240,180,41,0.4)",
                  }}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
                <img
                  src={slides[current].image}
                  className="rounded-3xl w-full"
                />
=======
                <img src={slides[current].image} className="rounded-3xl w-full" alt="slide" />
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LEFT ARROW */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={prev}
<<<<<<< HEAD
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          <ChevronLeft size={24} />
=======
          className="p-3 rounded-full transition"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronLeft size={24} className="text-white" />
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        </button>
      </div>

      {/* RIGHT ARROW */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={next}
<<<<<<< HEAD
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          <ChevronRight size={24} />
=======
          className="p-3 rounded-full transition"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ChevronRight size={24} className="text-white" />
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        </button>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
<<<<<<< HEAD
            onClick={() => {
              setCurrent(i);
              resetAutoSlide();
            }}
            className={`h-3 rounded-full transition-all duration-300 ${current === i ? "bg-primary w-8" : "bg-white/40 w-3"
              }`}
=======
            onClick={() => { setCurrent(i); resetAutoSlide(); }}
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: current === i ? 32 : 12,
              background: current === i ? "#F0B429" : "rgba(255,255,255,0.3)",
            }}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;