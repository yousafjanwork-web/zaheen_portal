import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";
const slides = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxZHw80WOsH9-52qQ_fdGk8dVdHwjDILG_kLSgg57DCn1Yq_eOWGhh3dvRGG_L2KMf523KAP5GoxDQlHNvjVtc6Q6X6hIY1dBH_m6izIWpMckAi6p6fTo7b8K6LIpitEqcwuJJLb_-sGvQi1IeuT69g7QIEBPXTiie0nj6gR5dUvSam-849yRYS1zcc3cfA3-_1OhkhZ6WslhourVckuP7wVPiS9HRjfGL338xhY2jQrRZQavcYMgx1zFWaH6MWovkx5JMNxZSZhf7",
    accentColor: "text-primary",
    bgColor: "bg-primary"
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiyEF6B4PIAtfDJYQ4n3gSsGQYM4pt71ui3LrryXFc1IfqTLAvNIyvpF5rcJsvYobto4-XNeG2FbGxQ98V9AH_DTwN5pxHXtHUHwC5_6L9NJx13tO3ut467KPhPQGp36q4il_q70bWH00u0UcYVEW3BfE_uLix3sWuE9aFmg1_aUoN4Wh9kbPBPhR189fli2iNe8n0_0IqFH-GHWaGVQKDLBvg7TiBs9MGti2iqKlClY6ugaUuQs2cPeFKu3YanDz8eGmSb_FBtlbU",
    accentColor: "text-secondary",
    bgColor: "bg-secondary"
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
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

              {/* Text */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4">

                  {t(`${slideKey}.title`).split(" ").slice(0, -1).join(" ")}{" "}
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

              {/* Image */}
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

      {/* arrows */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <button onClick={prev} className="p-3 rounded-full bg-white/20">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <button onClick={next} className="p-3 rounded-full bg-white/20">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${current === i ? "bg-primary w-8" : "bg-white/40"
              }`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroSlider;