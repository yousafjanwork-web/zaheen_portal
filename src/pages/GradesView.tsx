import React from "react";
import { LayoutDashboard, BookOpen, FileText, FolderOpen, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

/* ---------- WELCOME TITLES ---------- */

const welcomeTitles = {
  kg: { en: "KG", ur: "کے جی" },
  "1-5": { en: "Grades 1-5", ur: "گریڈ ۱-۵" },
  "6-8": { en: "Grades 6-8", ur: "گریڈ ۶-۸" },
  "9-12": { en: "Grades 9-12", ur: "گریڈ ۹-۱۲" }
};

/* ---------- SUBJECTS ---------- */

const subjectsByType = {
  kg: [
    "English Speaking",
    "English Learning",
    "English Writing",
    "Math Speaking",
    "Math Learning",
    "Math Writing",
    "Urdu"
  ],

  "1-5": [
    "English",
    "Urdu",
    "Math",
    "General Science"
  ],

  "6-8": [
    "English",
    "Urdu",
    "Math",
    "General Science"
  ],

  "9-12": [
    "English",
    "Urdu",
    "Math",
    "Computer",
    "Biology",
    "Chemistry",
    "Physics",
    "Islamiat"
  ]
};

/* ---------- DATA ---------- */

const gradeData = {

  kg: [
    {
      title: "KG | کے جی",
      lessons: "30 Lessons | ۳۰ اسباق",
      description: "Early childhood learning and foundational skills.",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350"
    }
  ],

  "1-5": [
    {
      title: "Grade 1 | گریڈ ۱",
      lessons: "45 Lessons | ۴۵ اسباق",
      description: "Foundation level learning for young explorers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqNFAJMqAKPAge-4O46yg__cNiFdcTxiO9QIUUj3Hd3VZyO6Ev7Jlvg0kBIdv3RY8n_wC-uwwHBaGkRhrCt5Ozv47W_5TCE-keBp91bAQH4AUJXzzKgZiARaEhKPve5FivsxCrqdtApmrS758lpIeavkj6SWqcZ6xblRvxZjU2pYhFHCXBr3mu1EbS4lHT718bo23-60sxTIYUqmXZKvbymhZFXqXBPmQQb0VqM7JOTMTlkhOoqkU8tV_YIMQLUU27eAkHhDIo0R4c"
    },
    {
      title: "Grade 2 | گریڈ ۲",
      lessons: "50 Lessons | ۵۰ اسباق",
      description: "Developing essential skills in literacy and numeracy.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPpd0wU5UhrRX7Y5busOkB-H3lICUrRhcHzvHZ6AUHJXJWc4DSYysSoINtwINjs5fITwAMdz3-KxsGLO5kzbG7w8fc3w4jIr3AU2FMCOIKP8nBPJOxu1Isl5dFylCUedIQD__RfzktGNRYETQG-oCXwxuj9lOgT9twIPAWtO5FjQxaPfeyjquQfVeJv0o08OrjhhYcAef2WjaaWhcE-f-diTxJuZwLo2IP-QTbm8EFcgi-9W9YWSyv10VM3WL7Q4y4bhJuzzfOgqQQ"
    },
    {
      title: "Grade 3 | گریڈ ۳",
      lessons: "48 Lessons | ۴۸ اسباق",
      description: "Expanding horizons with science and creative urdu.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOe4dNkqkF6qLvS80TPLVynJvlAholFrD4sGDHz48yYDf7d1_HOw0ommd2oBDvkPJ1U2OJmJFKxm9I_dFh0AcLcE1y7jw79h3pFb3Bco4v-r97H_GJP5tjHd15ZxkILSWygZK8rMTNPU-6hLmieQMvrU3XL8kn4B4J2FrdAXZRiyoMxp4hCIK_eu-3dFR-4594TcrmA3mlqUVFNy3PK_LIZFxrq8nS_6OOm9w5G40y2KPEG1Lve1f0p35ItpbBNn7HFsMVMa11HRjO"
    },
    {
      title: "Grade 4 | گریڈ ۴",
      lessons: "52 Lessons | ۵۲ اسباق",
      description: "Building complex problem-solving abilities.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD20gZz8UFz6oAMp8txbpfgx5KPA0ARD8yPv3GDuFu41T8SaxGuT0O1x53Lm8cdEn318PfaAtczoVzE8qqTzT0VfCxRjU5cdF5YZcm4325fFLcxJ64yBQP8SyQYmVxkVWrogp84exv5H8VVceKLWppSDwaILpiHoNcGCc47cOT9uHGHtTbvsGLKDd2U9bx98lvM-XEAfyGYfbTsy3XtFYMDIeYrDacj1i-fi1T0DDfZ17OAvLMY50XbdkLZM3yLebSf9OKEvaAHhPbY"
    },
    {
      title: "Grade 5 | گریڈ ۵",
      lessons: "55 Lessons | ۵۵ اسباق",
      description: "Preparing for the transition to middle school.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxoZSMyV-Yw5z6BGzpkU71vsbY9dIC9YX0HMbxLQHcgGT66w43v9MHJPhrjQaDvJhkWz0gXsRCu72eUiE7mRUav5KYDfHgUPaaX27LTur5XtMuQHZIRyUw6SFl8n7yx9wmejsElGjOgq74c3BpkCcMKk8yfhIH5S2gl8JcsNPOz6Xo-t9TtOkJgtark04oaObqaj0Z9O5OHG5NjkRYR4BQ0DSZTrKEiVfARpf8CQknouQgJnTelI-L8tOP5MOLTjxv33cmcXPHlALM"
    }
  ],

  "6-8": [
    {
      title: "Grade 6 | گریڈ ۶",
      lessons: "60 Lessons | ۶۰ اسباق",
      description: "Advancing knowledge across core subjects.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7"
    },
    {
      title: "Grade 7 | گریڈ ۷",
      lessons: "62 Lessons | ۶۲ اسباق",
      description: "Strengthening analytical and problem-solving skills.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
    },
    {
      title: "Grade 8 | گریڈ ۸",
      lessons: "65 Lessons | ۶۵ اسباق",
      description: "Preparing for advanced secondary education.",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350"
    }
  ],

  "9-12": [
    {
      title: "Grade 9 | گریڈ ۹",
      lessons: "70 Lessons | ۷۰ اسباق",
      description: "Secondary level learning foundations.",
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0"
    },
    {
      title: "Grade 10 | گریڈ ۱۰",
      lessons: "72 Lessons | ۷۲ اسباق",
      description: "Preparation for board examinations.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7"
    },
    {
      title: "Grade 11 | گریڈ ۱۱",
      lessons: "75 Lessons | ۷۵ اسباق",
      description: "Specialized streams and advanced concepts.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
    },
    {
      title: "Grade 12 | گریڈ ۱۲",
      lessons: "80 Lessons | ۸۰ اسباق",
      description: "Final preparation for higher education.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
    }
  ]

};

const GradesView = () => {

  const { type } = useParams();

  const grades = gradeData[type] || [];
  const title = welcomeTitles[type] || welcomeTitles["1-5"];
  const subjects = subjectsByType[type] || [];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Section */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">

          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              {title.en} | <span className="text-primary">{title.ur}</span>
            </h1>

            <p className="text-lg text-slate-600 mt-2 max-w-2xl">
              Select your grade to start learning in English and Urdu.
              High-quality educational content designed for primary school students.
            </p>

            <p className="text-sm text-slate-500 mt-1">
              انگریزی اور اردو میں سیکھنا شروع کرنے کے لیے اپنے گریڈ کا انتخاب کریں۔
            </p>
          </div>

          <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition">
            Explore All Courses
          </button>

        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}

          <aside className="w-full lg:w-64 flex flex-col gap-3">

            <div className="p-3 rounded-xl bg-primary text-white flex items-center gap-3">
              <LayoutDashboard size={18} />
              Dashboard | ڈیش بورڈ
            </div>

            <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer">
              <BookOpen size={18} />
              My Courses | میرے کورسز
            </div>

            <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer">
              <FileText size={18} />
              Assessments | امتحانات
            </div>

            <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer">
              <FolderOpen size={18} />
              Resources | وسائل
            </div>

            <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer">
              <Settings size={18} />
              Settings | ترتیبات
            </div>

          </aside>

          {/* Grades Grid */}

          <div className="flex-1">

            <h2 className="text-2xl font-bold mb-8">
              Select Your Grade | اپنے گریڈ کا انتخاب کریں
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {grades.map((grade, index) => (

                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-5 border hover:border-primary/50 shadow-sm hover:shadow-xl cursor-pointer"
                >

                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative">

                    <img
                      src={grade.image}
                      alt={grade.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary border">
                      {grade.lessons}
                    </div>

                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {grade.title}
                  </h3>

                  <p className="text-sm text-slate-500 mb-4">
                    {grade.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">

                    {subjects.map((subject, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg">
                        {subject}
                      </span>
                    ))}

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default GradesView;