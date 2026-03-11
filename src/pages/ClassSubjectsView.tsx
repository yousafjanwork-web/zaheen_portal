import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, FileText, FolderOpen, Settings, LayoutDashboard } from "lucide-react";

const ClassSubjectsView = () => {
    const { classId } = useParams();
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [classInfo, setClassInfo] = useState(null);

    const subjectIcons = [BookOpen, FileText, FolderOpen, Settings, LayoutDashboard];

    // Fetch class info
    useEffect(() => {
        const fetchClass = async () => {
            const res = await fetch("https://api.zaheen.com.pk/api/board/1/classes");
            const data = await res.json();
            const cls = data.find((c) => c.id === Number(classId));
            setClassInfo(cls);
        };
        fetchClass();
    }, [classId]);

    // Fetch subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            const res = await fetch(`https://api.zaheen.com.pk/api/class/${classId}/subjects`);
            const data = await res.json();
            setSubjects(data);
            if (data.length > 0) setSelectedSubject(data[0]);
        };
        fetchSubjects();
    }, [classId]);

    // Fetch chapters
    useEffect(() => {
        if (!selectedSubject) return;
        const fetchChapters = async () => {
            const res = await fetch(`https://api.zaheen.com.pk/api/subject/${selectedSubject.id}/chapters`);
            const data = await res.json();
            setChapters(data);
        };
        fetchChapters();
    }, [selectedSubject]);

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* WELCOME CARD */}
                <div className="mb-12 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                            {classInfo?.name}
                            <span className="text-green-600 font-bold"> | </span>
                            <span className="text-green-700">{classInfo?.urdu_name}</span>
                        </h1>
                        <p className="text-slate-600 mt-3 max-w-xl">
                            Select a subject to explore chapters and lessons for this class. Interactive lessons designed to help students learn effectively.
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            اس جماعت کے مضامین منتخب کریں اور ابواب اور اسباق سیکھنا شروع کریں۔
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-green-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow">
                            {subjects.length} Subjects
                        </div>
                        <span className="text-xs text-slate-500">Available Subjects</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside
                        className={`
    w-full lg:w-80 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2
    scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-transparent
  `}
                    >
                        {subjects.map((subject, index) => (
                            <div
                                key={subject.id}
                                onClick={() => setSelectedSubject(subject)}
                                className={`
        flex flex-row items-center gap-2 px-4 py-3 rounded-xl cursor-pointer
        ${selectedSubject?.id === subject.id
                                        ? "bg-green-600 text-white shadow-md"
                                        : "bg-green-50 text-green-700 hover:bg-green-100"
                                    }
        min-w-[120px] lg:min-w-full
      `}
                            >
                                {/* Icon */}
                                <span className={`text-lg ${selectedSubject?.id === subject.id ? "text-white" : "text-green-600"}`}>
                                    📑
                                </span>

                                {/* Text */}
                                <span className="text-sm font-semibold break-words">
                                    {subject.name} | {subject.urdu_name}
                                </span>
                            </div>
                        ))}
                    </aside>

                    {/* CHAPTER LIST */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-6">Chapters | ابواب</h2>

                        {chapters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapters.map((chapter) => (
                                    <div
                                        key={chapter.id}
                                        className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() =>
                                            navigate(
                                                `/lectures/${classInfo?.name}/${chapter.id}/${chapter.name}`,
                                                { state: { classTitle: classInfo?.name } }
                                            )
                                        }
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl">
                                            📘
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-slate-900">{chapter.name}</h4>
                                            <p
                                                className="text-xs text-green-600 font-semibold hover:underline cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/lectures/${classInfo?.name}/${chapter.id}/${chapter.name}`,
                                                        { state: { classTitle: classInfo?.name } }
                                                    )
                                                }
                                            >
                                                View Lectures | لیکچرز دیکھیں →
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl text-center">
                                <div className="text-6xl mb-4">🚧</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Lessons Coming Soon</h3>
                                <p className="text-slate-600 max-w-md mb-3">
                                    We are currently preparing high-quality lessons for this subject. Please check back soon!
                                </p>
                                <p className="text-sm text-slate-500">اس مضمون کے اسباق جلد شامل کیے جائیں گے۔</p>
                                <div className="mt-6 px-5 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">Stay Tuned</div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default ClassSubjectsView;