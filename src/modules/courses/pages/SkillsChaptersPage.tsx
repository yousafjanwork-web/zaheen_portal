import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, FolderOpen, Settings, LayoutDashboard,
  GraduationCap, PlayCircle, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle2, Check, Clock, Star, Users, ArrowLeft, Loader2, Lock,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { resolveClassIdFromParam, getSlugByClassId } from "@/modules/shared/utils/skillsCourseSlugs";

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

interface Subject { id: number; name: string; urdu_name?: string; }
interface Chapter { id: number; name: string; urdu_name?: string; }
interface Lecture {
  id: number;
  name: string;
  urdu_name?: string;
  path: string;
  chapter_id: number;
  duration?: string;
  desc?: string;
  urdu_desc?: string;
}
interface ClassInfo { class_id: number; name: string; urdu_name?: string; thumbnailUrl?: string; chapterCount?: number; }

const subjectIcons = [BookOpen, FileText, FolderOpen, Settings, LayoutDashboard];

const localName = (en: string, ur?: string, isRtl?: boolean) =>
  isRtl ? ur || en : en;

/* ─────────────────────────────────────────────
   Trading course (classId 305) — module grouping
   by overall lecture position, independent of chapters
───────────────────────────────────────────── */
const TRADING_MODULES = [
  { id: 1, labelEn: "Trading Course Module 1", labelUr: "ٹریڈنگ کورس ماڈیول 1", start: 1, end: 11 },
  { id: 2, labelEn: "Trading Course Module 2", labelUr: "ٹریڈنگ کورس ماڈیول 2", start: 12, end: 20 },
  { id: 3, labelEn: "Trading Course Module 3", labelUr: "ٹریڈنگ کورس ماڈیول 3", start: 21, end: 27 },
];



const DescriptionBlock = ({
  desc,
  isRtl,
}: {
  desc: string;
  isRtl: boolean;
}) => {
  if (!desc) return null;

  const lines = desc.split("\n").filter(Boolean);
  const intro: string[] = [];
  const bullets: string[] = [];

  lines.forEach((line) => {
    const stripped = line.replace(/^\*+\s*/, "").trim();

    if (line.trim().startsWith("*")) {
      bullets.push(stripped);
    } else {
      intro.push(line.trim());
    }
  });

  return (
    <div className="space-y-3">
      {intro.map((p, i) => (
        <p
          key={i}
          className={`text-slate-500 text-sm leading-relaxed ${
            isRtl ? "text-right" : ""
          }`}
        >
          {p}
        </p>
      ))}

      {bullets.length > 0 && (
        <ul className="space-y-2 mt-1">
          {bullets.map((b, i) => (
            <li
              key={i}
              className={`flex items-start gap-2.5 ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              <span className="mt-[5px] w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <span
                className={`text-slate-700 text-sm font-medium leading-relaxed ${
                  isRtl ? "text-right" : ""
                }`}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const SkillsChaptersPage = () => {
  const { classId: classIdParam } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { t, tArr, lang } = useTranslation();
  const isRtl = lang === "ur";

  // The URL param may be a slug ("how-to-become-a-professional-trader")
  // or a legacy numeric id ("305"). Resolve it to the real numeric classId
  // used everywhere else in this component / for API calls.
  const classId = resolveClassIdFromParam(classIdParam);

  // Legacy numeric link -> redirect to the slug URL once we know the slug.
  useEffect(() => {
    if (!classIdParam) return;
    const isNumericParam = /^\d+$/.test(classIdParam);
    if (!isNumericParam || classId === null) return;
    const slug = getSlugByClassId(classId);
    if (slug && slug !== classIdParam) {
      navigate(`/skills/${slug}`, { replace: true });
    }
  }, [classIdParam, classId, navigate]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [chapterMap, setChapterMap] = useState<Record<number, Chapter>>({});
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loadingClass, setLoadingClass] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [isWatchMode, setIsWatchMode] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set());
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([1]));
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set());
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIdx = lectures.findIndex((l) => l.id === selectedLecture?.id);
  const totalLectures = lectures.length;
  const totalWatched = watchedSet.size;
  const progressPercent = totalLectures > 0 ? Math.round((totalWatched / totalLectures) * 100) : 0;
  const courseName = localName(classInfo?.name ?? "", classInfo?.urdu_name, isRtl);

  const isTradingCourse = classId === 305;

  const getModuleStartingAt = (globalIdx: number) =>
    isTradingCourse ? TRADING_MODULES.find((m) => m.start - 1 === globalIdx) ?? null : null;

  const getModuleForIdx = (globalIdx: number) => {
    const position = globalIdx + 1;
    return TRADING_MODULES.find((m) => position >= m.start && position <= m.end) ?? null;
  };

  const toggleModule = (id: number) =>
    setOpenModules((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const isLectureLocked = (globalIdx: number) => globalIdx > 0 && !isLoggedIn;

  const lecturesByChapter: Record<number, Lecture[]> = {};
  lectures.forEach((l) => {
    if (!lecturesByChapter[l.chapter_id]) lecturesByChapter[l.chapter_id] = [];
    lecturesByChapter[l.chapter_id].push(l);
  });
  const chapterIds = Object.keys(lecturesByChapter).map(Number);

  useEffect(() => {
    if (classId === null) { setLoadingClass(false); return; }
    setLoadingClass(true);
    (async () => {
      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3?t=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" } }
        );
        const data = await res.json();
        const cls = data.find((c: ClassInfo) => c.class_id === classId);
        setClassInfo(cls ?? null);
      } catch (e) { console.error(e); }
      setLoadingClass(false);
    })();
  }, [classId]);

  useEffect(() => {
    if (classId === null) return;
    (async () => {
      try {
        const res = await fetch(
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

  // ── Access control: UNCHANGED. Clicking a lecture beyond the first one
  // while logged out still redirects to /login, exactly as before. ──
  const selectLecture = useCallback((lecture: Lecture) => {
    const globalIdx = lectures.findIndex((l) => l.id === lecture.id);
    if (globalIdx > 0 && !isLoggedIn) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setSelectedLecture(lecture);
    setIsWatchMode(true);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (videoRef.current) {
      (videoRef.current as any)._tracked50 = false;
      (videoRef.current as any)._started = false;
    }
    setOpenChapters((prev) => new Set(prev).add(lecture.chapter_id));
  }, [lectures, isLoggedIn, navigate]);

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

  const learnPoints = tArr("skillsChaptersPage.learnSection.points");
  const requirements = tArr("skillsChaptersPage.requirements.items");
  const descriptionText = t("skillsChaptersPage.description.text");

  /* ════════════════════════════════════════
     WATCH MODE
  ════════════════════════════════════════ */
  if (isWatchMode && selectedLecture) {
    return (
     <div className="min-h-screen bg-white flex flex-col">

   
       {/* Top navbar — always LTR so layout never flips in Urdu */}
<div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 md:px-6 h-14 flex items-center gap-4 shrink-0 shadow-sm">
         <button
  onClick={exitWatchMode}
  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold group"
>
  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
    {/* Icon ke andar yeh className add karein */}
    <ArrowLeft size={16} className={isRtl ? "rotate-180" : ""} />
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

          {/* Prev / Next */}
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

               {(isRtl
  ? selectedLecture.urdu_desc
  : selectedLecture.desc) && (
  <DescriptionBlock
    desc={
      isRtl
        ? selectedLecture.urdu_desc || selectedLecture.desc || ""
        : selectedLecture.desc || ""
    }
    isRtl={isRtl}
  />
)}
 
            
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="w-full xl:w-[520px] shrink-0 bg-white border-t xl:border-t-0 xl:border-l border-slate-200 flex flex-col xl:sticky xl:top-1 xl:h-[calc(100vh-3.5rem)] overflow-hidden shadow-xl">
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
                const chapter = chapterMap[chId];
                const vids = lecturesByChapter[chId] ?? [];
                const isOpen = openChapters.has(chId);
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
                      const globalIdx = globalOffset + vidIdx;
                      const isSelected = selectedLecture?.id === lecture.id;
                      const isWatched = watchedSet.has(lecture.id);
                      const progress = progressMap[lecture.id] ?? 0;
                      const locked = isLectureLocked(globalIdx);
                      const moduleStart = getModuleStartingAt(globalIdx);
                      const lectureModule = getModuleForIdx(globalIdx);
                      const moduleIsOpen = lectureModule ? openModules.has(lectureModule.id) : true;

                      return (
                        <React.Fragment key={lecture.id}>
                          {moduleStart && (
                            <button
                              onClick={() => toggleModule(moduleStart.id)}
                              className="w-full flex items-center justify-between px-6 py-3 bg-slate-100/60 hover:bg-slate-100 border-b border-slate-200 transition-colors text-left"
                            >
                              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                                {isRtl ? moduleStart.labelUr : moduleStart.labelEn}
                              </p>
                              <ChevronDown
                                size={15}
                                className={`text-indigo-500 shrink-0 transition-transform duration-200 ${moduleIsOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                          )}
                          {(!lectureModule || moduleIsOpen) && (
                            <div
                              onClick={() => selectLecture(lecture)}
                              className={`flex items-start gap-4 px-6 py-4 cursor-pointer border-b border-slate-100 transition-all ${isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-500" : "hover:bg-slate-50"
                                }`}
                            >
                              <div className="shrink-0 mt-0.5">
                                {locked ? (
                                  <Lock size={18} className="text-slate-500" />
                                ) : isWatched ? (
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
                                <p className={`text-[13px] font-semibold leading-snug ${isSelected ? "text-indigo-700" : locked ? "text-slate-500" : isWatched ? "text-slate-400" : "text-slate-800"
                                  } ${isRtl ? "text-right" : ""}`}>
                                  {lectureName(lecture)}
                                </p>
                                {locked ? (
                                  <span className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                                    <Lock size={10} /> {isRtl ? "مقفل" : "Locked"}
                                  </span>
                                ) : lecture.duration ? (
                                  <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                                    {lecture.duration}
                                  </span>
                                ) : null}
                                {!locked && !isWatched && progress > 0 && progress < 100 && (
                                  <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${progress}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
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
              const Icon = subjectIcons[index % subjectIcons.length];
              const isActive = selectedSubject?.id === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all duration-150 ${isActive
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
            lectures.map((lecture, index) => {
              const locked = isLectureLocked(index);
              const moduleStart = getModuleStartingAt(index);
              const lectureModule = getModuleForIdx(index);
              const moduleIsOpen = lectureModule ? openModules.has(lectureModule.id) : true;

              return (
                <React.Fragment key={lecture.id}>
                  {moduleStart && (
                    <button
                      onClick={() => toggleModule(moduleStart.id)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 border-b border-slate-100 transition-colors text-left"
                    >
                      <h4 className="text-[13px] font-black text-indigo-600 uppercase tracking-widest">
                        {isRtl ? moduleStart.labelUr : moduleStart.labelEn}
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-indigo-500 shrink-0 transition-transform duration-200 ${moduleIsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                  {(!lectureModule || moduleIsOpen) && (
                    <div
                      onClick={() => selectLecture(lecture)}
                      className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[14px] transition-all shrink-0 ${
                          locked
                            ? "bg-slate-200 text-slate-500"
                            : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                        }`}>
                          {locked ? <Lock size={16} /> : index + 1}
                        </div>
                        <div>
                          <p className={`font-bold text-[15px] ${locked ? "text-slate-500" : "text-slate-900"} ${isRtl ? "text-right" : ""}`}>
                            {lectureName(lecture)}
                          </p>
                          <p className={`text-xs mt-0.5 text-slate-400 ${isRtl ? "text-right" : ""}`}>
                            {locked ? (isRtl ? "مقفل" : "Locked") : chapterName(lecture.chapter_id)}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all shrink-0 ${locked ? "text-slate-400" : "text-indigo-600"}`}>
                        {locked ? <Lock size={18} /> : <PlayCircle size={18} />}
                        <span className="hidden sm:block">
                          {t("skillsChaptersPage.content.watch")}
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
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