/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { mdcatAiApi } from "../config";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  ArrowRight,
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
  Calendar,
  ClipboardList,
  Target,
  CheckCircle2,
  Search,
  X,
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

  useEffect(()=>
    {
      window.scrollTo(0,0)
    },[])

  const pastPapers = quizzes.filter((q) => !!q.isPastPaper);

  const availableYears = Array.from(
    new Set(
      pastPapers
        .filter((p) => p.pastPaperYear)
        .map((p) => p.pastPaperYear!.toString()),
    ),
  ).sort((a, b) => Number(b) - Number(a));

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
      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), {
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

  const presetDoubts = [
    { text: "Why are transition elements colored?", subj: "Chemistry" },
    { text: "Help me memorize active transport rules", subj: "Biology" },
    {
      text: "Differentiate between scalar and vector fields on MDCAT",
      subj: "Physics",
    },
  ];

  return (
    <div className="animate-fade-in ">
      {/* Cover Card */}
      <div
        className="bg-sky-950 px-7 md:px-10 pt-14 pb-8 md:pt-16 md:pb-10 text-white relative overflow-hidden flex flex-col items-center text-center gap-3 border-y border-sky-900 -mt-6 md:-mt-10"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "auto",
        }}
      >
<span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-sky-400 bg-sky-500/15 border border-sky-400/30 rounded-md px-3 py-1">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text h-3.5 w-3.5 shrink-0">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
    <path d="M10 9H8"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
  </svg>
  Year-wise papers
</span>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight flex items-center gap-3 whitespace-nowrap">
          <span>MDCAT</span>
          <span className="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Past Papers by Year</span>
        </h2>

        <p className="text-sm text-sky-200/80 font-semibold leading-relaxed max-w-xl">
          Browse through {availableYears.length || "multiple"} years of MDCAT
          papers. Each paper includes complete solutions and detailed
          explanations for every question.
        </p>
      </div>

      {/* ── SECTION 1: Past Papers ── */}
      <div className="bg-white py-10 md:py-14">
        <div className="space-y-6">
          <span className="block text-center text-[13px] font-black uppercase tracking-[0.3em] text-sky-500">
            Practice papers
          </span>


          {/* Search bar + filters */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto px-4">
            <div className="group relative flex-1 flex items-center gap-2.5 h-12 md:h-14 px-4 md:px-5 rounded-full bg-white border border-sky-100 card-shadow focus-within:rounded-md overflow-hidden">
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers by title or year..."
                className="peer flex-1 h-full bg-transparent text-sm font-semibold text-sky-950 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-slate-400 hover:text-sky-600 opacity-0 invisible peer-[:not(:placeholder-shown)]:opacity-100 peer-[:not(:placeholder-shown)]:visible transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full origin-center scale-x-0 bg-sky-950 rounded-full transition-transform duration-300 group-focus-within:scale-x-100" />
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-12 md:h-14 px-4 rounded-full text-xs font-black uppercase tracking-wide border border-sky-100 bg-white text-sky-700 card-shadow focus:outline-none focus:border-sky-400 transition-colors shrink-0"
            >
              <option value="All">All years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-12 md:h-14 px-4 rounded-full text-xs font-black uppercase tracking-wide border border-sky-100 bg-white text-sky-700 card-shadow focus:outline-none focus:border-sky-400 transition-colors shrink-0"
            >
              <option value="All">All regions</option>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Papers grid */}
          {filteredPapers.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
                No matching past papers found.
              </p>
              <p className="text-sky-300 text-[10px] font-bold">
                {pastPapers.length === 0
                  ? "No past papers loaded from database yet."
                  : "Try changing the year or region filters."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
              {filteredPapers.map((paper) => (
                // change to — bolder, clearly visible gradient
                <div
                  key={paper.id}
                  className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-100 border border-sky-100 card-shadow flex flex-col gap-5 hover:border-sky-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-sky-950 leading-tight">
                          MDCAT {paper.pastPaperYear ?? ""}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                          {paper.pastPaperRegion ?? "Conducted"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[9px] font-black uppercase text-sky-700 bg-sky-50 rounded-md shrink-0">
                      {paper.pastPaperRegion ?? "PMC"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
                      {paper.subject}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-sky-400" />
                      {paper.subTopic}
                    </span>
                  </div>

                  <ul className="space-y-2 flex-1">
                    <li className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{paper.title}</span>
                    </li>
                  </ul>

                <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate("/login", { state: { from: location.pathname } });
                        return;
                      }
                      onSelectQuiz(paper.id);
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition card-shadow"
                  >
                    Practice online
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 2: 180-Question Quiz ── */}
      <div
        className="bg-slate-50 py-10 md:py-14"
        style={{
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "auto",
          paddingLeft: "calc(50vw - 50%)",
          paddingRight: "calc(50vw - 50%)",
        }}
      >
        <span className="block text-center text-[13px] font-black uppercase tracking-[0.3em] text-orange-600 mb-6">
          Full simulation quiz
        </span>
        <div
          style={{
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            width: "auto",
          }}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 md:p-10 text-center card-shadow group">
            {/* Decorative rings */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-8 border-white/10" />
            <div className="absolute -bottom-14 -left-14 w-48 h-48 rounded-full border-8 border-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_60%)]" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <span className="px-3 py-1 text-[10px] font-black uppercase text-orange-700 bg-white rounded-full tracking-wider">
                PMDC standard simulation
              </span>

              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-snug">
                180 questions complete
                <br className="hidden sm:block" /> paper style quiz
              </h3>

              <p className="text-xs md:text-sm text-white/85 font-bold max-w-md leading-relaxed">
                Take a complete syllabus exam composed of{" "}
                <b className="text-white">
                  60 Biology, 50 Chemistry, 45 Physics, 18 English, and 7
                  Logical Reasoning
                </b>{" "}
                questions. Includes a dynamic 210-minute (3.5 hours)
                countdown board timer!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-[10px] font-black uppercase tracking-wider pt-1">
                <span>180 MCQs</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>210 minutes</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>5 subjects</span>
              </div>

             <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login", { state: { from: location.pathname } });
                    return;
                  }
                  onSelectQuiz(1800);
                }}
                className="mt-3 px-8 py-3.5 bg-white hover:bg-orange-50 text-orange-700 font-black uppercase text-xs tracking-wider rounded-full flex items-center gap-2 transition card-shadow hover:scale-[1.04] active:scale-95"
              >
                <span>Launch 180-QS exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}