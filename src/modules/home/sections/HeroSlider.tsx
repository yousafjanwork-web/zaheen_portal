import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";

import tradeBanner from "@/assets/images/trading-banner.jpeg";
import kgBanner from "@/assets/images/kg-kids-1.jpeg";
import onetofiveBanner from "@/assets/images/class-1-5.jpeg";
import webBanner from "@/assets/images/web-development.jpeg";

const slides = [
  { id: 1, image: kgBanner, accentColor: "text-primary", bgColor: "bg-primary" },
  { id: 2, image: onetofiveBanner, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 3, image: tradeBanner, accentColor: "text-secondary", bgColor: "bg-secondary" },
  { id: 4, image: webBanner, accentColor: "text-secondary", bgColor: "bg-secondary" }
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

  const next = () => {
    setCurrent(prev => (prev + 1) % slides.length);
    resetAutoSlide();
  };

  const prev = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    resetAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const slideKey = `hero.slide${slides[current].id}`;

  return (
    <section className="relative overflow-hidden h-[600px] lg:h-[700px] group bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">

      <div className="absolute inset-0 bg-black/40 z-0"></div>

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
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                  {t(`${slideKey}.title`)}{" "}
                  <span className={slides[current].accentColor}>
                    {t(`${slideKey}.highlight`)}
                  </span>
                </h1>

                <p className="text-lg text-slate-200 mb-8 max-w-lg">
                  {t(`${slideKey}.description`)}
                </p>

                <button
                  className={`px-8 py-4 ${slides[current].bgColor} rounded-xl font-bold shadow-xl hover:scale-105 transition`}
                  onClick={() => navigate(t(`${slideKey}.link`))}
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
                <img
                  src={slides[current].image}
                  className="rounded-3xl shadow-2xl border border-white/20 w-full"
                />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LEFT ARROW */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* RIGHT ARROW */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={next}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              resetAutoSlide();
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-primary w-8" : "bg-white/40 w-3"
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSlider;