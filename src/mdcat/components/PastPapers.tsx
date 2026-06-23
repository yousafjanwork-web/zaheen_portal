/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  BookMarked,
  ArrowRight,
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Quiz } from "../types";

interface PastPapersProps {
  quizzes: Quiz[];
  onSelectQuiz: (id: number) => void;
}

export default function PastPapers({ quizzes, onSelectQuiz }: PastPapersProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // AI Chat states
  const [chatSubject, setChatSubject] = useState<string>("Biology");
  const [chatLanguage, setChatLanguage] = useState<string>(
    "Bilingual (Urdu + Eng)",
  );
  const [chatQuestion, setChatQuestion] = useState<string>("");
  const [chatReply, setChatReply] = useState<string>("");
  const [isAskingAI, setIsAskingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter quizzes that are past papers
  const pastPapers = quizzes.filter((q) => !!q.isPastPaper);

  // Build dynamic year list from actual DB data
  const availableYears = Array.from(
    new Set(
      pastPapers
        .filter((p) => p.pastPaperYear)
        .map((p) => p.pastPaperYear!.toString()),
    ),
  ).sort((a, b) => Number(b) - Number(a));

  // Build dynamic region list from actual DB data
  const availableRegions = Array.from(
    new Set(
      pastPapers
        .filter((p) => p.pastPaperRegion)
        .map((p) => p.pastPaperRegion!),
    ),
  ).sort();

  const filteredPapers = pastPapers.filter((paper) => {
    const matchesYear =
      selectedYear === "All" ||
      paper.pastPaperYear?.toString() === selectedYear;
    // Use exact match now that dropdown values come from DB
    const matchesRegion =
      selectedRegion === "All" || paper.pastPaperRegion === selectedRegion;
    const matchesSearch =
      searchQuery === "" ||
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subTopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesRegion && matchesSearch;
  });

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    setIsAskingAI(true);
    setAiError(null);
    setChatReply("");

    try {
      const response = await fetch("/api/mdcat/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: chatQuestion,
          subject: chatSubject,
          language: chatLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to retrieve AI explanation");

      const data = await response.json();
      setChatReply(data.data?.reply ?? data.reply);
    } catch (err: any) {
      setAiError(err.message || "Error communicating with Zaheen AI Tutor.");
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleSelectQuiz = (id: number) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    onSelectQuiz(id);
  };

  const presetDoubts = [
    { text: "Why are transition elements colored?", subj: "Chemistry" },
    { text: "Help me memorize active transport rules", subj: "Biology" },
    {
      text: "Differentiate between scalar and vector fields on MDCAT",
      subj: "Physics",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-sky-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 card-shadow">
        <div className="relative z-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-3 opacity-90">
            Authentic Preparation
          </h2>
          <div className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            MDCAT Past Papers
          </div>
          <p className="mt-4 max-w-lg font-bold text-sky-100 text-xs sm:text-sm leading-relaxed">
            Gain a competitive edge by practicing actual previous board
            questions formulated by UHS Lahore, KMU, NUMS, and DUHS.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 select-none pointer-events-none">
          <BookMarked className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* 180-Question PMDC Simulation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50/70 to-orange-50/70 border border-orange-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-shadow relative overflow-hidden group">
        <div className="space-y-1.5 z-10">
          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-orange-700 bg-orange-100 rounded-md tracking-wider">
            PMDC standard simulation
          </span>
          <h3 className="text-base font-black text-sky-950 uppercase tracking-tight flex items-center gap-1.5">
            180 questions complete paper style quiz ⏱️
          </h3>
          <p className="text-xs text-sky-900/70 font-bold max-w-xl leading-relaxed">
            Take a complete syllabus exam composed of{" "}
            <b className="text-sky-950">
              60 Biology, 50 Chemistry, 45 Physics, 18 English, and 7 Logical
              Reasoning
            </b>{" "}
            questions. Includes a dynamic 210-minute (3.5 hours) countdown board
            timer!
          </p>
        </div>
       <button
          onClick={() => handleSelectQuiz(1800)}
          className="px-5 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl flex items-center gap-1.5 transition shrink-0 card-shadow hover:scale-[1.03] active:scale-95"
        >
          <span>Launch 180-QS Exam</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none text-9xl group-hover:scale-110 transition-all">
          ⏱️
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Past Papers List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
                  Available Past Papers
                  <span className="ml-2 px-2 py-0.5 text-[9px] font-black bg-sky-100 text-sky-700 rounded-md">
                    {filteredPapers.length} papers
                  </span>
                </h3>
                <p className="text-xs text-sky-500 font-bold">
                  Select any region or year to begin practice.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Dynamic Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/50 px-2 py-1 text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="All">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Dynamic Region Filter */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/50 px-2 py-1 text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="All">All Regions</option>
                  {availableRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search bar */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers by title, subject, or topic..."
              className="w-full text-xs font-bold border border-sky-100 rounded-xl bg-sky-50/30 px-4 py-2.5 text-sky-950 focus:outline-none focus:border-sky-300 transition"
            />

            {/* Past Papers List */}
            <div className="space-y-4">
              {filteredPapers.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
                    No matching past papers found.
                  </p>
                  <p className="text-sky-300 text-[10px] font-bold">
                    {pastPapers.length === 0
                      ? "No past papers loaded from database yet."
                      : "Try changing the year or region filters."}
                  </p>
                  {pastPapers.length === 0 && (
                    <p className="text-amber-500 text-[10px] font-bold mt-2">
                      ⚠️ Total quizzes loaded: {quizzes.length} — Past papers
                      found: {pastPapers.length}
                    </p>
                  )}
                </div>
              ) : (
                filteredPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-5 border border-sky-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-300 hover:bg-sky-50/20 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wide bg-sky-100 text-sky-800 rounded">
                          {paper.pastPaperYear} Past Paper
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wide bg-lime-100 text-lime-800 rounded">
                          {paper.pastPaperRegion}
                        </span>
                        <span className="text-[10px] text-sky-600 font-bold uppercase">
                          {paper.subject}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-sky-950 group-hover:text-sky-600 transition">
                        {paper.title}
                      </h4>
                      <p className="text-xs text-sky-600 font-bold">
                        Focus: {paper.subTopic}
                      </p>
                    </div>

                 <button
                      onClick={() => handleSelectQuiz(paper.id)}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center transition-all card-shadow"
                    >
                      <span>Solve Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Tutor */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                <Sparkles className="w-4 h-4 fill-sky-200" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-sky-950">
                  Ask Zaheen AI Tutor
                </h3>
                <p className="text-[10px] text-sky-500 font-bold uppercase">
                  Dynamic concept explanation bot.
                </p>
              </div>
            </div>

            <form onSubmit={handleAskAI} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-sky-400 block mb-1">
                    Subject
                  </label>
                  <select
                    value={chatSubject}
                    onChange={(e) => setChatSubject(e.target.value)}
                    className="w-full text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/50 p-2 text-sky-900 focus:outline-none"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="English">English</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-sky-400 block mb-1">
                    Language
                  </label>
                  <select
                    value={chatLanguage}
                    onChange={(e) => setChatLanguage(e.target.value)}
                    className="w-full text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/50 p-2 text-sky-900 focus:outline-none"
                  >
                    <option value="Bilingual (Urdu + Eng)">
                      Bilingual (Urdu + Eng)
                    </option>
                    <option value="English Only">English Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-sky-400 block mb-1">
                  Enter Doubt or Question
                </label>
                <div className="relative">
                  <textarea
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    placeholder="Ask about formulas, textbook lines, or tricky past paper MCQs..."
                    className="w-full h-24 text-xs font-bold border border-sky-100 rounded-2xl bg-sky-50/30 p-3 pr-10 text-sky-950 focus:outline-none focus:border-sky-300 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                  <button
                    type="submit"
                    disabled={isAskingAI || !chatQuestion.trim()}
                    className="absolute right-2.5 bottom-2.5 w-7 h-7 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center transition disabled:opacity-50"
                  >
                    {isAskingAI ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Quick preset doubts */}
            <div className="space-y-2 pt-2 border-t border-sky-50">
              <span className="text-[9px] uppercase font-black text-sky-400 tracking-wider block">
                Suggested Doubts:
              </span>
              <div className="flex flex-col gap-1.5">
                {presetDoubts.map((doubt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatQuestion(doubt.text);
                      setChatSubject(doubt.subj);
                    }}
                    className="text-[10px] font-bold text-sky-700 hover:text-sky-950 text-left p-2 bg-sky-50/40 hover:bg-sky-50/80 rounded-lg border border-sky-100/30 cursor-pointer transition"
                  >
                    • {doubt.text} ({doubt.subj})
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Area */}
            <AnimatePresence mode="wait">
              {aiError && (
                <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold leading-relaxed flex items-start gap-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p>{aiError}</p>
                </div>
              )}

              {chatReply && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs font-bold text-sky-900 leading-relaxed space-y-2 max-h-[250px] overflow-y-auto animate-fade-in">
                  <div className="font-black text-xs text-sky-700 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-sky-200 text-sky-600" />{" "}
                    Zaheen AI Advice:
                  </div>
                  <div className="space-y-2 text-sky-950 font-sans leading-relaxed whitespace-pre-wrap">
                    {chatReply}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
