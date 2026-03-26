import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { LayoutDashboard, FolderOpen } from "lucide-react";

const ResourcesPage = () => {
    const [searchParams] = useSearchParams();

    const [grades, setGrades] = useState<any[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [yearsData, setYearsData] = useState<any>({});

    const navigate = useNavigate();

    /* ---------- LANGUAGE ---------- */
    const lang = getLanguage();
    const isUrdu = lang === "ur";

    /* ---------- FETCH GRADES ---------- */
    useEffect(() => {
        const fetchGrades = async () => {
            const res = await fetch(
                "https://api.zaheen.com.pk/api/board/1/classes"
            );
            const data = await res.json();

            const filtered = data.filter(
                (g: any) => g.id >= 10 && g.id <= 13
            );

            setGrades(filtered);
            if (filtered.length) setSelectedGrade(filtered[0].id);
        };

        fetchGrades();
    }, []);

    /* ---------- FETCH SUBJECTS + YEARS ---------- */
    useEffect(() => {
        if (!selectedGrade) return;

        const fetchSubjects = async () => {
            const res = await fetch(
                `https://api.zaheen.com.pk/api/class/${selectedGrade}/subjects`
            );
            const data = await res.json();

            setSubjects(data);

            const yearsMap: any = {};

            for (let subject of data) {
                try {
                    const res = await fetch(
                        `https://api.zaheen.com.pk/api/pastpapers?class_id=${selectedGrade}&subject_id=${subject.id}`
                    );
                    const papers = await res.json();

                    const years = [
                        ...new Set(papers.data.map((p: any) => p.year)),
                    ];

                    yearsMap[subject.id] = years;
                } catch {
                    yearsMap[subject.id] = [];
                }
            }

            setYearsData(yearsMap);
        };

        fetchSubjects();
    }, [selectedGrade]);

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ---------- WELCOME ---------- */}

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                            {isUrdu
                                ? "گزشتہ پرچوں کے حل ویڈیو وضاحت کے ساتھ"
                                : "Past Papers – Solved with Video Explanations"}
                        </h1>
                        <p className="text-slate-600 mt-2">
                            {isUrdu
                                ? "حقیقی امتحانی سوالات کی مشق کریں اور ہر حل کو تفصیلی مرحلہ وار ویڈیو لیکچرز کے ذریعے سمجھیں۔"
                                : "Practice real exam questions and understand every solution through detailed step-by-step video lectures."}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 🔥 Sidebar */}
                    <aside className="w-full lg:w-64 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">

                        {/* Grades (dynamic but SAME STYLE) */}
                        {grades.map((g) => (
                            <div
                                key={g.id}
                                onClick={() => setSelectedGrade(g.id)}
                                className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer flex-shrink-0
            ${selectedGrade === g.id
                                        ? "bg-primary text-white"
                                        : "hover:bg-slate-100"
                                    }`}
                            >
                                <FolderOpen size={18} />

                                <span className="text-lg font-medium">
                                    {isUrdu ? g.urdu_name || g.name : g.name}
                                </span>
                            </div>
                        ))}
                    </aside>

                    {/* 🔥 Main Content */}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-8">
                            {isUrdu
                                ? "سال کے مطابق گزشتہ پرچے دیکھنے کے لیے گریڈ منتخب کریں"
                                : "Select a grade to view past papers by year"}
                        </h2>
                        <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {subjects.map((subject) => (
                                <motion.div
                                    key={subject.id}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-white p-5 rounded-2xl border hover:border-primary/40 shadow-sm hover:shadow-xl"
                                >
                                    {/* Subject Title */}
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
                                        {isUrdu
                                            ? subject.urdu_name || subject.name
                                            : subject.name}
                                    </h3>

                                    {/* Years */}
                                    <div className="flex flex-wrap gap-2">
                                        {(yearsData[subject.id] || []).map(
                                            (year: number) => (
                                                <button
                                                    key={year}
                                                    onClick={() =>
                                                        navigate(
                                                            `/resource-player?grade=${selectedGrade}&subject=${subject.id}&year=${year}`,
                                                            {
                                                                state: {
                                                                    subjectName:
                                                                        subject.name,
                                                                    classId:
                                                                        selectedGrade,
                                                                },
                                                            }
                                                        )
                                                    }
                                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-primary hover:text-white transition duration-200 active:scale-95 shadow-sm hover:shadow-md"
                                                >
                                                    {year}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Empty State */}
                                    {(yearsData[subject.id] || []).length === 0 && (
                                        <p className="text-sm text-slate-400 mt-2">
                                            {isUrdu
                                                ? "فی الحال مواد دستیاب نہیں"
                                                : "Resources currently not available"}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResourcesPage;