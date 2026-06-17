import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { useGrades } from "@/modules/shared/hooks/useGrade";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import {
  ChevronRight, GraduationCap, Star, BookOpen,
  BarChart2, Calendar, ArrowRight, CheckCircle,
  Sigma, Globe, BookMarked, Layers,
} from "lucide-react";

import labImage from "../../../assets/images/lab.png";

/* ── Reactive language hook ── */
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
   extractNum
   Handles: "Grade 6", "Class 6", "جماعت ۶", "6th Grade", etc.
   Arabic-Indic digits (۰–۹) are converted before matching.
──────────────────────────────────────────────────────────────── */
const extractNum = (name: string): number => {
  if (!name) return 0;
  const normalized = name
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const m = normalized.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
};

const TRACKS: Record<number, { en: string; ur: string }> = {
  6: { en: "Foundation & Focus",   ur: "بنیاد اور توجہ"   },
  7: { en: "Inquiry & Expansion",  ur: "تحقیق اور توسیع"  },
  8: { en: "Mastery & Transition", ur: "مہارت اور منتقلی" },
};

const DESCS: Record<number, { en: string; ur: string }> = {
  6: { en: "Introduction to systematic inquiry, data analysis, and advanced literary structures.", ur: "منظم تحقیق، ڈیٹا تجزیہ، اور ادبی ڈھانچوں کا تعارف۔" },
  7: { en: "Deepening analytical skills in pre-algebra, life sciences, and persuasive communication.", ur: "پری الجبرا، حیاتی علوم، اور قائل کن مواصلت میں تجزیاتی مہارت۔" },
  8: { en: "Rigorous preparation for secondary education via advanced algebra and global history.", ur: "جدید الجبرا اور عالمی تاریخ کے ذریعے ثانوی تعلیم کی سخت تیاری۔" },
};

const ICONS: Record<number, React.ReactNode> = {
  6: <GraduationCap size={20} strokeWidth={1.5} />,
  7: <Star size={20} strokeWidth={1.5} />,
  8: <Layers size={20} strokeWidth={1.5} />,
};

const PROGRESS: Record<number, string> = { 6: "35%", 7: "20%", 8: "5%" };
const RECOMMENDED: Record<number, boolean> = { 7: true };

/* ─────────────────────────────────────────────────────────────
   GradeCard — fetches its own subjects via useClassSubjects
   so each card shows the real count + subject name pills from
   the API, independent of any parent data shape.
──────────────────────────────────────────────────────────────── */
interface GradeCardProps {
  grade: any;
  index: number;
  isUrdu: boolean;
  onExplore: (grade: any) => void;
}

const GradeCard = ({ grade, index, isUrdu, onExplore }: GradeCardProps) => {
  /* Fetch real subjects for this specific class ID */
  const { subjects, loading: subjLoading } = useClassSubjects(Number(grade.id));

  const num = extractNum(grade?.name || "");

  const displayLabel = isUrdu
    ? (grade.urdu_name?.trim() || (num ? `جماعت ${num}` : grade.name))
    : (grade.name || `Grade ${index + 6}`);

  const track = isUrdu
    ? (TRACKS[num]?.ur || "تعلیمی راستہ")
    : (TRACKS[num]?.en || "Academic Track");

  const descEn = grade.description?.trim()      || DESCS[num]?.en || "Structured academic content tailored to your level.";
  const descUr = grade.urdu_description?.trim() || DESCS[num]?.ur || "آپ کی سطح کے مطابق منظم تعلیمی مواد۔";
  const desc   = isUrdu ? descUr : descEn;

  const icon        = ICONS[num]  || <BookOpen size={20} strokeWidth={1.5} />;
  const progress    = PROGRESS[num] || "10%";
  const recommended = RECOMMENDED[num] || false;

  /* Real subject list from API */
  const subjectList: any[] = useMemo(
    () => (Array.isArray(subjects) ? subjects : []),
    [subjects]
  );
  const subjectCount = subjectList.length;

  return (
    <div
      className={`mg-grade-card${recommended ? " rec" : ""}`}
      onClick={() => onExplore(grade)}
    >
      {recommended && (
        <div className="mg-badge">{isUrdu ? "تجویز کردہ" : "RECOMMENDED"}</div>
      )}

      <div className="mg-g-icon">{icon}</div>
      <p className="mg-g-lbl">{displayLabel}</p>
      <p className="mg-g-track">{track}</p>
      <p className="mg-g-desc">{desc}</p>

      {/* ── Real subject count from API ── */}
      <div className="mg-g-subj">
        <CheckCircle size={14} style={{ color: "#22C55E", flexShrink: 0 }} />
        {subjLoading ? (
          <span style={{ color: "#94A3B8", fontSize: ".75rem" }}>
            {isUrdu ? "لوڈ ہو رہا ہے…" : "Loading…"}
          </span>
        ) : (
          <span>
            <strong style={{ color: "#0F172A" }}>{subjectCount}</strong>
            &nbsp;{isUrdu ? "مضامین" : subjectCount === 1 ? "Subject" : "Subjects"}
          </span>
        )}
      </div>

      {/* ── Subject name pills ── */}
      {!subjLoading && subjectList.length > 0 && (
        <div className="mg-subj-pills">
          {subjectList.map((s: any) => {
            const label = isUrdu ? (s.urdu_name?.trim() || s.name) : s.name;
            return (
              <span key={s.id} className="mg-subj-pill">
                {label}
              </span>
            );
          })}
        </div>
      )}

      {/* skeleton pills while loading */}
      {subjLoading && (
        <div className="mg-subj-pills">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="mg-subj-pill-skel" />
          ))}
        </div>
      )}

      <div className="mg-g-prog">
        <div className="mg-g-prog-fill" style={{ width: progress }} />
      </div>
    </div>
  );
};

/* ── Academic Disciplines — only 3 ── */
const DISCIPLINES = [
  { icon: <Sigma size={20} />,      name: { en: "Algebra",      ur: "الجبرا"  }, desc: { en: "Linear equations & functions.",  ur: "خطی مساوات اور افعال۔"     } },
  { icon: <Globe size={20} />,      name: { en: "Earth Science", ur: "ارضیات" }, desc: { en: "Geology & Atmospheric systems.", ur: "ارضیات اور فضائی نظام۔"    } },
  { icon: <BookMarked size={20} />, name: { en: "Literature",    ur: "ادب"    }, desc: { en: "Critical analysis & Rhetoric.",  ur: "تنقیدی تجزیہ اور بیانیہ۔" } },
];

/* ── Skeleton (used only while grade list itself is loading) ── */
const GradeSkeleton = () => (
  <div style={{
    background: "#fff", border: "1px solid #E5E9F0", borderRadius: 16,
    padding: 28, minHeight: 240, display: "flex", flexDirection: "column",
    gap: 14, animation: "mgPulse 1.4s ease-in-out infinite",
  }}>
    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F1F5F9" }} />
    <div style={{ height: 14, width: "40%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 22, width: "80%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 13, width: "95%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 13, width: "75%", background: "#F1F5F9", borderRadius: 6 }} />
    <div style={{ height: 20, width: "50%", background: "#F1F5F9", borderRadius: 6, marginTop: "auto" }} />
    <div style={{ height: 3,  width: "100%", background: "#F1F5F9", borderRadius: 100 }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════ */
const MiddleGradesView = () => {
  const navigate = useNavigate();
  const lang     = useLang();
  const isUrdu   = lang === "ur";

  const { grades: grades68 = [], loading: l1 }  = useGrades("6-8")    as { grades: any[]; loading: boolean };
  const { grades: gradesMid = [], loading: l2 } = useGrades("middle") as { grades: any[]; loading: boolean };
  const loading = l1 && l2;

  const displayGrades = useMemo(() => {
    const a = Array.isArray(grades68)   ? grades68   : Array.isArray((grades68 as any)?.data)   ? (grades68 as any).data   : [];
    const b = Array.isArray(gradesMid)  ? gradesMid  : Array.isArray((gradesMid as any)?.data)  ? (gradesMid as any).data  : [];
    const raw = a.length > 0 ? a : b;
    const filtered = raw.filter((g: any) => {
      const n = extractNum(g?.name || "");
      return n >= 6 && n <= 8;
    });
    return filtered.length > 0 ? filtered : raw;
  }, [grades68, gradesMid]);

  const handleExplore = (grade: any) =>
    navigate(`/class/${grade.id}`, { state: { gradeType: grade.name, classTitle: grade.name } });

  const analytics = { pct: 75, weekly: "4.2 hrs/day", streak: "12 Days" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg,#F0F4FF 0%,#F7F9FC 50%,#EEF4F0 100%)",
      fontFamily: "'DM Sans','Nunito','Segoe UI',sans-serif",
      direction: isUrdu ? "rtl" : "ltr",
    }}>
      <style>{`
       
        @keyframes mgPulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes mgFadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .mg-wrap   { max-width:1200px;margin:0 auto;padding:clamp(40px,6vw,72px) clamp(16px,4vw,32px) 80px; }
        .mg-hero   { margin-bottom:64px;animation:mgFadeUp .5s ease both; }
        .mg-eyebrow{ font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#2563EB;margin:0 0 16px; }
        .mg-title  { font-size:clamp(2rem,5vw,3.4rem);font-weight:800;color:#0F172A;margin:0 0 16px;line-height:1.1;letter-spacing:-.5px; }
        .mg-sub    { font-size:.98rem;color:#475569;max-width:540px;line-height:1.75;margin:0 0 32px; }
        .mg-btns   { display:flex;gap:12px;flex-wrap:wrap; }
        .mg-btn-p  { display:inline-flex;align-items:center;gap:8px;background:#1E40AF;color:#fff;font-weight:700;font-size:.88rem;padding:13px 26px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s,transform .15s; }
        .mg-btn-p:hover { background:#1D4ED8;transform:translateY(-1px); }
        .mg-btn-s  { display:inline-flex;align-items:center;gap:8px;background:#fff;color:#1E293B;font-weight:700;font-size:.88rem;padding:13px 26px;border-radius:10px;border:1.5px solid #E2E8F0;cursor:pointer;font-family:'DM Sans',sans-serif;transition:border-color .15s,transform .15s; }
        .mg-btn-s:hover { border-color:#94A3B8;transform:translateY(-1px); }

        .mg-sec-hd   { margin-bottom:20px; }
        .mg-sec-title{ font-size:1.4rem;font-weight:800;color:#0F172A;margin:0 0 3px; }
        .mg-sec-sub  { font-size:.85rem;color:#64748B;margin:0; }

        .mg-grade-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:52px;animation:mgFadeUp .6s ease both; }

        /* ── Grade card ── */
        .mg-grade-card {
          background:#fff;border:1px solid #E5E9F0;border-radius:16px;
          padding:26px 22px 22px;display:flex;flex-direction:column;gap:11px;
          cursor:pointer;transition:box-shadow .2s ease,transform .2s cubic-bezier(.34,1.56,.64,1),border-color .15s;
          position:relative;overflow:hidden;
        }
        .mg-grade-card:hover { box-shadow:0 12px 36px rgba(30,64,175,.1);transform:translateY(-4px);border-color:#BFDBFE; }
        .mg-grade-card.rec  { border-color:#1E40AF; }
        .mg-badge  { position:absolute;top:0;right:0;background:#1E40AF;color:#fff;font-size:.6rem;font-weight:800;letter-spacing:1.5px;padding:5px 12px;border-radius:0 16px 0 12px; }
        .mg-g-icon { width:36px;height:36px;border-radius:8px;background:#F1F5F9;display:flex;align-items:center;justify-content:center;color:#64748B;flex-shrink:0; }
        .mg-g-lbl  { font-size:.8rem;font-weight:700;color:#2563EB;margin:0; }
        .mg-g-track{ font-size:1.1rem;font-weight:800;color:#0F172A;margin:0;line-height:1.2; }
        .mg-g-desc { font-size:.8rem;color:#64748B;line-height:1.6;margin:0;flex:1; }
        .mg-g-subj { display:flex;align-items:center;gap:6px;font-size:.78rem;font-weight:600;color:#2563EB; }
        .mg-g-prog { height:3px;background:#E2E8F0;border-radius:100px;overflow:hidden;margin-top:2px; }
        .mg-g-prog-fill{ height:100%;background:#22C55E;border-radius:100px; }

        /* ── Subject pills ── */
        .mg-subj-pills {
          display:flex;flex-wrap:wrap;gap:5px;margin-top:2px;
        }
        .mg-subj-pill {
          font-size:.65rem;font-weight:600;color:#1E40AF;
          background:#EFF6FF;border:1px solid #BFDBFE;
          border-radius:100px;padding:3px 9px;
          white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;
        }
        .mg-subj-pill-skel {
          display:inline-block;height:20px;width:52px;
          background:#F1F5F9;border-radius:100px;
          animation:mgPulse 1.4s ease-in-out infinite;
        }

        .mg-bottom { display:grid;grid-template-columns:1fr 340px;gap:22px;animation:mgFadeUp .7s ease both; }

        /* Disciplines */
        .mg-disc-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:10px; }
        .mg-disc-card { background:#fff;border:1px solid #E5E9F0;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:7px;cursor:pointer;transition:border-color .15s,box-shadow .15s; }
        .mg-disc-card:hover { border-color:#94A3B8;box-shadow:0 4px 14px rgba(0,0,0,.06); }
        .mg-disc-icon{ width:34px;height:34px;border-radius:8px;background:#F8FAFC;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;color:#475569; }
        .mg-disc-name{ font-size:.85rem;font-weight:700;color:#0F172A;margin:0; }
        .mg-disc-desc{ font-size:.74rem;color:#94A3B8;margin:0;line-height:1.4; }

        /* Feature banner */
        .mg-feat { border-radius:14px;overflow:hidden;position:relative;height:270px;display:flex;align-items:flex-end;padding:18px;margin-top:10px;cursor:pointer;background:#1E3A5F; }
        .mg-feat img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block; }
        .mg-feat-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,.1) 60%); }
        .mg-feat-lbl { position:relative;z-index:1; }
        .mg-feat-new { font-size:.62rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#86EFAC;margin:0 0 3px; }
        .mg-feat-title{ font-size:1.05rem;font-weight:800;color:#fff;margin:0;line-height:1.25; }
        .mg-feat-arrow { position:absolute;top:14px;right:14px;z-index:1; }

        /* Analytics */
        .mg-analytics { background:#0F172A;border-radius:20px;padding:26px 22px;display:flex;flex-direction:column; }
        .mg-a-hd { display:flex;align-items:center;justify-content:space-between;margin-bottom:22px; }
        .mg-a-title { font-size:1rem;font-weight:800;color:#fff;margin:0; }
        .mg-ring-wrap { display:flex;justify-content:center;margin-bottom:16px; }
        .mg-ring { position:relative;width:116px;height:116px; }
        .mg-ring svg { transform:rotate(-90deg); }
        .mg-ring-pct { position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center; }
        .mg-ring-num { font-size:1.55rem;font-weight:800;color:#fff;line-height:1; }
        .mg-ring-lbl { font-size:.6rem;font-weight:700;color:#64748B;letter-spacing:1px;text-transform:uppercase; }
        .mg-a-msg { font-size:.8rem;color:#94A3B8;text-align:center;margin-bottom:20px;line-height:1.6; }
        .mg-a-stat { display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-top:1px solid rgba(255,255,255,.06); }
        .mg-a-stat-lbl { font-size:.78rem;color:#64748B; }
        .mg-a-stat-val { font-size:.85rem;font-weight:700;color:#fff; }
        .mg-a-btn { margin-top:18px;width:100%;background:#22C55E;color:#fff;font-weight:700;font-size:.85rem;padding:12px;border:none;border-radius:10px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:filter .15s; }
        .mg-a-btn:hover { filter:brightness(1.08); }

        /* Breadcrumb */
        .mg-bc { display:flex;align-items:center;gap:5px;font-size:.76rem;color:#94A3B8;margin-bottom:32px;animation:mgFadeUp .4s ease both; }
        .mg-bc a { color:#94A3B8;text-decoration:none;font-weight:600;transition:color .14s; }
        .mg-bc a:hover { color:#2563EB; }
        .mg-bc-cur { color:#475569;font-weight:700; }
        .mg-empty { grid-column:1/-1;text-align:center;padding:60px 20px;background:#fff;border-radius:16px;border:2px dashed #E2E8F0;color:#94A3B8; }

        @media(max-width:1024px){ .mg-bottom{grid-template-columns:1fr;} .mg-analytics{max-width:420px;} }
        @media(max-width:768px) { .mg-grade-grid{grid-template-columns:1fr;} .mg-disc-grid{grid-template-columns:1fr 1fr;} }
        @media(max-width:520px) { .mg-disc-grid{grid-template-columns:1fr;} }
      `}</style>

      <div className="mg-wrap">

        {/* Breadcrumb */}
        <nav className="mg-bc">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <ChevronRight size={12} />
          <span className="mg-bc-cur">{isUrdu ? "گریڈ ۶–۸" : "Grades 6–8"}</span>
        </nav>

        {/* Hero */}
        <section className="mg-hero">
          <p className="mg-eyebrow">{isUrdu ? "مڈل اسکول تعلیم" : "Middle School Education"}</p>
          <h1 className="mg-title">{isUrdu ? "اپنا سیکھنے کا سفر بلند کریں۔" : "Elevate Your Learning Journey."}</h1>
          <p className="mg-sub">
            {isUrdu
              ? "آپ کے ذاتی تعلیمی مرکز میں خوش آمدید۔ گریڈ ۶ سے ۸ تک آزادانہ تحقیق کے لیے ڈیزائن کیا گیا۔"
              : "Welcome to your personalized academic headquarters. Designed for independent investigation and rigorous exploration across Grades 6 to 8."}
          </p>
          <div className="mg-btns">
            <button className="mg-btn-p" onClick={() => document.getElementById("grades")?.scrollIntoView({ behavior: "smooth" })}>
              <BookOpen size={15} /> {isUrdu ? "نصاب دریافت کریں" : "Explore Curriculum"}
            </button>
            <button className="mg-btn-s">
              <Calendar size={15} /> {isUrdu ? "کیلنڈر دیکھیں" : "View Calendar"}
            </button>
          </div>
        </section>

        {/* Grade cards */}
        <section id="grades" style={{ marginBottom: 52 }}>
          <div className="mg-sec-hd">
            <h2 className="mg-sec-title">{isUrdu ? "اپنا بنیادی راستہ منتخب کریں" : "Select Your Core Track"}</h2>
            <p className="mg-sec-sub">{isUrdu ? "آپ کی تعلیمی سطح کے مطابق منظم راستے۔" : "Structured pathways tailored to your academic level."}</p>
          </div>
          <div className="mg-grade-grid">
            {loading && Array.from({ length: 3 }).map((_, i) => <GradeSkeleton key={i} />)}

            {!loading && displayGrades.length === 0 && (
              <div className="mg-empty">
                <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                  {isUrdu ? "فی الحال کوئی گریڈ دستیاب نہیں" : "No grades available right now"}
                </p>
              </div>
            )}

            {/* Each GradeCard fetches its own subjects internally */}
            {!loading && displayGrades.map((grade: any, idx: number) => (
              <GradeCard
                key={grade.id ?? idx}
                grade={grade}
                index={idx}
                isUrdu={isUrdu}
                onExplore={handleExplore}
              />
            ))}
          </div>
        </section>

        {/* Bottom: Disciplines + Analytics */}
        <div className="mg-bottom">
          <div>
            <div className="mg-sec-hd">
              <h2 className="mg-sec-title">{isUrdu ? "تعلیمی مضامین" : "Academic Disciplines"}</h2>
            </div>

            <div className="mg-disc-grid">
              {DISCIPLINES.map((d, i) => (
                <div key={i} className="mg-disc-card">
                  <div className="mg-disc-icon">{d.icon}</div>
                  <p className="mg-disc-name">{isUrdu ? d.name.ur : d.name.en}</p>
                  <p className="mg-disc-desc">{isUrdu ? d.desc.ur : d.desc.en}</p>
                </div>
              ))}
            </div>

            <div className="mg-feat" onClick={() => navigate("/resources")}>
              <img src={labImage} alt="Advanced Laboratory Simulations" />
              <div className="mg-feat-overlay" />
              <div className="mg-feat-lbl">
                <p className="mg-feat-new">{isUrdu ? "نیا وسیلہ" : "New Resource"}</p>
                <p className="mg-feat-title">{isUrdu ? "جدید لیبارٹری سمولیشن" : "Advanced Laboratory Simulations"}</p>
              </div>
              <div className="mg-feat-arrow">
                <ArrowRight size={16} style={{ color: "rgba(255,255,255,.5)" }} />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="mg-analytics">
            <div className="mg-a-hd">
              <p className="mg-a-title">{isUrdu ? "مطالعہ تجزیات" : "Study Analytics"}</p>
              <BarChart2 size={17} style={{ color: "#22C55E" }} />
            </div>
            <div className="mg-ring-wrap">
              <div className="mg-ring">
                <svg width="116" height="116" viewBox="0 0 116 116">
                  <circle cx="58" cy="58" r="48" fill="none" stroke="#1E293B" strokeWidth="10" />
                  <circle cx="58" cy="58" r="48" fill="none" stroke="#22C55E" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - analytics.pct / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="mg-ring-pct">
                  <span className="mg-ring-num">{analytics.pct}%</span>
                  <span className="mg-ring-lbl">GOAL</span>
                </div>
              </div>
            </div>
            <p className="mg-a-msg">
              {isUrdu
                ? "آپ اپنے روزانہ تحقیقی سنگ میل سے ۱۵ منٹ دور ہیں۔"
                : "You are 15 minutes away from your daily research milestone."}
            </p>
            <div className="mg-a-stat">
              <span className="mg-a-stat-lbl">{isUrdu ? "ہفتہ وار اوسط" : "Weekly Average"}</span>
              <span className="mg-a-stat-val">{analytics.weekly}</span>
            </div>
            <div className="mg-a-stat">
              <span className="mg-a-stat-lbl">{isUrdu ? "موجودہ سلسلہ" : "Current Streak"}</span>
              <span className="mg-a-stat-val">{analytics.streak}</span>
            </div>
            <button className="mg-a-btn">{isUrdu ? "مکمل رپورٹ دیکھیں" : "View Full Report"}</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MiddleGradesView;