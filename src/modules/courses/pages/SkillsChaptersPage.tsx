import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, FolderOpen, Settings, LayoutDashboard,
  GraduationCap, PlayCircle, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle2, Check, Clock, Star, Users, ArrowLeft,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
};

const getNestedValue = (obj: any, key: string): any => {
  return key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
};

const useTranslation = () => {
  const [lang, setLang] = useState<string>(() => getLanguage());

  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("languageChange", sync);
    };
  }, []);

  const dict = translations[lang] ?? translations.en;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let val = getNestedValue(dict, key);
      if (typeof val !== "string") {
        val = getNestedValue(translations.en, key);
      }
      if (typeof val !== "string") return key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          val = val.replace(`{{${k}}}`, String(v));
        });
      }
      return val;
    },
    [dict]
  );

  const tArr = useCallback(
    (key: string): string[] => {
      const val = getNestedValue(dict, key);
      if (Array.isArray(val)) return val as string[];
      const fallback = getNestedValue(translations.en, key);
      return Array.isArray(fallback) ? (fallback as string[]) : [];
    },
    [dict]
  );

  return { t, tArr, lang };
};

interface Subject   { id: number; name: string; urdu_name?: string; }
interface Chapter   { id: number; name: string; urdu_name?: string; }
interface Lecture   { id: number; name: string; urdu_name?: string; path: string; chapter_id: number; duration?: string; desc?: string; }
interface ClassInfo { class_id: number; name: string; urdu_name?: string; thumbnailUrl?: string; chapterCount?: number; }

const subjectIcons = [BookOpen, FileText, FolderOpen, Settings, LayoutDashboard];

const localName = (en: string, ur?: string, isRtl?: boolean) =>
  isRtl ? ur || en : en;

/* ─────────────────────────────────────────────────────────────
   Desc localisation: replace known English phrases with Urdu
──────────────────────────────────────────────────────────────── */
const URDU_DESC_MAP: Record<string, string> = {
  "Benefits Of Learning Financial Market Trading": "فنانشل مارکیٹ ٹریڈنگ سیکھنے کے فوائد",
  "Additional Income Source": "اضافی آمدنی کا ذریعہ",
  "High-Income Skill": "زیادہ آمدنی والی مہارت",
  "Freedom & Flexibility": "آزادی اور لچک",
  "Global Opportunity": "عالمی موقع",
  "Skill-Based Growth": "مہارت پر مبنی ترقی",
  "Liquidity Pools and Stop Runs": "لیکویڈیٹی پولز اور اسٹاپ رنز",
  "Trading View Demo Account": "ٹریڈنگ ویو ڈیمو اکاؤنٹ",
  "Type Of Orders": "آرڈرز کی اقسام",
  "Liquidity Zones": "لیکویڈیٹی زونز",
};

const localiseDesc = (desc: string, isRtl: boolean): string => {
  if (!isRtl) return desc;
  let result = desc;
  Object.entries(URDU_DESC_MAP).forEach(([en, ur]) => {
    result = result.replace(new RegExp(en, "g"), ur);
  });
  return result;
};

const SkillsChaptersPage = () => {
  const { classId } = useParams();
  const navigate    = useNavigate();

  const { t, tArr, lang } = useTranslation();
  const isRtl = lang === "ur";

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const [classInfo, setClassInfo]             = useState<ClassInfo | null>(null);
  const [subjects, setSubjects]               = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [chapterMap, setChapterMap]           = useState<Record<number, Chapter>>({});
  const [lectures, setLectures]               = useState<Lecture[]>([]);
  const [loadingClass, setLoadingClass]       = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [isWatchMode, setIsWatchMode]         = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [openChapters, setOpenChapters]       = useState<Set<number>>(new Set());
  const [watchedSet, setWatchedSet]           = useState<Set<number>>(new Set());
  const [progressMap, setProgressMap]         = useState<Record<number, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIdx      = lectures.findIndex((l) => l.id === selectedLecture?.id);
  const totalLectures   = lectures.length;
  const totalWatched    = watchedSet.size;
  const progressPercent = totalLectures > 0 ? Math.round((totalWatched / totalLectures) * 100) : 0;
  const courseName      = localName(classInfo?.name ?? "", classInfo?.urdu_name, isRtl);

  const lecturesByChapter: Record<number, Lecture[]> = {};
  lectures.forEach((l) => {
    if (!lecturesByChapter[l.chapter_id]) lecturesByChapter[l.chapter_id] = [];
    lecturesByChapter[l.chapter_id].push(l);
  });
  const chapterIds = Object.keys(lecturesByChapter).map(Number);

  useEffect(() => {
    setLoadingClass(true);
    (async () => {
      try {
        const res  = await fetch(
          `https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3?t=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" } }
        );
        const data = await res.json();
        const cls  = data.find((c: ClassInfo) => c.class_id === Number(classId));
        setClassInfo(cls ?? null);
      } catch (e) { console.error(e); }
      setLoadingClass(false);
    })();
  }, [classId]);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(
          `https://api.zaheen.com.pk/api/class/${classId}/subjects?ts=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" } }
        );
        const data: Subject[] = await res.json();
        setSubjects(data);
        if (data.length > 0) setSelectedSubject(data[0]);
      } catch (e) { console.error(e); }
    })();
  }, [classId]);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoadingChapters(true);
    setLectures([]);
    setIsWatchMode(false);
    setSelectedLecture(null);
    setWatchedSet(new Set());
    setProgressMap({});
    (async () => {
      try {
        const chRes = await fetch(
          `https://api.zaheen.com.pk/api/subject/${selectedSubject.id}/chapters?ts=${Date.now()}`
        );
        const chaptersData: Chapter[] = await chRes.json();
        const map: Record<number, Chapter> = {};
        chaptersData.forEach((c) => { map[c.id] = c; });
        setChapterMap(map);
        if (chaptersData.length > 0) setOpenChapters(new Set([chaptersData[0].id]));
        const lecturesArrays = await Promise.all(
          chaptersData.map((c) =>
            fetch(`https://api.zaheen.com.pk/api/chapter/${c.id}/videos?ts=${Date.now()}`).then((r) => r.json())
          )
        );
        setLectures(lecturesArrays.flat());
      } catch (e) { console.error(e); }
      setLoadingChapters(false);
    })();
  }, [selectedSubject]);

  const selectLecture = useCallback((lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsWatchMode(true);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (videoRef.current) {
      (videoRef.current as any)._tracked50 = false;
      (videoRef.current as any)._started   = false;
    }
    setOpenChapters((prev) => new Set(prev).add(lecture.chapter_id));
  }, []);

  const exitWatchMode = () => {
    setIsWatchMode(false);
    setSelectedLecture(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = useCallback(() => {
    if (currentIdx < lectures.length - 1) selectLecture(lectures[currentIdx + 1]);
  }, [currentIdx, lectures, selectLecture]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) selectLecture(lectures[currentIdx - 1]);
  }, [currentIdx, lectures, selectLecture]);

  const handleEnded = () => {
    if (selectedLecture) {
      setWatchedSet((p) => new Set(p).add(selectedLecture.id));
      setProgressMap((p) => ({ ...p, [selectedLecture.id]: 100 }));
    }
    goNext();
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.target as HTMLVideoElement;
    if (!v.duration || !selectedLecture) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgressMap((p) => ({ ...p, [selectedLecture.id]: Math.round(pct) }));
  };

  const toggleChapter = (id: number) =>
    setOpenChapters((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const chapterName = (chId: number) => {
    const ch = chapterMap[chId];
    if (!ch) return t("skillsChaptersPage.watchMode.chapter");
    return localName(ch.name, ch.urdu_name, isRtl);
  };

  const lectureName = (l: Lecture) => localName(l.name, l.urdu_name, isRtl);

  const learnPoints     = tArr("skillsChaptersPage.learnSection.points");
  const requirements    = tArr("skillsChaptersPage.requirements.items");
  const descriptionText = t("skillsChaptersPage.description.text");

  /* ════════════════════════════════════════
     WATCH MODE
  ════════════════════════════════════════ */
  if (isWatchMode && selectedLecture) {
    return (
      <div className="min-h-screen bg-white flex flex-col">

        {/* Top navbar — always LTR so layout never flips in Urdu */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-6 h-14 flex items-center gap-4 shrink-0 shadow-sm" dir="ltr">
          <button
            onClick={exitWatchMode}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="hidden sm:block">{t("skillsChaptersPage.watchMode.backBtn")}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold text-sm truncate leading-tight">{courseName}</p>
            <p className="text-slate-400 text-[11px] font-medium truncate">
              {t("skillsChaptersPage.watchMode.lectureOf", { current: currentIdx + 1, total: totalLectures })}
            </p>
          </div>

          {/* Prev / Next — dir="ltr" forces < > order regardless of page RTL */}
          <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
            <button
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goNext}
              disabled={currentIdx >= totalLectures - 1}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main body */}
        <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">

          {/* LEFT — Video column */}
          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-white">
            <div className="w-full bg-black">
              <div className="w-full aspect-video">
                {selectedLecture.path ? (
                  <video
                    ref={videoRef}
                    key={selectedLecture.path}
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={`https://cdn.zaheen.com.pk/videos/${selectedLecture.path}`}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onError={(e) => console.error("Video error", e)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                    <img
                      src={classInfo?.thumbnailUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <PlayCircle size={40} className="text-white" />
                      </div>
                      <p className="text-white/60 text-sm text-center px-8">{lectureName(selectedLecture)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video info card */}
            <div className="w-full px-5 md:px-7 pt-5 pb-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                  {chapterName(selectedLecture.chapter_id)}
                </p>
                <h2 className={`text-xl md:text-2xl font-black text-slate-900 leading-snug mb-3 ${isRtl ? "text-right" : ""}`}>
                  {lectureName(selectedLecture)}
                </h2>

                {/* ✅ FIX 3: localiseDesc replaces known English phrases with Urdu when isRtl */}
                {selectedLecture.desc && (() => {
                  const localisedDesc = localiseDesc(selectedLecture.desc, isRtl);
                  const lines   = localisedDesc.split("\n").filter(Boolean);
                  const intro:   string[] = [];
                  const bullets: string[] = [];
                  lines.forEach((line) => {
                    const stripped = line.replace(/^\*+\s*/, "").trim();
                    if (line.trim().startsWith("*")) bullets.push(stripped);
                    else intro.push(line.trim());
                  });
                  return (
                    <div className="space-y-3">
                      {intro.map((p, i) => (
                        <p key={i} className={`text-slate-500 text-sm leading-relaxed ${isRtl ? "text-right" : ""}`}>{p}</p>
                      ))}
                      {bullets.length > 0 && (
                        <ul className="space-y-2 mt-1">
                          {bullets.map((b, i) => (
                            <li key={i} className={`flex items-start gap-2.5 ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="mt-[5px] w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                              <span className={`text-slate-700 text-sm font-medium leading-relaxed ${isRtl ? "text-right" : ""}`}>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}

                {/* Mobile progress */}
                <div className="mt-4 pt-4 border-t border-slate-200 xl:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">{t("skillsChaptersPage.watchMode.progress")}</span>
                    <span className="text-xs font-black text-indigo-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    {totalWatched} / {totalLectures} {t("skillsChaptersPage.watchMode.completed")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar (progress bar lives here only on desktop) */}
          <div className="w-full xl:w-[520px] shrink-0 bg-white border-t xl:border-t-0 xl:border-l border-slate-200 flex flex-col xl:sticky xl:top-14 xl:h-[calc(100vh-3.5rem)] overflow-hidden shadow-xl">
            <div className="px-6 py-5 border-b border-slate-200 shrink-0 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-black text-slate-900">{t("skillsChaptersPage.watchMode.courseContent")}</h3>
                <span className="text-[12px] text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-1 rounded-full">
                  {totalLectures} {t("skillsChaptersPage.content.lectures")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="text-[12px] font-bold text-indigo-600 shrink-0">{progressPercent}%</span>
              </div>
              <p className="text-[12px] text-slate-400 mt-1.5">
                {totalWatched} / {totalLectures} {t("skillsChaptersPage.watchMode.completed")}
              </p>
            </div>

            <div className="overflow-y-auto flex-1">
              {chapterIds.map((chId, chIdx) => {
                const chapter      = chapterMap[chId];
                const vids         = lecturesByChapter[chId] ?? [];
                const isOpen       = openChapters.has(chId);
                const globalOffset = chapterIds
                  .slice(0, chIdx)
                  .reduce((acc, id) => acc + (lecturesByChapter[id]?.length ?? 0), 0);

                return (
                  <div key={chId}>
                    <button
                      onClick={() => toggleChapter(chId)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 border-b border-slate-200 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {chIdx + 1}
                        </span>
                        <span className="text-[13px] font-bold text-slate-800 truncate">
                          {chapter
                            ? localName(chapter.name, chapter.urdu_name, isRtl)
                            : `${t("skillsChaptersPage.watchMode.chapter")} ${chIdx + 1}`}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && vids.map((lecture, vidIdx) => {
                      const globalIdx  = globalOffset + vidIdx;
                      const isSelected = selectedLecture?.id === lecture.id;
                      const isWatched  = watchedSet.has(lecture.id);
                      const progress   = progressMap[lecture.id] ?? 0;

                      return (
                        <div
                          key={lecture.id}
                          onClick={() => selectLecture(lecture)}
                          className={`flex items-start gap-4 px-6 py-4 cursor-pointer border-b border-slate-100 transition-all ${
                            isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-500" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isWatched ? (
                              <CheckCircle2 size={20} className="text-emerald-500" />
                            ) : isSelected ? (
                              <PlayCircle size={20} className="text-indigo-600" />
                            ) : (
                              <div className="w-[20px] h-[20px] rounded-full border-2 border-slate-300 flex items-center justify-center">
                                <span className="text-[8px] text-slate-400 font-bold">{globalIdx + 1}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-semibold leading-snug ${
                              isSelected ? "text-indigo-700" : isWatched ? "text-slate-400" : "text-slate-800"
                            } ${isRtl ? "text-right" : ""}`}>
                              {lectureName(lecture)}
                            </p>
                            {lecture.duration && (
                              <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                                {lecture.duration}
                              </span>
                            )}
                            {!isWatched && progress > 0 && progress < 100 && (
                              <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════
     COURSE PAGE (non-watch mode)
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO BANNER */}
      <div className="relative w-full min-h-[400px] md:min-h-[590px] overflow-hidden">
        <img
          src={classInfo?.thumbnailUrl || "https://placehold.co/1600x600/1e293b/ffffff?text=Course"}
          alt={courseName}
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={16} />
          {t("skillsChaptersPage.hero.back")}
        </button>

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col justify-end h-full min-h-[400px] md:min-h-[480px] pb-14 pt-20">

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
              {t("skillsChaptersPage.badges.bestseller")}
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
              {t("skillsChaptersPage.badges.professional")}
            </span>
          </div>

          {loadingClass ? (
            <div className="h-12 w-72 bg-white/20 rounded-xl animate-pulse mb-4" />
          ) : (
            <h1 className={`text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-2xl drop-shadow-lg ${isRtl ? "text-right" : ""}`}>
              {courseName || t("skillsChaptersPage.badges.professional")}
            </h1>
          )}

          <p className={`text-white/80 text-[15px] leading-relaxed max-w-xl mb-6 ${isRtl ? "text-right" : ""}`}>
            {t("skillsChaptersPage.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm mb-7">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star size={15} fill="currentColor" />
              <span>4.9</span>
              <span className="text-white/50 font-normal">(12,480 {t("skillsChaptersPage.hero.ratings")})</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Users size={14} />
              <span>45,192 {t("skillsChaptersPage.hero.students")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <BookOpen size={14} />
              <span>{totalLectures} {t("skillsChaptersPage.hero.lectures")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Clock size={14} />
              <span>{t("skillsChaptersPage.hero.level")}</span>
            </div>
          </div>

          <button
            onClick={() => document.getElementById("content-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-fit flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/40"
          >
            <PlayCircle size={20} />
            {t("skillsChaptersPage.hero.startBtn")}
          </button>
        </div>
      </div>

      {/* WHAT YOU'LL LEARN */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{t("skillsChaptersPage.learnSection.title")}</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {learnPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={16} className="text-indigo-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className={`text-[14px] text-slate-700 leading-relaxed ${isRtl ? "text-right" : ""}`}>
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECT TABS */}
      {subjects.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject, index) => {
              const Icon     = subjectIcons[index % subjectIcons.length];
              const isActive = selectedSubject?.id === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  <Icon size={15} />
                  {localName(subject.name, subject.urdu_name, isRtl)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* COURSE CONTENT */}
      <div id="content-section" className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{t("skillsChaptersPage.content.title")}</h2>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-[15px] font-bold text-slate-900">{t("skillsChaptersPage.content.allLectures")}</h3>
            <span className="text-[13px] text-slate-400 font-medium">
              {totalLectures} {t("skillsChaptersPage.content.lectures")}
            </span>
          </div>

          {loadingChapters ? (
            <div className="space-y-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-5 border-b border-slate-100 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200" />
                    <div>
                      <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-28 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>

          ) : lectures.length > 0 ? (
            lectures.map((lecture, index) => (
              <div
                key={lecture.id}
                onClick={() => selectLecture(lecture)}
                className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-[14px] group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-bold text-slate-900 text-[15px] ${isRtl ? "text-right" : ""}`}>
                      {lectureName(lecture)}
                    </p>
                    <p className={`text-xs text-slate-400 mt-0.5 ${isRtl ? "text-right" : ""}`}>
                      {chapterName(lecture.chapter_id)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all shrink-0">
                  <PlayCircle size={18} />
                  <span className="hidden sm:block">{t("skillsChaptersPage.content.watch")}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                <GraduationCap size={38} className="text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {t("skillsChaptersPage.content.comingSoonTitle")}
              </h3>
              <p className="text-slate-500 max-w-md text-[14px] leading-relaxed">
                {t("skillsChaptersPage.content.comingSoonDesc")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REQUIREMENTS & DESCRIPTION */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">{t("skillsChaptersPage.requirements.title")}</h2>
            <ul className="space-y-3">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className={`text-[14px] text-slate-600 leading-relaxed ${isRtl ? "text-right" : ""}`}>
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">{t("skillsChaptersPage.description.title")}</h2>
            <div className="space-y-3">
              {descriptionText.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} className={`text-[14px] text-slate-600 leading-relaxed ${isRtl ? "text-right" : ""}`}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsChaptersPage;