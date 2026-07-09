import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "@/modules/shared/i18n";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// TODO: point these at your actual files in the images folder.
import cosmokidImg from "@/assets/images/solar2.png";



import origami from "@/assets/images/origami.png";



import vocabImg from "@/assets/images/vocab1.png";
const lang = localStorage.getItem("lang") || "en";

// Static modules — update names/paths/images as needed.
// "path" is where the card navigates to on click.
const modules = [
    {
    name: "📚 Word Builder",
    urdu_name: " 📚 الفاظ سیکھیں",
    path: "/vocab",
    image: vocabImg,
  },
  
  {
    name: "✂️ Origami Fun", 
    urdu_name: "✂️ اوریگامی کا مزہ", 
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
    <section className="py-16 md:py-24 bg-orange-50 overflow-hidden">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {t("summerBreak.title")}
          </h2>
          <p className="text-slate-500 mt-2">
            {t("summerBreak.subtitle")}
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10">

        {/* NAVIGATION ARROWS */}
        <button className="prev-btn-summer absolute left-0 md:-left-0 top-1/2 -translate-y-1/2 z-40
                           bg-orange-500 text-white shadow-xl p-3 md:p-2 rounded-full
                           hover:bg-orange-600 transition-all duration-300 active:scale-90
                           animate-pulse hover:animate-none group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button className="next-btn-summer absolute right-0 md:-right-0 top-1/2 -translate-y-1/2 z-40
                           bg-orange-500 text-white shadow-xl p-3 md:p-2 rounded-full
                           hover:bg-orange-600 transition-all duration-300 active:scale-90
                           animate-pulse hover:animate-none group">
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* SWIPER SLIDER */}
        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, Pagination]}
          spaceBetween={25}
          slidesPerView={1.2}
          slidesPerGroup={1}
          loop={modules.length > 3}
          watchOverflow={false}
          grabCursor={true}
          speed={800}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            thresholdDelta: 20,
            thresholdTime: 400,
          }}
          navigation={{
            prevEl: ".prev-btn-summer",
            nextEl: ".next-btn-summer",
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ height: '100%' }}
          className="pb-12 !px-2"
        >
          {modules.map((mod, i) => (
            <SwiperSlide key={i} className="py-5 !h-auto">
              <div
                onClick={() => {
                  navigate(mod.path);
                  window.scrollTo(0, 0);
                }}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer
                           border border-orange-100 flex flex-col h-full
                           transition-all duration-400 ease-out
                           hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
              >
                {/* IMAGE */}
                <div className="relative h-48 md:h-56 flex-shrink-0">
                  <img
                    src={mod.image}
                    alt={mod.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-slate-900 text-lg text-center">
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