import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    BookOpen,
    FileText,
    FolderOpen,
    Settings,
    LayoutDashboard,
    GraduationCap
} from "lucide-react";

const SkillsChaptersPage = () => {
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
            const res = await fetch(
                "https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3"
            );
            const data = await res.json();
            const cls = data.find((c) => c.class_id === Number(classId));
            setClassInfo(cls);
        };
        fetchClass();
    }, [classId]);

    // Fetch subjects
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

    // Fetch chapters
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
        <section className="py-16 bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="relative overflow-hidden mb-12 rounded-3xl p-12 text-white
                        bg-gradient-to-br from-blue-500 via-green-400 to-blue-300 shadow-2xl">

                    {/* ROTATING RING */}
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full
                            border-[80px] border-indigo-500/20 animate-slow-spin"></div>

                    {/* SECOND RING */}
                    <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full
                         border-[70px] border-purple-500/20 animate-slow-spin"></div>

                    {/* LIGHT BEAM */}
                    <div className="absolute inset-0 opacity-30
                         bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]"></div>

                    {/* FLOATING BUBBLES */}
                    <div className="absolute top-10 left-20 w-24 h-24 bg-indigo-400/30 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute bottom-10 right-32 w-28 h-28 bg-purple-400/30 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-400/30 rounded-full blur-2xl animate-float"></div>

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">

                        {/* TEXT */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
                                <GraduationCap size={38} />
                                {classInfo?.name}
                            </h1>

                            <p className="text-indigo-200 mt-2 text-lg font-medium">
                                {classInfo?.urdu_name}
                            </p>

                            <p className="mt-4 max-w-xl text-indigo-100">
                                Select a lecture to start learning this skill. Interactive lessons designed for modern learning.
                            </p>

                            <p className="text-sm  mt-1">
                                اس سکل کے اسباق منتخب کریں اور سیکھنا شروع کریں۔
                            </p>
                        </div>

                        {/* GLASS STAT CARD */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20
    px-10 py-6 rounded-2xl text-center shadow-xl">

                            <p className="text-4xl font-bold">
                                {subjects.length}
                            </p>

                            <p className="text-xs uppercase tracking-widest  mt-1">
                                {subjects.length === 1 ? "Skill" : "Skills"}
                            </p>

                        </div>

                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-80 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">

                        {subjects.map((subject, index) => {
                            const Icon = subjectIcons[index % subjectIcons.length];

                            return (
                                <div
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${selectedSubject?.id === subject.id
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50"
                                        }
                  `}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-semibold">
                                        {subject.name}
                                    </span>
                                </div>
                            );
                        })}

                    </aside>

                    {/* CHAPTER LIST */}
                    <div className="flex-1">

                        <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                            <BookOpen size={24} className="text-indigo-600" />
                            Skills Lectures
                        </h2>

                        {chapters.length > 0 ? (

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {chapters.map((chapter) => (

                                    <div
                                        key={chapter.id}
                                        onClick={() =>
                                            navigate(
                                                `/lectures/${classInfo?.name}/${chapter.id}/${chapter.name}`,
                                                { state: { classTitle: classInfo?.name } }
                                            )
                                        }
                                        className="group flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                    >

                                        <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <BookOpen size={22} />
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                                                {chapter.name}
                                            </h4>

                                            <p className="text-xs text-slate-500 mt-1">
                                                View Lectures →
                                            </p>
                                        </div>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl text-center">

                                <GraduationCap size={50} className="text-indigo-500 mb-4" />

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    Lessons Coming Soon
                                </h3>

                                <p className="text-slate-600 max-w-md mb-3">
                                    We are currently preparing high-quality lessons for this subject.
                                </p>

                                <p className="text-sm text-slate-500">
                                    اس مضمون کے اسباق جلد شامل کیے جائیں گے۔
                                </p>

                                <div className="mt-6 px-5 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-full text-sm">
                                    Stay Tuned
                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default SkillsChaptersPage;