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
import { getLanguage } from "@/modules/shared/i18n";

const SkillsChaptersPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [classInfo, setClassInfo] = useState(null);

  // ✅ loading states
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [chapterMap, setChapterMap] = useState({});


  const [lectures, setLectures] = useState([]);

  const gradeType = "Skills";


  const subjectIcons = [
    BookOpen,
    FileText,
    FolderOpen,
    Settings,
    LayoutDashboard,
  ];

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  // scroll top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* ---------------- FETCH CLASS ---------------- */
  useEffect(() => {
    const fetchClass = async () => {
      setLoadingClass(true);

      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3?t=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        const data = await res.json();
        console.log(data)
        const cls = data.find((c) => c.class_id === Number(classId));
        setClassInfo(cls);
      } catch (err) {
        console.error(err);
      }

      setLoadingClass(false);
    };

    fetchClass();
  }, [classId]);

  /* ---------------- FETCH SUBJECTS ---------------- */
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);

      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/class/${classId}/subjects?ts=${Date.now()}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        const data = await res.json();
        setSubjects(data);

        if (data.length > 0) setSelectedSubject(data[0]);
      } catch (err) {
        console.error(err);
      }

      setLoadingSubjects(false);
    };

    fetchSubjects();
  }, [classId]);

  /* ---------------- FETCH CHAPTERS ---------------- */
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchLectures = async () => {
      setLoadingChapters(true);

      try {
        // 1️⃣ Get chapters
        const res = await fetch(
          `https://api.zaheen.com.pk/api/subject/${selectedSubject.id}/chapters?ts=${Date.now()}`
        );

        const chaptersData = await res.json();

        // 🧠 Create map: { chapterId: chapterObject }
        const map = {};
        chaptersData.forEach((c) => {
          map[c.id] = c;
        });
        setChapterMap(map);

        // 2️⃣ Extract IDs only
        const chapterIds = chaptersData.map((c) => c.id);

        // 3️⃣ Fetch lectures for each chapter
        const lecturesPromises = chapterIds.map((id) =>
          fetch(
            `https://api.zaheen.com.pk/api/chapter/${id}/videos?ts=${Date.now()}`
          ).then((res) => res.json())
        );

        const lecturesArrays = await Promise.all(lecturesPromises);

        // 4️⃣ Flatten all lectures
        const allLectures = lecturesArrays.flat();

        console.log("Lectures:", allLectures);

        setLectures(allLectures);
      } catch (err) {
        console.error(err);
      }

      setLoadingChapters(false);
    };

    fetchLectures();
  }, [selectedSubject]);


  return (
    <section className="py-14 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4">

        {/* ---------------- COURSE HEADER ---------------- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-10">

          {loadingClass ? (
            <div className="animate-pulse flex gap-8">
              <div className="w-96 h-56 bg-slate-200 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ) : (
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
                    ? "یہ کورس آپ کو جدید مہارتیں سکھانے کے لیے تیار کیا گیا ہے۔"
                    : "This course is designed to teach modern skills."}
                </p>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {lectures.length}{" "}
                    {isUrdu
                      ? lectures.length === 1
                        ? "باب"
                        : "ابواب"
                      : lectures.length === 1
                        ? "Lecture"
                        : "Lectures"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ---------------- SUBJECTS ---------------- */}
          {/* <aside className="w-full lg:w-72 flex gap-3 overflow-x-auto lg:flex-col">

            {loadingSubjects
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-40 bg-slate-200 rounded-xl animate-pulse"
                />
              ))
              : subjects.map((subject, index) => {
                const Icon = subjectIcons[index % subjectIcons.length];

                return (
                  <div
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition
                      ${selectedSubject?.id === subject.id
                        ? "bg-indigo-600 text-white"
                        : "bg-white border hover:bg-indigo-50"
                      }`}
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
          </aside> */}

          {/* ---------------- CHAPTERS ---------------- */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">

              <div className="p-6 border border-slate-200 flex justify-between">
                <h2 className="text-xl font-bold">
                  {isUrdu ? "کورس مواد" : "Course Content"}
                </h2>
                {/* <span className="text-sm text-slate-500">
                  {chapters.length} {isUrdu ? "لیکچرز" : "lectures"}
                </span> */}
              </div>

              <div>
                {loadingChapters ? (
                  <div className="space-y-4 p-6">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse flex justify-between p-4 border border-slate-200 rounded-xl"
                      >
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-slate-200 rounded-full" />
                          <div>
                            <div className="h-4 w-40 bg-slate-200 mb-2 rounded" />
                            <div className="h-3 w-24 bg-slate-200 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : lectures.length > 0 ? (
                  lectures.map((lecture, index) => (
                    <div
                      key={lecture.id}
                      onClick={() =>
                        navigate(
                          `/lectures/${classInfo?.name}/${lecture.chapter_id}/${chapterMap[lecture.chapter_id]?.name || "chapter"}`,
                          {
                            state: {
                              classTitle: isUrdu ? classInfo?.urdu_name : classInfo?.name,
                              gradeType: "Skills",
                              classId,
                              selectedSubjectId: selectedSubject?.id,

                              videoId: lecture.id,
                              chapterId: lecture.chapter_id,
                              chapterName: chapterMap[lecture.chapter_id]?.name,

                              // ✅ ADD THIS (important fallback + stability)
                              autoPlayVideoId: lecture.id,
                            },
                          }
                        )
                      }
                      className="flex justify-between px-6 py-5 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {lecture.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Contains Video Lectures
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                        <PlayCircle size={18} />
                        Watch
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center py-20">
                    <GraduationCap size={50} className="text-indigo-500 mb-4" />
                    <h3 className="text-xl font-bold">
                      {isUrdu ? "اسباق جلد آرہے ہیں" : "Lessons Coming Soon"}
                    </h3>
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