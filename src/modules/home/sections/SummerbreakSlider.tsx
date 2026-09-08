import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cosmokidImg = "https://cdn.zaheen.com.pk/zaheen-web-img/solar2.png";
const pakdesk = "https://cdn.zaheen.com.pk/zaheen-web-img/pakdesk.png";
const origami = "https://cdn.zaheen.com.pk/zaheen-web-img/origami.png";
const vocabImg = "https://cdn.zaheen.com.pk/zaheen-web-img/vocab1.png";

const lang = localStorage.getItem("lang") || "en";

const modules = [
  {
    name: "🏔️ Let's Discover Pakistan",
    urdu_name: " 🏔️ آئیے پاکستان کو دریافت کریں",
    path: "/pakistan",
    image: pakdesk,
  },
  {
    name: "📚 Grammar Adventure",
    urdu_name: " 📚 گرامر کی مہم ",
    path: "/vocab",
    image: vocabImg,
  },
  {
    name: "✂️ Creative Adventure",
    urdu_name: "✂️تخلیقی مہمات ",
    path: "/origami",
    image: origami,
  },
  {
    name: "🚀 Space Adventure",
    urdu_name: " 🚀 خلائی دریافت",
    path: "/cosmokid",
    image: cosmokidImg,
  },
];

const SummerBreak = () => {
  const navigate = useNavigate();

  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Subtle divider line */}
      <div
        className="max-w-7xl mx-auto px-6 mb-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0" }}
      />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          {t("summerBreak.title")}
        </h2>
        <p className="text-slate-400 mt-2">
          {t("summerBreak.subtitle")}
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10">

        {/* NAV ARROWS — amber to match login yellow buttons */}
        <button
          className="prev-btn-summer absolute left-0 md:-left-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          className="next-btn-summer absolute right-0 md:-right-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, Pagination]}
          spaceBetween={25}
          slidesPerView={1.2}
          slidesPerGroup={1}
          loop={modules.length > 3}
          watchOverflow={false}
          grabCursor={true}
          speed={800}
          mousewheel={{ forceToAxis: true, sensitivity: 1, thresholdDelta: 20, thresholdTime: 400 }}
          navigation={{ prevEl: ".prev-btn-summer", nextEl: ".next-btn-summer" }}
          breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } }}
          style={{ height: "100%" }}
          className="pb-12 !px-2"
        >
          {modules.map((mod, i) => (
            <SwiperSlide key={i} className="py-5 !h-auto">
              <div
                onClick={() => { navigate(mod.path); window.scrollTo(0, 0); }}
                className="rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full
                           transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 25px 50px -12px rgba(240,180,41,0.15)";
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(240,180,41,0.25)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.08)";
                }}
              >
                {/* IMAGE */}
                <div className="relative h-48 md:h-56 flex-shrink-0">
                  <img
                    src={mod.image}
                    alt={mod.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-white text-lg text-center">
                    {lang === "ur" ? mod.urdu_name : mod.name}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SummerBreak;