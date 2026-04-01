import React, { useEffect, useState } from "react";
import { BookOpen, Brain, Pencil, Shapes, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { useSearchParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const PracticeCornerPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const sectionMap = {
    kg: isUrdu ? "کے جی" : "KG",
    "1-5": isUrdu ? "گریڈ ۱-۵" : "Grades 1-5",
    "6-8": isUrdu ? "گریڈ ۶-۸" : "Grades 6-8",
    "9-12": isUrdu ? "گریڈ ۹-۱۲" : "Grades 9-12",
  };



  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch(
        "https://api.zaheen.com.pk/api//fetch-all-subjects/1"
      );
      const data = await res.json();

      setClasses(data);

      // 🔥 Mapping logic
      let targetId = null;

      if (section === "kg") targetId = 1;
      else if (section === "1-5") targetId = 2;
      else if (section === "6-8") targetId = 7;
      else if (section === "9-12") targetId = 10;

      // ✅ Find matching class
      const foundClass =
        data.find((c: any) => c.class_id === targetId) || data[0];

      setSelectedClass(foundClass);
    };

    fetchClasses();
  }, [section]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section]);

  const subjectIcons = [BookOpen, Brain, Pencil, Shapes, Sparkles];

  return (
    <section className="bg-slate-50 min-h-screen py-16">


      <div className="max-w-7xl mx-auto px-4 sm:px-2">
        {/* ================== BREADCRUMBS ================== */}

        <div className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">
            {isUrdu ? "ہوم" : "Home"}
          </Link>

          <span>/</span>

          <Link
            to={`/grades/${section}`}
            className="hover:text-primary"
          >
            {sectionMap[section] || (isUrdu ? "گریڈز" : "Grades")}
          </Link>

          <span>/</span>

          <span className="text-slate-700 font-medium">
            {isUrdu ? "پریکٹس کارنر" : "Practice Corner"}
          </span>
        </div>
        {/* ================== HERO ================== */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-12 
                            p-3 sm:p-4 md:p-6 lg:p-8 
                            rounded-3xl bg-primary/5 border border-primary/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 w-full">
            {/* MAIN TILE */}
            <div className="col-span-2 lg:col-span-2 row-span-2 p-5 md:p-6 rounded-3xl text-black bg-gradient-to-br from-slate-300 to-blue-200 shadow-2xl flex flex-col justify-center">

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-3">
                <Sparkles size={28} />
                {isUrdu ? "پریکٹس کارنر" : "Practice Corner"}
              </h1>

              <p className="mt-2 text-sm md:text-base text-center leading-relaxed">
                {isUrdu
                  ? "یہاں مختلف مضامین کی پریکٹس کریں اور اپنی صلاحیتیں بہتر بنائیں۔"
                  : "Sharpen your skills with fun practice exercises and quizzes for every class."}
              </p>

            </div>

            {/* CARD TEMPLATE */}
            {[
              { icon: Brain, textEn: "Smart Practice", textUr: "سمارٹ پریکٹس" },
              { icon: Pencil, textEn: "Interactive Exercises", textUr: "انٹرایکٹو مشقیں" },
              { icon: Shapes, textEn: "Fun Learning", textUr: "مزیدار سیکھنا" },
              { icon: BookOpen, textEn: "Subject Practice", textUr: "مضامین کی پریکٹس" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="h-full p-4 md:p-5 rounded-2xl bg-gradient-to-br from-slate-300 to-blue-200 text-black shadow-lg flex flex-col justify-center gap-3"
                >
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  <h3 className="font-bold text-sm md:text-base leading-snug break-words">
                    {isUrdu ? item.textUr : item.textEn}
                  </h3>
                </div>
              );
            })}

          </div>
        </div>

        {/* ================== MAIN ================== */}

        <div className="flex gap-6">
          {/* ================== SIDEBAR ================== */}

          <aside className="w-40 sm:w-64 flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-5">
              <div className="flex flex-col gap-2 overflow-y-auto">

                {classes.map((cls) => (
                  <button
                    key={cls.class_id}
                    onClick={() => setSelectedClass(cls)}
                    className={`p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0
                    ${selectedClass?.class_id === cls.class_id
                        ? "bg-primary text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                  >
                    <BookOpen size={18} />
                    {isUrdu
                      ? cls.class_urdu_name || cls.class_name
                      : cls.class_name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ================== SUBJECTS ================== */}

          <div className="flex-1">
            <h2 className="text-2xl font-extrabold mb-6 text-grey-800 flex items-center gap-2">
              <Sparkles size={22} />
              {isUrdu
                ? `${selectedClass?.class_urdu_name || selectedClass?.class_name} پریکٹس`
                : `${selectedClass?.class_name} Practice`}
            </h2>

            {selectedClass && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {selectedClass.subjects.map((subject: any, index: number) => {
                  const Icon = subjectIcons[index % subjectIcons.length];

                  return (
                    <div
                      key={subject.id}
                      onClick={() =>
                        navigate(`/worksheets/${subject.id}`, {
                          state: { subject },
                        })
                      }
                      className="flex items-center gap-4 p-4 rounded-2xl 
                      bg-white/50 backdrop-blur-sm shadow-md hover:shadow-xl 
                      transition cursor-pointer border border-white/30"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-300 to-blue-200 flex items-center justify-center text-white shadow-lg">
                        <Icon size={26} />
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-bold text-lg text-slate-900">
                          {isUrdu
                            ? subject.urdu_name || subject.name
                            : subject.name}
                        </h4>

                        {!isUrdu && subject.urdu_name && (
                          <p className="text-sm text-slate-500">
                            {subject.urdu_name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticeCornerPage;