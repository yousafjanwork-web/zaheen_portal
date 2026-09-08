/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Trophy,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Category = "basics" | "registration" | "preparation" | "results";

interface FAQItem {
  id: string;
  category: Category;
  question: string;
  lead: string;
  points: string[];
}

const CATEGORY_META: Record<
  Category,
  { label: string; icon: React.ElementType }
> = {
  basics: { label: "Exam Basics", icon: HelpCircle },
  registration: { label: "Registration & Eligibility", icon: ClipboardList },
  preparation: { label: "Preparation & Score", icon: GraduationCap },
  results: { label: "Test Day & Results", icon: Trophy },
};

// ─── MDCAT — Frequently Asked Questions ───
const MDCAT_FAQS: FAQItem[] = [
  {
    id: "mdcat-q1",
    category: "basics",
    question: "What is MDCAT 2026 and who conducts it?",
    lead: "MDCAT is Pakistan's national entry test for MBBS and BDS admissions, conducted by the Pakistan Medical and Dental Council (PMDC).",
    points: [
      "180 MCQs total, held on August 16, 2026",
      "Biology 81 · Chemistry 45 · Physics 36 · English 9 · Logical Reasoning 9",
      "No negative marking — every question is worth attempting",
      "Zaheen Digital (zaheen.com.pk) offers PMDC-aligned lectures, past papers, and an AI-driven Zaheen Intelligence Engine to guide prep",
    ],
  },
  {
    id: "mdcat-q2",
    category: "registration",
    question: "What are the MDCAT 2026 registration dates and fees?",
    lead: "Registration opened June 22, 2026, and runs through two windows on the official PMDC portal.",
    points: [
      "Regular deadline: July 8, 2026 — fee Rs. 9,000",
      "Late deadline: July 13, 2026 — fee Rs. 13,000",
      "Register only at mdcat.pmdc.pk — fees are non-refundable",
      "Start prep immediately after registering to make the most of remaining time",
    ],
  },
  {
    id: "mdcat-q3",
    category: "basics",
    question: "What is the MDCAT 2026 paper pattern and exam format?",
    lead: "180 MCQs completed in 3 hours, with no negative marking.",
    points: [
      "Biology 45% (81 MCQs)",
      "Chemistry 25% (45 MCQs)",
      "Physics 20% (36 MCQs)",
      "English 5% · Logical Reasoning 5%",
      "Practice full-length timed mocks to build pacing before exam day",
    ],
  },
  {
    id: "mdcat-q4",
    category: "registration",
    question: "What is the MDCAT eligibility criteria in Pakistan?",
    lead: "Candidates must meet four core requirements to qualify.",
    points: [
      "F.Sc Pre-Medical or equivalent (A-Levels, IB) with 60%+ marks",
      "Biology and Chemistry mandatory, plus Physics or Mathematics",
      "Valid CNIC, B-Form, or JRC (for candidates under 18)",
      "A relevant provincial domicile",
      "Verify the latest criteria directly at pmdc.pk",
    ],
  },
  {
    id: "mdcat-q5",
    category: "preparation",
    question: "What are the MDCAT 2026 passing marks and competitive score targets?",
    lead: "Passing is 55% for MBBS and 50% for BDS — but top colleges need much more.",
    points: [
      "MBBS passing: 99/180 (55%) · BDS passing: 90/180 (50%)",
      "Competitive government-college range: 150–165+",
      "Merit combines MDCAT score with F.Sc and Matric percentages",
      "Consistent practice matters more than last-minute cramming",
    ],
  },
  {
    id: "mdcat-q6",
    category: "preparation",
    question: "What is the MDCAT 2026 syllabus and subject breakdown?",
    lead: "The syllabus follows the 2025 Uniform National Curriculum (UNC), confirmed by PMDC.",
    points: [
      "Biology (45%) — highest priority",
      "Chemistry (25%) — second priority",
      "Physics (20%), English (5%), Logical Reasoning (5%)",
      "Full syllabus PDF available at pmdc.pk",
    ],
  },
  {
    id: "mdcat-q7",
    category: "preparation",
    question: "What are the high-yield MDCAT topics students must focus on?",
    lead: "Past-paper analysis points to a consistent set of high-frequency topics.",
    points: [
      "Biology: Cell Structure, Biological Molecules, Genetics, Human Physiology, Evolution",
      "Chemistry: Organic Reaction Mechanisms, Chemical Bonding, Equilibrium, Thermochemistry",
      "Physics: Kinematics, Waves, Electricity, formula-based problem solving",
    ],
  },
  {
    id: "mdcat-q8",
    category: "preparation",
    question: "How many months of MDCAT preparation is ideal for a high score?",
    lead: "Top scorers typically follow a focused 3–4 month plan.",
    points: [
      "Month 1 — full syllabus via lectures and notes",
      "Month 2 — topic-wise MCQ practice and past papers",
      "Month 3 — full-length timed mocks every 3–4 days",
      "Month 4 — targeted revision of weak areas",
    ],
  },
  {
    id: "mdcat-q9",
    category: "preparation",
    question: "Are MDCAT past papers useful and where can I practice them?",
    lead: "Yes — past papers are one of the highest-leverage prep tools available.",
    points: [
      "Reveal recurring question patterns and common traps",
      "Build time-management instincts under real exam pressure",
      "Aim to solve 5–10 years of past papers before test day",
    ],
  },
  {
    id: "mdcat-q10",
    category: "basics",
    question: "Is there a negative marking in MDCAT 2026?",
    lead: "No — every question should be attempted since blanks guarantee zero marks.",
    points: [
      "Eliminate obviously wrong choices to improve odds when guessing",
      "A blank answer is a guaranteed zero; a guess has a chance",
      "Timed mock practice builds the speed to attempt all 180 questions",
    ],
  },
  {
    id: "mdcat-q11",
    category: "results",
    question: "What are the MDCAT 2026 test centers across Pakistan?",
    lead: "Centers span all major cities plus select international locations.",
    points: [
      "Lahore, Karachi, Islamabad, Peshawar, Quetta, Faisalabad, Multan, Hyderabad, Rawalpindi, and more",
      "City selected during PMDC registration at mdcat.pmdc.pk",
      "Choose a center close to home to reduce exam-day stress",
    ],
  },
  {
    id: "mdcat-q12",
    category: "results",
    question: "How does the MDCAT merit list work for MBBS and BDS admissions?",
    lead: "Provincial authorities calculate a combined merit score after results are announced.",
    points: [
      "UHS (Punjab), DUHS (Sindh), and KMU (KPK) each apply provincial weighting",
      "Formula blends MDCAT score + F.Sc marks + Matric marks",
      "Higher MDCAT scores meaningfully improve odds at top government colleges",
      "Private colleges may apply different merit policies",
    ],
  },
  {
    id: "mdcat-q13",
    category: "basics",
    question: "What is Zaheen Digital and what does it offer?",
    lead: "Zaheen Digital (zaheen.com.pk) is a complete online learning platform for students from KG to Class 12.",
    points: [
      "Video lectures, interactive assessments, and structured worksheets",
      "Past papers aligned with the national curriculum",
      "Professional skills courses like Web Development and Trading",
    ],
  },
];

interface FAQProps {
  onBack?: () => void;
}

export default function FAQ({ onBack }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [openId, setOpenId] = useState<string | null>("mdcat-q1");

  useEffect(()=>
    {
      window.scrollTo(0,0)
    },[])

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MDCAT_FAQS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.lead.toLowerCase().includes(q) ||
        item.points.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

return (
  <div className="space-y-8 px-10">
    {/* Cover Card */}
    <div
      className="bg-sky-950 px-7 md:px-10 pt-14 pb-8 md:pt-16 md:pb-10 text-white relative overflow-hidden flex flex-col items-center text-center gap-3 border-y border-sky-900 -mt-6 md:-mt-10"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "auto",
      }}
    >


      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="px-3 py-1 text-[10px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-md tracking-wider">
          {MDCAT_FAQS.length} Verified Answers
        </span>
        <span className="px-3 py-1 text-[10px] font-black uppercase text-sky-200 bg-sky-500/15 border border-sky-400/30 rounded-md tracking-wider">
          MDCAT 2026 Ready
        </span>
      </div>

      <h2 className="flex items-center gap-3 text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight whitespace-nowrap">
        Frequently Asked
        <span className="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
          Questions
        </span>
      </h2>

      <p className="text-sm md:text-base text-sky-200/80 font-semibold leading-relaxed max-w-xl">
        Everything you need to know about MDCAT 2026 — registration,
        eligibility, paper pattern, syllabus, and merit — answered clearly.
      </p>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.05] select-none pointer-events-none hidden md:block"></div>
    </div>
{/* Search bar */}
<div className="group relative flex items-center gap-2.5 w-full h-12 md:h-14 px-4 md:px-5 rounded-full bg-white border border-sky-100 card-shadow transition-[border-radius] duration-300 focus-within:rounded-md">
  <Search className="w-4 h-4 text-sky-400 shrink-0" />
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search MDCAT questions — e.g. registration, syllabus, merit..."
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

{/* Category pills */}
<div className="flex flex-wrap gap-2.5">
  <button
    onClick={() => setActiveCategory("all")}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide border transition-colors ${
      activeCategory === "all"
        ? "bg-sky-950 text-white border-sky-950"
        : "bg-white text-sky-700 border-sky-100 hover:border-sky-300"
    }`}
  >
    <Sparkles className="w-3.5 h-3.5" /> All Questions
  </button>
  {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
    const meta = CATEGORY_META[cat];
    const Icon = meta.icon;
    const isActive = activeCategory === cat;
    return (
      <button
        key={cat}
        onClick={() => setActiveCategory(cat)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wide border transition-colors ${
          isActive
            ? "bg-sky-950 text-white border-sky-950"
            : "bg-white text-sky-700 border-sky-100 hover:border-sky-300"
        }`}
      >
        <Icon className="w-3.5 h-3.5" /> {meta.label}
      </button>
    );
  })}
</div>



      {/* FAQ Accordion List */}
      
      <div className="bg-white py-4 md:py-6 px-4 md:px-5 rounded-3xl card-shadow space-y-3">

        {filteredFaqs.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <HelpCircle className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-400 font-semibold">
              No questions matched "{searchQuery}". Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openId === item.id;
              const meta = CATEGORY_META[item.category];
              const CatIcon = meta.icon;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-colors overflow-hidden relative ${
                    isOpen
                      ? "border-sky-300 bg-sky-50/40"
                      : "border-sky-100 bg-white hover:border-sky-200"
                  }`}
                >
                  {/* Category accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isOpen ? "bg-amber-400" : "bg-sky-100"
                    }`}
                  />
                  <button
                    onClick={() => toggleOpen(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    className="w-full flex items-center justify-between gap-4 py-5 md:py-6 px-3 md:px-4 text-left"

                  >
                    <div className="flex items-start gap-4">
                      <span className="shrink-0 w-9 h-9 rounded-xl bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center font-mono-custom">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-sky-500">
                          <CatIcon className="w-3 h-3" /> {meta.label}
                        </span>
                        <span className="block text-sm md:text-base font-black text-sky-950 leading-snug">
                          {item.question}
                        </span>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-sky-500"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={`${item.id}-panel`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 md:px-4 pb-6 pl-[3.5rem] md:pl-[4rem] space-y-3 border-t border-sky-100 pt-4">
                          <p className="text-sm text-sky-950 font-semibold leading-relaxed">
                            {item.lead}
                          </p>
                          <ul className="space-y-2">
                            {item.points.map((point, pIdx) => (
                              <li
                                key={pIdx}
                                className="flex items-start gap-2.5 text-sm text-slate-600 font-medium leading-relaxed"
                              >
                                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}