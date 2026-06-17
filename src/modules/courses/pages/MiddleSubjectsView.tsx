import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import {
  ChevronRight, BookOpen, Zap, FileText, BookMarked,
  BarChart2, Calendar, Play,
  FlaskConical, Atom, Leaf, Languages, Sigma, Landmark, Globe,
  Calculator, Cpu,
} from "lucide-react";

import labImg from "../../../assets/images/lab2.png";
import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─── Reactive language hook ─── */
const useLang = () => {
  const [lang, setLang] = useState(() => getLanguage());
  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("languageChange", sync);
    };
  }, []);
  return lang;
};



/* ─────────────────────────────────────────────────────────────
   getSubjectMeta
   Descriptions are pulled directly from the translation JSON
   (classSubjectsView.subjects.*) — the same source used by
   ClassSubjectsView and SubjectLecturesView, so all three pages
   stay in sync automatically whenever en.json / ur.json change.
──────────────────────────────────────────────────────────────── */
interface SubjectMeta {
  isMath: boolean;
  color: string;
  iconBg: string;
  iconColor: string;
  tag: { en: string; ur: string } | null;
  desc: { en: string; ur: string };
  units: { n: string; t: { en: string; ur: string } }[];
  icon: React.ReactNode;
}

/* Read classSubjectsView.subjects.<key>.description from a translation file */
const tSubjDesc = (file: typeof enTranslations, key: string): string => {
  try {
    const node = (file as any).classSubjectsView?.subjects?.[key];
    return typeof node?.description === "string" ? node.description : "";
  } catch {
    return "";
  }
};

/* Build a bilingual description pair for the given subject key */
const subjDesc = (key: string): { en: string; ur: string } => ({
  en: tSubjDesc(enTranslations, key) || tSubjDesc(enTranslations, "default"),
  ur: tSubjDesc(urTranslations, key) || tSubjDesc(urTranslations, "default"),
});

const getSubjectMeta = (name: string): SubjectMeta => {
  const n = name.toLowerCase();

  if (n.includes("math") || n.includes("ریاضی")) return {
    isMath: true,
    color: "#1E3A5F", iconBg: "#2563EB", iconColor: "#fff",
    tag: null,
    desc: subjDesc("math"),
    units: [
      { n: "Unit 1", t: { en: "Numbers", ur: "اعداد"  } },
      { n: "Unit 2", t: { en: "Shapes",  ur: "شکلیں"  } },
      { n: "Unit 3", t: { en: "Ratios",  ur: "تناسب"  } },
      { n: "Unit 4", t: { en: "Algebra", ur: "الجبرا" } },
    ],
    icon: <Sigma size={26} />,
  };

  if (n.includes("physic")) return {
    isMath: false, color: "#1d4ed8", iconBg: "#EFF6FF", iconColor: "#1d4ed8",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("physics"),
    units: [], icon: <Atom size={22} />,
  };

  if (n.includes("chem")) return {
    isMath: false, color: "#059669", iconBg: "#ECFDF5", iconColor: "#059669",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("chemistry"),
    units: [], icon: <FlaskConical size={22} />,
  };

  if (n.includes("bio")) return {
    isMath: false, color: "#16a34a", iconBg: "#F0FDF4", iconColor: "#16a34a",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("biology"),
    units: [], icon: <Leaf size={22} />,
  };

  if (n.includes("english") || n.includes("انگریزی")) return {
    isMath: false, color: "#2563EB", iconBg: "#EEF3FF", iconColor: "#2563EB",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("english"),
    units: [],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  };

  if (n.includes("urdu") || n.includes("اردو")) return {
    isMath: false, color: "#374151", iconBg: "#F3F4F6", iconColor: "#374151",
    tag: { en: "Regional", ur: "علاقائی" },
    desc: subjDesc("urdu"),
    units: [], icon: <Languages size={22} />,
  };

  if (n.includes("science") || n.includes("سائنس")) return {
    isMath: false, color: "#374151", iconBg: "#F3F4F6", iconColor: "#374151",
    tag: { en: "Core", ur: "بنیادی" },
    /* General Science falls back to biology key — covers life/natural sciences */
    desc: subjDesc("biology"),
    units: [],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 7h14l-4-7V3"/>
      </svg>
    ),
  };

  if (n.includes("computer") || n.includes("cs") || n.includes("کمپیوٹر")) return {
    isMath: false, color: "#065F46", iconBg: "#ECFDF5", iconColor: "#065F46",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("computer"),
    units: [], icon: <Cpu size={22} />,
  };

  if (n.includes("islamic") || n.includes("اسلام")) return {
    isMath: false, color: "#92400E", iconBg: "#FEF3E2", iconColor: "#92400E",
    tag: { en: "Regional", ur: "علاقائی" },
    desc: subjDesc("islamic"),
    units: [],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <path d="M9 7h6"/><path d="M9 11h4"/>
      </svg>
    ),
  };

  if (n.includes("pakistan")) return {
    isMath: false, color: "#c2410c", iconBg: "#FFF7ED", iconColor: "#c2410c",
    tag: { en: "Regional", ur: "علاقائی" },
    desc: subjDesc("pakistan"),
    units: [], icon: <Globe size={22} />,
  };

  // default
  return {
    isMath: false, color: "#2563EB", iconBg: "#EEF3FF", iconColor: "#2563EB",
    tag: { en: "Core", ur: "بنیادی" },
    desc: subjDesc("default"),
    units: [],
    icon: <Calculator size={22} />,
  };
};

/* ─── Grade hero copy by grade number ─── */
const GRADE_COPY: Record<number, { title: { en: string; ur: string }; sub: { en: string; ur: string } }> = {
  6: {
    title: { en: "Grade 6: Your Academic Journey",       ur: "جماعت ۶: آپ کا تعلیمی سفر"      },
    sub:   { en: "Transition into higher learning with focused investigation and independent discovery. Master the fundamentals of core disciplines and develop your intellectual voice.",
             ur: "اعلیٰ تعلیم میں قدم رکھیں۔ بنیادی مضامین میں مہارت حاصل کریں اور اپنی علمی آواز پیدا کریں۔" },
  },
  7: {
    title: { en: "Grade 7: Expand Your Horizons",        ur: "جماعت ۷: اپنے افق کو وسعت دیں" },
    sub:   { en: "Deepen analytical skills and explore complex ideas. Build confidence in problem-solving and creative expression across all disciplines.",
             ur: "تجزیاتی مہارتوں کو گہرا کریں۔ تمام مضامین میں مسئلہ حل کرنے کی صلاحیت پیدا کریں۔" },
  },
  8: {
    title: { en: "Grade 8: Prepare for Excellence",      ur: "جماعت ۸: عمدگی کی تیاری کریں"  },
    sub:   { en: "Rigorous preparation for secondary education. Master advanced concepts and develop the critical thinking skills required for future success.",
             ur: "ثانوی تعلیم کی مضبوط تیاری۔ جدید تصورات میں مہارت اور تنقیدی سوچ کی صلاحیت پیدا کریں۔" },
  },
};

/* ─── Weekly schedule (static display) ─── */
const SCHEDULE = [
  { day: { en: "Mon", ur: "پیر"   }, time: "09:00 AM", topic: { en: "Advanced Arithmetic", ur: "جدید حساب"          }, active: false },
  { day: { en: "Tue", ur: "منگل"  }, time: "10:30 AM", topic: { en: "Literature Review",   ur: "ادب کا جائزہ"       }, active: true  },
  { day: { en: "Wed", ur: "بدھ"   }, time: "11:00 AM", topic: { en: "Biology Basics",      ur: "حیاتیات کی بنیادیں" }, active: false },
  { day: { en: "Thu", ur: "جمعرات"}, time: "09:00 AM", topic: { en: "Urdu Linguistics",    ur: "اردو لسانیات"       }, active: false },
];

/* ─── Skeleton card ─── */
const SubjectSkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #E5E9F0", borderRadius: 14,
    padding: 22, display: "flex", flexDirection: "column", gap: 12,
    animation: "msPulse 1.4s ease-in-out infinite",
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 10, background: "#F1F5F9" }} />
    <div style={{ height: 14, width: "55%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 13, width: "90%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 13, width: "70%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 3,  width: "100%", background: "#F1F5F9", borderRadius: 100, marginTop: 8 }} />
    <div style={{ height: 38, width: "100%", background: "#F1F5F9", borderRadius: 8 }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const MiddleSubjectsView = () => {
  const { classId } = useParams();
  const navigate    = useNavigate();
  const location    = useLocation();
  const lang        = useLang();
  const isUrdu      = lang === "ur";

  const classTitle = location.state?.classTitle || location.state?.gradeType || `Grade ${classId}`;

  // Fetch subjects from API
  const { classInfo, subjects, loading } = useClassSubjects(Number(classId));

  /* ─────────────────────────────────────────────────────────────
     FIX 1 — Grade number & display name
     Use classInfo.name (from API) to derive the grade number so
     the displayed title always matches what the API returned, not
     the raw URL classId param (which may be offset by 1 on the
     backend).
  ──────────────────────────────────────────────────────────────── */
  const gradeNum = useMemo(() => {
    // Prefer the API name since the classId param may be offset
    const source = classInfo?.name || classTitle || "";
    const m = source.match(/\d+/);
    return m ? parseInt(m[0], 10) : parseInt(classId || "6", 10);
  }, [classInfo, classTitle, classId]);

  const copy = GRADE_COPY[gradeNum] || GRADE_COPY[6];

  /* Reactive grade display name — same pattern as ClassSubjectsView */
  const gradeName = useMemo(() => {
    if (!classInfo) return classTitle || `Grade ${classId}`;
    if (!isUrdu) return classInfo.name || classTitle;
    const apiUrdu = classInfo.urdu_name?.trim();
    if (apiUrdu) return apiUrdu;
    const numMatch = (classInfo.name || "").match(/\d+/);
    if (numMatch) return `جماعت ${numMatch[0]}`;
    return classInfo.name || classTitle;
  }, [classInfo, isUrdu, classId, classTitle]);

  /* ─────────────────────────────────────────────────────────────
     Navigation helper
     Use classInfo.id (authoritative API id) when available so
     child routes resolve correctly even when the URL classId is
     off by one on the server.
  ──────────────────────────────────────────────────────────────── */
  const resolvedClassId = classInfo?.id ?? classId;

  const handleSubject = (subject: any) =>
    navigate(`/class/${resolvedClassId}/subject/${subject.id}`, {
      state: { gradeType: gradeName, selectedSubject: subject, classTitle: gradeName },
    });

  /* ─────────────────────────────────────────────────────────────
     FIX 2 — Subject ordering
     Desired layout:
       Row 1: first 2 non-math subjects (2-col grid)
       Featured math card (full width dark card)
       Row 2: remaining non-math subjects (2-col grid)

     This way math always sits in the middle, never at the end.
  ──────────────────────────────────────────────────────────────── */
  const mathSubject = useMemo(
    () => subjects?.find((s: any) => getSubjectMeta(s.name).isMath) ?? null,
    [subjects]
  );

  const nonMathSubjects: any[] = useMemo(
    () => subjects?.filter((s: any) => !getSubjectMeta(s.name).isMath) ?? [],
    [subjects]
  );

  // Split non-math into first-two and the rest
  const firstTwoNonMath = nonMathSubjects.slice(0, 2);
  const remainingNonMath = nonMathSubjects.slice(2);

  /* ─── Subject card renderer (keeps JSX DRY) ─── */
  const renderSubjectCard = (subject: any) => {
    const meta = getSubjectMeta(subject.name);
    const displayName = isUrdu ? (subject.urdu_name?.trim() || subject.name) : subject.name;
    return (
      <div key={subject.id} className="ms-subj-card" onClick={() => handleSubject(subject)}>
        <div className="ms-subj-card-top">
          <div className="ms-subj-icon-box" style={{ background: meta.iconBg, color: meta.iconColor }}>
            {meta.icon}
          </div>
          {meta.tag && (
            <span className="ms-subj-tag">{isUrdu ? meta.tag.ur : meta.tag.en}</span>
          )}
        </div>
        <h3 className="ms-subj-name">{displayName}</h3>
        {/* FIX 3 — description from API meta (keyword-matched from subject.name) */}
        <p className="ms-subj-desc">{isUrdu ? meta.desc.ur : meta.desc.en}</p>
        <div>
          <div className="ms-prog-row">
            <span>{isUrdu ? "تکمیل" : "Completion Progress"}</span>
            <span>0%</span>
          </div>
          <div className="ms-prog-bar"><div className="ms-prog-fill" style={{ width: "0%" }} /></div>
        </div>
        <button
          className="ms-continue-btn"
          onClick={e => { e.stopPropagation(); handleSubject(subject); }}
        >
          {isUrdu ? "جاری رکھیں" : "Continue"}
        </button>
      </div>
    );
  };

  /* ─── Math featured card renderer ─── */
  const renderMathCard = () => {
    if (!mathSubject) return null;
    const meta = getSubjectMeta(mathSubject.name);
    const displayName = isUrdu ? (mathSubject.urdu_name?.trim() || mathSubject.name) : mathSubject.name;
    return (
      <div className="ms-math-card" onClick={() => handleSubject(mathSubject)}>
        <div className="ms-math-top">
          <div className="ms-math-icon">{meta.icon}</div>
          <div>
            <h3 className="ms-math-name">
              {displayName}
              {isUrdu ? ": جدید حساب اور جیومیٹری" : ": Advanced Arithmetic & Geometry"}
            </h3>
            {/* FIX 3 — description from API meta */}
            <p className="ms-math-desc">{isUrdu ? meta.desc.ur : meta.desc.en}</p>
          </div>
        </div>
        {meta.units.length > 0 && (
          <div className="ms-units-grid">
            {meta.units.map((u, i) => (
              <div key={i} className="ms-unit-box">
                <p className="ms-unit-lbl">{u.n}</p>
                <p className="ms-unit-name">{isUrdu ? u.t.ur : u.t.en}</p>
              </div>
            ))}
          </div>
        )}
        <div className="ms-math-footer">
          <div className="ms-math-prog-wrap">
            <div className="ms-math-prog-row">
              <span>{isUrdu ? "کورس کی پیشرفت" : "Course Progress"}</span>
              <span>0%</span>
            </div>
            <div className="ms-math-prog-bar">
              <div className="ms-math-prog-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <button
            className="ms-start-btn"
            onClick={e => { e.stopPropagation(); handleSubject(mathSubject); }}
          >
            {isUrdu ? "ابھی شروع کریں" : "Start Now"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F1F5F9",
      fontFamily: "'DM Sans','Nunito','Segoe UI',sans-serif",
      direction: isUrdu ? "rtl" : "ltr",
    }}>
      <style>{`
       
        @keyframes msPulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes msFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .ms-wrap { max-width:1280px;margin:0 auto;padding:clamp(24px,4vw,48px) clamp(14px,3vw,28px) 72px; }

        .ms-hero {
          background:linear-gradient(120deg,#0F172A 0%,#1E3A5F 55%,#134E4A 100%);
          border-radius:18px;padding:clamp(36px,5vw,56px) clamp(24px,5vw,52px);
          margin-bottom:20px;animation:msFadeUp .45s ease both;
        }
        .ms-hero-title { font-size:clamp(1.8rem,4.5vw,3rem);font-weight:800;color:#fff;margin:0 0 14px;line-height:1.15;letter-spacing:-.3px; }
        .ms-hero-sub   { font-size:clamp(.85rem,1.6vw,.98rem);color:rgba(255,255,255,.65);margin:0;line-height:1.75;max-width:640px; }

        .ms-qr-bar {
          background:#fff;border:1px solid #E2E8F0;border-radius:14px;
          padding:14px 20px;margin-bottom:24px;display:flex;align-items:center;
          gap:16px;flex-wrap:wrap;animation:msFadeUp .5s ease both;
        }
        .ms-qr-label { font-size:.7rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748B;display:flex;align-items:center;gap:6px; }
        .ms-qr-div   { width:1px;height:22px;background:#E2E8F0; }
        .ms-qr-btn-solid    { display:inline-flex;align-items:center;gap:7px;background:#2563EB;color:#fff;font-weight:700;font-size:.82rem;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s; }
        .ms-qr-btn-solid:hover { background:#1D4ED8; }
        .ms-qr-btn-outline  { display:inline-flex;align-items:center;gap:7px;background:#fff;color:#1E293B;font-weight:700;font-size:.82rem;padding:9px 18px;border-radius:9px;border:1.5px solid #E2E8F0;cursor:pointer;font-family:'DM Sans',sans-serif;transition:border-color .15s; }
        .ms-qr-btn-outline:hover { border-color:#94A3B8; }

        .ms-layout { display:grid;grid-template-columns:1fr 360px;gap:22px;align-items:start; }

        .ms-sec-hd       { display:flex;align-items:center;gap:9px;margin-bottom:16px; }
        .ms-sec-hd-icon  { color:#2563EB; }
        .ms-sec-title    { font-size:1.2rem;font-weight:800;color:#0F172A;margin:0; }

        .ms-subj-grid { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px; }
        .ms-subj-card {
          background:#fff;border:1px solid #E5E9F0;border-radius:14px;
          padding:20px 18px 18px;display:flex;flex-direction:column;gap:10px;
          cursor:pointer;transition:box-shadow .18s ease,transform .18s cubic-bezier(.34,1.56,.64,1),border-color .15s;
          position:relative;overflow:hidden;
        }
        .ms-subj-card:hover { box-shadow:0 10px 30px rgba(30,64,175,.1);transform:translateY(-3px);border-color:#BFDBFE; }
        .ms-subj-card-top   { display:flex;align-items:flex-start;justify-content:space-between; }
        .ms-subj-icon-box   { width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ms-subj-tag        { font-size:.65rem;font-weight:700;letter-spacing:.5px;padding:3px 9px;border-radius:100px;border:1px solid #E2E8F0;color:#64748B;background:#F8FAFC; }
        .ms-subj-name       { font-size:1.1rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-subj-desc       { font-size:.78rem;color:#64748B;line-height:1.55;margin:0;flex:1; }
        .ms-prog-row        { display:flex;align-items:center;justify-content:space-between;font-size:.72rem;color:#94A3B8;font-weight:600; }
        .ms-prog-bar        { height:3px;background:#F1F5F9;border-radius:100px;overflow:hidden;margin:2px 0 0; }
        .ms-prog-fill       { height:100%;background:#2563EB;border-radius:100px; }
        .ms-continue-btn    { width:100%;background:#2563EB;color:#fff;font-weight:700;font-size:.82rem;padding:10px;border:none;border-radius:9px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s; }
        .ms-continue-btn:hover { background:#1D4ED8; }

        .ms-math-card {
          background:linear-gradient(120deg,#0F172A 0%,#1E3A5F 80%,#1E293B 100%);
          border-radius:14px;padding:24px 22px;cursor:pointer;margin-bottom:16px;
          transition:box-shadow .2s ease,transform .2s ease;
        }
        .ms-math-card:hover { box-shadow:0 14px 40px rgba(30,64,175,.22);transform:translateY(-2px); }
        .ms-math-top  { display:flex;align-items:center;gap:14px;margin-bottom:14px; }
        .ms-math-icon { width:56px;height:56px;background:#2563EB;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0; }
        .ms-math-name { font-size:1.25rem;font-weight:800;color:#fff;margin:0 0 4px; }
        .ms-math-desc { font-size:.78rem;color:rgba(255,255,255,.6);margin:0;line-height:1.55; }
        .ms-units-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px; }
        .ms-unit-box  { background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 12px; }
        .ms-unit-lbl  { font-size:.62rem;color:rgba(255,255,255,.45);font-weight:600;margin:0 0 2px; }
        .ms-unit-name { font-size:.82rem;color:#fff;font-weight:700;margin:0; }
        .ms-math-footer { display:flex;align-items:center;justify-content:space-between;gap:16px; }
        .ms-math-prog-wrap { flex:1; }
        .ms-math-prog-row  { display:flex;justify-content:space-between;font-size:.72rem;color:rgba(255,255,255,.45);margin-bottom:4px; }
        .ms-math-prog-bar  { height:3px;background:rgba(255,255,255,.12);border-radius:100px;overflow:hidden; }
        .ms-math-prog-fill { height:100%;background:#22C55E;border-radius:100px; }
        .ms-start-btn  { background:#fff;color:#2563EB;font-weight:800;font-size:.88rem;padding:11px 22px;border:none;border-radius:9px;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:background .15s; }
        .ms-start-btn:hover { background:#F0F4FF; }

        .ms-sidebar { display:flex;flex-direction:column;gap:18px; }

        .ms-analytics { background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:22px 20px;animation:msFadeUp .55s ease both; }
        .ms-an-hd     { display:flex;align-items:center;gap:8px;margin-bottom:18px; }
        .ms-an-title  { font-size:1.05rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-an-prog-box { background:#F8FAFC;border:1px solid #E5E9F0;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:18px; }
        .ms-an-pct        { font-size:1.3rem;font-weight:800;color:#0F172A;min-width:46px;text-align:center; }
        .ms-an-prog-title { font-size:.88rem;font-weight:700;color:#0F172A;margin:0 0 2px; }
        .ms-an-prog-sub   { font-size:.72rem;color:#94A3B8;margin:0;font-style:italic; }
        .ms-an-row  { display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid #F1F5F9;font-size:.82rem; }
        .ms-an-lbl  { color:#64748B; }
        .ms-an-val  { font-weight:700;color:#0F172A; }
        .ms-an-empty { background:#F8FAFC;border-radius:10px;padding:16px;text-align:center;font-size:.78rem;color:#94A3B8;line-height:1.5;margin-top:6px; }

        .ms-schedule { background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:20px;animation:msFadeUp .6s ease both; }
        .ms-sch-hd   { display:flex;align-items:center;justify-content:space-between;margin-bottom:14px; }
        .ms-sch-title { display:flex;align-items:center;gap:8px;font-size:1rem;font-weight:800;color:#0F172A;margin:0; }
        .ms-sch-full  { font-size:.78rem;font-weight:700;color:#2563EB;text-decoration:none;transition:opacity .15s; }
        .ms-sch-full:hover { opacity:.7; }
        .ms-sch-row  { display:flex;align-items:center;gap:0;border:1px solid #F1F5F9;border-radius:10px;overflow:hidden;margin-bottom:8px; }
        .ms-sch-row.active { border-color:#BFDBFE;background:#F0F6FF; }
        .ms-sch-day  { width:52px;text-align:center;padding:12px 0;font-size:.78rem;font-weight:700;color:#64748B;border-right:1px solid #F1F5F9;flex-shrink:0; }
        .ms-sch-row.active .ms-sch-day { color:#2563EB; }
        .ms-sch-info  { flex:1;padding:10px 12px; }
        .ms-sch-time  { font-size:.68rem;color:#94A3B8;margin:0 0 2px; }
        .ms-sch-topic { font-size:.82rem;font-weight:700;color:#0F172A;margin:0; }
        .ms-sch-play  { padding:0 12px;color:#2563EB; }

        .ms-lab-card { border-radius:16px;overflow:hidden;position:relative;height:220px;cursor:pointer;animation:msFadeUp .65s ease both; }
        .ms-lab-card img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover; }
        .ms-lab-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78) 0%,rgba(0,0,0,.15) 55%); }
        .ms-lab-content { position:absolute;bottom:0;left:0;right:0;padding:18px 20px;z-index:1; }
        .ms-lab-tag   { display:inline-block;background:#10B981;color:#fff;font-size:.62rem;font-weight:800;letter-spacing:.5px;padding:4px 10px;border-radius:100px;margin-bottom:8px; }
        .ms-lab-title { font-size:1.1rem;font-weight:800;color:#fff;margin:0 0 4px;line-height:1.25; }
        .ms-lab-sub   { font-size:.74rem;color:rgba(255,255,255,.75);margin:0; }

        .ms-bc  { display:flex;align-items:center;gap:5px;font-size:.76rem;color:#94A3B8;margin-bottom:20px;animation:msFadeUp .38s ease both;flex-wrap:wrap; }
        .ms-bc a { color:#94A3B8;text-decoration:none;font-weight:600;transition:color .14s; }
        .ms-bc a:hover { color:#2563EB; }
        .ms-bc-cur { color:#475569;font-weight:700; }

        @media(max-width:1024px) {
          .ms-layout { grid-template-columns:1fr; }
          .ms-sidebar { flex-direction:row;flex-wrap:wrap; }
          .ms-analytics,.ms-schedule { flex:1;min-width:280px; }
          .ms-lab-card { flex:1;min-width:280px; }
        }
        @media(max-width:640px) {
          .ms-subj-grid  { grid-template-columns:1fr; }
          .ms-units-grid { grid-template-columns:repeat(2,1fr); }
          .ms-math-footer { flex-direction:column;align-items:stretch; }
          .ms-start-btn   { width:100%; }
          .ms-sidebar     { flex-direction:column; }
        }
      `}</style>

      <div className="ms-wrap">

       {/* Breadcrumb */}
        <nav className="ms-bc">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <ChevronRight size={12} style={{ transform: isUrdu ? "rotate(180deg)" : "none" }} />
          
          {/* Intermediary Middle School Link */}
          <Link to="/grade-view/6-8">
            {isUrdu ? "جماعت ۶-۸" : "Grade 6-8"}
          </Link>
          <ChevronRight size={12} style={{ transform: isUrdu ? "rotate(180deg)" : "none" }} />
          
          <span className="ms-bc-cur">{gradeName}</span>
        </nav>
        {/* Hero Banner — title/sub use gradeNum resolved from API name */}
        <div className="ms-hero">
          <h1 className="ms-hero-title">
            {isUrdu ? copy.title.ur : copy.title.en}
          </h1>
          <p className="ms-hero-sub">
            {isUrdu ? copy.sub.ur : copy.sub.en}
          </p>
        </div>

        {/* Quick Resources Bar */}
        <div className="ms-qr-bar">
          <span className="ms-qr-label">
            <Zap size={13} /> {isUrdu ? "فوری وسائل" : "QUICK RESOURCES"}
          </span>
          <div className="ms-qr-div" />
          <button className="ms-qr-btn-solid" onClick={() => navigate("/worksheets/0")}>
            <FileText size={14} /> {isUrdu ? "ورک شیٹس" : "Worksheets"}
          </button>
         <button className="ms-qr-btn-outline" onClick={() => navigate(`/class/${classId}/quiz`)}>
            <BookMarked size={14} /> {isUrdu ? "باب کے کوئز" : "Chapter Quizzes"}
          </button>
        </div>

        {/* Main 2-col layout */}
        <div className="ms-layout">

          {/* ════ LEFT: Core Subjects ════ */}
          <div>
            <div className="ms-sec-hd">
              <BookOpen size={20} className="ms-sec-hd-icon" color="#2563EB" />
              <h2 className="ms-sec-title">{isUrdu ? "بنیادی مضامین" : "Core Subjects"}</h2>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <>
                <div className="ms-subj-grid">
                  <SubjectSkeleton /><SubjectSkeleton />
                </div>
                <div style={{ background: "#1E3A5F", borderRadius: 14, height: 220, animation: "msPulse 1.4s ease-in-out infinite", marginBottom: 16 }} />
                <div className="ms-subj-grid">
                  <SubjectSkeleton /><SubjectSkeleton />
                </div>
              </>
            )}

            {/* Empty state */}
            {!loading && (!subjects || subjects.length === 0) && (
              <div style={{ background: "#fff", borderRadius: 14, border: "2px dashed #E2E8F0", padding: "48px 20px", textAlign: "center", color: "#94A3B8", fontSize: ".88rem" }}>
                {isUrdu ? "فی الحال کوئی مضمون دستیاب نہیں" : "No subjects available right now"}
              </div>
            )}

            {!loading && subjects && subjects.length > 0 && (
              <>
                {/* ── Row 1: first 2 non-math subjects ── */}
                {firstTwoNonMath.length > 0 && (
                  <div className="ms-subj-grid">
                    {firstTwoNonMath.map(renderSubjectCard)}
                  </div>
                )}

                {/* ── Math featured card (middle position) ── */}
                {renderMathCard()}

                {/* ── Remaining non-math subjects ── */}
                {remainingNonMath.length > 0 && (
                  <div className="ms-subj-grid">
                    {remainingNonMath.map(renderSubjectCard)}
                  </div>
                )}

                {/* Edge case: only math, no non-math subjects */}
                {nonMathSubjects.length === 0 && mathSubject && renderMathCard()}
              </>
            )}
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <aside className="ms-sidebar">

            {/* Study Analytics */}
            <div className="ms-analytics">
              <div className="ms-an-hd">
                <BarChart2 size={20} color="#2563EB" />
                <h3 className="ms-an-title">{isUrdu ? "مطالعہ تجزیات" : "Study Analytics"}</h3>
              </div>
              <div className="ms-an-prog-box">
                <div className="ms-an-pct">0%</div>
                <div>
                  <p className="ms-an-prog-title">{isUrdu ? "مجموعی پیشرفت" : "Overall Progress"}</p>
                  <p className="ms-an-prog-sub">{isUrdu ? "نئے دریافت کار کا سفر" : "New explorer journey"}</p>
                </div>
              </div>
              <div className="ms-an-row">
                <span className="ms-an-lbl">{isUrdu ? "مکمل اسائنمنٹس" : "Assignments Done"}</span>
                <span className="ms-an-val">0 / 48</span>
              </div>
              <div className="ms-an-row">
                <span className="ms-an-lbl">{isUrdu ? "ٹیسٹ اسکور اوسط" : "Test Score Avg."}</span>
                <span className="ms-an-val">--</span>
              </div>
              <div className="ms-an-row">
                <span className="ms-an-lbl">{isUrdu ? "گھنٹے لاگ کیے" : "Hours Logged"}</span>
                <span className="ms-an-val">0h</span>
              </div>
              <div className="ms-an-empty">
                {isUrdu
                  ? "ابھی تک کوئی ڈیٹا نہیں۔ بصیرت دیکھنے کے لیے پہلا سبق شروع کریں!"
                  : "No data to display yet. Start your first lesson to see insights!"}
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="ms-schedule">
              <div className="ms-sch-hd">
                <h3 className="ms-sch-title">
                  <Calendar size={18} color="#2563EB" />
                  {isUrdu ? "ہفتہ وار شیڈول" : "Weekly Schedule"}
                </h3>
                <a href="#" className="ms-sch-full">{isUrdu ? "مکمل دیکھیں" : "Full View"}</a>
              </div>
              {SCHEDULE.map((s, i) => (
                <div key={i} className={`ms-sch-row${s.active ? " active" : ""}`}>
                  <div className="ms-sch-day">{isUrdu ? s.day.ur : s.day.en}</div>
                  <div className="ms-sch-info">
                    <p className="ms-sch-time">{s.time}</p>
                    <p className="ms-sch-topic">{isUrdu ? s.topic.ur : s.topic.en}</p>
                  </div>
                  {s.active && (
                    <div className="ms-sch-play">
                      <Play size={16} fill="#2563EB" stroke="none" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lab image card */}
            <div className="ms-lab-card" onClick={() => navigate("/resources")}>
              <img src={labImg} alt="Virtual Lab Discovery" />
              <div className="ms-lab-overlay" />
              <div className="ms-lab-content">
                <span className="ms-lab-tag">{isUrdu ? "خصوصی پروجیکٹ" : "Special Project"}</span>
                <p className="ms-lab-title">
                  {isUrdu ? "ورچوئل لیب دریافت میں شامل ہوں" : "Join the Virtual Lab Discovery"}
                </p>
                <p className="ms-lab-sub">
                  {isUrdu ? "انٹرایکٹو 3D تجربات اس جمعہ سے۔" : "Interactive 3D experiments starting this Friday."}
                </p>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default MiddleSubjectsView;