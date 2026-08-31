import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { classIdFromSlug, classSlugFromId, gradeNumberFromSlug } from "@/config/classSlugs";
import { slugifySubject } from "../../../config/subjectSlug";
import student from "../../../assets/images/boy.png";
import {
  BookOpen, Languages, Sigma, Gamepad2, Bot, Trophy,
  Atom, FlaskConical, Leaf, Landmark, Globe, Cpu,
  Music, Palette, ChevronRight, Sparkles, Users, X, Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import type { NormalizedSubject } from "@/modules/shared/services/classService";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   i18n — only used for static UI labels, never for API content
──────────────────────────────────────────────────────────────── */
const translations: Record<string, any> = { en: enTranslations, ur: urTranslations };

const getNestedValue = (obj: any, key: string): string => {
  const value = key.split(".").reduce((acc, part) => acc?.[part], obj);
  return typeof value === "string" ? value : key;
};

const useT = () => {
  const lang = getLanguage();
  const dict = translations[lang] ?? translations.en;
  return (key: string) => getNestedValue(dict, key);
};

const FONT = "'Nunito', 'Fredoka One', sans-serif";

const isUrl = (s?: string): boolean =>
  !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

/* ─────────────────────────────────────────────────────────────
   Card shape profiles
──────────────────────────────────────────────────────────────── */
const SHAPE_PROFILES = [
  { borderRadius: "70px 32px 32px 32px", minHeight: 410, paddingTop: 36, iconFloat: false },
  { borderRadius: "70px 32px 32px 32px", minHeight: 320, paddingTop: 60, iconFloat: false, iconOffset: 52 },
  { borderRadius: "70px 32px 32px 32px", minHeight: 400, paddingTop: 36, iconFloat: false },
  { borderRadius: "32px 8px 32px 32px",   minHeight: 370, paddingTop: 36, iconFloat: false },
  { borderRadius: "70px 32px 32px 8px",   minHeight: 350, paddingTop: 36, iconFloat: false },
  { borderRadius: "8px 32px 8px 32px",    minHeight: 380, paddingTop: 36, iconFloat: false },
  { borderRadius: "32px 8px 32px 8px",    minHeight: 360, paddingTop: 36, iconFloat: false },
  { borderRadius: "8px 8px 32px 32px",    minHeight: 390, paddingTop: 36, iconFloat: false },
  { borderRadius: "32px 32px 8px 8px",    minHeight: 370, paddingTop: 36, iconFloat: false },
];
const getProfile = (i: number) => SHAPE_PROFILES[i % SHAPE_PROFILES.length];

/* ─────────────────────────────────────────────────────────────
   Subject meta (colours, icon, i18n key for UI labels only)
──────────────────────────────────────────────────────────────── */
interface KGMeta {
  icon: React.ElementType;
  /** Used ONLY to build the t() fallback key for tagline/btnLabel */
  subjectKey: string;
  cardBg: string; border: string; iconColor: string;
  titleColor: string; taglineColor: string; btnBg: string;
  accentBar?: string;
}

/** Maps the v2 `_iconHint` strings (Lucide icon names) to components. */
const ICON_HINT_MAP: Record<string, React.ElementType> = {
  BookOpen, Languages, Sigma, Atom, FlaskConical, Leaf,
  Landmark, Globe, Cpu, Music, Palette, Gamepad2, Bot, Trophy,
};

const getKGMeta = (name: string, iconHint?: string): KGMeta => {
  const hintIcon = iconHint ? ICON_HINT_MAP[iconHint] : undefined;
  const n = name.toLowerCase();

  if (n.includes("english"))  return { icon: hintIcon ?? BookOpen,      subjectKey: "english",   cardBg: "#DBEAFE", border: "3px solid #BFDBFE", iconColor: "#2563EB", titleColor: "#1E40AF", taglineColor: "#3B82F6", btnBg: "#2563EB" };
  if (n.includes("urdu"))     return { icon: hintIcon ?? Languages,     subjectKey: "urdu",      cardBg: "#FFEDD5", border: "3px solid #FED7AA", iconColor: "#EA580C", titleColor: "#C2410C", taglineColor: "#EA580C", btnBg: "#F97316" };
  if (n.includes("math"))     return { icon: hintIcon ?? Sigma,         subjectKey: "math",      cardBg: "#DCFCE7", border: "3px solid #BBF7D0", iconColor: "#16A34A", titleColor: "#15803D", taglineColor: "#16A34A", btnBg: "#16A34A" };
  if (n.includes("physic"))   return { icon: hintIcon ?? Atom,          subjectKey: "physics",   cardBg: "#DBEAFE", border: "3px solid #BFDBFE", iconColor: "#1D4ED8", titleColor: "#1E3A8A", taglineColor: "#3B82F6", btnBg: "#1D4ED8" };
  if (n.includes("chem"))     return { icon: hintIcon ?? FlaskConical, subjectKey: "chemistry", cardBg: "#D1FAE5", border: "3px solid #A7F3D0", iconColor: "#059669", titleColor: "#065F46", taglineColor: "#10B981", btnBg: "#059669" };
  if (n.includes("bio"))      return { icon: hintIcon ?? Leaf,         subjectKey: "biology",   cardBg: "#DCFCE7", border: "3px solid #BBF7D0", iconColor: "#15803D", titleColor: "#14532D", taglineColor: "#16A34A", btnBg: "#15803D", accentBar: "#4ADE80" };
  if (n.includes("islamic"))  return { icon: hintIcon ?? Landmark,      subjectKey: "islamic",   cardBg: "#CCFBF1", border: "3px solid #99F6E4", iconColor: "#0D9488", titleColor: "#115E59", taglineColor: "#0D9488", btnBg: "#0D9488" };
  if (n.includes("pakistan")) return { icon: hintIcon ?? Globe,         subjectKey: "pakistan",  cardBg: "#DCFCE7", border: "3px solid #BBF7D0", iconColor: "#15803D", titleColor: "#14532D", taglineColor: "#16A34A", btnBg: "#15803D" };
  if (n.includes("computer") || n.includes("cs")) return { icon: hintIcon ?? Cpu,      subjectKey: "computer", cardBg: "#E0E7FF", border: "3px solid #C7D2FE", iconColor: "#4F46E5", titleColor: "#3730A3", taglineColor: "#6366F1", btnBg: "#4F46E5" };
  if (n.includes("art") || n.includes("draw"))    return { icon: hintIcon ?? Palette,  subjectKey: "art",       cardBg: "#FCE7F3", border: "3px solid #FBCFE8", iconColor: "#DB2777", titleColor: "#9D174D", taglineColor: "#EC4899", btnBg: "#DB2777" };
  if (n.includes("music"))    return { icon: hintIcon ?? Music,         subjectKey: "music",     cardBg: "#FEF9C3", border: "3px solid #FDE68A", iconColor: "#CA8A04", titleColor: "#713F12", taglineColor: "#D97706", btnBg: "#EAB308" };
  return { icon: hintIcon ?? BookOpen, subjectKey: "default", cardBg: "#F1F5F9", border: "3px solid #E2E8F0", iconColor: "#64748B", titleColor: "#1E293B", taglineColor: "#94A3B8", btnBg: "#64748B" };
};

/* ─────────────────────────────────────────────────────────────
   Sub-components (unchanged from original)
──────────────────────────────────────────────────────────────── */
const SoonBadge = ({ label }: { label: string }) => (
  <div style={{ position: "absolute", top: 14, right: 14, background: "#FEF3C7", color: "#B45309", fontSize: 10, fontWeight: 900, padding: "4px 10px", borderRadius: 999, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}>
    {label}
  </div>
);

interface PillBtnProps { bg: string; label: string; textColor?: string; icon?: React.ReactNode; onClick: (e: React.MouseEvent) => void; }
const PillBtn = ({ bg, label, textColor = "white", icon, onClick }: PillBtnProps) => (
  <button
    onClick={onClick}
    style={{ background: bg, color: textColor, borderRadius: 999, padding: "13px 32px", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 3px 12px rgba(0,0,0,0.15)", border: "none", cursor: "pointer", transition: "opacity 0.15s, transform 0.15s", fontFamily: FONT }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1";    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
  >
    {label}{icon}
  </button>
);

interface SubjectCardProps {
  meta: KGMeta;
  index: number;
  title: string;
  tagline: string;
  btnLabel: string;
  isRtl: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
  customBtn?: React.ReactNode;
  thumbnailUrl?: string;
}

const SubjectCard = ({ meta, index, title, tagline, btnLabel, isRtl, onClick, badge, customBtn, thumbnailUrl }: SubjectCardProps) => {
  const Icon    = meta.icon;
  const profile = getProfile(index);
  const dir     = isRtl ? "rtl" : "ltr";
  const showImg = isUrl(thumbnailUrl);

  const motionProps = {
    initial:    { opacity: 0, y: 30, scale: 0.9 },
    animate:    { opacity: 1, y: 0,  scale: 1   },
    transition: { duration: 0.4, delay: index * 0.07, type: "spring" as const, stiffness: 240, damping: 22 },
    whileHover: { y: -8, scale: 1.03, transition: { type: "spring" as const, stiffness: 300, damping: 14 } },
    whileTap:   { scale: 0.97 },
    onClick,
  };

  const IconCircle = () => (
    <div style={{ width: 104, height: 104, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(0,0,0,0.10)", flexShrink: 0, overflow: "hidden" }}>
      {showImg
        ? <img src={thumbnailUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Icon size={50} style={{ color: meta.iconColor }} strokeWidth={1.5} />
      }
    </div>
  );

  const textBlock = (topMargin: number) => (
    <>
      {badge}
      <h3 style={{ fontSize: 26, fontWeight: 900, color: meta.titleColor, textAlign: "center", lineHeight: 1.2, fontFamily: FONT, marginTop: topMargin, direction: dir }}>
        {title}
      </h3>
      <p style={{ fontSize: 15, fontWeight: 600, color: meta.taglineColor, textAlign: "center", lineHeight: 1.5, marginTop: 10, direction: dir, fontFamily: FONT }}>
        {tagline}
      </p>
      <div style={{ marginTop: "auto", paddingTop: 28 }}>
        {customBtn ?? (
          <PillBtn bg={meta.btnBg} label={btnLabel} icon={<ChevronRight size={16} strokeWidth={2.5} />} onClick={(e) => { e.stopPropagation(); onClick(); }} />
        )}
      </div>
    </>
  );

  if (profile.iconFloat) {
    return (
      <motion.div {...motionProps} style={{ position: "relative", marginTop: profile.iconOffset, cursor: "pointer" }}>
        <div style={{ position: "absolute", top: -(profile.iconOffset!), left: "50%", transform: "translateX(-50%)", zIndex: 2, width: 104, height: 104, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {showImg
            ? <img src={thumbnailUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Icon size={50} style={{ color: meta.iconColor }} strokeWidth={1.5} />
          }
        </div>
        <div style={{ background: meta.cardBg, border: meta.border, borderRadius: profile.borderRadius, minHeight: profile.minHeight, paddingTop: profile.paddingTop + (profile.iconOffset || 0), paddingBottom: 36, paddingLeft: 28, paddingRight: 28, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", position: "relative", overflow: "hidden" }}>
          {meta.accentBar && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: meta.accentBar }} />}
          {textBlock(8)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps} style={{ background: meta.cardBg, border: meta.border, borderRadius: profile.borderRadius, minHeight: profile.minHeight, paddingTop: profile.paddingTop, paddingBottom: 36, paddingLeft: 28, paddingRight: 28, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", cursor: "pointer", position: "relative", overflow: "hidden" }}>
      {meta.accentBar && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: meta.accentBar, borderRadius: `${profile.borderRadius.split(" ")[0]} ${profile.borderRadius.split(" ")[1]} 0 0` }} />
      )}
      {badge}
      <IconCircle />
      {textBlock(20)}
    </motion.div>
  );
};

const KGCardSkeleton = ({ index }: { index: number }) => {
  const profile = getProfile(index);
  return (
    <div className="animate-pulse flex flex-col items-center gap-5" style={{ background: "#F1F5F9", border: "3px solid #E2E8F0", borderRadius: profile.borderRadius, minHeight: profile.minHeight, paddingTop: profile.paddingTop, paddingBottom: 36, paddingLeft: 28, paddingRight: 28, animationDelay: `${index * 0.06}s` }}>
      <div style={{ width: 104, height: 104, borderRadius: "50%", background: "#E2E8F0" }} />
      <div style={{ width: 128, height: 24, borderRadius: 999, background: "#E2E8F0", marginTop: 4 }} />
      <div style={{ width: 160, height: 16, borderRadius: 999, background: "#E2E8F0" }} />
      <div style={{ width: 140, height: 44, borderRadius: 999, background: "#E2E8F0", marginTop: "auto" }} />
    </div>
  );
};

const FloatingBubbles = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    {[
      { size: 90, top: "6%",   left: "2%",   color: "rgba(254,240,138,0.22)", delay: "0s"   },
      { size: 55, top: "18%", right: "4%",  color: "rgba(249,168,212,0.22)", delay: "0.6s" },
      { size: 70, top: "52%", left: "1%",   color: "rgba(147,197,253,0.22)", delay: "1.1s" },
      { size: 45, top: "72%", right: "7%",  color: "rgba(134,239,172,0.22)", delay: "1.7s" },
      { size: 60, top: "38%", right: "1%",  color: "rgba(196,181,253,0.22)", delay: "0.3s" },
      { size: 35, top: "85%", left: "10%",  color: "rgba(252,165,165,0.22)", delay: "2s"   },
    ].map((b, i) => (
      <div key={i} className="absolute rounded-full" style={{ width: b.size, height: b.size, top: b.top, left: (b as any).left, right: (b as any).right, background: b.color, animation: `kgFloat 5s ease-in-out ${b.delay} infinite` }} />
    ))}
  </div>
);

interface CTAProps { badge: string; title: string; desc: string; btnLessons: string; btnApp: string; isRtl: boolean; onNavigate: () => void; }
const CTABanner = ({ badge, title, desc, btnLessons, btnApp, isRtl, onNavigate }: CTAProps) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-14 w-full bg-white rounded-3xl shadow-sm overflow-hidden">
    <div className="flex flex-row items-center justify-between px-8 sm:px-14 py-10 gap-8">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0"><Users size={15} className="text-blue-600" /></div>
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-600" style={{ fontFamily: FONT }}>{badge}</span>
        </div>
        <h2 className="text-[28px] sm:text-[42px] font-black text-slate-900 leading-tight mb-3" style={{ fontFamily: FONT, direction: isRtl ? "rtl" : "ltr" }}>{title}</h2>
        <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed max-w-sm mb-7" style={{ direction: isRtl ? "rtl" : "ltr" }}>{desc}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onNavigate} className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-[#2563EB] text-white text-[13px] sm:text-[14px] font-black shadow-md hover:bg-[#1D4ED8] transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ fontFamily: FONT }}>{btnLessons}</button>
          <button className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl border-2 border-[#2563EB] text-[#2563EB] bg-white text-[13px] sm:text-[14px] font-black hover:bg-[#EFF6FF] transition-all" style={{ fontFamily: FONT }}>{btnApp}</button>
        </div>
      </div>
      <div className="hidden sm:flex shrink-0 self-end">
        <img src={student} alt="Student mascot" className="w-[280px] lg:w-[380px] xl:w-[420px] object-contain" style={{ animation: "kgFloat 3s ease-in-out infinite", filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.10))" }} />
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const KGClassView = () => {
 const { classSlug } = useParams();
const classId = classIdFromSlug(classSlug ?? "");
console.log("Current Class Slug:", classSlug, "→ resolved ID:", classId);
  const navigate    = useNavigate();
  const location    = useLocation();
  const gradeType   = location.state?.gradeType;

  const t    = useT();
  const lang = getLanguage();
  const isRtl = lang === "ur";

const { classInfo, subjects, loading } = useClassSubjects(Number(classId));

  const gamesType = (() => {
    if (classSlug === "kg") return "kg";
    const num = gradeNumberFromSlug(classSlug ?? "");
    if (num == null) return "kg";
    return num <= 5 ? "1-5" : "6-8";
  })();
  const gradeName =
    (isRtl ? classInfo?.urdu_name : classInfo?.name)
    || classInfo?.name
    || t("kgClassView.defaultGrade");

const handleSubjectClick = (subject: NormalizedSubject) => {
    navigate(`/${classSlug}/${slugifySubject(subject.name)}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });
  };
const handleSeeAllLessons = () => {
    const eng = subjects.find((s) => s.name.toLowerCase().includes("english"));
    if (eng) {
      navigate(`/${classSlug}/${slugifySubject(eng.name)}`, {
        state: { gradeType, selectedSubject: eng, classTitle: classInfo?.name },
      });
    } else {
      navigate("/");
    }
  };

  const subjectCount = subjects.length;

  return (
    <section className="min-h-screen relative z-0 overflow-x-hidden" style={{ background: "#EFF6FF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes kgFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes kgWiggle { 0%,100%{transform:rotate(-5deg) scale(1)} 50%{transform:rotate(5deg) scale(1.15)} }
        @keyframes kgSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <FloatingBubbles />
      <div className="pointer-events-none fixed top-5 left-5 z-0 opacity-20 select-none" style={{ fontSize: 60 }}>☁️</div>
      <div className="pointer-events-none fixed top-8 right-8 z-0 opacity-25 select-none" style={{ fontSize: 28, animation: "kgSpin 7s linear infinite" }}>✦</div>
      <div className="pointer-events-none fixed bottom-14 right-14 z-0 opacity-20 select-none" style={{ fontSize: 22, animation: "kgSpin 9s linear infinite reverse" }}>✦</div>

      <div className="relative z-10 max-w-[1160px] mx-auto px-4 pt-24 sm:pt-16 pb-10 flex flex-col items-center">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center justify-center gap-2 mb-5" style={{ fontSize: 14, color: "#94A3B8", direction: isRtl ? "rtl" : "ltr" }}>
          <Link to="/" className="hover:text-slate-600 transition-colors font-semibold">
            {t("kgClassView.home")}
          </Link>
          <ChevronRight size={13} style={{ color: "#CBD5E1", transform: isRtl ? "rotate(180deg)" : undefined }} />
          <span style={{ color: "#334155", fontWeight: 700 }}>{gradeName}</span>
        </div>

        {/* ── Heading ── */}
        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center mb-16">
          <h1 style={{ fontSize: "clamp(28px, 6vw, 68px)", fontFamily: FONT, fontWeight: 900, color: "#1E40AF", lineHeight: 1.2, letterSpacing: "-0.02em", direction: isRtl ? "rtl" : "ltr" }}>
            {t("kgClassView.pageTitle")}{" "}
            <span style={{ display: "inline-block", marginLeft: 6, fontSize: "clamp(26px, 5.5vw, 64px)", animation: "kgWiggle 2.5s ease-in-out infinite", verticalAlign: "middle" }}>🌈</span>
          </h1>
          <p style={{ color: "#64748B", marginTop: 12, fontWeight: 600, fontSize: 17, direction: isRtl ? "rtl" : "ltr" }}>
            {t("kgClassView.pageSubtitle")}
          </p>
        </motion.div>

        {/* ── Card Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "60px", alignItems: "end" }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <KGCardSkeleton key={i} index={i} />)
            : (
              <>
                {subjects.map((subject, i) => {
                  const meta = getKGMeta(subject.name, subject._iconHint);
                  const title = isRtl ? subject.urdu_name || subject.name : subject.name;
                  const apiDesc = isRtl ? subject.urdu_desc : subject.desc;
                  const tagline = apiDesc || t(`kgClassView.subjects.${meta.subjectKey}.tagline`);

                  return (
                    <SubjectCard
                      key={subject.id}
                      meta={meta}
                      index={i}
                      title={title}
                      tagline={tagline}
                      btnLabel={t(`kgClassView.subjects.${meta.subjectKey}.btnLabel`)}
                      isRtl={isRtl}
                      onClick={() => handleSubjectClick(subject)}
                      thumbnailUrl={subject.thumbnail_url}
                    />
                  );
                })}

                {/* ── Quizzes Card (Now navigates straight to /mdcat) ── */}
                <SubjectCard
                  meta={{ icon: Trophy, subjectKey: "quizzes", cardBg: "#FFE4E6", border: "3px solid #FECDD3", iconColor: "#F43F5E", titleColor: "#BE123C", taglineColor: "#E11D48", btnBg: "#F43F5E" }}
                  index={subjectCount}
                  title={t("kgClassView.quizzes.title")}
                  tagline={t("kgClassView.quizzes.tagline")}
                  btnLabel={t("kgClassView.quizzes.btnLabel")}
                  isRtl={isRtl}
        onClick={() => navigate(`/${classSlug}/quiz`)}
                  // badge={<SoonBadge label={t("kgClassView.soonBadge")} />}
                  customBtn={
                    <PillBtn
                      bg="#F43F5E"
                      label={t("kgClassView.quizzes.btnLabel")}
                      icon={<Star size={15} className="fill-white" strokeWidth={0} />}
                      onClick={(e) => { e.stopPropagation(); navigate(`/${classSlug}/quiz`); }}
                    />
                  }
                />

                {/* ── Fun Games ── */}
                <SubjectCard
                  meta={{ icon: Gamepad2, subjectKey: "funGames", cardBg: "#EDE9FE", border: "3px solid #DDD6FE", iconColor: "#7C3AED", titleColor: "#5B21B6", taglineColor: "#7C3AED", btnBg: "#7C3AED" }}
                  index={subjectCount + 1}
                  title={t("kgClassView.funGames.title")}
                  tagline={t("kgClassView.funGames.tagline")}
                  btnLabel={t("kgClassView.funGames.btnLabel")}
                  isRtl={isRtl}
          onClick={() => navigate(`/games/${gamesType}`)}
                  customBtn={
                    <PillBtn
                      bg="#7C3AED"
                      label={t("kgClassView.funGames.btnLabel")}
                      icon={<Gamepad2 size={15} strokeWidth={2} />}
                      onClick={(e) => { e.stopPropagation(); navigate(`/games/${gamesType}`); }}
                    />
                  }
                />

                {/* ── AI Bestie ── */}
                <SubjectCard
                  meta={{ icon: Bot, subjectKey: "aiBestie", cardBg: "#6D28D9", border: "3px solid #7C3AED", iconColor: "#6D28D9", titleColor: "white", taglineColor: "#DDD6FE", btnBg: "white" }}
                  index={subjectCount + 2}
                  title={t("kgClassView.aiBestie.title")}
                  tagline={t("kgClassView.aiBestie.tagline")}
                  btnLabel={t("kgClassView.aiBestie.btnLabel")}
                  isRtl={isRtl}
                  onClick={() => navigate("/ai")}
                  customBtn={
                    <PillBtn
                      bg="white" textColor="#6D28D9"
                      label={t("kgClassView.aiBestie.btnLabel")}
                      icon={<Sparkles size={15} />}
                      onClick={(e) => { e.stopPropagation(); navigate("/ai"); }}
                    />
                  }
                />
              </>
            )
          }
        </div>

        {/* ── CTA Banner ── */}
        <CTABanner
          badge={t("kgClassView.cta.badge")}
          title={t("kgClassView.cta.title")}
          desc={t("kgClassView.cta.desc")}
          btnLessons={t("kgClassView.cta.btnLessons")}
          btnApp={t("kgClassView.cta.btnApp")}
          isRtl={isRtl}
          onNavigate={handleSeeAllLessons}
        />
      </div>
    </section>
  );
};

export default KGClassView;