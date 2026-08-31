/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
    Plus,
    ClipboardList,
    Calendar,
    BookOpen,
    Award,
    ChevronRight,
    Sparkles,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Book,
    Target,
    Star,
    Flame,
    History,
    Timer,
    FileText,
    BarChart3, 
    Dna, 
    FlaskConical, 
    Brain,
    Atom
    

} from "lucide-react";
import { Clock3 } from "lucide-react";

import { SUBJECT_ICON, SUBJECT_THEME } from "./ProgressBar";

import { motion, AnimatePresence } from "motion/react";
import { PerformanceStats, StudyRecommendation, MDCATSubject } from "../types";
import { mdcatApi, mdcatAiApi } from "../config";

interface DashboardProps {
    stats: PerformanceStats;
    recommendations: StudyRecommendation[];
    onStartGenQuiz: () => void;
    onSelectQuiz: (id: number) => void;
    availableQuizzes: any[];
    refreshData: () => Promise<void>;
}

export default function Dashboard1({
    stats,
    recommendations,
    onStartGenQuiz,
    onSelectQuiz,
    availableQuizzes,
    refreshData,
}: DashboardProps) {
    availableQuizzes = availableQuizzes || [];
    stats = {
        totalAttempts: stats?.totalAttempts || 0,
        averageScorePercent: stats?.averageScorePercent || 0,
        subjectBreakdown: stats?.subjectBreakdown || [],
        attemptHistory: stats?.attemptHistory || [],
        totalFocusMinutes: stats?.totalFocusMinutes || 0,
        focusSessions: stats?.focusSessions || [],
        studyStreak: stats?.studyStreak || 0,
    } as any;

    const [isGeneratingRec, setIsGeneratingRec] = useState(false);
    const [recError, setRecError] = useState<string | null>(null);
    const [selectedSubjectFilter, setSelectedSubjectFilter] =
        useState<string>("All");
        const PARTICLE_CONFIG = [
    { x: 10, y: 20, size: 0.3, duration: 1.8, delay: 0.1, alpha: 0.8 },
    { x: 85, y: 15, size: 0.25, duration: 2.2, delay: 0.4, alpha: 0.6 },
    { x: 25, y: 80, size: 0.35, duration: 1.6, delay: 0.7, alpha: 0.9 },
    { x: 70, y: 75, size: 0.2, duration: 2.4, delay: 0.2, alpha: 0.5 },
    { x: 50, y: 10, size: 0.3, duration: 1.9, delay: 0.9, alpha: 0.7 },
    { x: 15, y: 55, size: 0.22, duration: 2.1, delay: 0.5, alpha: 0.6 },
    { x: 90, y: 50, size: 0.28, duration: 1.7, delay: 1.1, alpha: 0.8 },
    { x: 40, y: 90, size: 0.24, duration: 2.3, delay: 0.3, alpha: 0.7 },
    { x: 60, y: 35, size: 0.32, duration: 1.5, delay: 0.6, alpha: 0.9 },
    { x: 5, y: 40, size: 0.2, duration: 2.0, delay: 0.8, alpha: 0.5 },
    { x: 80, y: 90, size: 0.26, duration: 1.8, delay: 1.0, alpha: 0.6 },
    { x: 35, y: 5, size: 0.3, duration: 2.2, delay: 0.15, alpha: 0.8 },
];
    function getSubjectIcon(subject: string) {
    const map: Record<string, typeof Dna> = {
        Biology: Dna,
        Chemistry: FlaskConical,
        Physics: Atom,
        English: BookOpen,
        "Logical Reasoning": Brain,
    };
    return map[subject] || BarChart3;
}
    function getSubjectSolid(subject: string): string {
    const map: Record<string, string> = {
        Biology: "#10b981",
        Chemistry: "#f59e0b",
        Physics: "#a855f7",
        English: "#3b82f6",
        "Logical Reasoning": "#ec4899",
    };
    return map[subject] || "#0ea5e9";
}
    // Trigger dynamic AI Advice Regeneration using historical wrong answers
    const handleRegenerateRecommendation = async () => {
        setIsGeneratingRec(true);
        setRecError(null);
        try {
            const response = await fetch(
                mdcatApi("/api/mdcat/recommendations/generate"),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                },
            );
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to generate recommendations");
            }
            await refreshData();
        } catch (err: any) {
            console.error(err);
            setRecError(
                err.message || "Error occurred. Please attempt some quizzes first!",
            );
        } finally {
            setIsGeneratingRec(false);
        }
    };

    // Find recommendations for the weaker areas
    const latestRec =
        recommendations && recommendations.length > 0 ? recommendations[0] : null;

    // Filter quizzes by subject for quick practice action
    const filteredQuizzes =
        selectedSubjectFilter === "All"
            ? availableQuizzes
            : availableQuizzes.filter((q) => q.subject === selectedSubjectFilter);

    // Subject colors helper
    const getSubjectColor = (subject: MDCATSubject) => {
        switch (subject) {
            case "Biology":
                return {
                    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    badge: "bg-emerald-500",
                };
            case "Chemistry":
                return {
                    bg: "bg-amber-50 text-amber-700 border-amber-200",
                    badge: "bg-amber-500",
                };
            case "Physics":
                return {
                    bg: "bg-purple-50 text-purple-700 border-purple-200",
                    badge: "bg-purple-500",
                };
            case "English":
                return {
                    bg: "bg-blue-50 text-blue-700 border-blue-200",
                    badge: "bg-blue-500",
                };
            case "Logical Reasoning":
                return {
                    bg: "bg-rose-50 text-rose-700 border-rose-200",
                    badge: "bg-rose-500",
                };
            default:
                return {
                    bg: "bg-slate-50 text-slate-700 border-slate-200",
                    badge: "bg-slate-500",
                };
        }
    };

    // Derive per-subject attempt counts from history, for the hover reveal on Metric 1
    const subjectAttemptCounts = (stats.attemptHistory as any[]).reduce(
        (acc: Record<string, number>, a: any) => {
            acc[a.subject] = (acc[a.subject] || 0) + 1;
            return acc;
        },
        {},
    );

    // Score delta between the two most recent attempts, for the hover reveal on Metric 2
    const recentScores = (stats.attemptHistory as any[]).map((a) => Number(a.score) || 0);
    const scoreDelta =
        recentScores.length >= 2
            ? recentScores[recentScores.length - 1] - recentScores[recentScores.length - 2]
            : null;

    // Sparkline built from real score history
    const sparklinePoints = (() => {
        if (recentScores.length < 2) return "0,55 800,55";
        const max = Math.max(...recentScores, 100);
        const min = Math.min(...recentScores, 0);
        const range = max - min || 1;
        const step = 800 / (recentScores.length - 1);
        return recentScores
            .map((s, i) => `${(i * step).toFixed(1)},${(100 - ((s - min) / range) * 90 - 5).toFixed(1)}`)
            .join(" ");
    })();

    const readinessLabel =
        stats.averageScorePercent >= 80 ? "Highly Ready" : stats.averageScorePercent >= 60 ? "Competitive" : "Focus Needed";

    const nextMilestone =
        stats.averageScorePercent >= 80
            ? null
            : stats.averageScorePercent >= 60
                ? { target: 80, label: "Highly Ready" }
                : { target: 60, label: "Competitive" };

    return (
        <div className="space-y-8 animate-fade-in px-3 md:px-6">
            {/* ═══════════════ COVER CARD — Current Readiness ═══════════════ */}
            <div
                className="relative overflow-hidden bg-sky-950 card-shadow -mt-4 md:-mt-2"
                style={{
                    marginLeft: "calc(-50vw + 50%)",
                    marginRight: "calc(-50vw + 50%)",
                    width: "auto",
                }}
            >
                {/* Grid pattern background */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                {/* Ambient glow blobs */}
                <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-sky-500/25 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                {/* Faint watermark letter, echoing the old "M" but subtler */}
                <div className="relative z-10 px-5 md:px-12 pt-6 pb-6 md:pt-8 md:pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[10px] font-black uppercase text-sky-200 bg-white/10 border border-white/10 rounded-full tracking-widest backdrop-blur-sm ">
                            <Flame className="flame-icon w-5 h-5 text-amber-300 fill-amber-300/40" /> Current Readiness
                        </span>

                        <div className="flex items-baseline gap-1.5">
                            <span className="font-mono-custom font-black text-6xl md:text-7xl bg-gradient-to-b from-white to-sky-300 bg-clip-text text-transparent leading-none">
                                {stats.averageScorePercent || "0.0"}
                            </span>
                            <span className="font-mono-custom font-black text-2xl md:text-3xl text-sky-400">%</span>
                        </div>

                        <p className="max-w-md font-semibold text-sky-200/80 text-xs sm:text-sm leading-relaxed">
                            {stats.totalAttempts > 0
                                ? `You've completed ${stats.totalAttempts} exams. Keep drilling practice questions to move this number.`
                                : "Formulate standard custom practice tests. Your AI tutor will score your results relative to regional UHS thresholds."}
                        </p>

                    </div>


<div className="flex flex-col sm:flex-row gap-3 shrink-0 md:self-end">
                        <div className="sp">
                            <button onClick={onStartGenQuiz} className="sparkle-button">
                                <span className="spark"></span>
                                <span className="backdrop"></span>
                                <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                <span className="sparkle-text">Start AI Prep Exam</span>
                            </button>
                            <div className="bodydrop"></div>
                            <span aria-hidden="true" className="particle-pen">
                                {PARTICLE_CONFIG.map((p, i) => (
                                    <svg
                                        key={i}
                                        className="particle"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ "--x": p.x, "--y": p.y, "--size": p.size, "--duration": p.duration, "--delay": p.delay, "--alpha": p.alpha } as React.CSSProperties}
                                    >
                                        <path d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ Core Summary Metrics Grid — solid color cards with icon micro-interactions ═══════════════ */}
            <div className="px-1 md:px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ">
                    {/* Metric 1: Total Completed Attempts — sky solid — closed book opens on hover */}
                    <div className="group relative px-5 py-7 min-h-[145px] rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-700 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.20)] flex items-center gap-3 h-full">
                        <div className="w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ">
                            <Book className="w-5 h-5 group-hover:hidden" />
                            <BookOpen className="w-5 h-5 hidden group-hover:block" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[10px] text-sky-100 font-black uppercase tracking-wider block ">
                                Completed
                            </span>
                            <div className="text-3xl font-black text-white">
                                {stats.totalAttempts}
                            </div>
                            <span className="text-[10px] text-sky-100/80 font-bold uppercase tracking-wide block">
                                PMDC modules
                            </span>
                        </div>
                    </div>

                    {/* Metric 2: Average Score percentage — emerald solid — medal turns golden on hover */}
                    <div className="group relative px-5 py-7 min-h-[145px] rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.20)] flex items-center gap-3 h-full  ">
                        <div className="w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            <Award className="w-5 h-5 text-white group-hover:text-amber-300 group-hover:fill-amber-300/30 transition-colors duration-300" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[10px] text-emerald-100 font-black uppercase tracking-wider block">
                                Avg Score
                            </span>
                            <div className="text-3xl font-black text-white">
                                {stats.averageScorePercent}%
                            </div>
                            <div className="w-full bg-white/20 h-1.5 rounded-full mt-1 overflow-hidden">
                                <div
                                    className="bg-white h-full rounded-full transition-all duration-500"
                                    style={{ width: `${stats.averageScorePercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Metric 3: Active Focus Minutes Tracker — amber solid — dart flies into dartboard on hover */}
                    <div className="group relative px-5 py-7 min-h-[145px] rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.20)] flex items-center gap-3 h-full  ">
                        <div className="relative w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                            <Clock3 className="clock-swing w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[10px] text-amber-50 font-black uppercase tracking-wider block">
                                Focus Hours
                            </span>
                            <div className="text-3xl font-black text-white">
                                {stats.totalFocusMinutes ? (stats.totalFocusMinutes / 60).toFixed(1) : "0.0"}{" "}
                                <span className="text-xs font-black text-amber-50 uppercase">hr</span>
                            </div>
                            <span className="text-[9px] text-amber-50/80 font-bold uppercase tracking-wide block">
                                {stats.totalFocusMinutes || 0} mins
                            </span>
                        </div>
                    </div>

                    {/* Metric 4: Study Streak Tracker — rose solid — flame flickers, ash rises on hover */}
                    <div className="group relative px-5 py-7 min-h-[145px] rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.20)] flex items-center gap-3 h-full ">
                        <div className="relative w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            <Flame className="flame-icon w-5 h-5 fill-amber-300/40 text-amber-300" />
                            <span className="ash-particle absolute top-1 left-2.5 w-1 h-1 rounded-full bg-white/70 opacity-0" />
                            <span className="ash-particle absolute top-1 right-2.5 w-1 h-1 rounded-full bg-white/70 opacity-0" style={{ animationDelay: "0.3s" }} />
                            <span className="ash-particle absolute top-0 left-1/2 w-1 h-1 rounded-full bg-white/70 opacity-0" style={{ animationDelay: "0.6s" }} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[10px] text-rose-100 font-black uppercase tracking-wider block flex items-center gap-1">
                                Streak
                            </span>
                            <div className="text-3xl font-black text-white flex items-baseline gap-1">
                                {stats.studyStreak || 0}
                                <span className="text-[9px] font-black uppercase text-rose-100">
                                    {stats.studyStreak === 1 ? "Day" : "Days"}
                                </span>
                            </div>
                            <span className="text-[10px] text-rose-100/80 font-bold uppercase tracking-wide block">
                                {stats.studyStreak && stats.studyStreak > 0 ? "Keep going!" : "Start today!"}
                            </span>
                        </div>
                    </div>

                    {/* Metric 5: Target Rank Progress — violet solid — star turns golden on hover */}
                    <div className="group relative px-5 py-7 min-h-[145px] rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-[0_1px_3px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.20)] flex items-center gap-3 h-full  ">
                        <div className="w-11 h-11 bg-white/15 text-white rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                            <Star className="w-5 h-5 text-white group-hover:text-amber-300 group-hover:fill-amber-300 transition-colors duration-300" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="text-[12px] text-violet-100 font-black uppercase tracking-wider block">
                                Grade
                            </span>
                            <div className="text-[15px] font-black text-white uppercase tracking-tight leading-tight">
                                {readinessLabel}
                            </div>
                            <span className="text-[10px] text-violet-100/80 font-bold uppercase tracking-wide block">
                                Rank status
                            </span>
                        </div>
                    </div>
                </div>
            </div>


{/* ═══════════════ 1. AI Study Recommendations ═══════════════ */}
            <div className="p-4 md:p-5 rounded-3xl border border-sky-100 shadow-[0_0_30px_-5px_rgba(0,0,0,0.12)] space-y-4 relative overflow-hidden mx-auto max-h-[380px] flex flex-col max-w-full">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-sky-50 blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-sky-600 flex items-center justify-center shrink-0 shadow-lg shadow-sky-200">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-sky-950">AI STUDY RECOMMENDATIONS</h3>
                            <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">Personalized weak-area guidance</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRegenerateRecommendation}
                        disabled={isGeneratingRec || stats.totalAttempts === 0}
                        className={`text-[11px] px-4 py-2.5 text-white bg-sky-600 hover:bg-sky-700 font-extrabold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-sky-200 ${stats.totalAttempts === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={stats.totalAttempts === 0 ? "Complete at least 1 quiz to trigger AI analysis" : "Regenerate advice based on your weak sub-topics"}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingRec ? "animate-spin" : ""}`} />
                        {isGeneratingRec ? "Analyzing..." : "Refresh AI"}
                    </button>
                </div>

                {recError && (
                    <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-sm flex items-start gap-2.5 relative z-10">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>{recError}</p>
                    </div>
                )}

                {stats.totalAttempts === 0 ? (
                    <div className="p-8 rounded-2xl bg-sky-50/50 border border-sky-100 text-center space-y-4 relative z-10">
                        <p className="text-sm font-bold text-sky-900 leading-relaxed max-w-md mx-auto">
                            Attempt some practice quizzes first! The AI counselor will automatically inspect your wrong options to formulate precise curriculum guidance and textbook focus.
                        </p>
                        <button
                            onClick={onStartGenQuiz}
                            className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-sky-200"
                        >
                            Generate Practice Exam
                        </button>
                    </div>
                ) : latestRec ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={latestRec.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5 relative z-10"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-bold text-sky-500">Target Focus:</span>
                                <span className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg border ${getSubjectColor(latestRec.subject).bg}`}>
                                    {latestRec.subject}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-black text-sky-950 uppercase tracking-wide block">Critical Sub-Topics Needing Review:</span>
                                <div className="flex flex-wrap gap-2">
                                    {((latestRec as any).focusTopics || (latestRec as any).focus_topics || []).map((topic: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1.5 text-sm font-bold text-sky-900 bg-sky-50 border border-sky-100 rounded-lg flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {(() => {
                                const confidence = Number((latestRec as any).scoreLevel ?? (latestRec as any).score_level ?? 0);
                                const strategyText = (((latestRec as any).notes || "").split("\n").find((p: string) => p.trim())) || "";
                                return (
                                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
                                            {/* Actionable Strategy */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center shrink-0">
                                                    <Target className="w-4.5 h-4.5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-sky-600 tracking-wide mb-1 uppercase">Actionable Strategy</p>
                                                    <p className="text-sm font-bold text-sky-900 leading-snug">
                                                        {strategyText || `Focus on revising key concepts in ${latestRec.subject}.`}
                                                    </p>
                                                </div>
                                            </div>

{/* Confidence Ring */}
<div className="flex flex-col items-center gap-1 justify-self-center md:border-l md:border-r md:border-sky-200 md:px-6">
                                                <div className="relative w-20 h-20">
                                                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                                        <circle cx="40" cy="40" r="34" fill="none" stroke="#e0f2fe" strokeWidth="8" />
                                                        <circle
                                                            cx="40" cy="40" r="34"
                                                            fill="none"
                                                            stroke="#0284c7"
                                                            strokeWidth="8"
                                                            strokeLinecap="round"
                                                            strokeDasharray={2 * Math.PI * 34}
                                                            strokeDashoffset={2 * Math.PI * 34 * (1 - confidence / 100)}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-lg font-black text-sky-950">{confidence.toFixed(0)}%</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-sky-400 tracking-wide uppercase">Confidence</span>
                                            </div>

                                            {/* Why this */}
                                            <div>
                                                <p className="text-xs font-black text-sky-600 tracking-wide mb-1 uppercase flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    Why this?
                                                </p>
                                                <p className="text-sm font-semibold text-sky-500 leading-snug">
                                                    Your recent performance in {latestRec.subject} is below your average.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="flex justify-center py-6 relative z-10">
                        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* ═══════════════ 2. Recent Answer Logs ═══════════════ */}
            <div className="p-7 md:p-8 rounded-3xl bg-white border border-sky-100 card-shadow space-y-5 shadow-[0_0_30px_-5px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
                        <History className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-sky-950">RECENT ANSWER LOGS</h3>
                        <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">Your latest exam attempts</p>
                    </div>
                </div>

                {stats.attemptHistory.length === 0 ? (
                    <div className="py-10 text-center text-sky-400 text-sm font-bold uppercase tracking-wider">
                        No quiz history. Complete your first practice test above to see performance graphs.
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                        {stats.attemptHistory.slice().reverse().map((attempt: any, index: number) => (
                            <div key={index} className="p-4 bg-sky-50/50 hover:bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-between gap-3 transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getSubjectColor(attempt.subject).badge}`}></span>
                                    <div className="space-y-1 min-w-0">
                                        <span className="text-[10px] uppercase font-black text-sky-400 tracking-wider block">{attempt.subject}</span>
                                        <h4 className="text-sm font-bold text-sky-900 line-clamp-1">{attempt.title}</h4>
                                        <p className="text-[11px] text-sky-500 font-medium">{attempt.date}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`px-3 py-1.5 text-sm font-mono-custom font-bold rounded-xl ${attempt.score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : attempt.score >= 55 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                                        {Number(attempt.score).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ═══════════════ 4. Standard Papers ═══════════════ */}
            <div className="p-7 md:p-8 rounded-3xl bg-white border border-sky-100 card-shadow space-y-5 shadow-[0_0_30px_-5px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tight text-sky-950">STANDARD PAPERS</h3>
                            <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">Board-style practice tests</p>
                        </div>
                    </div>

                    <select
                        value={selectedSubjectFilter}
                        onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                        className="text-sm font-bold border border-sky-100 rounded-xl bg-sky-50/50 px-3 py-2 text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="All">All Subjects</option>
                        <option value="Biology">Biology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="English">English</option>
                        <option value="Logical Reasoning">Logical Reasoning</option>
                    </select>
                </div>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {filteredQuizzes.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-sm font-bold uppercase tracking-wider">
                            No quizzes available in this topic.
                        </div>
                    ) : (
                        filteredQuizzes.map((quiz) => (
                            <button
                                key={quiz.id}
                                onClick={() => onSelectQuiz(quiz.id)}
                                className="w-full text-left p-4 border border-sky-100/70 hover:border-sky-300 hover:bg-sky-50/40 rounded-2xl flex items-center justify-between gap-3 group transition-all"
                            >
                                <div className="space-y-1.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${getSubjectColor(quiz.subject).badge}`}></span>
                                        <span className="text-[11px] text-sky-400 uppercase font-black tracking-wider">{quiz.subject}</span>
                                        {quiz.isAiGenerated && (
                                            <span className="px-2 py-0.5 text-[10px] font-black uppercase text-sky-700 bg-sky-100 rounded flex items-center gap-1">
                                                <Sparkles className="w-2.5 h-2.5" /> AI
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold text-sky-950 group-hover:text-sky-600 transition">{quiz.title}</h4>
                                    <p className="text-[11px] text-sky-500 font-medium uppercase tracking-tight">{quiz.subTopic} • {quiz.difficulty}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-sky-300 group-hover:text-sky-600 transition-all transform group-hover:translate-x-1 shrink-0" />
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ═══════════════ 5. Subject Wise Diagnostic Mastery ═══════════════ */}
            <div className="p-7 md:p-8 rounded-3xl bg-white border border-sky-100 card-shadow space-y-6 shadow-[0_0_30px_-5px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-100">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-sky-950">SUBJECT WISE DIAGNOSTIC MASTERY</h3>
                        <p className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                            Percentage of correctly answered questions per curriculum syllabus segment
                        </p>
                    </div>
                </div>

<div className="space-y-4">
                    {stats.subjectBreakdown.map((breakdown: any) => {
                        const theme = SUBJECT_THEME[breakdown.subject];
                        const SubjectIcon = SUBJECT_ICON[breakdown.subject];
                        return (
                            <div
                                key={breakdown.subject}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50/40 border border-sky-100"
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
                                    <SubjectIcon className="w-5 h-5 text-white" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div>
                                        <p className="font-black text-sky-950 text-sm leading-tight">{breakdown.subject}</p>
                                        <p className="text-xs font-semibold text-sky-400">
                                            {breakdown.correctQuestions} / {breakdown.totalQuestions} MCQs
                                        </p>
                                    </div>
                                    <div className="relative w-full pt-5">
                                        <div
                                            className={`absolute -top-0.5 px-2 py-0.5 rounded-md text-[10px] font-black text-white -translate-x-1/2 whitespace-nowrap ${theme.iconBg}`}
                                            style={{ left: `${breakdown.percentage}%` }}
                                        >
                                            {breakdown.percentage}%
                                        </div>
                                        <div className="relative w-full bg-sky-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${theme.iconBg}`}
                                                style={{ width: `${breakdown.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                
                            </div>
                        );
                    })}
                </div>
        </div>
        </div>
    );
}