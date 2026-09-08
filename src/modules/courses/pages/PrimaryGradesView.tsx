import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { classSlugFromId } from "@/config/classSlugs";
import { useGrades } from "@/modules/shared/hooks/useGrade";

const CourseImage1 = "https://cdn.zaheen.com.pk/zaheen-web-img/vocab1.png";
const CourseImage2 = "https://cdn.zaheen.com.pk/zaheen-web-img/solar2.png";

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
   Per-grade config — each grade has its own color + unique SVG icon
──────────────────────────────────────────────────────────────── */
const GRADE_META: Record<number, {
  color: string; border: string;
  iconBg: string; iconColor: string;
  badge: { en: string; ur: string };
  desc: { en: string; ur: string };
  icon: React.ReactNode;
}> = {
  1: {
    color: "#2563EB", border: "#2563EB",
    iconBg: "linear-gradient(135deg,#DBEAFE 0%,#EEF3FF 100%)",
    iconColor: "#2563EB",
    badge: { en: "Foundation", ur: "بنیاد" },
    desc:  { en: "Begin your magical journey with basic letters and numbers.", ur: "بنیادی حروف اور اعداد کے ساتھ اپنا سفر شروع کریں۔" },
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        <path d="m15 5 4 4"/>
      </svg>
    ),
  },
  2: {
    color: "#92400E", border: "#92400E",
    iconBg: "linear-gradient(135deg,#FDE68A 0%,#FEF3E2 100%)",
    iconColor: "#92400E",
    badge: { en: "Explorer", ur: "مہم جو" },
    desc:  { en: "Dive deeper into wonderful stories and creative puzzles.", ur: "شاندار کہانیوں اور تخلیقی پہیلیوں میں گہرائی سے غوطہ لگائیں۔" },
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  3: {
    color: "#065F46", border: "#065F46",
    iconBg: "linear-gradient(135deg,#A7F3D0 0%,#E6FAF5 100%)",
    iconColor: "#065F46",
    badge: { en: "Discoverer", ur: "دریافت کار" },
    desc:  { en: "Discover the secrets of the world and our environment.", ur: "دنیا اور ہمارے ماحول کے رازوں کو دریافت کریں۔" },
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  4: {
    color: "#6D28D9", border: "#6D28D9",
    iconBg: "linear-gradient(135deg,#DDD6FE 0%,#F0ECFF 100%)",
    iconColor: "#6D28D9",
    badge: { en: "Scientist", ur: "سائنسدان" },
    desc:  { en: "Reach for the stars with advanced science and math.", ur: "جدید سائنسی اور ریاضی کے ساتھ ستاروں تک پہنچیں۔" },
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3"/>
        <path d="M3 9a9 9 0 0 0 9 9 9 9 0 0 0 6.32-2.6"/>
        <path d="M21 9H3"/>
      </svg>
    ),
  },
  5: {
    color: "#BE185D", border: "#BE185D",
    iconBg: "linear-gradient(135deg,#FBCFE8 0%,#FFF0F7 100%)",
    iconColor: "#BE185D",
    badge: { en: "Champion", ur: "چیمپئن" },
    desc:  { en: "Master the skills you need for the big adventures ahead.", ur: "آگے آنے والی مہم جوئی کے لیے مہارتوں میں مہارت حاصل کریں۔" },
    icon: (
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
        <path d="M12 2v16"/>
        <circle cx="12" cy="8" r="2"/>
      </svg>
    ),
  },
};

const DEFAULT_META = {
  color: "#2563EB", border: "#2563EB",
  iconBg: "linear-gradient(135deg,#DBEAFE 0%,#EEF3FF 100%)",
  iconColor: "#2563EB",
  badge: { en: "Grade", ur: "جماعت" },
  desc:  { en: "Explore subjects and start learning.", ur: "مضامین دریافت کریں اور سیکھنا شروع کریں۔" },
  icon: (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
};

const extractNum = (name: string) => { 
  if (!name) return 0;
  
  const normalizedName = name.toLowerCase();

  // 1. Check for Urdu text descriptions returned by API
  if (normalizedName.includes("اول") || normalizedName.includes("one") || normalizedName.includes("first")) return 1;
  if (normalizedName.includes("دوم") || normalizedName.includes("two") || normalizedName.includes("second")) return 2;
  if (normalizedName.includes("سوم") || normalizedName.includes("three") || normalizedName.includes("third")) return 3;
  if (normalizedName.includes("چہارم") || normalizedName.includes("four") || normalizedName.includes("fourth")) return 4;
  if (normalizedName.includes("پنجم") || normalizedName.includes("five") || normalizedName.includes("fifth")) return 5;

  // 2. Check for Eastern Arabic/Urdu native digits (۱, ۲, ۳...)
  const normalizedDigits = name.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
  
  // 3. Fallback to Western digit matching (1, 2, 3...)
  const m = normalizedDigits.match(/\d+/); 
  return m ? parseInt(m[0], 10) : 0; 
};

const FEATURED_COURSES = [
  {
    id: 1,
    title: { en: "📚 Vocabulary Building", ur: "📚 ذخیرۂ الفاظ میں اضافہ" },
    desc:  { en: "Expand your vocabulary with fun lessons, exciting activities, and new words that boost your confidence in speaking, reading, and writing.", ur: "دلچسپ اسباق، پرلطف سرگرمیوں اور نئے الفاظ کے ذریعے اپنی لغت (الفاظ کے ذخیرے) میں اضافہ کریں، تاکہ بولنے، پڑھنے اور لکھنے میں آپ کا اعتماد مزید مضبوط ہو۔" },
    src: CourseImage1,
    path: "/vocab", // not wired up yet
    
  },
  {
    id: 2,
    title: { en: "🌌 Explore the Universe", ur: "🌌 کائنات کی سیر کریں" },
    desc:  { en: "Learn about the solar system, astronauts, galaxies, and incredible space adventures through fun activities.", ur: "نظامِ شمسی، خلا بازوں، کہکشاؤں اور خلا کی حیرت انگیز مہمات کے بارے میں دلچسپ اور تفریحی سرگرمیوں کے ذریعے سیکھیں۔" },
    src: CourseImage2,
    path: "/cosmokid",
  },
];

/* ── Skeleton ── */
const GradeSkeleton = () => (
  <div style={{ background:"#fff", borderRadius:20, padding:"20px 18px 22px", border:"1.5px solid #E8EEF7", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
    <div style={{ width:84, height:84, borderRadius:20, background:"#E8EAF6", marginBottom:18, animation:"pgPulse 1.4s ease-in-out infinite" }} />
    <div style={{ height:22, background:"#E8EEF7", borderRadius:6, width:"55%", marginBottom:12, animation:"pgPulse 1.4s ease-in-out infinite" }} />
    <div style={{ height:13, background:"#E8EEF7", borderRadius:6, width:"88%", marginBottom:6, animation:"pgPulse 1.4s ease-in-out infinite" }} />
    <div style={{ height:13, background:"#E8EEF7", borderRadius:6, width:"70%", marginBottom:20, animation:"pgPulse 1.4s ease-in-out infinite" }} />
    <div style={{ height:42, background:"#E8EEF7", borderRadius:100, width:"85%", animation:"pgPulse 1.4s ease-in-out infinite" }} />
  </div>
);

const PrimaryGradesView = () => {
  const navigate = useNavigate();
   const [navigating, setNavigating] = useState(false);  // add this
  const lang     = useLang();
  const isUrdu   = lang === "ur";

  const { grades = [], loading } = useGrades("primary") as { grades: any[]; loading: boolean };

  const safeGrades: any[] = Array.isArray(grades) ? grades : Array.isArray((grades as any)?.data) ? (grades as any).data : [];

  const primaryGrades = safeGrades.filter((g: any, index: number) => { 
    // Try matching both English names and Urdu descriptive names
    let n = extractNum(g?.name || ""); 
    if (n === 0) n = extractNum(g?.urdu_name || "");
    if (n === 0) n = g?.level || g?.grade_number || g?.sort_order || (index + 1);
    
    return n >= 1 && n <= 5; 
  });

  const displayGrades = primaryGrades.length > 0 ? primaryGrades : safeGrades;

 const handleExplore = (grade: any) =>
    navigate(`/${classSlugFromId(grade.id)}`, { state: { gradeType: grade.name, classTitle: grade.name } });
if (navigating) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#ECEEF5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: "4px solid #E0E7FF",
        borderTopColor: "#2563EB",
        animation: "pgPulse 0.8s linear infinite",
      }} />
    </div>
  );
}
  return (
    <div style={{ minHeight:"100vh", background:"#ECEEF5", fontFamily:"'Nunito','Segoe UI',sans-serif", direction: isUrdu ? "rtl" : "ltr", overflowX:"hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes pgPulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes pgFadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pgDrift   { 0%{transform:translate(0,0) rotate(0deg)} 33%{transform:translate(4px,-10px) rotate(2deg)} 66%{transform:translate(-4px,-5px) rotate(-1deg)} 100%{transform:translate(0,0) rotate(0deg)} }

        .pg-float { position:absolute; pointer-events:none; animation:pgDrift linear infinite; color:#B0BCE0; opacity:.5; }
        .pg-wrap { max-width: 1200px; margin: 0 auto; padding: 25px clamp(14px, 4vw, 28px) 64px; position: relative; }

        /* HERO */
        .pg-hero { position:relative; background:linear-gradient(140deg,#FFFFFF 0%,#E5ECF8 45%,#D8EEE7 100%); border-radius:24px; padding:clamp(52px,8vw,88px) clamp(20px,5vw,60px); text-align:center; overflow:hidden; margin-bottom:28px; box-shadow:0 2px 24px rgba(100,120,180,.09); border:1px solid rgba(255,255,255,.85); animation:pgFadeUp .45s ease both; }
        .pg-hero-title  { font-size:clamp(1.75rem,4.5vw,3rem); font-weight:900; color:#111827; margin:0 0 16px; line-height:1.15; letter-spacing:-.5px; }
        .pg-hero-accent { color:#2563EB; }
        .pg-hero-sub    { font-size:clamp(.88rem,1.8vw,1.05rem); color:#4B5A78; margin:0 auto 28px; max-width:500px; line-height:1.7; }
        .pg-hero-btn    { display:inline-flex; align-items:center; gap:6px; background:rgba(214,226,248,.75); color:#1D4ED8; font-weight:800; font-size:.9rem; padding:11px 28px; border-radius:100px; text-decoration:none; border:1.5px solid rgba(147,174,228,.55); backdrop-filter:blur(8px); transition:background .18s,transform .15s; font-family:'Nunito',sans-serif; }
        .pg-hero-btn:hover { background:rgba(193,212,245,.9); transform:translateY(-2px); }

        /* HOW IT WORKS */
        .pg-steps      { background:#FFF; border-radius:20px; padding:clamp(28px,4vw,40px) clamp(20px,4vw,48px); margin-bottom:28px; box-shadow:0 2px 16px rgba(100,120,180,.07); animation:pgFadeUp .5s ease both; }
        .pg-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
        .pg-step       { display:flex; flex-direction:column; align-items:center; text-align:center; }
        .pg-step-icon  { width:80px; height:80px; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:16px; }
        .pg-step-title { font-size:1rem; font-weight:800; color:#111827; margin:0 0 8px; }
        .pg-step-desc  { font-size:.85rem; color:#5A6A8C; margin:0; line-height:1.55; }

        /* SECTION HEADER */
        .pg-section-row   { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; gap:10px; flex-wrap:wrap; animation:pgFadeUp .52s ease both; }
        .pg-section-title { font-size:.97rem; font-weight:800; color:#1A2744; display:flex; align-items:center; gap:6px; margin:0; }
        .pg-view-all      { font-size:.88rem; font-weight:700; color:#2563EB; text-decoration:none; transition:opacity .15s; }
        .pg-view-all:hover{ opacity:.65; }

        /* GRADE GRID */
        .pg-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; animation:pgFadeUp .58s ease both; }

        /* GRADE CARD */
        .pg-card {
          background:#FFF; border-radius:20px; padding:22px 16px 22px;
          cursor:pointer;
          border-top:4px solid transparent;
          border-left:1.5px solid #EEF0F8;
          border-right:1.5px solid #EEF0F8;
          border-bottom:1.5px solid #EEF0F8;
          box-shadow:0 2px 12px rgba(100,120,180,.07);
          transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;
          display:flex; flex-direction:column; align-items:center; text-align:center; overflow:hidden;
        }
        .pg-card:hover { transform:translateY(-6px) scale(1.015); box-shadow:0 16px 40px rgba(100,120,180,.15); }

        /* ICON BOX */
        .pg-icon-box { width:84px; height:84px; border-radius:20px; display:flex; align-items:center; justify-content:center; margin-bottom:16px; transition:transform .2s ease; flex-shrink:0; }
        .pg-card:hover .pg-icon-box { transform:scale(1.08); }

        .pg-grade-name  { font-size:1.35rem; font-weight:900; color:#111827; margin:0 0 10px; line-height:1.15; }
        .pg-grade-desc  { font-size:.8rem; color:#5A6A8C; margin:0 0 18px; line-height:1.55; flex:1; }
        .pg-explore-btn { width:100%; border:none; border-radius:100px; padding:11px 16px; font-size:.85rem; font-weight:800; cursor:pointer; font-family:'Nunito',sans-serif; color:#fff; transition:filter .15s,transform .15s; }
        .pg-explore-btn:hover { filter:brightness(1.1); transform:scale(1.02); }

        /* BREADCRUMB */
        .pg-bc   { display:flex; align-items:center; gap:6px; font-size:.82rem; color:#8A9BB8; margin-bottom:10px; animation:pgFadeUp .38s ease both; }
        .pg-bc a { color:#8A9BB8; text-decoration:none; font-weight:600; }
        .pg-bc a:hover { color:#2563EB; }
        .pg-bc-cur { color:#3D5080; font-weight:700; }

        /* EMPTY */
        .pg-empty { grid-column:1/-1; display:flex; flex-direction:column; align-items:center; padding:60px 20px; background:#fff; border-radius:20px; border:2px dashed #C8D5E8; color:#8A9BB8; text-align:center; gap:10px; }

        /* FEATURED SECTION & LAYOUT DIMS */
        .pg-featured-section { margin-top:40px; animation:pgFadeUp .65s ease both; }
        .pg-featured-grid    { display:grid; grid-template-columns:repeat(2,1fr) 340px; gap:18px; align-items:stretch; }
        .pg-course-card      { background:#FFF; border-radius:20px; overflow:hidden; border:1.5px solid #EEF0F8; box-shadow:0 2px 14px rgba(100,120,180,.07); cursor:pointer; transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease; display:flex; flex-direction:column; }
        .pg-course-card:hover{ transform:translateY(-5px); box-shadow:0 18px 44px rgba(100,120,180,.14); }
        
       .pg-course-img-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;   /* match your images' actual ratio */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;              /* remove the 12px side padding causing the gutters */
  box-sizing: border-box;
  background: #FFFFFF !important;
}

      .pg-course-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;   /* anchors crop to the top, revealing top-of-image text */
  display: block;
  transition: transform .35s ease;
  border-radius: 14px 14px 0 0;
}
        .pg-course-card:hover .pg-course-img-wrap img { transform:scale(1.04); }
        
        .pg-course-body  { padding: 18px 14px 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .pg-course-title { font-size:1.05rem; font-weight:900; color:#111827; margin:0; line-height:1.2; }
        .pg-course-desc  { font-size:.82rem; color:#5A6A8C; margin:0; line-height:1.4; flex:initial; }
        
        .pg-cta-card     { border-radius:20px; background:linear-gradient(150deg,#1D4ED8 0%,#2563EB 50%,#1E40AF 100%); padding:22px 24px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:10px; box-shadow:0 8px 32px rgba(37,99,235,.35); border:1.5px solid rgba(255,255,255,.15); position:relative; overflow:hidden; }
        .pg-cta-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.12) 0%,transparent 55%); pointer-events:none; }
        .pg-cta-badge { width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; color:#fff; backdrop-filter:blur(6px); }
        .pg-cta-title { font-size:1.3rem; font-weight:900; color:#fff; margin:0; line-height:1.2; }
        .pg-cta-sub   { font-size:.82rem; color:rgba(255,255,255,.82); margin:0; line-height:1.5; }
        .pg-cta-btn   { background:#fff; color:#1D4ED8; font-weight:900; border:none; border-radius:100px; padding:10px 28px; font-size:.88rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:transform .15s,box-shadow .15s; box-shadow:0 4px 14px rgba(0,0,0,.12); }
        .pg-cta-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 20px rgba(0,0,0,.18); }

        /* RESPONSIVE */
        @media(max-width:1100px){ .pg-grid{ grid-template-columns:repeat(3,1fr); } .pg-featured-grid{ grid-template-columns:1fr 1fr; } .pg-cta-card{ grid-column:1/-1; flex-direction:row; gap:24px; text-align:left; padding:22px 28px; } }
        @media(max-width:860px) { .pg-steps-grid{ grid-template-columns:1fr; gap:24px; } .pg-step{ flex-direction:row; text-align:left; gap:18px; } .pg-step-icon{ flex-shrink:0; width:64px; height:64px; margin-bottom:0; } .pg-grid{ grid-template-columns:repeat(2,1fr); } .pg-featured-grid{ grid-template-columns:1fr; } .pg-cta-card{ flex-direction:column; text-align:center; } }
        @media(max-width:520px) { .pg-hero-title{ font-size:1.65rem; } .pg-grid{ grid-template-columns:1fr; gap:14px; } .pg-step{ flex-direction:column; text-align:center; } .pg-step-icon{ margin-bottom:12px; } .pg-icon-box{ width:72px; height:72px; } }
      `}</style>

      <div className="pg-wrap">

        {/* Breadcrumb */}
        <nav className="pg-bc">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <span>/</span>
          <span className="pg-bc-cur">{isUrdu ? "گریڈ ۱–۵" : "Grades 1–5"}</span>
        </nav>

        {/* ══ HERO ══ */}
        <div className="pg-hero">
          <span className="pg-float" style={{ top:26, left:26, animationDuration:"7s" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <span className="pg-float" style={{ top:30, left:66, animationDuration:"9s", animationDelay:"1.2s" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </span>
          <span className="pg-float" style={{ top:20, right:76, animationDuration:"8.5s", animationDelay:"0.4s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </span>
          <span className="pg-float" style={{ top:28, right:20, animationDuration:"11s", animationDelay:"2s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </span>
          <span className="pg-float" style={{ bottom:28, left:44, animationDuration:"9.5s", animationDelay:"0.7s", opacity:0.35 }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="20,4 28,16 12,16"/><rect x="6" y="20" width="12" height="12" rx="2"/><circle cx="28" cy="26" r="6"/></svg>
          </span>

          <div style={{ position:"relative", zIndex:1 }}>
            <h1 className="pg-hero-title">
              {isUrdu
                ? "آپ کی سیکھنے کی مہم جوئی!"
                : <> Welcome to Your <span className="pg-hero-accent">Learning Adventure!</span> </>}
            </h1>
            <p className="pg-hero-sub">
              {isUrdu
                ? "اپنا گریڈ منتخب کریں اور دریافت شروع کریں۔ ہر قدم ایک نئی دریافت ہے۔"
                : "Choose your grade to start exploring. Every step is a new discovery waiting for you."}
            </p>
            <a href="#grades" className="pg-hero-btn">
              {isUrdu ? "⬇ شروع کریں!" : "New here? Let's get started! ↓"}
            </a>
          </div>
        </div>

        {/* ══ HOW IT WORKS ══ */}
        <div className="pg-steps">
          <div className="pg-steps-grid">
            <div className="pg-step">
              <div className="pg-step-icon" style={{ background:"#EEF3FF", color:"#2563EB" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <div>
                <p className="pg-step-title"> {isUrdu ? "۱. گریڈ منتخب کریں" : "1. Select Grade"}</p>
                <p className="pg-step-desc">{isUrdu ? "اپنی عمر کے لیے صحیح سطح چنیں" : "Pick the right level for your age"}</p>
              </div>
            </div>
            <div className="pg-step">
              <div className="pg-step-icon" style={{ background:"#E6FAF5", color:"#059669" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <p className="pg-step-title">{isUrdu ? "۲. مضمون چنیں" : "2. Pick a Subject"}</p>
                <p className="pg-step-desc">{isUrdu ? "ریاضی، سائنس یا آرٹ دریافت کریں" : "Explore math, science, or art"}</p>
              </div>
            </div>
            <div className="pg-step">
              <div className="pg-step-icon" style={{ background:"#FEF3E2", color:"#92400E" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
              </div>
              <div>
                <p className="pg-step-title">{isUrdu ? "۳. سیکھنا شروع کریں" : "3. Start Learning"}</p>
                <p className="pg-step-desc">{isUrdu ? "آگے بڑھتے ہوئے انعامات حاصل کریں" : "Unlock rewards as you play"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ GRADE SECTION HEADER ══ */}
        <div className="pg-section-row" id="grades"></div>

        {/* ══ GRADE CARDS ══ */}
        <div className="pg-grid">
          {loading && Array.from({ length:5 }).map((_,i) => <GradeSkeleton key={i} />)}

          {!loading && displayGrades.length === 0 && (
            <div className="pg-empty">
              <span style={{ fontSize:"2.6rem" }}>📭</span>
              <p style={{ fontWeight:700, color:"#5A6A8A", margin:0 }}>
                {isUrdu ? "فی الحال کوئی گریڈ دستیاب نہیں" : "No grades available right now"}
              </p>
            </div>
          )}

         {!loading && displayGrades.map((grade: any, i: number) => {
  // 1. Get the grade number quietly for icons and colors
  let num = extractNum(grade?.name || "");
  if (num === 0) num = extractNum(grade?.urdu_name || "");
  if (num === 0) num = grade?.level || grade?.grade_number || (i % 5) + 1;

  const meta = GRADE_META[num] ?? DEFAULT_META;
  
  // 2. FIXED: Map numbers to beautiful Urdu text if your API doesn't pass it
  const urduWords: Record<number, string> = {
    1: "جماعت اول",
    2: "جماعت دوم",
    3: "جماعت سوم",
    4: "جماعت چہارم",
    5: "جماعت پنجم"
  };

  // If Urdu mode is on, prioritize the exact text from the API, 
  // or look up our native words table, or use a smart fallback.
  const displayName = isUrdu
    ? (grade.urdu_name?.trim() || (grade.name && isNaN(Number(grade.name)) ? grade.name : urduWords[num]) || urduWords[num])
    : (grade.name || `Grade ${num}`);

  const displayDesc = isUrdu
    ? (grade.urdu_description?.trim() || meta.desc.ur)
    : (grade.description?.trim()      || meta.desc.en);

  return (
    <div
      key={grade.id ?? i}
      className="pg-card"
      style={{ borderTopColor: meta.color }}
      onClick={() => handleExplore(grade)}
    >
      <div
        className="pg-icon-box"
        style={{ background: meta.iconBg, color: meta.iconColor }}
      >
        {meta.icon}
      </div>

      {/* This renders "جماعت اول", "جماعت دوم", etc. instead of numbers! */}
      <h3 className="pg-grade-name">{displayName}</h3>
      <p className="pg-grade-desc">{displayDesc}</p>

      <button
        className="pg-explore-btn"
        style={{ background: meta.color }}
        onClick={e => { e.stopPropagation(); handleExplore(grade); }}
      >
        {isUrdu ? "کلاس دریافت کریں" : "Explore Class"}
      </button>
    </div>
  );
})}
        </div>

        {/* ══ FEATURED COURSES ══ */}
        <div className="pg-featured-section">
          <div className="pg-section-row" style={{ marginTop:8 }}>
            <h2 className="pg-section-title">
              <span>⭐</span>
              {isUrdu ? "اپنی دلچسپی جگائیں!" : "Spark Your Interest!"}
              <span>✨</span>
            </h2>
            
          </div>

          <div className="pg-featured-grid">
            {FEATURED_COURSES.map((course) => (
              <div
    key={course.id}
    className="pg-course-card"
    onClick={() => {
      if (course.path) {
         setNavigating(true);  
        navigate(course.path);
        window.scrollTo(0, 0);
      }
    }}
    style={{ cursor: course.path ? "pointer" : "default" }}
  >
                <div className="pg-course-img-wrap">
                  {course.src
                    ? <img src={course.src} alt={course.title.en} />
                    : <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        width: "100%", 
                        height: "100%", 
                        color: "rgba(100,120,180,.4)", 
                        fontSize: ".75rem", 
                        fontWeight: 700,
                        borderRadius: "14px"
                      }}>Image here</div>
                  }
                </div>
                <div className="pg-course-body">
                  <h3 className="pg-course-title">{isUrdu ? course.title.ur : course.title.en}</h3>
                  <p className="pg-course-desc">{isUrdu ? course.desc.ur : course.desc.en}</p>
                </div>
              </div>
            ))}

            {/* CTA CARD */}
            <div className="pg-cta-card">
              <div className="pg-cta-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <h3 className="pg-cta-title">{isUrdu ? "۵٬۰۰۰+ طلباء میں شامل ہوں" : "Join 5,000+ Students"}</h3>
              <p className="pg-cta-sub">{isUrdu ? "آج مفت ٹرائل شروع کریں اور اپنا پہلا بیج حاصل کریں!" : "Start your free trial today and earn your first badge!"}</p>
              <button className="pg-cta-btn" onClick={() => navigate("/subscribe")}>
                {isUrdu ? "شروع کریں" : "Get Started"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrimaryGradesView;