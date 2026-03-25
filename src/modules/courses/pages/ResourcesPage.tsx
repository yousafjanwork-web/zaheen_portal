import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ResourcesPage = () => {
    const [searchParams] = useSearchParams();

    const [grades, setGrades] = useState<any[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [yearsData, setYearsData] = useState<any>({});
    const navigate = useNavigate();

    // ✅ Fetch Grades
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

    // ✅ Fetch Subjects + Years
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">

            {/* 🔥 Welcome Section */}
            <div className="mb-8 p-6 md:p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                        Resources (Grades 9–12)
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Select subject and explore past papers by year
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* 🔥 Sidebar (Mobile = horizontal) */}
                <aside className="lg:w-64 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2">
                    {grades.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setSelectedGrade(g.id)}
                            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${selectedGrade === g.id
                                ? "bg-primary text-white shadow-md"
                                : "bg-white hover:bg-primary/10"
                                }`}
                        >
                            {g.name}
                        </button>
                    ))}
                </aside>

                {/* 🔥 Main Content */}
                <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {subjects.map((subject, index) => (
                        <motion.div
                            key={subject.id}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white p-5 rounded-2xl border hover:border-primary/40 shadow-sm hover:shadow-xl"
                        >
                            {/* Subject Title */}
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
                                {subject.name}
                            </h3>

                            {/* Years */}
                            <div className="flex flex-wrap gap-2">
                                {(yearsData[subject.id] || []).map((year: number) => (
                                    <button
                                        key={year}
                                        onClick={() =>
                                            navigate(
                                                `/resource-player?grade=${selectedGrade}&subject=${subject.id}&year=${year}`,
                                                {
                                                    state: {
                                                        subjectName: subject.name,
                                                        classId: selectedGrade,
                                                    },
                                                }
                                            )
                                        }
                                        className="
                                                px-4 py-2 text-sm font-semibold rounded-xl
                                                bg-slate-100 text-slate-700
                                                hover:bg-primary hover:text-white
                                                transition duration-200
                                                active:scale-95
                                                shadow-sm hover:shadow-md
                                                "
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>

                            {/* Empty State */}
                            {(yearsData[subject.id] || []).length === 0 && (
                                <p className="text-sm text-slate-400 mt-2">
                                    Resources currently not available
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;