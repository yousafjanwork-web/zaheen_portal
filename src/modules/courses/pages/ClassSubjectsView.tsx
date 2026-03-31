import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ClassSubjectsView = () => {
  const { classId }: any = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const gradeType = location.state?.gradeType || classInfo?.type;

  /* ---------- LANGUAGE ---------- */

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------- FETCH CLASS ---------- */

  useEffect(() => {
    const fetchClass = async () => {
      const res = await fetch(
        "https://api.zaheen.com.pk/api/board/1/classes"
      );
      const data = await res.json();
      const cls = data.find((c: any) => c.id === Number(classId));
      if (cls) cls.type = data.some((g: any) => g.id === cls.id)?.type || "1-5"; // map to your grade type
      setClassInfo(cls);
    };
    fetchClass();
  }, [classId]);

  /* ---------- FETCH SUBJECTS ---------- */

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch(
        `https://api.zaheen.com.pk/api/class/${classId}/subjects`
      );
      const data = await res.json();
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0]);
    };
    fetchSubjects();
  }, [classId]);

  /* ---------- FETCH CHAPTERS ---------- */

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchChapters = async () => {
      const res = await fetch(
        `https://api.zaheen.com.pk/api/subject/${selectedSubject.id}/chapters`
      );
      const data = await res.json();
      setChapters(data);
    };

    fetchChapters();
  }, [selectedSubject]);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ---------- BREADCRUMBS ---------- */}
        <div className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">
            {isUrdu ? "ہوم" : "Home"}
          </Link>

          <span>/</span>

          <Link to={`/grades/${gradeType}`} className="hover:text-primary">
            {isUrdu
              ? classInfo?.urdu_name || "گریڈ"
              : classInfo?.name || "Grade"}
          </Link>

          <span>/</span>

          <span className="text-slate-700 font-medium">
            {isUrdu ? classInfo?.urdu_name : classInfo?.name}
          </span>
        </div>



        {/* ---------- WELCOME ---------- */}

        <div className="mb-12 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">
              {isUrdu ? classInfo?.urdu_name : classInfo?.name}
            </h1>

            <p className="text-slate-600 mt-3 max-w-xl">
              {isUrdu
                ? "اس جماعت کے مضامین منتخب کریں اور ابواب اور اسباق سیکھنا شروع کریں۔"
                : "Select a subject to explore chapters and lessons for this class. Interactive lessons designed to help students learn effectively."}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow">
              {isUrdu
                ? `${subjects.length} مضامین`
                : `${subjects.length} Subjects`}
            </div>

            <span className="text-xs text-slate-500">
              {isUrdu ? "دستیاب مضامین" : "Available Subjects"}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ---------- SIDEBAR ---------- */}

          <aside className="w-full lg:w-80 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer
                ${selectedSubject?.id === subject.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }
                min-w-[120px] lg:min-w-full`}
              >
                <span
                  className={`text-lg ${selectedSubject?.id === subject.id
                    ? "text-white"
                    : "text-blue-600"
                    }`}
                >
                  📑
                </span>

                <span className="text-sm font-semibold break-words">
                  {isUrdu
                    ? subject.urdu_name || subject.name
                    : subject.name}
                </span>
              </div>
            ))}
          </aside>

          {/* ---------- CHAPTERS ---------- */}

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">
              {isUrdu ? "ابواب" : "Chapters"}
            </h2>

            {chapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/lectures/${isUrdu ? classInfo?.urdu_name : classInfo?.name
                        }/${chapter.id}/${isUrdu
                          ? chapter.urdu_name || chapter.name
                          : chapter.name
                        }`,
                        {
                          state: {
                            classTitle: isUrdu
                              ? classInfo?.urdu_name
                              : classInfo?.name,
                            gradeType: gradeType,

                          },
                        }
                      )
                    }
                  >
                    <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                      📘
                    </div>

                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-slate-900">
                        {isUrdu
                          ? chapter.urdu_name || chapter.name
                          : chapter.name}
                      </h4>

                      <p className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">
                        {isUrdu
                          ? "لیکچرز دیکھیں →"
                          : "View Lectures →"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl text-center">
                <div className="text-6xl mb-4">🚧</div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {isUrdu ? "اسباق جلد آرہے ہیں" : "Lessons Coming Soon"}
                </h3>

                <p className="text-slate-600 max-w-md mb-3">
                  {isUrdu
                    ? "ہم اس مضمون کے لیے اعلیٰ معیار کے اسباق تیار کر رہے ہیں۔ براہ کرم جلد دوبارہ دیکھیں!"
                    : "We are currently preparing high-quality lessons for this subject. Please check back soon!"}
                </p>

                <div className="mt-6 px-5 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm">
                  {isUrdu ? "جلد آرہا ہے" : "Stay Tuned"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSubjectsView;