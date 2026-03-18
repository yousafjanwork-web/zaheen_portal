import React, { useEffect, useState } from "react";
import { BookOpen, Brain, Pencil, Shapes, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLanguage } from "@/i18n";

const PracticeCornerPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const navigate = useNavigate();

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch(
        "https://api.zaheen.com.pk/api//fetch-all-subjects/1"
      );
      const data = await res.json();

      setClasses(data);
      setSelectedClass(data[0]);
    };

    fetchClasses();
  }, []);

  const subjectIcons = [BookOpen, Brain, Pencil, Shapes, Sparkles];

  return (
    <section className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-2">
        {/* ================== HERO ================== */}

        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-12">
          {/* MAIN TILE */}
          <div className="col-span-2 row-span-2 p-3 rounded-3xl text-white 
          bg-gradient-to-br from-orange-600 to-blue-400 shadow-2xl relative overflow-hidden">

            <div className="absolute -right-20 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-spin-slow"></div>
            <div className="absolute -left-16 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>

            <h1 className="text-3xl sm:text-xl font-black flex items-center gap-3">
              <Sparkles size={30} />
              {isUrdu ? "پریکٹس کارنر" : "Practice Corner"}
            </h1>

            <p className="mt-3 text-sm text-center">
              {isUrdu
                ? "یہاں مختلف مضامین کی پریکٹس کریں اور اپنی صلاحیتیں بہتر بنائیں۔"
                : "Sharpen your skills with fun practice exercises and quizzes for every class."}
            </p>
          </div>

          {/* CARD 1 */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-lg flex flex-col justify-between">
            <Brain size={28} />
            <h3 className="font-bold text-sm">
              {isUrdu ? "سمارٹ پریکٹس" : "Smart Practice"}
            </h3>
          </div>

          {/* CARD 2 */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-green-300 text-white shadow-lg flex flex-col justify-between">
            <Pencil size={28} />
            <h3 className="font-bold text-sm">
              {isUrdu ? "انٹرایکٹو مشقیں" : "Interactive Exercises"}
            </h3>
          </div>

          {/* CARD 3 */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-600 to-green-200 text-white shadow-lg flex flex-col justify-between">
            <Shapes size={28} />
            <h3 className="font-bold text-sm">
              {isUrdu ? "مزیدار سیکھنا" : "Fun Learning"}
            </h3>
          </div>

          {/* CARD 4 */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-red-400 to-purple-400 text-white shadow-lg flex flex-col justify-between">
            <BookOpen size={28} />
            <h3 className="font-bold text-sm">
              {isUrdu ? "مضامین کی پریکٹس" : "Subject Practice"}
            </h3>
          </div>
        </div>

        {/* ================== MAIN ================== */}

        <div className="flex gap-6">
          {/* ================== SIDEBAR ================== */}

          <aside className="w-40 sm:w-64 flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-5 shadow border">
              <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">

                {classes.map((cls) => (
                  <button
                    key={cls.class_id}
                    onClick={() => setSelectedClass(cls)}
                    className={`text-left px-4 py-3 rounded-xl transition font-semibold
                    ${
                      selectedClass?.class_id === cls.class_id
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
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
            <h2 className="text-2xl font-extrabold mb-6 text-indigo-800 flex items-center gap-2">
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
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 flex items-center justify-center text-white shadow-lg">
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