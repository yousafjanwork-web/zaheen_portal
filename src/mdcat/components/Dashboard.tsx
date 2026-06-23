/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  BookOpen,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Flame,
} from "lucide-react";
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

export default function Dashboard({
  stats,
  recommendations,
  onStartGenQuiz,
  onSelectQuiz,
  availableQuizzes,
  refreshData,
}: DashboardProps) {
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

  // Trigger dynamic AI Advice Regeneration using historical wrong answers
  const handleRegenerateRecommendation = async () => {
    setIsGeneratingRec(true);
    setRecError(null);
    try {
      const response = await fetch(
        mdcatAiApi("/api/mdcat/recommendations/generate"),
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Readiness Banner */}
      <div className="bg-sky-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 card-shadow">
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-3 opacity-90">
            Current Readiness
          </h2>
          <div className="bold-number">
            {stats.averageScorePercent || "0.0"}
            <span className="text-3xl font-black">%</span>
          </div>
          <p className="mt-5 max-w-md font-bold text-sky-100 text-xs sm:text-sm leading-relaxed">
            {stats.totalAttempts > 0
              ? `You have completed ${stats.totalAttempts} exams. Your curriculum retention is solid. Keep drilling practice questions below!`
              : "Formulate standard custom practice tests. Your AI tutor will score your results relative to regional UHS thresholds."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
          <button
            onClick={onStartGenQuiz}
            className="px-6 py-4 bg-white text-sky-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-sky-50 transition-all duration-150 shadow-md transform hover:scale-[1.01]"
          >
            Start AI Prep Exam
          </button>
        </div>
        <div className="absolute -right-12 -bottom-12 opacity-15 select-none pointer-events-none">
          <div className="bold-number" style={{ fontSize: "15rem" }}>
            M
          </div>
        </div>
      </div>

      {/* Core Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
        {/* Metric 1: Total Completed Attempts */}
        <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow flex items-center gap-5 h-full">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider block">
              Completed Quizzes
            </span>
            <div className="text-2xl font-black text-sky-950">
              {stats.totalAttempts}
            </div>
            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wide block">
              PMDC modules
            </span>
          </div>
        </div>

        {/* Metric 2: Average Score percentage */}
        <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow flex items-center gap-5 h-full">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider block">
              Average Test Score
            </span>
            <div className="text-2xl font-black text-sky-950">
              {stats.averageScorePercent}%
            </div>
            <div className="w-full bg-sky-50 h-2 rounded-full mt-1.5 overflow-hidden border border-sky-100">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.averageScorePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Focus Minutes Tracker */}
        <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow flex items-center gap-5 h-full">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-100 text-amber-500 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] text-amber-500 font-black uppercase tracking-wider block">
              Study Focus Hours
            </span>
            <div className="text-2xl font-black text-sky-950">
              {stats.totalFocusMinutes
                ? (stats.totalFocusMinutes / 60).toFixed(1)
                : "0.0"}{" "}
              <span className="text-xs font-black text-sky-500 uppercase">
                hr
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide block">
              {stats.totalFocusMinutes || 0} focussed mins
            </span>
          </div>
        </div>

        {/* Metric 4: Study Streak Tracker */}
        <div className="p-6 rounded-3xl bg-orange-50/20 border border-orange-100 card-shadow flex items-center gap-5 transition hover:bg-orange-50/40 relative overflow-hidden group h-full">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-all">
            <Flame className="w-6 h-6 fill-orange-200 animate-bounce text-orange-600" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] text-orange-600 font-black uppercase tracking-wider block flex items-center gap-1">
              Study Streak <span className="text-xs">🔥</span>
            </span>
            <div className="text-2xl font-black text-sky-950 flex items-baseline gap-1">
              {stats.studyStreak || 0}
              <span className="text-[10px] font-black uppercase text-orange-600">
                {" "}
                {stats.studyStreak === 1 ? "Day" : "Days"}
              </span>
            </div>
            <span className="text-[10px] text-orange-650 text-orange-805 font-bold uppercase tracking-wide block">
              {stats.studyStreak && stats.studyStreak > 0
                ? "Excellent streak!"
                : "Complete a test!"}
            </span>
          </div>
          {/* subtle absolute styling background */}
          <div className="absolute -right-2 -bottom-2 text-orange-100/30 font-black text-5xl select-none pointer-events-none group-hover:scale-110 transition-all">
            🔥
          </div>
        </div>

        {/* Metric 5: Target Rank Progress */}
        <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow flex items-center gap-5 h-full">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] text-sky-400 font-black uppercase tracking-wider block">
              Candidate Grade
            </span>
            <div className="text-base font-black text-sky-950 uppercase tracking-tight leading-4">
              {stats.averageScorePercent >= 80
                ? "Highly Ready"
                : stats.averageScorePercent >= 60
                  ? "Competitive"
                  : "Focus Needed"}
            </div>
            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wide block pt-1">
              Dynamic Rank Status
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: AI study Recommendations Card & Subject Breakdown */}
        <div className="lg:col-span-7 space-y-8">
          {/* Smart AI Study Recommendations Panel */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
                  AI Study Recommendations
                </h3>
              </div>
              <button
                onClick={handleRegenerateRecommendation}
                disabled={isGeneratingRec || stats.totalAttempts === 0}
                className={`text-[10px] px-3 py-1.5 text-sky-600 bg-sky-50 hover:bg-sky-100 font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all ${stats.totalAttempts === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                title={
                  stats.totalAttempts === 0
                    ? "Complete at least 1 quiz to trigger AI analysis"
                    : "Regenerate advice based on your weak sub-topics"
                }
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isGeneratingRec ? "animate-spin" : ""}`}
                />
                {isGeneratingRec ? "Analyzing..." : "Refresh AI"}
              </button>
            </div>

            {recError && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{recError}</p>
              </div>
            )}

            {stats.totalAttempts === 0 ? (
              <div className="p-8 rounded-2xl bg-sky-50/50 border border-sky-100 text-center space-y-4">
                <p className="text-xs font-bold text-sky-900 leading-relaxed">
                  Attempt some practice quizzes first! The AI counselor will
                  automatically inspect your wrong options to formulate precise
                  curriculum guidance and textbooks focus.
                </p>
                <button
                  onClick={onStartGenQuiz}
                  className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold uppercase text-[10px] tracking-widest rounded-xl transition-all"
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
                  className="space-y-4"
                >
                  {/* Subject targeted */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-sky-450 text-sky-500">
                      Target Focus:
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${getSubjectColor(latestRec.subject).bg}`}
                    >
                      {latestRec.subject}
                    </span>
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest font-mono-custom">
                      Confidence: {Number((latestRec as any).scoreLevel ?? (latestRec as any).score_level ?? 0).toFixed(0)}%
                    </span>
                  </div>

                  {/* Specific Key Weak Areas */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-sky-950 uppercase tracking-wide block">
                      Critical Sub-Topics Needing Review:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {((latestRec as any).focusTopics || (latestRec as any).focus_topics || []).map((topic: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-bold text-sky-900 bg-sky-50 border border-sky-100 rounded-md flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Strategic Advice Notes */}
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs font-bold text-sky-900 leading-relaxed max-h-[220px] overflow-y-auto space-y-1">
                    <div className="font-black text-xs text-sky-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-sky-100 text-sky-650 text-sky-600" />{" "}
                      Actionable Strategy:
                    </div>
                    {((latestRec as any).notes || "").split("\n").map(
                      (para, pIdx) =>
                        para.trim() && (
                          <p key={pIdx} className="mb-1.5">
                            {para.startsWith("-") || para.startsWith("*") ? (
                              <span className="pl-2 block">
                                • {para.replace(/^[\s-*]+/, "")}
                              </span>
                            ) : (
                              para
                            )}
                          </p>
                        ),
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Subject Mastery Progress */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-5">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
                Subject Wise Diagnostic Mastery
              </h3>
              <p className="text-xs text-sky-500 font-bold">
                Percentage of correctly answered questions per curriculum
                syllabus segment.
              </p>
            </div>

            <div className="space-y-4">
              {stats.subjectBreakdown.map((breakdown) => (
                <div key={breakdown.subject} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-sky-900 flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-sm ${getSubjectColor(breakdown.subject).badge}`}
                      ></span>
                      {breakdown.subject}
                    </span>
                    <span className="font-semibold font-mono-custom text-sky-950">
                      {breakdown.percentage}%{" "}
                      <span className="font-normal text-sky-400">
                        ({breakdown.correctQuestions}/{breakdown.totalQuestions}{" "}
                        MCQs)
                      </span>
                    </span>
                  </div>
                  <div className="relative w-full bg-sky-50 h-2 rounded-full overflow-hidden border border-sky-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500`}
                      style={{
                        width: `${breakdown.percentage}%`,
                        backgroundColor:
                          breakdown.subject === "Biology"
                            ? "#10b981"
                            : breakdown.subject === "Chemistry"
                              ? "#f59e0b"
                              : breakdown.subject === "Physics"
                                ? "#8b5cf6"
                                : breakdown.subject === "English"
                                  ? "#0ea5e9"
                                  : "#f43f5e",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Recent Attempts History & Available Practice Exams */}
        <div className="lg:col-span-5 space-y-8">
          {/* Recent Quiz Attempts Logs */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-4">
            <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
              Recent Answer Logs
            </h3>

            {stats.attemptHistory.length === 0 ? (
              <div className="py-8 text-center text-sky-400 text-xs font-bold uppercase tracking-wider">
                No quiz history. Complete your first practice test above to see
                performance graphs.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {stats.attemptHistory
                  .slice()
                  .reverse()
                  .map((attempt, index) => (
                    <div
                      key={index}
                      className="p-3 bg-sky-50/50 hover:bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between gap-3 transition"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black text-sky-400 tracking-wider block">
                          {attempt.subject}
                        </span>
                        <h4 className="text-xs font-bold text-sky-900 line-clamp-1">
                          {attempt.title}
                        </h4>
                        <p className="text-[10px] text-sky-500 font-medium">
                          {attempt.date}
                        </p>
                      </div>
                      {/* Score status indicator */}
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-1 text-xs font-mono-custom font-bold rounded-lg ${attempt.score >= 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : attempt.score >= 55 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}
                        >
                          {Number(attempt.score).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* study session logs widget list */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-4">
            <h3 className="text-base font-black uppercase tracking-tight text-sky-950 flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-100" />
              Study Session Logs
            </h3>

            {!stats.focusSessions || stats.focusSessions.length === 0 ? (
              <div className="py-8 text-center text-sky-400 text-xs font-bold uppercase tracking-wider">
                No session logged yet. Use the Pomodoro timer in the sidebar to
                record your focused study intervals!
              </div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {stats.focusSessions
                  .slice()
                  .reverse()
                  .map((session, index) => (
                    <div
                      key={session.id || index}
                      className="p-3 bg-amber-50/20 hover:bg-amber-50/45 border border-amber-100/55 rounded-xl flex items-center justify-between gap-3 transition"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-black text-amber-600 tracking-wider block">
                          Logged Focus
                        </span>
                        <h4 className="text-xs font-bold text-sky-900">
                          {session.subject} Syllabus Study
                        </h4>
                        <p className="text-[10px] text-sky-500 font-medium">
                          {new Date(session.sessionDate).toLocaleDateString(
                            "en-PK",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-1 text-xs font-mono-custom font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
                          {session.duration} mins
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Quick-Action Practice Papers */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
                Standard Papers
              </h3>

              {/* Simple inline subject selection filter */}
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/50 px-2 py-1 text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="All">All Subjects</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Logical Reasoning">Logical Reasoning</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredQuizzes.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                  No quizzes available in this topic.
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <button
                    key={quiz.id}
                    onClick={() => onSelectQuiz(quiz.id)}
                    className="w-full text-left p-3.5 border border-sky-100/50 hover:border-sky-300 hover:bg-sky-50/30 rounded-xl flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${getSubjectColor(quiz.subject).badge}`}
                        ></span>
                        <span className="text-[10px] text-sky-400 uppercase font-black tracking-wider">
                          {quiz.subject}
                        </span>
                        {quiz.isAiGenerated && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase text-sky-700 bg-sky-100 rounded flex items-center gap-0.5">
                            <Sparkles className="w-2 h-2" /> AI
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-sky-950 group-hover:text-sky-600 transition">
                        {quiz.title}
                      </h4>
                      <p className="text-[10px] text-sky-500 font-medium uppercase tracking-tight">
                        {quiz.subTopic} • {quiz.difficulty}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sky-300 group-hover:text-sky-600 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
