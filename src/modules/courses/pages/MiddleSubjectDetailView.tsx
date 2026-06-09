import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, ChevronRight, Lock, CheckCircle2,
  Play, Clock, FileText, ClipboardList, GraduationCap,
  Zap, Edit3, Save, Hash, HelpCircle,
  BookOpen, Sigma, Atom, Leaf, FlaskConical,
  Languages, Globe, Cpu, Landmark, X, Menu,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";

const useLang = () => {
  const [lang, setLang] = useState(() => getLanguage());
  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("languageChange", sync); };
  }, []);
  return lang;
};

const getAccent = (name: string) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("physic"))  return { color:"#1d4ed8", bg:"#EFF6FF", icon: Atom         };
  if (n.includes("math"))    return { color:"#7c3aed", bg:"#F5F3FF", icon: Sigma        };
  if (n.includes("chem"))    return { color:"#059669", bg:"#ECFDF5", icon: FlaskConical };
  if (n.includes("bio"))     return { color:"#16a34a", bg:"#F0FDF4", icon: Leaf         };
  if (n.includes("english")) return { color:"#0284c7", bg:"#EFF6FF", icon: BookOpen     };
  if (n.includes("urdu"))    return { color:"#e11d48", bg:"#FFF1F2", icon: Languages    };
  if (n.includes("islamic")) return { color:"#0d9488", bg:"#F0FDFA", icon: Landmark     };
  if (n.includes("pak"))     return { color:"#ea580c", bg:"#FFF7ED", icon: Globe        };
  if (n.includes("computer") || n.includes("cs")) return { color:"#4338ca", bg:"#EEF2FF", icon: Cpu };
  return { color:"#1E40AF", bg:"#EFF6FF", icon: BookOpen };
};

// ── Thumbnail helpers (ported from PrimarySubjectDetailView) ──
const CDN_THUMB = "https://cdn.zaheen.com.pk";

const buildThumbUrl = (raw?: string): string | null => {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${CDN_THUMB}/${raw.replace(/^\/+/, "")}`;
};

const getThumbUrl = (video: Video): string | null => {
  const raw = video.thumbnailUrl || video.thumbnail || video.thumb || video.image || video.cover || video.poster || null;
  return buildThumbUrl(raw);
};

interface Video   {
  id:number; name:string; urdu_name?:string; path:string; desc?:string; urdu_desc?:string;
  // thumbnail fields
  thumbnailUrl?: string; thumbnail?: string; thumb?: string;
  image?: string; cover?: string; poster?: string;
  [key: string]: any;
}
interface Chapter { id:number; name:string; urdu_name?:string; subject_id:number; videos:Video[]; }

const CDN = "https://cdn.zaheen.com.pk/videos/";

const MiddleSubjectDetailView = () => {
  const { classId, subjectId } = useParams<{ classId:string; subjectId:string }>();
  const navigate  = useNavigate();
  const location  = useLocation();
  const lang      = useLang();
  const isUrdu    = lang === "ur";

  const gradeType    = location.state?.gradeType as string | undefined;
  const stateSubject = location.state?.selectedSubject;

  const { classInfo, subjects, chapters, chapterVideos, loading } = useClassSubjects(Number(classId));

  const subject     = useMemo(() => subjects?.find((s:any) => String(s.id) === String(subjectId)) ?? stateSubject ?? null, [subjects, subjectId, stateSubject]);
  const subjectName = isUrdu ? subject?.urdu_name?.trim() || subject?.name || "" : subject?.name || "";
  const accent      = getAccent(subject?.name || "");
  const AccentIcon  = accent.icon;

  const subjectChapters: Chapter[] = useMemo(() =>
    chapters.filter((c:any) => String(c.subject_id) === String(subjectId))
            .map((c:any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, subjectId]
  );

  const allVideos: Video[] = useMemo(() => subjectChapters.flatMap(c => c.videos), [subjectChapters]);
  const totalLessons = allVideos.length;

  const gradeName = useMemo(() => {
    if (!classInfo) return `Class ${classId}`;
    if (!isUrdu) return classInfo.name || `Class ${classId}`;
    return classInfo.urdu_name?.trim() || (() => { const m = (classInfo.name||"").match(/\d+/); return m ? `جماعت ${m[0]}` : classInfo.name; })() || `Class ${classId}`;
  }, [classInfo, isUrdu, classId]);

  const [openChapterId, setOpenChapterId] = useState<number | null>(null);
  const [activeVideo,   setActiveVideo]   = useState<Video | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [watchedSet,    setWatchedSet]    = useState<Set<number>>(new Set());
  const [progressMap,   setProgressMap]   = useState<Record<number,number>>({});
  const [notes,         setNotes]         = useState("");
  const [filter,        setFilter]        = useState<"all"|"inprogress">("all");
  const [isLoggedIn]                      = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (subjectChapters.length > 0 && openChapterId === null)
      setOpenChapterId(subjectChapters[0].id);
  }, [subjectChapters]);

  useEffect(() => { setMobileSidebarOpen(false); }, [activeVideo]);

  const watchedCount = watchedSet.size;
  const progressPct  = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
  const isChapterUnlocked = (idx: number) => idx === 0 || isLoggedIn;

  const chapterOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach(c => { offsets.push(acc); acc += c.videos.length; });
    return offsets;
  }, [subjectChapters]);

  const playVideo = useCallback((video: Video, chapter: Chapter) => {
    setActiveVideo(video);
    setActiveChapter(chapter);
    window.scrollTo({ top:0, behavior:"smooth" });
  }, []);

  const exitPlayer = useCallback(() => {
    setActiveVideo(null);
    setActiveChapter(null);
    setMobileSidebarOpen(false);
  }, []);

  const handleEnded = () => {
    if (activeVideo) { setWatchedSet(p => new Set(p).add(activeVideo.id)); setProgressMap(p => ({...p,[activeVideo.id]:100})); }
    if (activeVideo && activeChapter) {
      const idx = activeChapter.videos.findIndex(v => v.id === activeVideo.id);
      if (idx < activeChapter.videos.length - 1) playVideo(activeChapter.videos[idx+1], activeChapter);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.target as HTMLVideoElement;
    if (!v.duration || !activeVideo) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgressMap(p => ({...p,[activeVideo.id]:Math.round(pct)}));
    if (pct >= 90) setWatchedSet(p => new Set(p).add(activeVideo.id));
  };

  const chapterProgress = (chapter: Chapter) => {
    if (!chapter.videos.length) return 0;
    return Math.round(chapter.videos.filter(v => watchedSet.has(v.id)).length / chapter.videos.length * 100);
  };

  const RESOURCES = [
    { icon: <FileText size={18} style={{color:"#3B82F6"}} />, bg:"#EFF6FF", name: isUrdu ? "مشق شیٹس" : "Ratio Practice Sheets",    sub: isUrdu ? "پی ڈی ایف • ۱.۲ MB"    : "PDF • 1.2 MB"        },
    { icon: <ClipboardList size={18} style={{color:"#7C3AED"}} />, bg:"#F5F3FF", name: isUrdu ? "یونٹ ۱ تشخیص" : "Unit 1 Assessment",  sub: isUrdu ? "انٹرایکٹو کوئز"     : "Interactive Quiz"    },
    { icon: <GraduationCap size={18} style={{color:"#0891B2"}} />, bg:"#ECFEFF", name: isUrdu ? "جیومیٹری ویژوالائزر" : "Geometry Visualizer", sub: isUrdu ? "ویب ٹول" : "Web Tool" },
  ];

  /* ── Shared lecture sidebar content (used in both desktop & mobile drawer) ── */
  const LectureSidebarContent = () => (
    <>
     <div style={{ 
      flex: "1 1 0%", 
      padding: "10px 10px", 
      minHeight: 0 
    }}>
        {subjectChapters.map((chapter, chIdx) => {
          const unlocked      = isChapterUnlocked(chIdx);
          const chLbl         = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
          const isCurrentChap = activeChapter ? chapter.id === activeChapter.id : false;
          return (
            <div key={chapter.id} style={{ marginBottom:8 }}>
              <div style={{ padding:"6px 12px", fontSize:".72rem", fontWeight:800, color:"#94A3B8", textTransform:"uppercase", letterSpacing:.8, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:20, height:20, borderRadius:5, background: isCurrentChap ? accent.color : "#E2E8F0", color: isCurrentChap ? "#fff" : "#94A3B8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", fontWeight:900, flexShrink:0 }}>
                  {chIdx+1}
                </span>
                {chLbl}
              </div>
              {chapter.videos.map((video, vidIdx) => {
                const globalIdx = chapterOffsets[chIdx] + vidIdx;
                const locked    = !unlocked;
                const watched   = watchedSet.has(video.id);
                const isActive  = activeVideo?.id === video.id;
                const vt        = isUrdu ? video.urdu_name || video.name : video.name;
                return (
                  <div key={video.id}
                    style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 12px", borderRadius:10, cursor: locked ? "default" : "pointer", opacity: locked ? .45 : 1, background: isActive ? accent.bg : "transparent", border: `1.5px solid ${isActive ? accent.color+"33" : "transparent"}`, marginBottom:2, transition:"background .14s" }}
                    onClick={() => { if (!locked) { playVideo(video, chapter); setMobileSidebarOpen(false); } }}
                  >
                    <div style={{ width:32, height:32, borderRadius:8, background: isActive ? accent.color : locked ? "#E2E8F0" : "#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {locked ? <Lock size={14} style={{ color:"#94A3B8" }} />
                        : watched ? <CheckCircle2 size={14} style={{ color:"#22C55E" }} />
                        : isActive ? <Play size={13} style={{ color:"#fff" }} fill="#fff" />
                        : <AccentIcon size={14} style={{ color:accent.color }} />}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:".82rem", fontWeight: isActive ? 800 : 600, color: isActive ? accent.color : locked ? "#94A3B8" : "#0F172A", margin:"0 0 2px", lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {globalIdx+1}.{vidIdx+1} {vt}
                      </p>
                      <p style={{ fontSize:".7rem", color:"#94A3B8", margin:0, display:"flex", alignItems:"center", gap:4 }}>
                        {locked ? <><Lock size={9}/> {isUrdu ? "مقفل" : "Locked"}</>
                          : isActive ? <span style={{ color:accent.color, fontWeight:700 }}>{isUrdu ? "موجودہ" : "Current"}</span>
                          : <><Clock size={9}/> 15–20 {isUrdu ? "منٹ" : "mins"}</>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{ borderTop:"1px solid #F1F5F9", marginTop:8, paddingTop:12, display:"flex", flexDirection:"column", gap:4 }}>
          <button style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:9, border:"none", background:"none", color:"#64748B", fontSize:".8rem", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", textAlign:"left" }}>
            <HelpCircle size={15}/> {isUrdu ? "مدد مرکز" : "Help Center"}
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:9, border:"none", background:"none", color:"#64748B", fontSize:".8rem", fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", textAlign:"left" }}
            onClick={() => navigate("/resources")}>
            <BookOpen size={15}/> {isUrdu ? "وسائل" : "Resources"}
          </button>
        </div>
      </div>
     
    </>
  );

  /* ════════════════════════════════════════════════
     VIDEO PLAYER MODE
  ════════════════════════════════════════════════ */
  if (activeVideo && activeChapter) {
    const vTitle  = isUrdu ? activeVideo.urdu_name || activeVideo.name : activeVideo.name;
    const vUrl    = `${CDN}${activeVideo.path}`;
    const chLabel = isUrdu ? activeChapter.urdu_name || activeChapter.name : activeChapter.name;

    return (
      <div style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"'DM Sans','Nunito','Segoe UI',sans-serif", direction: isUrdu ? "rtl" : "ltr" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap');
          .ms-notes-area { width:100%; border:none; outline:none; resize:none; font-family:'DM Sans',sans-serif; font-size:.88rem; color:#374151; line-height:1.65; background:transparent; min-height:130px; }

          /* Desktop: side-by-side grid */
          .ms-player-grid {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 320px;
            min-height: 100vh;
          }
          /* Desktop sidebar */
          .ms-desktop-sidebar {
  background: #fff;
  border-left: 1px solid #E5E9F0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto; /*  Dono sidebars (main aur internal) ke liye safe zone */
}
          /* Mobile sidebar — hidden on desktop */
          .ms-mobile-fab { display: none; }
          .ms-drawer-overlay { display: none; }

          @media (max-width: 900px) {
            /* Stack layout vertically on mobile */
            .ms-player-grid { grid-template-columns: 1fr; }
            /* Hide desktop sidebar */
            .ms-desktop-sidebar { display: none !important; }
            /* Show FAB */
            .ms-mobile-fab {
              display: flex !important;
              align-items: center;
              gap: 7px;
              position: fixed;
              bottom: 20px;
              ${isUrdu ? "left: 20px;" : "right: 20px;"}
              z-index: 900;
              background: ${accent.color};
              color: #fff;
              border: none;
              border-radius: 50px;
              padding: 13px 20px;
              font-size: .85rem;
              font-weight: 800;
              cursor: pointer;
              box-shadow: 0 4px 18px rgba(0,0,0,.25);
              font-family: 'DM Sans', sans-serif;
            }
            /* Drawer overlay */
            .ms-drawer-overlay {
              display: flex !important;
              position: fixed;
              inset: 0;
              z-index: 1000;
              background: rgba(0,0,0,0.5);
              align-items: stretch;
              justify-content: flex-end;
            }
            .ms-drawer-overlay.hidden { display: none !important; }
            .ms-drawer-panel {
              width: min(320px, 88vw);
              background: #fff;
              display: flex;
              flex-direction: column;
              height: 100%;
              box-shadow: -6px 0 24px rgba(0,0,0,.15);
              ${isUrdu ? "margin-right: auto;" : ""}
            }
          }
          @media (max-width: 600px) {
            .ms-player-left { padding: 12px 12px 100px !important; }
            .ms-notes-grid  { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Mobile FAB */}
        <button className="ms-mobile-fab" onClick={() => setMobileSidebarOpen(true)}>
          <Menu size={16}/> {isUrdu ? "اسباق" : "Lectures"}
        </button>

        {/* Mobile drawer overlay */}
        <div className={`ms-drawer-overlay${mobileSidebarOpen ? "" : " hidden"}`} onClick={() => setMobileSidebarOpen(false)}>
          <div className="ms-drawer-panel" onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div style={{ padding:"16px", borderBottom:"1px solid #F1F5F9", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <AccentIcon size={16} style={{ color:accent.color }}/>
                <span style={{ fontSize:".92rem", fontWeight:800, color:"#0F172A" }}>{subjectName}</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", padding:6, borderRadius:8, color:"#64748B" }}>
                <X size={20}/>
              </button>
            </div>
            <p style={{ fontSize:".72rem", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:.5, margin:0, padding:"8px 16px 0", flexShrink:0 }}>
              {chLabel}
            </p>
            <LectureSidebarContent/>
          </div>
        </div>

        {/* Main grid */}
        <div className="ms-player-grid">

          {/* Left: video + notes */}
          <div className="ms-player-left" style={{ padding:"20px 24px 40px" }}>

            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".78rem", color:"#64748B", marginBottom:16, flexWrap:"wrap" }}>
              <button onClick={() => navigate(`/class/${classId}`, { state:{ gradeType } })}
                style={{ background:"none", border:"none", color:"#2563EB", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", padding:0, fontSize:".78rem" }}>
                {gradeName}
              </button>
              <ChevronRight size={12}/>
              <button onClick={exitPlayer}
                style={{ background:"none", border:"none", color:"#2563EB", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", padding:0, fontSize:".78rem" }}>
                {chLabel}
              </button>
              <ChevronRight size={12}/>
              <span style={{ color:"#006aff", }}>{vTitle}</span>
            </div>

            {/* Video player */}
            <div style={{ background:"#000", borderRadius:16, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,.22)", marginBottom:20 }}>
              <div style={{ aspectRatio:"16/9" }}>
                <video ref={videoRef} key={vUrl} src={vUrl} controls autoPlay
                  style={{ width:"100%", height:"100%", display:"block" }}
                  onEnded={handleEnded} onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </div>

            {/* Notes + Resources */}
            <div className="ms-notes-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
              {/* Lecture Notes */}
              <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E9F0", padding:"16px 16px 12px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, borderBottom:"1px solid #F1F5F9", paddingBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <Edit3 size={15} style={{ color:accent.color }}/>
                    <span style={{ fontWeight:800, fontSize:".9rem", color:"#0F172A" }}>{isUrdu ? "لیکچر نوٹس" : "Lecture Notes"}</span>
                  </div>
                  <button style={{ display:"flex", alignItems:"center", gap:5, background:"#0F172A", color:"#fff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:".74rem", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                    <Save size={12}/> {isUrdu ? "محفوظ" : "Save Notes"}
                  </button>
                </div>
                <textarea className="ms-notes-area" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={isUrdu ? "یہاں اپنے نوٹس لکھیں..." : "Start typing your mathematical observations here... Use / for fractions or * for multiplication."}/>
                <div style={{ display:"flex", gap:7, marginTop:9, flexWrap:"wrap" }}>
                 
                </div>
              </div>

              {/* Resources + Mark Complete */}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ background:"#fff", borderRadius:14, border:"1px solid #E5E9F0", padding:"16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12, borderBottom:"1px solid #F1F5F9", paddingBottom:10 }}>
                    <BookOpen size={15} style={{ color:"#22C55E" }}/>
                    <span style={{ fontWeight:800, fontSize:".9rem", color:"#0F172A" }}>{isUrdu ? "وسائل" : "Resources"}</span>
                  </div>
                  {RESOURCES.map((r,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"8px 0", borderBottom: i < RESOURCES.length-1 ? "1px solid #F8FAFC" : "none" }}>
                      <div style={{ width:34, height:34, borderRadius:9, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.icon}</div>
                      <div>
                        <p style={{ fontSize:".82rem", fontWeight:700, color:"#0F172A", margin:0 }}>{r.name}</p>
                        <p style={{ fontSize:".7rem", color:"#94A3B8", margin:0 }}>{r.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#fff", border:`2px solid ${watchedSet.has(activeVideo.id) ? "#22C55E" : "#E2E8F0"}`, borderRadius:12, padding:"12px 16px", fontWeight:800, fontSize:".88rem", color: watchedSet.has(activeVideo.id) ? "#22C55E" : "#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .15s" }}
                  onClick={() => setWatchedSet(p => { const n = new Set(p); n.has(activeVideo.id) ? n.delete(activeVideo.id) : n.add(activeVideo.id); return n; })}
                >
                  <CheckCircle2 size={17} style={{ color: watchedSet.has(activeVideo.id) ? "#22C55E" : "#94A3B8" }}/>
                  {watchedSet.has(activeVideo.id) ? (isUrdu ? "مکمل!" : "Completed!") : (isUrdu ? "مکمل کے طور پر نشان لگائیں" : "Mark as Complete")}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="ms-desktop-sidebar">
            <div style={{ padding:"16px", borderBottom:"1px solid #F1F5F9", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <AccentIcon size={15} style={{ color:accent.color }}/>
                <span style={{ fontSize:".92rem", fontWeight:800, color:"#0F172A" }}>{subjectName}</span>
              </div>
              <p style={{ fontSize:".74rem", fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:.5, margin:0 }}>
                {chLabel} · {isUrdu ? "باب" : "CH"} {String(subjectChapters.findIndex(c=>c.id===activeChapter.id)+1).padStart(2,"0")}
              </p>
            </div>
            <LectureSidebarContent/>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     CHAPTER / COURSES VIEW
  ════════════════════════════════════════════════ */
  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"'DM Sans','Nunito','Segoe UI',sans-serif", direction: isUrdu ? "rtl" : "ltr" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap');
        @keyframes msPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        /* ── Desktop: 2-col ── */
        .ms-page-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 48px;
          gap: 32px;
          align-items: flex-start;
        }
        /* ── Left sidebar ── */
        .ms-left-sidebar {
          background: #fff;
          border: 1px solid #E5E9F0;
          border-radius: 16px;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }

        /* Chapter accordion */
        .ms-chap-wrap { background:#fff; border:1px solid #E5E9F0; border-radius:14px; overflow:hidden; margin-bottom:10px; }
        .ms-chap-hdr  { display:flex; align-items:center; gap:14px; padding:18px 20px; cursor:pointer; transition:background .14s; }
        .ms-chap-hdr:hover { background:#F8FAFC; }
        .ms-chap-num  { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:.88rem; color:#fff; flex-shrink:0; }
        .ms-chap-name { font-size:1.05rem; font-weight:800; color:#0F172A; margin:0 0 4px; line-height:1.25; }
        .ms-chap-meta { font-size:.78rem; color:#64748B; margin:0; }
        .ms-prog-bar  { height:4px; background:#E5E9F0; border-radius:100px; overflow:hidden; margin-top:6px; }
        .ms-prog-fill { height:100%; border-radius:100px; transition:width .4s ease; }
        .ms-lec-row   { display:flex; align-items:center; gap:14px; padding:14px 20px; border-top:1px solid #F1F5F9; cursor:pointer; transition:background .14s; }
        .ms-lec-row:hover:not(.locked) { background:#F8FAFC; }
        .ms-lec-row.active { background:${accent.bg}; border-left:3px solid ${accent.color}; }
        .ms-lec-row.locked { cursor:default; opacity:.65; }
        .ms-thumb      { width:88px; height:56px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#E2E8F0; position:relative; display:flex; align-items:center; justify-content:center; }
        .ms-dur-badge  { position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,.7); color:#fff; font-size:.62rem; font-weight:700; padding:2px 5px; border-radius:4px; z-index:2; }
        .ms-cur-badge  { position:absolute; top:4px; right:4px; background:${accent.color}; color:#fff; font-size:.6rem; font-weight:800; padding:2px 7px; border-radius:4px; z-index:2; }
        .ms-thumb img  { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; z-index:1; }
        .ms-thumb-placeholder { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ms-page-grid {
            /* On mobile: sidebar goes to TOP (not side) */
            grid-template-columns: 1fr;
            padding: 16px 16px 40px;
            gap: 20px;
          }
          .ms-left-sidebar {
            /* Remove sticky on mobile so it stays at top naturally */
            position: static;
          }
        }
        @media (max-width: 600px) {
          .ms-page-grid { padding: 12px 12px 40px; }
          .ms-lec-row { padding: 12px 14px; gap: 10px; }
          .ms-thumb { width: 72px; height: 46px; }
          .ms-chap-hdr { padding: 14px 14px; }
          .ms-chap-num { width: 38px; height: 38px; font-size: .8rem; }
        }
      `}</style>

      <div className="ms-page-grid">

        {/* ── LEFT SIDEBAR — always on top on mobile, left on desktop ── */}
        <aside className="ms-left-sidebar">

          {/* Subject title + progress */}
          <div style={{ padding:"20px 20px 16px", borderBottom:"1px solid #F1F5F9" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:accent.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <AccentIcon size={16} style={{ color:accent.color }}/>
              </div>
              <p style={{ fontSize:".7rem", fontWeight:700, color:accent.color, textTransform:"uppercase", letterSpacing:.5, margin:0 }}>{gradeName}</p>
            </div>
            <h2 style={{ fontSize:"1.1rem", fontWeight:900, color:"#0F172A", margin:"0 0 3px" }}>
              {subjectName}: {isUrdu ? "ترقی یافتہ نصاب" : "Advanced Curriculum"}
            </h2>
            <p style={{ fontSize:".78rem", color:"#64748B", margin:"0 0 12px" }}>
              {isUrdu ? "اعلیٰ ریاضی اور جیومیٹری" : "Advanced Arithmetic & Geometry"}
            </p>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".76rem", marginBottom:5 }}>
              <span style={{ fontWeight:600, color:"#374151" }}>{isUrdu ? "مجموعی پیشرفت" : "Overall Progress"}</span>
              <span style={{ fontWeight:800, color:accent.color }}>{progressPct}%</span>
            </div>
            <div style={{ background:"#E5E9F0", borderRadius:100, height:8, overflow:"hidden", marginBottom:7 }}>
              <div style={{ height:"100%", width:`${progressPct}%`, background:accent.color, borderRadius:100, transition:"width .5s ease" }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:".74rem", color:accent.color, fontWeight:700 }}>
              <Zap size={12}/> {isUrdu ? "بہت اچھا! اس ہفتے ۳ اسباق باقی ہیں۔" : "Keep it up! 3 lessons left this week."}
            </div>
          </div>

          {/* Gap */}
          <div style={{ height:6, background:"#F8FAFC" }}/>

          {/* Related Resources */}
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #F1F5F9" }}>
            <p style={{ fontSize:".66rem", fontWeight:800, color:"#94A3B8", textTransform:"uppercase", letterSpacing:1, margin:"0 0 10px" }}>
              {isUrdu ? "متعلقہ وسائل" : "RELATED RESOURCES"}
            </p>
            {loading
              ? Array.from({length:3}).map((_,i) => <div key={i} style={{ height:44, background:"#F1F5F9", borderRadius:9, marginBottom:6, animation:"msPulse 1.4s ease-in-out infinite" }}/>)
              : RESOURCES.map((r,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:11, padding:"7px 0", cursor:"pointer", borderBottom: i < RESOURCES.length-1 ? "1px solid #F8FAFC" : "none" }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <p style={{ fontSize:".8rem", fontWeight:700, color:"#0F172A", margin:0 }}>{r.name}</p>
                    <p style={{ fontSize:".7rem", color:"#94A3B8", margin:0 }}>{r.sub}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Gap */}
          <div style={{ height:6, background:"#F8FAFC" }}/>

          {/* Recent Notes */}
          <div style={{ padding:"14px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
              <p style={{ fontSize:".66rem", fontWeight:800, color:"#94A3B8", textTransform:"uppercase", letterSpacing:1, margin:0 }}>
                {isUrdu ? "حالیہ نوٹس" : "RECENT NOTES"}
              </p>
              <Edit3 size={13} style={{ color:accent.color, cursor:"pointer" }}/>
            </div>
            <div style={{ borderLeft:`3px solid ${accent.color}`, paddingLeft:11 }}>
              <p style={{ fontSize:".8rem", color:"#374151", fontStyle:"italic", lineHeight:1.6, margin:"0 0 6px" }}>
                {isUrdu
                  ? `"تناسب بنیادی طور پر تقسیم کا استعمال کرتے ہوئے مقداروں کا موازنہ کرنے کا طریقہ ہے۔ یاد رکھیں 3:4 4/3 ہے۔"`
                  : `"Ratios are essentially a way to compare quantities using division. Remember 3:4 is 3/4."`}
              </p>
              <p style={{ fontSize:".7rem", color:"#94A3B8", margin:0 }}>{isUrdu ? "مئی ۱۴ • سبق ۱.۲" : "May 14 • Lesson 1.2"}</p>
            </div>
          </div>

          {/* Back */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9" }}>
  <button 
    onClick={() => navigate(`/class/${classId}`, { state: { gradeType } })}
    style={{ 
      color: accent.color, 
      fontWeight: 700, 
      fontSize: ".78rem", 
      background: "none", 
      border: "none", 
      cursor: "pointer", 
      fontFamily: "'DM Sans',sans-serif", 
      padding: 0,
      display: "flex", // Icon aur text ko align karne ke liye
      alignItems: "center",
      gap: "6px"
    }}
  >
    {/* Agar Urdu hai to Right arrow (→), wrna Left arrow (←) */}
    {isUrdu ? "→" : "←"} {isUrdu ? "مضامین پر واپس" : "Back to Subjects"}
  </button>
</div>
        </aside>

        {/* ── MAIN: chapters ── */}
        <main>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".76rem", color:"#64748B", marginBottom:18, flexWrap:"wrap" }}>
            <Link to="/" style={{ color:"#64748B", textDecoration:"none", fontWeight:600 }}>{isUrdu ? "ہوم" : "Home"}</Link>
            <ChevronRight size={11}/>
            <Link to={`/class/${classId}`} state={{ gradeType }} style={{ color:"#64748B", textDecoration:"none", fontWeight:600 }}>{gradeName}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"#0F172A", fontWeight:700 }}>{subjectName}</span>
          </div>

          {/* Header + filter */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <h1 style={{ fontSize:"1.35rem", fontWeight:900, color:"#0F172A", margin:0 }}>
              {isUrdu ? "کورس کے ابواب" : "Course Chapters"}
            </h1>
            <div style={{ display:"flex", gap:8 }}>
              {(["all","inprogress"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding:"7px 16px", borderRadius:100, border:"1.5px solid #E2E8F0", background: filter===f ? "#0F172A" : "#fff", color: filter===f ? "#fff" : "#374151", fontWeight:700, fontSize:".8rem", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .14s" }}>
                  {f === "all" ? (isUrdu ? "تمام اسباق" : "All Lessons") : (isUrdu ? "جاری" : "In Progress")}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && Array.from({length:3}).map((_,i) => (
            <div key={i} style={{ background:"#fff", border:"1px solid #E5E9F0", borderRadius:14, marginBottom:10, height:78, animation:"msPulse 1.4s ease-in-out infinite" }}/>
          ))}

          {/* Chapters */}
          {!loading && subjectChapters.map((chapter, chIdx) => {
            const unlocked = isChapterUnlocked(chIdx);
            const isOpen   = openChapterId === chapter.id;
            const chPct    = chapterProgress(chapter);
            const chDone   = chPct === 100;
            const chLabel  = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
            const chNum    = String(chIdx+1).padStart(2,"0");

            return (
              <div key={chapter.id} className="ms-chap-wrap">
                <div className="ms-chap-hdr"
                  onClick={() => { if (!unlocked) return; setOpenChapterId(isOpen ? null : chapter.id); }}
                  style={{ cursor: unlocked ? "pointer" : "default" }}>
                  <div className="ms-chap-num" style={{ background: chDone ? "#22C55E" : isOpen ? accent.color : "#1E293B" }}>
                    {chDone ? <CheckCircle2 size={18}/> : chNum}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p className="ms-chap-name">{chLabel}</p>
                    <p className="ms-chap-meta">
                      {chDone
                        ? <span style={{ color:"#22C55E", fontWeight:700 }}>{isUrdu ? "مکمل" : "Completed"}</span>
                        : chPct > 0
                        ? <span style={{ color:accent.color, fontWeight:700 }}>{chPct}% {isUrdu ? "مکمل" : "Completed"}</span>
                        : chapter.videos.length > 0
                        ? `${chapter.videos.length} ${isUrdu ? "اسباق" : "Lessons"} • 0% ${isUrdu ? "مکمل" : "Completed"}`
                        : isUrdu ? "کوئی اسباق نہیں" : "No lessons"}
                    </p>
                    {(chPct > 0 || chDone) && (
                      <div className="ms-prog-bar">
                        <div className="ms-prog-fill" style={{ width:`${chDone ? 100 : chPct}%`, background: chDone ? "#22C55E" : accent.color }}/>
                      </div>
                    )}
                  </div>
                  <div style={{ color:"#94A3B8", flexShrink:0 }}>
                    {!unlocked ? <Lock size={15}/> : isOpen ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && unlocked && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:.2 }} style={{ overflow:"hidden" }}>
                      {chapter.videos.map((video, vidIdx) => {
                        const globalIdx = chapterOffsets[chIdx] + vidIdx;
                        const watched   = watchedSet.has(video.id);
                        const isCurrent = activeVideo?.id === video.id;
                        const vTitle    = isUrdu ? video.urdu_name || video.name : video.name;
                        const vDesc     = isUrdu ? video.urdu_desc || video.desc : video.desc;
                        const shortDesc = vDesc?.split("|")[0]?.trim() || "";
                        // ── THUMBNAIL FIX: use getThumbUrl helper ──
                        const thumb     = getThumbUrl(video);

                        return (
                          <div key={video.id}
                            className={`ms-lec-row${isCurrent ? " active" : ""}`}
                            onClick={() => playVideo(video, chapter)}>
                            <div className="ms-thumb">
                              {/* Placeholder background (always rendered behind image) */}
                              <div className="ms-thumb-placeholder" style={{ background: watched ? "#DCFCE7" : accent.bg }}>
                                {watched
                                  ? <CheckCircle2 size={22} style={{ color:"#22C55E" }}/>
                                  : <Play size={20} style={{ color:accent.color }}/>}
                              </div>
                              {/* Actual thumbnail image — shown on top when available */}
                              {thumb && (
                                <img
                                  src={thumb}
                                  alt={vTitle}
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                />
                              )}
                              <div className="ms-dur-badge">
                                {["08:45","12:20","15:10","10:00","09:30","11:15"][vidIdx % 6]}
                              </div>
                              {isCurrent && <div className="ms-cur-badge">{isUrdu ? "موجودہ" : "CURRENT"}</div>}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:".9rem", fontWeight:800, color: isCurrent ? accent.color : "#0F172A", margin:"0 0 3px", lineHeight:1.3 }}>
                                {(globalIdx+1)}.{(vidIdx+1)} {vTitle}
                              </p>
                              {shortDesc && (
                                <p style={{ fontSize:".76rem", color:"#64748B", margin:0, lineHeight:1.45, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                                  {shortDesc}
                                </p>
                              )}
                            </div>
                            <div style={{ flexShrink:0 }}>
                              {watched
                                ? <CheckCircle2 size={19} style={{ color:"#22C55E" }}/>
                                : <div style={{ width:19, height:19, borderRadius:"50%", border:"2px solid #E2E8F0" }}/>}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {!loading && subjectChapters.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#94A3B8" }}>
              <BookOpen size={46} strokeWidth={1} style={{ marginBottom:14 }}/>
              <p style={{ fontWeight:700, fontSize:"1rem" }}>{isUrdu ? "ابھی تک کوئی باب نہیں" : "No chapters yet"}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MiddleSubjectDetailView;