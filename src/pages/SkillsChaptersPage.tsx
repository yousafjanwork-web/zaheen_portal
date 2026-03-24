import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  FolderOpen,
  Settings,
  LayoutDashboard,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { getLanguage } from "@/i18n";

const SkillsChaptersPage = () => {
 useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const { classId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [classInfo, setClassInfo] = useState(null);

  const subjectIcons = [
    BookOpen,
    FileText,
    FolderOpen,
    Settings,
    LayoutDashboard,
  ];

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------------- FETCH CLASS ---------------- */

  useEffect(() => {

    const fetchClass = async () => {

      const res = await fetch(
        "https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3"
      );

      const data = await res.json();

      const cls = data.find((c) => c.class_id === Number(classId));

      setClassInfo(cls);

    };

    fetchClass();

  }, [classId]);

  /* ---------------- FETCH SUBJECTS ---------------- */

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

  /* ---------------- FETCH CHAPTERS ---------------- */

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

    <section className="py-14 bg-slate-100">

      <div className="max-w-7xl mx-auto px-4">

        {/* ---------------- COURSE HEADER ---------------- */}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-10">

          <div className="flex flex-col md:flex-row gap-8">

            <img
              src={classInfo?.thumbnailUrl || "https://placehold.co/400x250"}
              className="w-full md:w-96 h-56 object-cover rounded-2xl"
            />

            <div className="flex flex-col justify-center">

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="text-indigo-600" />
                {isUrdu ? classInfo?.urdu_name : classInfo?.name}
              </h1>

              <p className="text-slate-600 mb-5 max-w-xl">

                {isUrdu
                  ? "یہ کورس آپ کو جدید مہارتیں سکھانے کے لیے تیار کیا گیا ہے۔ مرحلہ وار لیکچرز کے ذریعے آسان سیکھنے کا تجربہ حاصل کریں۔"
                  : "This course is designed to teach you modern professional skills through step-by-step lectures."}

              </p>

              <div className="flex items-center gap-6 text-sm text-slate-500">

                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {chapters.length} {isUrdu ? "لیکچرز" : "Lectures"}
                </span>

                <span className="flex items-center gap-1">
                  <GraduationCap size={16} />
                  {isUrdu ? "ابتدائی سطح" : "Beginner"}
                </span>

              </div>

            </div>

          </div>

        </div>


        <div className="flex flex-col lg:flex-row gap-8">

          {/* ---------------- SUBJECT SIDEBAR ---------------- */}

          <aside className="w-full lg:w-72 flex gap-3 overflow-x-auto lg:flex-col">

            {subjects.map((subject, index) => {

              const Icon = subjectIcons[index % subjectIcons.length];

              return (

                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition
                  
                  ${
                    selectedSubject?.id === subject.id
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-white border border-slate-200 hover:bg-indigo-50"
                  }
                  
                  `}
                >

                  <Icon size={18} />

                  <span className="text-sm font-semibold">

                    {isUrdu
                      ? subject.urdu_name || subject.name
                      : subject.name}

                  </span>

                </div>

              );

            })}

          </aside>


          {/* ---------------- LECTURE LIST ---------------- */}

          <div className="flex-1">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">

              <div className="p-6 border-b border-slate-200 flex justify-between">

                <h2 className="text-xl font-bold text-slate-900">

                  {isUrdu ? "کورس مواد" : "Course Content"}

                </h2>

                <span className="text-sm text-slate-500">

                  {chapters.length} {isUrdu ? "لیکچرز" : "lectures"}

                </span>

              </div>


              <div>

                {chapters.length > 0 ? (

                  chapters.map((chapter, index) => (

                    <div
                      key={chapter.id}
                      onClick={() =>
                        navigate(
                          `/lectures/${
                            isUrdu
                              ? classInfo?.urdu_name
                              : classInfo?.name
                          }/${chapter.id}/${
                            isUrdu
                              ? chapter.urdu_name || chapter.name
                              : chapter.name
                          }`,
                          {
                            state: {
                              classTitle: isUrdu
                                ? classInfo?.urdu_name
                                : classInfo?.name,
                            },
                          }
                        )
                      }

                      className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                    >

                      <div className="flex items-center gap-4">

                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">

                          {index + 1}

                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">

                            {isUrdu
                              ? chapter.urdu_name || chapter.name
                              : chapter.name}

                          </p>

                          <p className="text-xs text-slate-500">

                            {isUrdu
                              ? "ویڈیو لیکچر"
                              : "Video Lecture"}

                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-2 text-indigo-600 font-semibold">

                        <PlayCircle size={18} />

                        {isUrdu ? "دیکھیں" : "Watch"}

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="flex flex-col items-center justify-center py-20 text-center">

                    <GraduationCap size={50} className="text-indigo-500 mb-4" />

                    <h3 className="text-xl font-bold text-slate-900 mb-2">

                      {isUrdu
                        ? "اسباق جلد آرہے ہیں"
                        : "Lessons Coming Soon"}

                    </h3>

                    <p className="text-slate-500 max-w-md">

                      {isUrdu
                        ? "ہم اس مضمون کے لیے اسباق تیار کر رہے ہیں۔"
                        : "We are preparing lessons for this course."}

                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default SkillsChaptersPage;