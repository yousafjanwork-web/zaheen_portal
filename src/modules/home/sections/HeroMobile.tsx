import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { t } from "@/modules/shared/i18n";
import { useSubscribe } from "@/modules/shared/hooks/useSubscribe";

import banner1 from "@/assets/images/banner1.jpeg";
import banner2 from "@/assets/images/banner2.jpeg";
import banner3 from "@/assets/images/banner3.jpeg";

const slides = [
  { key: "slide1", image: banner1, plan: "205" },
  { key: "slide2", image: banner2, plan: "206" },
  { key: "slide3", image: banner3, plan: "207" }
];

const HeroMobile = () => {

  const [current, setCurrent] = useState(0);
    const { handleSubscribe } = useSubscribe();
  const { isLoggedIn } = useAuth();
 

  const next = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  useEffect(() => {

    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);

  }, []);

 

  return (

    <section className="lg:hidden bg-gray-100 pb-6">

      <AnimatePresence mode="wait">

        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >

          {/* IMAGE */}

          <img
            src={slides[current].image}
            alt="Zaheen"
            className="w-full h-[230px] object-cover"
          />

          {/* CONTENT */}

          <div className="px-5 py-6 bg-white">

            <h2 className="text-2xl font-bold text-slate-900 mb-2">

              {t(`${slides[current].key}.title`)}{" "}
              <span className="text-primary">
                {t(`${slides[current].key}.highlight`)}
              </span>

            </h2>

            <p className="text-slate-600 text-sm mb-6">

              {t(`${slides[current].key}.description`)}

            </p>

            {/* BUTTON */}

            {!isLoggedIn && (

              <button
                onClick={handleSubscribe}
                className="w-full py-4 rounded-xl text-white font-semibold text-lg
                bg-gradient-to-r from-purple-600 to-blue-500 shadow-md"
              >

                {t(`${slides[current].key}.button`)}

              </button>

            )}

          </div>

        </motion.div>

      </AnimatePresence>

      {/* INDICATORS */}

      <div className="flex justify-center gap-2 mt-4">

        {slides.map((_, i) => (

          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              current === i ? "w-8 bg-blue-600" : "w-3 bg-gray-300"
            }`}
          />

        ))}

      </div>

    </section>

  );

};

export default HeroMobile;