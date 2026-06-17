/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  BookMarked,
  BookOpen,
  ChevronRight,
  Activity,
  Stethoscope,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PerformanceStats,
  StudyRecommendation,
  Quiz,
  MDCATSubject,
} from "./types";
import { mdcatApi } from "../config";
import Dashboard from "../components/Dashboard";
import QuizSession from "../components/QuizSession";
import AIQuizGenerator from "../components/AIQuizGenerator";
import PastPapers from "../components/PastPapers";
import ZaheenLogo from "../components/ZaheenLogo";
import FocusTimer from "../components/FocusTimer";
import StudyNotes from "../components/StudyNotes";

const mapQuiz = (q: any): Quiz => ({
  ...q,
  subTopic: q.subTopic ?? q.sub_topic ?? "",
  isAiGenerated: q.isAiGenerated ?? q.is_ai_generated === 1,
  isPastPaper: q.isPastPaper ?? q.is_past_paper === 1,
  pastPaperYear: q.pastPaperYear ?? q.past_paper_year ?? null,
  pastPaperRegion: q.pastPaperRegion ?? q.past_paper_region ?? null,
  createdAt: q.createdAt ?? q.created_at ?? null,
});

const mapQuestion = (q: any) => ({
  ...q,
  questionText: q.questionText ?? q.question_text ?? "",
  optionA: q.optionA ?? q.option_a ?? "",
  optionB: q.optionB ?? q.option_b ?? "",
  optionC: q.optionC ?? q.option_c ?? "",
  optionD: q.optionD ?? q.option_d ?? "",
  correctOption: q.correctOption ?? q.correct_option ?? "A",
  subTopic: q.subTopic ?? q.sub_topic ?? "",
});

export function MDCATmobile() {
  const [searchParams] = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as
      | "dashboard"
      | "ai-generator"
      | "past-papers"
      | "notes") || "ai-generator";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    totalAttempts: 0,
    averageScorePercent: 0,
    subjectBreakdown: [],
    subTopicList: [],
    attemptHistory: [],
  });

  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [quizzesRes, statsRes, recsRes] = await Promise.all([
        fetch(mdcatApi("/api/mdcat/quizzes")),
        fetch(mdcatApi("/api/mdcat/performance")),
        fetch(mdcatApi("/api/mdcat/recommendations")),
      ]);

      if (quizzesRes.ok && statsRes.ok && recsRes.ok) {
        const quizzesData = await quizzesRes.json();
        const statsData = await statsRes.json();
        const recsData = await recsRes.json();

        const rawQuizzes = Array.isArray(quizzesData.data) ? quizzesData.data : [];
        setQuizzes(rawQuizzes.map(mapQuiz));
        setPerformanceStats(statsData);
        setRecommendations(Array.isArray(recsData.data) ? recsData.data : []);
      }
    } catch (e) {
      console.error("[App] Failed to prefetch full-stack parameters:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSelectQuiz = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(mdcatApi(`/api/mdcat/quizzes/${id}`));
      if (res.ok) {
        const json = await res.json();
        const quizData: Quiz = json.data ?? json;
        setActiveQuiz(quizData);
        setSelectedQuizId(id);
      }
    } catch (e) {
      console.error("Failed to load quiz details", e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizGenerated = (newQuiz: Quiz) => {
    const raw = (newQuiz as any).data ?? newQuiz;
    const quiz: Quiz = {
      ...mapQuiz(raw),
      questions: (raw.questions || []).map(mapQuestion),
    };
    setQuizzes((prev) => [quiz, ...prev]);
    setActiveQuiz(quiz);
    setSelectedQuizId(quiz.id);
  };

  const handleAttemptFinished = async () => {
    await fetchAllData();
  };

  const getSubjectColorBadge = (subject: string) => {
    switch (subject) {
      case "Biology": return "bg-emerald-500";
      case "Chemistry": return "bg-amber-500";
      case "Physics": return "bg-purple-500";
      case "English": return "bg-blue-500";
      default: return "bg-rose-500";
    }
  };

  const examDate = new Date("2026-08-16T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.max(
    0,
    Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="min-h-screen bg-brand-50/70 text-slate-800 flex flex-col font-sans selection:bg-brand-200">

      {/* ── Header: logo kept, title text removed ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-sky-100 px-6 py-4 flex items-center justify-between card-shadow">
       <div className="flex items-center gap-1.5 matches-logo">
  {/* ✅ Logo removed, title text restored */}
  <div className="pl-1">
    <h1 className="text-sm md:text-base font-black tracking-tight text-sky-900 uppercase">
      zaheen MDCAT Prep
    </h1>
    <p className="text-[9px] text-sky-400 font-bold tracking-widest uppercase">
      Pakistan Curriculum Standard
    </p>
  </div>
</div>
        {/* EXAM IN / DAYS / ZH — unchanged */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-sky-400 tracking-wider">
              EXAM IN
            </p>
            <p className="text-xs md:text-sm font-black text-sky-900">
              {daysLeft} DAYS
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center font-display text-xs font-black text-sky-800">
            ZH
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Nav */}
        <nav className="lg:col-span-3 space-y-4 shrink-0">
          <div className="bg-white p-6 rounded-3xl border border-sky-100 card-shadow space-y-4">
            <h3 className="text-[10px] uppercase font-black text-sky-400 tracking-widest">
              Navigation
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab("dashboard"); setSelectedQuizId(null); setActiveQuiz(null); }}
                className={`w-full flex items-center justify-between gap-3 p-3 text-xs rounded-xl transition-all ${activeTab === "dashboard" && !selectedQuizId ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow" : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"}`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => { setActiveTab("ai-generator"); setSelectedQuizId(null); setActiveQuiz(null); }}
                className={`w-full flex items-center justify-between gap-3 p-3 text-xs rounded-xl transition-all ${activeTab === "ai-generator" && !selectedQuizId ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow" : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Prep Exams</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => { setActiveTab("past-papers"); setSelectedQuizId(null); setActiveQuiz(null); }}
                className={`w-full flex items-center justify-between gap-3 p-3 text-xs rounded-xl transition-all ${activeTab === "past-papers" && !selectedQuizId ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow" : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"}`}
              >
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  <span>MDCAT Past Papers</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => { setActiveTab("notes"); setSelectedQuizId(null); setActiveQuiz(null); }}
                className={`w-full flex items-center justify-between gap-3 p-3 text-xs rounded-xl transition-all ${activeTab === "notes" && !selectedQuizId ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow" : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Syllabus Study Notes</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>

          <FocusTimer onSessionLogged={fetchAllData} />

          <div className="hidden lg:block bg-white p-6 rounded-3xl border border-sky-100 card-shadow space-y-4">
            <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-widest">
              Syllabus Check
            </h4>
            <div className="space-y-3.5">
              {["Biology", "Chemistry", "Physics", "English", "Logical Reasoning"].map((name) => {
                const pct = performanceStats.subjectBreakdown.find((s) => s.subject === name)?.percentage || 0;
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                      <span>{name}</span>
                      <span className="font-mono-custom text-slate-900">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getSubjectColorBadge(name)}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Right Main Content */}
        <main className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading-frame" className="p-16 text-center bg-white border border-brand-100 rounded-3xl min-h-[400px] flex flex-col items-center justify-center space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
                <p className="text-xs text-slate-500 font-mono-custom">Reading syllabus indices, preparing test engines...</p>
              </motion.div>
            ) : selectedQuizId && activeQuiz ? (
              <motion.div key="quiz-session-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <QuizSession quiz={activeQuiz} onBack={() => { setSelectedQuizId(null); setActiveQuiz(null); setActiveTab("dashboard"); }} onAttemptFinished={handleAttemptFinished} refreshData={fetchAllData} />
              </motion.div>
            ) : activeTab === "dashboard" ? (
              <motion.div key="dashboard-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Dashboard stats={performanceStats} recommendations={recommendations} onStartGenQuiz={() => setActiveTab("ai-generator")} onSelectQuiz={handleSelectQuiz} availableQuizzes={quizzes} refreshData={fetchAllData} />
              </motion.div>
            ) : activeTab === "ai-generator" ? (
              <motion.div key="ai-generator-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AIQuizGenerator onQuizGenerated={handleQuizGenerated} onBack={() => setActiveTab("dashboard")} />
              </motion.div>
            ) : activeTab === "past-papers" ? (
              <motion.div key="past-papers-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <PastPapers quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />
              </motion.div>
            ) : (
              <motion.div key="study-notes-frame" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <StudyNotes onSelectQuiz={handleSelectQuiz} onBack={() => setActiveTab("dashboard")} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ✅ Footer: both text lines removed, footer itself kept minimal */}
      <footer className="mt-auto border-t border-brand-100 bg-white/50 py-5" />
    </div>
  );
}