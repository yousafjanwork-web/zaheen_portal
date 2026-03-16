import React, { useEffect, useState } from "react";
import { BookOpen, Brain, Pencil, Shapes, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PracticeCornerPage = () => {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await fetch("https://api.zaheen.com.pk/api//fetch-all-subjects/1");
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

                {/* ================== WELCOME GRID ================== */}

                <div className="grid grid-cols-4 gap-2 sm:gap-3 xs:gap-1 mb-12">
                    {/* MAIN TILE */}
                    <div className="col-span-2 row-span-2 p-2 sm:p-2 xs:p-1 rounded-3xl text-white 
      bg-gradient-to-br from-orange-600 to-blue-400
      shadow-2xl relative overflow-hidden animate-fade-in">

                        {/* Floating circles */}
                        <div className="absolute -right-20 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-spin-slow"></div>
                        <div className="absolute -left-16 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"></div>

                        <h1 className="text-4xl sm:text-1md xs:text-1md font-black flex items-center gap-3 sm:gap-1xs">
                            <Sparkles size={34} />
                            Practice Corner
                        </h1>

                        <p className="mt-4 text max-w-md sm:text-xs xs:text-xs justify-center text-center">
                            Sharpen your skills with fun practice exercises and quizzes for every class.
                        </p>

                        <p className="text-sm sm:text-xs mt-2 justify-center text-center">
                            یہاں مختلف مضامین کی پریکٹس کریں اور اپنی صلاحیتیں بہتر بنائیں۔
                        </p>
                    </div>

                    {/* CARD 1 */}
                    <div className="p-3 sm:p-4 xs:p-1 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-lg flex flex-col justify-between">
                        <Brain size={32} />
                        <h3 className="font-bold text-lg sm:text-sm xs:text-sm">Smart Practice</h3>
                    </div>

                    {/* CARD 2 */}
                    <div className="p-3 sm:p-4 xs:p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-green-300 text-white shadow-lg flex flex-col justify-between">
                        <Pencil size={32} />
                        <h3 className="font-bold text-lg sm:text-sm xs:text-sm">Interactive Exercises</h3>
                    </div>

                    {/* CARD 3 */}
                    <div className="p-3 sm:p-4 xs:p-3 rounded-2xl bg-gradient-to-br from-green-600 to-green-200 text-white shadow-lg flex flex-col justify-between">
                        <Shapes size={32} />
                        <h3 className="font-bold text-lg sm:text-sm xs:text-sm">Fun Learning</h3>
                    </div>

                    {/* CARD 4 */}
                    <div className="p-3 sm:p-4 xs:p-3 rounded-2xl bg-gradient-to-br from-red-400 to-purple-400 text-white shadow-lg flex flex-col justify-between">
                        <BookOpen size={32} />
                        <h3 className="font-bold text-lg sm:text-base xs:text-sm">Subject Practice</h3>
                    </div>

                </div>

                {/* ================== MAIN LAYOUT ================== */}

                <div className="flex gap-8 sm:gap-4">

                    {/* ================== SIDEBAR ================== */}
                    <aside className="w-40 sm:w-64 flex flex-col gap-3">
                        <div className="bg-white rounded-2xl p-5 shadow border">


                            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto scrollbar-thumb-indigo-400 ">

                                {classes.map((cls) => (
                                    <button
                                        key={cls.class_id}
                                        onClick={() => setSelectedClass(cls)}
                                        className={`text-left px-4 py-3 rounded-xl transition font-semibold
                                            ${selectedClass?.class_id === cls.class_id
                                                ? "bg-indigo-600 text-white shadow"
                                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            }`}
                                    >
                                        {cls.class_name}
                                    </button>
                                ))}

                            </div>

                        </div>

                    </aside>

                    {/* ================== SUBJECTS ================== */}
                    <div className="flex-1">

                        <h2 className="text-2xl font-extrabold mb-6 text-indigo-800 flex items-center gap-2">
                            <Sparkles size={24} />
                            {selectedClass?.class_name} Practice
                        </h2>

                        {selectedClass && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {selectedClass.subjects.map((subject, index) => {
                                    const Icon = subjectIcons[index % subjectIcons.length];

                                    return (
                                        <div
                                            key={subject.id}
                                            onClick={() => navigate(`/worksheets/${subject.id}`, { state: { subject } })}
                                            className="flex items-center gap-4 p-4 rounded-2xl 
                                                        bg-white/50 backdrop-blur-sm shadow-md hover:shadow-xl 
                                                        transition cursor-pointer border border-white/30"
                                        >
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 flex items-center justify-center text-white shadow-lg">
                                                <Icon size={28} />
                                            </div>

                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-lg text-slate-900">{subject.name}</h4>
                                                <p className="text-sm text-slate-600">{subject.urdu_name}</p>
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