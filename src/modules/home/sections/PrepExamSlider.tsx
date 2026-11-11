import React from "react";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const mdcatImg = "https://cdn.zaheen.com.pk/images/mdcat-prep-small.png";
const natImg = "https://cdn.zaheen.com.pk/images/nat-prep-small.png";
const issbImg = "https://cdn.zaheen.com.pk/images/issb-prep-small.png";
const uniImg = "https://cdn.zaheen.com.pk/images/uni-prep.png";

const lang = localStorage.getItem("lang") || "en";

interface PrepModule {
  id: string;
  title_en: string;
  title_ur: string;
  image: string;
  href: string;
  external: boolean; // true = separate app, opens in a new tab
}

const MODULES: PrepModule[] = [
  {
    id: "mdcat",
    title_en: "MDCAT Preparation",
    title_ur: "ایم ڈی کیٹ کی تیاری",
    image: mdcatImg,
    href: "/mdcat", // lives inside Zaheen
    external: false,
  },
  {
    id: "nat",
    title_en: "NAT Preparation",
    title_ur: "این اے ٹی کی تیاری",
    image: natImg,
    href: "https://zaheen.com.pk/nat/", // separate folder/app
    external: true,
  },
  {
    id: "uniprep",
    title_en: "University Preparation",
    title_ur: "یونیورسٹی کی تیاری",
    image: uniImg,
    href: "https://zaheen.com.pk/uniprep/", // separate folder/app
    external: true,
  },
  {
    id: "issb",
    title_en: "ISSB Preparation",
    title_ur: "آئی ایس ایس بی کی تیاری",
    image: issbImg,
    href: "https://zaheen.com.pk/issb/", // separate folder/app
    external: true,
  },
];

const PrepExamSlider = () => {
  const navigate = useNavigate();

  const handleOpen = (m: PrepModule) => {
    if (m.external) {
      window.open(m.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(m.href);
    }
  };

  return (
    <section
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "2.5rem" }} />
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {lang === "ur" ? "ٹیسٹ کی تیاری" : "Test Preparation"}
            </h2>
            <p className="text-slate-400 mt-2">
              {lang === "ur"
                ? "پاکستان کے سب سے اہم قومی امتحانات کی تیاری کریں"
                : "Prepare for Pakistan's top national exams"}
            </p>
          </div>

          <button
            onClick={() => navigate("/prep-exam")}
            className="flex items-center gap-2 font-semibold text-sm md:text-base transition-colors group shrink-0 ml-4"
            style={{ color: "#F0B429" }}
          >
            {lang === "ur" ? "تمام امتحانات دیکھیں" : "View All Exams"}
            <ArrowRight
              size={18}
              className={`transition-transform
                ${lang === "ur"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
                }`}
            />
          </button>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-10">

        {/* NAV ARROWS (unique class names so they don't control the Professional Courses slider) */}
        <button
          className="prep-prev-btn absolute left-0 md:-left-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          className="prep-next-btn absolute right-0 md:-right-0 top-1/2 -translate-y-1/2 z-40
                     text-slate-900 shadow-xl p-3 md:p-2 rounded-full
                     transition-all duration-300 active:scale-90 group"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)" }}
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <Swiper
          modules={[Navigation, Autoplay, Mousewheel, Pagination]}
          spaceBetween={25}
          slidesPerView={1.2}
          slidesPerGroup={1}
          loop={MODULES.length > 3} // loop needs more slides than slidesPerView (3)
          grabCursor={true}
          speed={800}
          mousewheel={{ forceToAxis: true, sensitivity: 1, thresholdDelta: 20, thresholdTime: 400 }}
          navigation={{ prevEl: ".prep-prev-btn", nextEl: ".prep-next-btn" }}
          breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } }}
          style={{ height: "100%" }}
          className="pb-12 !px-2"
        >
          {MODULES.map((m) => (
            <SwiperSlide key={m.id} className="py-5 !h-auto">
              <div
                onClick={() => handleOpen(m)}
                className="rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-12px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 25px 50px -12px rgba(240,180,41,0.15)";
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(240,180,41,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.08)";
                }}
              >
                <div className="relative h-48 md:h-56 flex-shrink-0">
                  <img
                    src={m.image}
                    alt={m.title_en}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-grow justify-between">
                  <h3 className="font-bold text-white line-clamp-2 text-lg">
                    {lang === "ur" ? m.title_ur : m.title_en}
                  </h3>
                  <div
                    className="flex justify-between items-center text-sm pt-4 mt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center font-bold" style={{ color: "#F0B429" }}>
                      <Star size={16} fill="currentColor" className="mr-1" />
                      5.0
                    </div>
                    <div
                      className="flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}
                    >
                      <ArrowRight size={14} className="mr-1.5" />
                      {lang === "ur" ? "تیاری شروع کریں" : "Enter pathway"}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PrepExamSlider;