import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  MapPin,
  GraduationCap,
  CalendarDays,
  Clock,
  BadgeCheck,
  Star,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Globe,
  Award,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";

/* ─────────────────────────────────────────────────────────────
   Scholarships API (GET only)
   GET /api/scholarships          → list (filters + pagination)
   GET /api/scholarships/countries → country dropdown
   GET /api/scholarships/:id       → single scholarship (details)
──────────────────────────────────────────────────────────────── */
const API = "https://api.zaheen.com.pk/v2/api";
const LIMIT = 12;

interface Scholarship {
  id: number;
  title: string;
  university_name: string | null;
  country: string | null;
  scholarship_type: string | null;
  degree_level: string | null;
  field_of_study: string | null;
  application_url: string | null;
  official_website: string | null;
  application_deadline: string | null;
  days_remaining: number | null;
  intake_year: number | null;
  funding_details: string | null;
  eligibility_criteria: string | null;
  scholarship_benefits: string | null;
  description: string | null;
  required_documents: string | null;
  application_process: string | null;
  is_featured: boolean;
  is_verified: boolean;
}

/* ── Text (English / Urdu) ── */
const TEXT = {
  en: {
    title: "Scholarships for Pakistani Students",
    subtitle:
      "Find fully funded and partial scholarships for Pakistani students from top universities around the world. Filter by country, degree level and deadline, and apply before it closes.",
    searchPh: "Search by scholarship or university",
    country: "Country",
    allCountries: "All countries",
    degree: "Degree level",
    all: "All",
    closing: "Deadline",
    anyDeadline: "Any deadline",
    within: (n: number) => `Closing in ${n} days`,
    featuredOnly: "Featured only",
    clear: "Clear filters",
    found: (n: number) => `${n} ${n === 1 ? "scholarship" : "scholarships"} found`,
    apply: "Apply now",
    details: "View details",
    daysLeft: (n: number) => `${n} days left`,
    today: "Closes today",
    closed: "Closed",
    deadline: "Deadline",
    featured: "Featured",
    verified: "Verified",
    emptyTitle: "No scholarships found",
    emptyDesc: "Try a different search, or clear your filters.",
    errorTitle: "Could not load scholarships",
    errorDesc: "Check your connection and try again.",
    retry: "Try again",
    prev: "Previous",
    next: "Next",
    pageOf: (p: number, t: number) => `Page ${p} of ${t}`,
    close: "Close",
    about: "About",
    funding: "Funding",
    eligibility: "Eligibility",
    benefits: "Benefits",
    documents: "Required documents",
    process: "How to apply",
    field: "Field of study",
    intake: "Intake year",
    website: "Official website",
    degrees: { Bachelor: "Bachelor", Master: "Master", PhD: "PhD" } as Record<string, string>,
  },
  ur: {
    title: "پاکستانی طلباء کے لیے اسکالرشپس",
    subtitle:
      "دنیا بھر کی بہترین یونیورسٹیوں کی مکمل اور جزوی فنڈڈ اسکالرشپس تلاش کریں، ملک، ڈگری اور آخری تاریخ کے مطابق فلٹر کریں اور وقت پر اپلائی کریں۔",
    searchPh: "اسکالرشپ یا یونیورسٹی کے نام سے تلاش کریں",
    country: "ملک",
    allCountries: "تمام ممالک",
    degree: "ڈگری کی سطح",
    all: "تمام",
    closing: "آخری تاریخ",
    anyDeadline: "کوئی بھی تاریخ",
    within: (n: number) => `${n} دن میں ختم`,
    featuredOnly: "صرف نمایاں",
    clear: "فلٹرز صاف کریں",
    found: (n: number) => `${n} اسکالرشپس ملیں`,
    apply: "ابھی اپلائی کریں",
    details: "تفصیلات دیکھیں",
    daysLeft: (n: number) => `${n} دن باقی`,
    today: "آج آخری دن ہے",
    closed: "بند",
    deadline: "آخری تاریخ",
    featured: "نمایاں",
    verified: "تصدیق شدہ",
    emptyTitle: "کوئی اسکالرشپ نہیں ملی",
    emptyDesc: "کوئی اور لفظ تلاش کریں، یا فلٹرز صاف کریں۔",
    errorTitle: "اسکالرشپس لوڈ نہیں ہو سکیں",
    errorDesc: "اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔",
    retry: "دوبارہ کوشش کریں",
    prev: "پچھلا",
    next: "اگلا",
    pageOf: (p: number, t: number) => `صفحہ ${p} از ${t}`,
    close: "بند کریں",
    about: "تعارف",
    funding: "فنڈنگ",
    eligibility: "اہلیت",
    benefits: "فوائد",
    documents: "مطلوبہ دستاویزات",
    process: "اپلائی کرنے کا طریقہ",
    field: "مضمون کا شعبہ",
    intake: "داخلے کا سال",
    website: "آفیشل ویب سائٹ",
    degrees: { Bachelor: "بیچلر", Master: "ماسٹر", PhD: "پی ایچ ڈی" } as Record<string, string>,
  },
};

const DEGREES = ["Bachelor", "Master", "PhD"];
const CLOSING_OPTIONS = [15, 30, 60];

/* ── SEO ── */
const SEO = {
  en: {
    title: "Scholarships for Pakistani Students 2027 | Fully Funded | Zaheen",
    description:
      "Find fully funded and partial scholarships for Pakistani students abroad. Filter by country, degree level and deadline, and apply before it closes.",
    keywords: [
      "scholarships for Pakistani students",
      "fully funded scholarships for Pakistani students",
      "scholarships in Pakistan",
      "scholarships 2027",
      "study abroad scholarships Pakistan",
      "bachelor scholarships for Pakistani students",
      "master scholarships for Pakistani students",
      "PhD scholarships for Pakistani students",
      "international scholarships Pakistan",
      "HEC scholarships",
      "scholarship deadlines",
      "Zaheen scholarships",
    ].join(", "),
    locale: "en_PK",
  },
  ur: {
    title: "پاکستانی طلباء کے لیے اسکالرشپس 2027 | مکمل فنڈڈ | ذہین",
    description:
      "پاکستانی طلباء کے لیے بیرونِ ملک مکمل اور جزوی فنڈڈ اسکالرشپس تلاش کریں۔ ملک، ڈگری اور آخری تاریخ کے مطابق فلٹر کریں اور اپلائی کریں۔",
    keywords: [
      "پاکستانی طلباء کے لیے اسکالرشپس",
      "مکمل فنڈڈ اسکالرشپس",
      "بیرون ملک اسکالرشپس",
      "اسکالرشپس 2027",
      "ایچ ای سی اسکالرشپس",
      "scholarships for Pakistani students",
      "fully funded scholarships Pakistan",
    ].join(", "),
    locale: "ur_PK",
  },
};

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/* ── Helpers ── */
const isHttpUrl = (u?: string | null) => !!u && /^https?:\/\//i.test(u.trim());

const splitDegrees = (v?: string | null) =>
  (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const formatDate = (d: string | null, isUrdu: boolean) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(isUrdu ? "ur-PK" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* Countdown badge colour: red ≤ 7 days, amber ≤ 30 days, teal otherwise */
const daysStyle = (days: number) => {
  if (days <= 7) return { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "rgba(239,68,68,0.35)" };
  if (days <= 30) return { bg: "rgba(240,180,41,0.15)", color: "#F0B429", border: "rgba(240,180,41,0.35)" };
  return { bg: "rgba(45,212,191,0.12)", color: "#5eead4", border: "rgba(45,212,191,0.3)" };
};

/* ─────────────────────────────────────────────────────────────
   Skeleton card (loading state)
──────────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div
    className="rounded-2xl p-5 md:p-6 flex flex-col gap-4"
    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <div className="sch-shimmer h-5 w-3/4 rounded-md" />
    <div className="sch-shimmer h-4 w-1/2 rounded-md" />
    <div className="flex gap-2">
      <div className="sch-shimmer h-6 w-16 rounded-full" />
      <div className="sch-shimmer h-6 w-16 rounded-full" />
    </div>
    <div className="sch-shimmer h-4 w-2/3 rounded-md" />
    <div className="sch-shimmer h-10 w-full rounded-xl mt-2" />
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Scholarship card
──────────────────────────────────────────────────────────────── */
const ScholarshipCard: React.FC<{
  s: Scholarship;
  index: number;
  tx: typeof TEXT.en;
  isUrdu: boolean;
  onOpen: (s: Scholarship) => void;
}> = ({ s, index, tx, isUrdu, onOpen }) => {
  const degrees = splitDegrees(s.degree_level);
  const days = s.days_remaining;

  let badge: React.ReactNode = null;
  if (days !== null && days !== undefined) {
    const label = days < 0 ? tx.closed : days === 0 ? tx.today : tx.daysLeft(days);
    const st = days < 0 ? { bg: "rgba(148,163,184,0.15)", color: "#cbd5e1", border: "rgba(148,163,184,0.3)" } : daysStyle(days);
    badge = (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
        style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
      >
        <Clock size={12} />
        {label}
      </span>
    );
  }

  return (
    <article
      className="sch-card group relative rounded-2xl flex flex-col h-full overflow-hidden"
      style={{
        animationDelay: `${Math.min(index, 11) * 60}ms`,
        background: "rgba(255,255,255,0.04)",
        border: s.is_featured ? "1px solid rgba(240,180,41,0.4)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {s.is_featured && (
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />
      )}

      <div className="p-5 md:p-6 flex flex-col flex-grow gap-4">
        {/* Top row: badges */}
        <div className="flex flex-wrap items-center gap-2 min-h-[28px]">
          {badge}
          {s.is_featured && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(240,180,41,0.15)", color: "#F0B429", border: "1px solid rgba(240,180,41,0.35)" }}
            >
              <Star size={12} fill="currentColor" />
              {tx.featured}
            </span>
          )}
          {s.is_verified && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(45,212,191,0.12)", color: "#5eead4", border: "1px solid rgba(45,212,191,0.3)" }}
            >
              <BadgeCheck size={12} />
              {tx.verified}
            </span>
          )}
        </div>

        {/* Title + university */}
        <div>
          <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{s.title}</h3>
          {s.university_name && (
            <p className="text-slate-400 text-sm mt-1.5 line-clamp-1">{s.university_name}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 text-sm text-slate-300">
          {s.country && (
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-slate-500 flex-shrink-0" />
              <span>{s.country}</span>
            </div>
          )}
          {s.scholarship_type && (
            <div className="flex items-center gap-2">
              <Award size={15} className="text-slate-500 flex-shrink-0" />
              <span style={{ color: "#F0B429" }} className="font-medium">
                {s.scholarship_type}
              </span>
            </div>
          )}
          {s.application_deadline && (
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-slate-500 flex-shrink-0" />
              <span>
                {tx.deadline}: {formatDate(s.application_deadline, isUrdu)}
              </span>
            </div>
          )}
        </div>

        {/* Degree tags */}
        {degrees.length > 0 && (
          <div className="flex flex-wrap gap-2" dir="ltr">
            {degrees.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full text-slate-300"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <GraduationCap size={12} />
                {tx.degrees[d] || d}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center gap-3 pt-4 mt-auto"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => onOpen(s)}
            className="flex-1 text-sm font-semibold py-2.5 rounded-xl text-white transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            {tx.details}
          </button>
          {isHttpUrl(s.application_url) && (
            <a
              href={s.application_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                color: "#0f172a",
                boxShadow: "0 4px 12px rgba(240,180,41,0.3)",
              }}
            >
              {tx.apply}
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────────────────────
   Details modal (fetches GET /scholarships/:id for full info)
──────────────────────────────────────────────────────────────── */
const DetailModal: React.FC<{
  base: Scholarship;
  tx: typeof TEXT.en;
  isUrdu: boolean;
  onClose: () => void;
}> = ({ base, tx, isUrdu, onClose }) => {
  const [full, setFull] = useState<Scholarship>(base);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API}/scholarships/${base.id}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        const d = json?.data?.scholarship ?? json?.data;
        if (d && typeof d === "object") setFull({ ...base, ...d });
      })
      .catch(() => {
        /* keep the list data if the details request fails */
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [base]);

  /* Esc to close + lock page scroll */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const sections: { label: string; value: string | null }[] = [
    { label: tx.about, value: full.description },
    { label: tx.funding, value: full.funding_details },
    { label: tx.benefits, value: full.scholarship_benefits },
    { label: tx.eligibility, value: full.eligibility_criteria },
    { label: tx.documents, value: full.required_documents },
    { label: tx.process, value: full.application_process },
  ];

  const degrees = splitDegrees(full.degree_level);

  return createPortal(
    <div
      className="sch-overlay fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6"
      style={{ background: "rgba(2,6,23,0.8)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={full.title}
    >
      <div
        dir={isUrdu ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="sch-modal w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-white text-xl md:text-2xl font-bold leading-snug">{full.title}</h2>
              {full.university_name && <p className="text-slate-400 mt-1.5">{full.university_name}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label={tx.close}
              className="flex-shrink-0 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {[
              { icon: <MapPin size={16} />, label: tx.country, value: full.country },
              { icon: <Award size={16} />, label: "", value: full.scholarship_type },
              {
                icon: <CalendarDays size={16} />,
                label: tx.deadline,
                value: full.application_deadline ? formatDate(full.application_deadline, isUrdu) : null,
              },
              { icon: <GraduationCap size={16} />, label: tx.field, value: full.field_of_study },
              { icon: <CalendarDays size={16} />, label: tx.intake, value: full.intake_year ? String(full.intake_year) : null },
            ]
              .filter((f) => f.value)
              .map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span style={{ color: "#F0B429" }}>{f.icon}</span>
                  <div className="min-w-0">
                    {f.label && <p className="text-[11px] text-slate-500">{f.label}</p>}
                    <p className="text-sm text-slate-200 truncate">{f.value}</p>
                  </div>
                </div>
              ))}
          </div>

          {degrees.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4" dir="ltr">
              {degrees.map((d) => (
                <span
                  key={d}
                  className="text-xs font-medium px-3 py-1 rounded-full text-slate-300"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  {tx.degrees[d] || d}
                </span>
              ))}
            </div>
          )}

          {/* Long text sections */}
          <div className="mt-6 space-y-5">
            {loading && <div className="sch-shimmer h-16 w-full rounded-xl" />}
            {sections
              .filter((s) => s.value)
              .map((s) => (
                <div key={s.label}>
                  <h4 className="text-white font-semibold mb-1.5">{s.label}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{s.value}</p>
                </div>
              ))}
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {isHttpUrl(full.application_url) && (
              <a
                href={full.application_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-transform active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 12px rgba(240,180,41,0.3)",
                }}
              >
                {tx.apply}
                <ExternalLink size={15} />
              </a>
            )}
            {isHttpUrl(full.official_website) && (
              <a
                href={full.official_website!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Globe size={15} />
                {tx.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ─────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────── */
const ScholarshipPage: React.FC = () => {
  const isUrdu = getLanguage() === "ur";
  const tx = isUrdu ? TEXT.ur : TEXT.en;

  const [items, setItems] = useState<Scholarship[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [countries, setCountries] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [closing, setClosing] = useState("");
  const [featured, setFeatured] = useState(false);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Scholarship | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const prevPage = useRef(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* SEO: title, description, keywords, canonical, Open Graph, Twitter */
  useEffect(() => {
    const seo = isUrdu ? SEO.ur : SEO.en;
    const url = `${window.location.origin}${window.location.pathname}`;

    document.title = seo.title;
    document.documentElement.lang = isUrdu ? "ur" : "en";

    setMeta("name", "description", seo.description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
    setCanonical(url);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Zaheen");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:locale", seo.locale);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);
  }, [isUrdu]);

  /* SEO: structured data (JSON-LD) listing the scholarships on screen */
  useEffect(() => {
    if (loading || error || items.length === 0) return;
    const seo = isUrdu ? SEO.ur : SEO.en;
    const url = `${window.location.origin}${window.location.pathname}`;

    const data = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seo.title,
      description: seo.description,
      url,
      inLanguage: isUrdu ? "ur" : "en",
      isPartOf: { "@type": "WebSite", name: "Zaheen", url: window.location.origin },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: total,
        itemListElement: items.map((s, i) => ({
          "@type": "ListItem",
          position: (page - 1) * LIMIT + i + 1,
          name: s.title,
          description: [s.university_name, s.country, s.scholarship_type].filter(Boolean).join(" · "),
        })),
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "sch-jsonld";
    script.text = JSON.stringify(data);
    document.getElementById("sch-jsonld")?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, [items, total, page, loading, error, isUrdu]);

  /* Countries for the dropdown (GET) */
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${API}/scholarships/countries`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (Array.isArray(json?.data)) setCountries(json.data);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  /* Debounce the search box */
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  /* Scholarships list (GET) */
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (degree) params.set("degree_level", degree);
    if (closing) params.set("closing_soon", closing);
    if (featured) params.set("is_featured", "true");
    params.set("page", String(page));
    params.set("limit", String(LIMIT));

    fetch(`${API}/scholarships?${params.toString()}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((json) => {
        const d = json?.data;
        setItems(Array.isArray(d?.scholarships) ? d.scholarships : []);
        setTotal(Number(d?.total) || 0);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setItems([]);
        setTotal(0);
        setError(true);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [search, country, degree, closing, featured, page, reloadKey]);

  /* Scroll back to the results only when the page number changes */
  useEffect(() => {
    if (prevPage.current === page) return;
    prevPage.current = page;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const hasFilters = !!(searchInput || country || degree || closing || featured);

  const clearAll = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setCountry("");
    setDegree("");
    setClosing("");
    setFeatured(false);
    setPage(1);
  }, []);

  const changeFilter = (setter: (v: any) => void) => (v: any) => {
    setter(v);
    setPage(1);
  };

  const selectCls =
    "w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/60 appearance-none cursor-pointer";
  const selectStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      lang={isUrdu ? "ur" : "en"}
      className="sch-page"
      style={{ background: "#0f172a", minHeight: "70vh" }}
    >
      <style>{`
        @keyframes schFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes schFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes schPop {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes schShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .sch-hero-in { animation: schFadeUp 0.7s cubic-bezier(.2,.8,.2,1) both; }
        .sch-card {
          opacity: 0;
          animation: schFadeUp 0.6s cubic-bezier(.2,.8,.2,1) forwards;
          transition: transform 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .sch-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(240,180,41,0.18);
          border-color: rgba(240,180,41,0.35) !important;
        }
        .sch-overlay { animation: schFadeIn 0.25s ease both; }
        .sch-modal { animation: schPop 0.35s cubic-bezier(.2,.8,.2,1) both; }
        .sch-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: schShimmer 1.4s linear infinite;
        }
        .sch-page select option { color: #0f172a; background: #fff; }
        @media (prefers-reduced-motion: reduce) {
          .sch-hero-in, .sch-card, .sch-overlay, .sch-modal, .sch-shimmer { animation: none !important; opacity: 1 !important; }
          .sch-card:hover { transform: none; }
        }
      `}</style>

      {/* ── Hero + filters ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(900px 400px at 15% -10%, rgba(240,180,41,0.14), transparent 60%), radial-gradient(800px 380px at 90% 10%, rgba(45,212,191,0.12), transparent 60%), #0f172a",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-12">
          <div className="sch-hero-in max-w-3xl">
            <h1
              className="text-4xl md:text-6xl text-white leading-tight"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              {tx.title}
            </h1>
            <p className="text-slate-400 text-base md:text-lg mt-4 leading-relaxed">{tx.subtitle}</p>
          </div>

          {/* Filter panel */}
          <div
            className="sch-hero-in mt-8 md:mt-10 rounded-3xl p-4 md:p-6"
            style={{
              animationDelay: "120ms",
              background: "rgba(15,23,42,0.88)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
            }}
          >
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${isUrdu ? "right-4" : "left-4"}`}
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={tx.searchPh}
                className={`w-full rounded-xl py-3.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-400/60 ${
                  isUrdu ? "pr-11 pl-4" : "pl-11 pr-4"
                }`}
                style={selectStyle}
              />
            </div>

            {/* Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <select
                value={country}
                onChange={(e) => changeFilter(setCountry)(e.target.value)}
                className={selectCls}
                style={selectStyle}
                aria-label={tx.country}
              >
                <option value="">{tx.allCountries}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={degree}
                onChange={(e) => changeFilter(setDegree)(e.target.value)}
                className={selectCls}
                style={selectStyle}
                aria-label={tx.degree}
              >
                <option value="">
                  {tx.degree}: {tx.all}
                </option>
                {DEGREES.map((d) => (
                  <option key={d} value={d}>
                    {tx.degrees[d]}
                  </option>
                ))}
              </select>

              <select
                value={closing}
                onChange={(e) => changeFilter(setClosing)(e.target.value)}
                className={selectCls}
                style={selectStyle}
                aria-label={tx.closing}
              >
                <option value="">{tx.anyDeadline}</option>
                {CLOSING_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {tx.within(n)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => changeFilter(setFeatured)(!featured)}
                aria-pressed={featured}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                style={
                  featured
                    ? { background: "rgba(240,180,41,0.18)", color: "#F0B429", border: "1px solid rgba(240,180,41,0.5)" }
                    : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.12)" }
                }
              >
                <Star size={15} fill={featured ? "currentColor" : "none"} />
                {tx.featuredOnly}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section
        ref={resultsRef}
        aria-label={isUrdu ? "اسکالرشپس کی فہرست" : "Scholarship listings"}
        className="max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-24 scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-h-[36px]">
          <p className="text-slate-400 text-sm" aria-live="polite">
            {!loading && !error ? tx.found(total) : "\u00A0"}
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "#F0B429" }}
            >
              <RotateCcw size={14} />
              {tx.clear}
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-3xl text-center px-6 py-16"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h3 className="text-white text-xl font-bold">{tx.errorTitle}</h3>
            <p className="text-slate-400 mt-2">{tx.errorDesc}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold transition-transform active:scale-95"
              style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}
            >
              {tx.retry}
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && items.length === 0 && (
          <div
            className="rounded-3xl text-center px-6 py-16"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <GraduationCap size={40} className="mx-auto text-slate-600" />
            <h3 className="text-white text-xl font-bold mt-4">{tx.emptyTitle}</h3>
            <p className="text-slate-400 mt-2">{tx.emptyDesc}</p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {tx.clear}
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {items.map((s, i) => (
              <ScholarshipCard key={s.id} s={s} index={i} tx={tx} isUrdu={isUrdu} onOpen={setSelected} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3 mt-10" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {isUrdu ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {tx.prev}
            </button>

            <span className="text-slate-400 text-sm px-2">{tx.pageOf(page, totalPages)}</span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {tx.next}
              {isUrdu ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </nav>
        )}
      </section>

      {selected && <DetailModal base={selected} tx={tx} isUrdu={isUrdu} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default ScholarshipPage;