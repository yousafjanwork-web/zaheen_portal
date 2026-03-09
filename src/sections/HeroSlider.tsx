import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const slides = [
  {
    id: 1,
    title: "Unlock Your Potential from KG to Grade 12",
    arabicTitle: "ذہین کے ساتھ اپنی صلاحیتوں کو اجاگر کریں",
    description: "Personalized learning paths for every student with video lectures, assignments, and quizzes.",
    buttonText: "Explore K-12 Curriculum",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxZHw80WOsH9-52qQ_fdGk8dVdHwjDILG_kLSgg57DCn1Yq_eOWGhh3dvRGG_L2KMf523KAP5GoxDQlHNvjVtc6Q6X6hIY1dBH_m6izIWpMckAi6p6fTo7b8K6LIpitEqcwuJJLb_-sGvQi1IeuT69g7QIEBPXTiie0nj6gR5dUvSam-849yRYS1zcc3cfA3-_1OhkhZ6WslhourVckuP7wVPiS9HRjfGL338xhY2jQrRZQavcYMgx1zFWaH6MWovkx5JMNxZSZhf7",
    accentColor: "text-primary",
    bgColor: "bg-primary"
  },
  {
    id: 2,
    title: "Master High-Demand Skills",
    arabicTitle: "پیشہ ورانہ مہارتوں میں کمال حاصل کریں",
    description: "Advance your career with industry-recognized certifications in Digital Marketing, Web Development, and more.",
    buttonText: "Browse Professional Courses",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiyEF6B4PIAtfDJYQ4n3gSsGQYM4pt71ui3LrryXFc1IfqTLAvNIyvpF5rcJsvYobto4-XNeG2FbGxQ98V9AH_DTwN5pxHXtHUHwC5_6L9NJx13tO3ut467KPhPQGp36q4il_q70bWH00u0UcYVEW3BfE_uLix3sWuE9aFmg1_aUoN4Wh9kbPBPhR189fli2iNe8n0_0IqFH-GHWaGVQKDLBvg7TiBs9MGti2iqKlClY6ugaUuQs2cPeFKu3YanDz8eGmSb_FBtlbU",
    accentColor: "text-secondary",
    bgColor: "bg-secondary"
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden hero-gradient h-[600px] lg:h-[700px] group" id="hero-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 dark:text-white">
                  {slides[current].id === 1 ? (
                    <>Unlock Your <span className="text-primary">Potential</span> from KG to Grade 12</>
                  ) : (
                    <>Master <span className="text-secondary">High-Demand</span> Skills</>
                  )}
                </h1>
                <p className={`arabic-text text-xl md:text-2xl font-medium mb-6 ${slides[current].accentColor}`}>
                  {slides[current].arabicTitle}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
                  {slides[current].description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className={`px-8 py-4 ${slides[current].bgColor} text-white font-bold rounded-xl shadow-xl hover:scale-105 transition-transform`}>
                    {slides[current].buttonText}
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative hidden lg:block"
              >
                <img 
                  src={slides[current].image} 
                  alt={slides[current].title} 
                  className="rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 w-full object-cover aspect-[4/3]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Navigation Arrows */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={prev}
          className="p-3 rounded-full bg-white/50 backdrop-blur-md border border-white dark:bg-slate-800/50 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-white"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button 
          onClick={next}
          className="p-3 rounded-full bg-white/50 backdrop-blur-md border border-white dark:bg-slate-800/50 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-800 dark:text-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === i ? 'bg-primary w-8' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
export default HeroSlider;