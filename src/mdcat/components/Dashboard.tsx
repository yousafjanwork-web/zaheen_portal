import { useState, useEffect } from 'react';

import {
  Sparkles, Atom, FlaskConical, BookOpen, Languages, Brain,
  ArrowRight, ShieldCheck, Zap, ClipboardList, Timer, Bot, FileText, Calculator,
} from 'lucide-react';
import bgImage from "../../mdcat/assets/images/HomePageBackGround.png";
import MdcatCountdown from '../../mdcat/components/FlipCountDown';
import SubjectsGrid from '../../mdcat/components/SubjectsGrid';
import ProgressBar from '../../mdcat/components/ProgressBar';
import SubjectsSection from '../../mdcat/components/SubjectsSection'
import DotGridBackground from '../../mdcat/components/Dotgridbackground';
import MeritCalculator from '../../mdcat/components/MeritCalculator';
import screenshot from '../../assets/images/screenshot.png'
/* ------------------------------------------------------------------ */
/* Subject config — colors pulled from your existing subject cards     */
/* ------------------------------------------------------------------ */
const SUBJECTS = [
  { name: 'PHYSICS', gradient: 'from-violet-600 to-purple-700', icon: Atom, desc: 'Mechanics, electrostatics, modern physics — built for numericals under time pressure.' },
  { name: 'CHEMISTRY', gradient: 'from-orange-500 to-red-600', icon: FlaskConical, desc: 'Organic, inorganic and physical chemistry, mapped straight to the PMDC syllabus.' },
  { name: 'BIOLOGY', gradient: 'from-teal-600 to-emerald-500', icon: BookOpen, desc: 'The highest-weight section — deep conceptual coverage with board-style MCQs.' },
  { name: 'ENGLISH', gradient: 'from-blue-500 to-blue-700', icon: Languages, desc: 'Grammar, vocabulary and comprehension drilled the way MDCAT actually tests it.' },
  { name: 'LOGICAL REASONING', gradient: 'from-pink-600 to-rose-600', icon: Brain, desc: 'Pattern recognition and analytical questions to sharpen your problem-solving speed.' },
];



/* ------------------------------------------------------------------ */
/* Homepage                                                            */
/* ------------------------------------------------------------------ */
import { PerformanceStats } from './types';
import SwoopingSubject from './SwoopingSubject';
import { useNavigate } from 'react-router-dom';
import PhoneMockup from '../../mdcat/components/Phonemockup';
import DownloadSection from './DownloadSection';

interface DashBoardProps {
  testDate?: string | Date;
  setActiveTab: any;
  performanceStats: PerformanceStats;
  getSubjectColorBadge: (subject: string) => string;
}

export default function Dashboard({ testDate = '2026-08-16', setActiveTab, performanceStats, getSubjectColorBadge }: DashBoardProps) {
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div
      className="min-h-screen bg-white w-full overflow-x-hidden">

      {/* Hero */}
      <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-screen bg-white overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-top"
          style={{
            backgroundImage: `url(${bgImage})`,
            opacity: 0.35,
            WebkitMaskImage:
              "radial-gradient(ellipse 420px 280px at 50% 40%, transparent, black 75%)",
            maskImage: "radial-gradient(ellipse 420px 280px at 50% 40%, transparent, black 75%)"
          }}
        />


        <DotGridBackground
          dotColor="14, 165, 233"
          className="opacity-80"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 40%, black, transparent)",
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 40%, black, transparent)",
          }}
        />


        <div className="relative max-w-6xl mx-auto px-6 pt-26 pb-20 text-center space-y-8">




          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight">
            <span className="block font-black uppercase text-sky-950">Your MDCAT Journey</span>
            <span className="flex flex-wrap items-baseline justify-center gap-3">
              <span className="font-black uppercase position relative text-sky-950">Starts With</span>
              <span>
                <SwoopingSubject SUBJECTS={SUBJECTS} />
              </span>
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-sm font-semibold text-slate-500 leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3">            Zaheen brings AI-generated practice exams, PMDC-aligned syllabus notes,
            and a verified FAQ bank into one focused study system — built specifically
            around Pakistan's MDCAT curriculum.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

            <button
              onClick={() => { setActiveTab('notes'); navigate("/mdcat/study-Notes") }}
              className="px-8 my-6 mb-10 py-4 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-sky-600/30 hover:shadow-xl hover:shadow-sky-600/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              Explore Syllabus

            </button>
          </div>


          <div className="pt-20 flex justify-center">
            <MdcatCountdown testDate={testDate} />
          </div>
        </div>
      </section>

      <div className='h-0 border border-gray-300'></div>

      {/* Subject cards */}
      <SubjectsSection SUBJECTS={SUBJECTS} />

      {/* Features */}
     <section id="features" className="bg-sky-50/40 border-y border-sky-100">
  <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
    <div className="text-center space-y-3">
      <span className="text-[16px] font-black uppercase tracking-widest text-green-500">
        Why Zaheen
      </span>
      <h3 className="text-2xl md:text-3xl font-black text-sky-950">
        Built for how MDCAT is actually tested
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          icon: Zap,
          title: "AI-Generated Practice Exams",
          desc: "Custom papers by subject, subtopic, and difficulty — compiled in seconds.",
          accent: "from-sky-500 to-blue-600",
        },
        {
          icon: ClipboardList,
          title: "PMDC-Aligned Notes",
          desc: "Syllabus content mapped exactly to the current provincial curriculum.",
          accent: "from-emerald-500 to-teal-600",
        },
        {
          icon: ShieldCheck,
          title: "Verified FAQ Bank",
          desc: "Registration, eligibility and paper-pattern answers you can trust.",
          accent: "from-violet-500 to-purple-600",
        },
        {
          icon: Bot,
          title: "AI Tutor",
          desc: "Ask doubts anytime and get instant, syllabus-aware explanations.",
          accent: "from-indigo-500 to-blue-600",
        },
        {
          icon: FileText,
          title: "MDCAT Past Papers",
          desc: "Solve real past papers with instant scoring and topic-wise breakdown.",
          accent: "from-amber-500 to-orange-600",
        },
        {
          icon: Calculator,
          title: "Merit Calculator",
          desc: "Estimate your aggregate and merit position across universities instantly.",
          accent: "from-rose-500 to-pink-600",
        },
      ].map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={i}
            className={`group relative p-7 rounded-3xl bg-gradient-to-br ${f.accent} card-shadow space-y-4 overflow-hidden transition-transform duration-300 hover:-translate-y-1`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Icon className="w-6 h-6 text-white" strokeWidth={2.25} />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-white tracking-tight leading-snug">
                {f.title}
              </h4>
              <p className="text-sm font-medium text-white/80 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      <section>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#0d1224",
          }}
        >
          <DownloadSection />
        </div>
      </section>
      <section className="max-w-6xl flex mx-auto px-6 py-16 gap-16">
        <ProgressBar performanceStats={performanceStats} getSubjectColorBadge={getSubjectColorBadge} />
        <MeritCalculator />
      </section>



    </div>
  );
}