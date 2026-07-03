/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ArrowLeft,
  MessageCircleQuestion,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ─── MDCAT — Frequently Asked Questions ───
const MDCAT_FAQS: FAQItem[] = [
  {
    id: 'mdcat-q1',
    question: 'What is MDCAT 2026 and who conducts it?',
    answer:
      "MDCAT or MDCAT 2026 (Medical and Dental College Admission Test) is Pakistan's national entry test for admission into MBBS and BDS programs. It is conducted by the Pakistan Medical and Dental Council (PMDC). The exam consists of 180 MCQs — Biology (81), Chemistry (45), Physics (36), English (9), and Logical Reasoning (9) — with no negative marking, held on August 16, 2026. For comprehensive MDCAT online preparation in Pakistan, Zaheen Digital at zaheen.com.pk provides structured video lectures, past papers, and assessments fully aligned with the PMDC syllabus, making it the best MDCAT online platform. This is further enhanced by the Zaheen Intelligence Engine, an AI-driven tool designed to personalize and optimize your MDCAT preparation.",
  },
  {
    id: 'mdcat-q2',
    question: 'What are the MDCAT or MDCAT 2026 registration dates and fees?',
    answer:
      "The process for MDCAT registration opened on June 22, 2026. The regular registration deadline is July 8, 2026, and the late registration deadline is July 13, 2026. The registration fee is Rs. 9,000 (regular) and Rs. 13,000 (late). Registration is done exclusively through the official PMDC portal at mdcat.pmdc.pk. Fees are non-refundable. Once registered, students can begin their online preparation immediately through best MDCAT online platform Zaheen Digital's to make the most of the available time.",
  },
  {
    id: 'mdcat-q3',
    question: 'What is the MDCAT 2026 paper pattern and exam format?',
    answer:
      'The MDCAT paper pattern consists of 180 MCQs to be completed in 3 hours. The exam is a paper based on no negative markings. Subject breakdown: Biology — 45% (81 MCQs), Chemistry — 25% (45 MCQs), Physics — 20% (36 MCQs), English — 5% (9 MCQs), Logical Reasoning — 5% (9 MCQs). Students preparing for this pattern should regularly practice timed mock tests. Zaheen Digital (zaheen.com.pk) allows you to take an MDCAT mock test online that simulates the actual exam format, helping students build exam confidence and time management skills.',
  },
  {
    id: 'mdcat-q4',
    question: 'What is the MDCAT eligibility criteria in Pakistan?',
    answer:
      'To meet the MDCAT eligibility criteria in Pakistan, a candidate must: (1) Have passed F.Sc pre-medical or equivalent (A-Levels, IB, etc.) with minimum 60% marks, (2) Have studied Biology and Chemistry as mandatory subjects with either Physics or Mathematics, (3) Possess a valid CNIC, B-Form, or JRC (for candidates under 18), (4) Hold a relevant provincial domicile. Candidates should verify the latest MDCAT eligibility criteria directly at pmdc.pk. Students can then begin structured preparation at best MDCAT online platform using Zaheen Digital\'s curriculum-aligned resources.',
  },
  {
    id: 'mdcat-q5',
    question: 'What are the MDCAT 2026 passing marks and competitive score targets?',
    answer:
      'The official MDCAT passing marks are set at a minimum threshold of 55% (99/180 marks) for MBBS and 50% (90/180) for BDS. However, to be competitive for top government medical colleges, students typically need scores above 150-165. Merit is calculated by combining MDCAT scores with F.Sc and Matric percentages. Consistent, high-quality preparation is essential. Zaheen Digital at zaheen.com.pk provides the MDCAT study resources — including comprehensive MDCAT Biology MCQs, Chemistry practice, past papers, and online assessments — needed to achieve a top score in Pakistan\'s MDCAT 2026. Additionally, students can leverage the Zaheen Intelligence Engine to receive AI-powered insights, ensuring a more focused and effective study experience.',
  },
  {
    id: 'mdcat-q6',
    question: 'What is the MDCAT 2026 syllabus and subject breakdown?',
    answer:
      'The official MDCAT syllabus follows the 2025 Uniform National Curriculum (UNC) as confirmed by PMDC. The syllabus PDF is available at pmdc.pk. Subject priorities: Biology carries the highest weightage at 45% and must be the primary focus. Chemistry at 25% should be the second priority. Physics at 20%, English at 5%, and Logical Reasoning at 5%. Zaheen Digital (zaheen.com.pk) provides video lectures, worksheets, and past papers organized topic-by-topic for each MDCAT subject, making it easy for students across Pakistan to study systematically according to the official syllabus.',
  },
  {
    id: 'mdcat-q7',
    question: 'What are the high-yield MDCAT topics students must focus on?',
    answer:
      'Based on MDCAT past paper analysis, the most crucial areas to study include high-yield Biology topics such as Cell Structure & Function, Biological Molecules (Enzymes, Proteins), Genetics & Inheritance, Human Physiology, Plant Reproduction, and Evolution. For Chemistry, heavily focus on organic reaction mechanisms, Chemical Bonding, States of Matter, Thermochemistry, and Chemical Equilibrium. Physics focuses on formula application, kinematics, waves, and electricity.',
  },
  {
    id: 'mdcat-q8',
    question: 'How many months of MDCAT preparation is ideal for a high score?',
    answer:
      'Experts and top scorers recommend 3 to 4 months of focused MDCAT preparation. One of the best MDCAT preparation tips is to follow an effective study plan: Month 1 — Complete the full PMDC syllabus through video lectures and notes. Month 2 — Topic-wise MCQ practice and MDCAT past papers. Month 3 — Full-length timed mock tests every 3-4 days with detailed mistake analysis. Month 4 — Targeted revision of weak areas. Zaheen Digital at zaheen.com.pk provides all the tools for this journey, and the Zaheen Intelligence Engine offers smart, AI-guided learning paths to maximize your preparation efficiency.',
  },
  {
    id: 'mdcat-q9',
    question: 'Are MDCAT past papers useful and where can I practice them?',
    answer:
      'Yes — practicing MDCAT past papers is one of the most powerful preparation tools available. They reveal recurring question patterns, teach time management, and expose common traps that repeatedly appear in the exam. Solving 5-10 years of MDCAT past papers is strongly recommended by top scorers. Zaheen Digital includes comprehensive past paper resources as part of its study system, alongside subject-wise video lectures and timed assessments.',
  },
  {
    id: 'mdcat-q10',
    question: 'Is there a negative marking in MDCAT 2026?',
    answer:
      'No — MDCAT 2026 has no negative markings. This means every single question should be attempted, even if the student is unsure. Smart elimination strategy — ruling out obviously wrong choices — significantly improves scores. Since no marks are deducted for wrong answers, leaving a question blank is a guaranteed zero, while guessing gives a chance at a correct answer. Practice timed mock tests on Zaheen Digital to build the speed and confidence to attempt all 180 questions within the 3-hour MDCAT exam time.',
  },
  {
    id: 'mdcat-q11',
    question: 'What are the MDCAT 2026 test centers across Pakistan?',
    answer:
      'MDCAT 2026 test centers are spread across all major cities of Pakistan — Lahore, Karachi, Islamabad, Peshawar, Quetta, Faisalabad, Multan, Hyderabad, Rawalpindi, and more — along with international centers. Students select their preferred city during PMDC registration at mdcat.pmdc.pk. It is recommended to choose a test center close to home to reduce exam-day stress.',
  },
  {
    id: 'mdcat-q12',
    question: 'How does the MDCAT merit list work for MBBS and BDS admissions?',
    answer:
      'After MDCAT 2026 results are announced, provincial medical admission authorities — such as UHS (Punjab), DUHS (Sindh), and KMU (KPK) — calculate the final MDCAT merit list using a combined formula: MDCAT score + FSc marks + Matric marks, each weighted according to provincial rules. Students with higher MDCAT scores have significantly greater chances of securing seats in top government medical colleges. Private colleges may have different merit policies.',
  },
  {
    id: 'mdcat-q13',
    question: 'What is Zaheen Digital and what does it offer?',
    answer:
      'Zaheen Digital is a complete online learning platform Pakistan can rely on, accessible at zaheen.com.pk. It provides a full range of educational resources for students from KG to Class 12, including high-quality video lectures, interactive assessments, structured worksheets, educational games, and past papers — all aligned with the official Pakistani national curriculum. Beyond school-level education, Zaheen Digital also offers professional skills courses such as Web Development and Trading.',
  },
];

interface FAQProps {
  onBack?: () => void;
}

export default function FAQ({ onBack }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('mdcat-q1');

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MDCAT_FAQS;
    return MDCAT_FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* Cover Card */}
      <div className="bg-sky-950 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 card-shadow border border-sky-900">
        <div className="space-y-3 z-10 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-[9px] font-black uppercase text-sky-200 hover:text-white transition-colors mr-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
            )}
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-amber-300 bg-amber-500/15 border border-amber-400/30 rounded-md tracking-wider">
              {MDCAT_FAQS.length} Verified Answers
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-sky-200 bg-sky-500/15 border border-sky-400/30 rounded-md tracking-wider">
              MDCAT 2026 Ready
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
            Frequently Asked Questions <HelpCircle className="w-6 h-6 text-sky-400" />
          </h2>
          <p className="text-xs text-sky-200/80 font-semibold leading-relaxed">
            Everything you need to know about MDCAT 2026 — registration, eligibility, paper pattern, syllabus, and merit — answered clearly.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.05] select-none pointer-events-none text-[12rem] text-white">
          <MessageCircleQuestion strokeWidth={1} className="w-40 h-40" />
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 card-shadow">
        <div className="relative">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MDCAT questions — e.g. registration, syllabus, merit..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-sky-100 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-sky-500/40 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-sky-100 card-shadow space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase text-sky-950 tracking-widest flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            MDCAT 2026 Questions
          </h3>
          <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border self-start bg-sky-50 text-sky-700 border-sky-200">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Result' : 'Results'}
          </span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">
              No questions matched "{searchQuery}". Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFaqs.map((item, idx) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isOpen
                      ? 'border-sky-300 bg-sky-50/40'
                      : 'border-sky-100 bg-white hover:border-sky-200'
                  }`}
                >
                  <button
                    onClick={() => toggleOpen(item.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-[10px] font-black flex items-center justify-center font-mono-custom">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs md:text-sm font-bold text-sky-950 leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-sky-500"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-5 pb-4 md:pb-5 pl-13 md:pl-16">
                          <p className="text-[11px] md:text-xs text-slate-600 font-medium leading-relaxed border-t border-sky-100 pt-3 ml-9 md:ml-9">
                            {item.answer}
                          </p>
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
