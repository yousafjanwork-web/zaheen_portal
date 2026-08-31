import React, { useState, useEffect } from "react";
import logo from "../assets/logo/space-logo-zaheen1.png";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Map as MapIcon,
  Trophy,
  BookOpen,
  MessageSquare,
  Menu,
  X,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Thermometer,
  Moon,
  Orbit,
  Ruler,
  Zap,
  Music,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import {
  PLANETS,
  QUIZ_QUESTIONS,
  TIMELINE,
  SPACE_OBJECTS,
  PlanetData,
  SpaceObject,
} from "./data/spaceData";
import { Starfield } from "./components/Starfield";
import { SolarSystemView } from "./components/SolarSystemView";
import { translations, Language } from "./lib/translations";
import confetti from "canvas-confetti";
import { cosmoApi } from "./config";
// Views
type View = "home" | "explorer" | "quiz" | "timeline" | "academy" | "objects";

export default function CosmokidApp({ hideLogo = false }: { hideLogo?: boolean }) {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [showChat, setShowChat] = useState(false);
  const [score, setScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [activeTool, setActiveTool] = useState<"chart" | "measure" | null>(
    null,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAcademyModule, setSelectedAcademyModule] = useState<any>(null);
  // ── NEW: mobile menu state ──
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const t = translations[language];

  // Text to Speech
  const speak = (text: string) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
const navigate = useNavigate();
  const addBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges([...badges, badge]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF4500", "#1E90FF"],
      });
    }
  };

  // Close mobile menu on view change
  const navigateTo = (view: View) => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  return (
    <div
      className={cn(
        "relative min-h-screen text-white font-sans selection:bg-purple-500/30",
        language === "ur" && "font-urdu text-right",
      )}
    >
      <Starfield />

      {/* Background Music */}
      <audio
        src="https://assets.mixkit.co/music/preview/mixkit-space-atmosphere-background-loop-290.mp3"
        loop
        autoPlay={isMusicPlaying && !isMuted}
        ref={(el) => {
          if (el) {
            if (isMusicPlaying && !isMuted) {
              el.play().catch(() => {});
            } else {
              el.pause();
            }
          }
        }}
      />

      {/* ══════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-7 py-6 md:pt-8 bg-gradient-to-b from-[#020410] to-transparent">
    
{/* Logo */}
        {!hideLogo && (
         <div
  className="flex items-center gap-3 cursor-pointer group"
  onClick={() => {
    setCurrentView("home");
    setSelectedPlanet(null);
    setShowMobileMenu(false);
    navigate("/");
  }}
>
  <div
  className="flex items-center gap-3 cursor-pointer group"
  onClick={() => {
    setCurrentView("home");
    setSelectedPlanet(null);
    setShowMobileMenu(false);
    navigate("/");
  }}
>
  <div
  className="flex items-center gap-3 cursor-pointer group"
  onClick={() => {
    setCurrentView("home");
    setSelectedPlanet(null);
    setShowMobileMenu(false);
    navigate("/");
  }}
>
  <div className="relative w-14 h-9 md:w-20 md:h-8 flex items-center justify-center">
    {/* Outer orbit ring */}
    <div className="absolute inset-0 rounded-full  border-indigo-300/0 group-hover:border-indigo-300/40 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />

    {/* Soft starlight glow */}
    <div className="absolute inset-0 rounded-full bg-indigo-300/0 group-hover:bg-indigo-300/25 blur-lg scale-75 group-hover:scale-125 transition-all duration-500 ease-out" />

    <img
      src={logo}
      alt=""
      className="relative z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-6 group-hover:drop-shadow-[0_0_14px_rgba(165,180,252,0.7)]"
    />
  </div>
</div>
</div>
</div>
        )}
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 font-bold text-sm">
          <NavItem
            label={t.nav.explore}
            active={currentView === "explorer"}
            onClick={() => navigateTo("explorer")}
          />
          <NavItem
            label={t.nav.wonders}
            active={currentView === "objects"}
            onClick={() => navigateTo("objects")}
          />
          <NavItem
            label={t.nav.quiz}
            active={currentView === "quiz"}
            onClick={() => navigateTo("quiz")}
          />
          <NavItem
            label={t.nav.history}
            active={currentView === "timeline"}
            onClick={() => navigateTo("timeline")}
          />
          <NavItem
            label={t.nav.academy}
            active={currentView === "academy"}
            onClick={() => navigateTo("academy")}
          />
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "ur" : "en")}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            {language === "en" ? "اردو" : "EN"}
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className={cn(
              "p-2.5 rounded-xl transition-all border",
              isMusicPlaying && !isMuted
                ? "bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20"
                : "bg-white/5 text-white/40 border-white/10",
            )}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 transition-colors text-white/70 hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Avatar — hidden on mobile to save space */}
          <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-white shadow-lg overflow-hidden items-center justify-center shrink-0">
            <span className="text-xl">👨‍🚀</span>
          </div>

          {/* ── NEW: Hamburger button — mobile only ── */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* ── NEW: Mobile menu overlay ── */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-[#020410]/96 backdrop-blur-xl flex flex-col items-center justify-center gap-5 pt-20"
          >
            {(
              [
                { label: t.nav.explore, view: "explorer" as View },
                { label: t.nav.wonders, view: "objects" as View },
                { label: t.nav.quiz, view: "quiz" as View },
                { label: t.nav.history, view: "timeline" as View },
                { label: t.nav.academy, view: "academy" as View },
              ] as { label: string; view: View }[]
            ).map(({ label, view }) => (
              <button
                key={view}
                onClick={() => navigateTo(view)}
                className={cn(
                  "w-64 py-4 rounded-2xl font-black text-lg uppercase tracking-widest border transition-all",
                  currentView === view
                    ? "bg-white text-black border-white shadow-xl"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}

            {/* Bottom language + mute row */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setLanguage(language === "en" ? "ur" : "en")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                {language === "en" ? "اردو" : "EN"}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white/60" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 pt-28 md:pt-36 pb-40 px-6 md:px-10 flex flex-col items-center min-h-screen w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <HomeView
              onStart={() => setCurrentView("explorer")}
              language={language}
            />
          )}
          {currentView === "explorer" && (
            <ExplorerView
              setSelectedPlanet={setSelectedPlanet}
              hoveredPlanet={hoveredPlanet}
              setHoveredPlanet={setHoveredPlanet}
              language={language}
            />
          )}
          {currentView === "quiz" && (
            <QuizView
              setScore={setScore}
              addBadge={addBadge}
              language={language}
            />
          )}
          {currentView === "timeline" && <TimelineView language={language} />}
          {currentView === "academy" && (
            <AcademyView
              addBadge={addBadge}
              setSelectedModule={setSelectedAcademyModule}
              language={language}
            />
          )}
          {currentView === "objects" && (
            <ObjectsGalleryView language={language} />
          )}
        </AnimatePresence>
      </main>

      {/* Planet Detail Side Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetDetailPanel
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
            speak={speak}
            language={language}
          />
        )}
      </AnimatePresence>

      {/* Other Modals */}
      <AnimatePresence>
        {showBadgesModal && (
          <Modal
            onClose={() => setShowBadgesModal(false)}
            title="My Space Badges"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.length === 0 ? (
                <div className="col-span-full py-12 text-center text-white/40 font-bold uppercase tracking-widest">
                  No badges earned yet. Start learning!
                </div>
              ) : (
                badges.map((b) => (
                  <div
                    key={b}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xs font-black uppercase text-center">
                      {b}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Modal>
        )}

        {showToolsModal && (
          <Modal
            onClose={() => {
              setShowToolsModal(false);
              setActiveTool(null);
            }}
            title={
              activeTool
                ? activeTool === "chart"
                  ? "Sky Chart"
                  : "Universal Measure"
                : "Explorer Tools"
            }
          >
            <AnimatePresence mode="wait">
              {!activeTool ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 gap-4"
                >
                  <button
                    onClick={() => setActiveTool("chart")}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 group hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <Orbit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic tracking-tighter">
                        Sky Chart
                      </h4>
                      <p className="text-xs text-white/50">
                        View constellations and stars
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTool("measure")}
                    className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 group hover:bg-white/10 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                      <Ruler className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic tracking-tighter">
                        Universal Measure
                      </h4>
                      <p className="text-xs text-white/50">
                        Calculate distances in Light Years
                      </p>
                    </div>
                  </button>
                </motion.div>
              ) : activeTool === "chart" ? (
                <SkyChartTool onBack={() => setActiveTool(null)} />
              ) : (
                <MeasureTool onBack={() => setActiveTool(null)} />
              )}
            </AnimatePresence>
          </Modal>
        )}

        {selectedAcademyModule && (
          <Modal
            onClose={() => setSelectedAcademyModule(null)}
            title={selectedAcademyModule.title}
          >
            <div className="space-y-6">
              <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
                {React.cloneElement(selectedAcademyModule.icon, {
                  size: 80,
                  className: "text-white/80",
                })}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                Mission Briefing
              </h3>
              <p className="text-white/70 leading-relaxed font-medium">
                {selectedAcademyModule.longDescription}
              </p>
              <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl">
                <p className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-2">
                  Reward for completion
                </p>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <span className="text-xl font-black italic uppercase tracking-tighter">
                    {selectedAcademyModule.reward} Badge
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  addBadge(selectedAcademyModule.reward);
                  setSelectedAcademyModule(null);
                }}
                className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                CLAIM BADGE
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Assistant Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-[60] p-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
      </button>

      <AnimatePresence>
        {showChat && <AIAssistant onClose={() => setShowChat(false)} />}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-all uppercase tracking-widest",
        active ? "text-cyan-400" : "text-white/70 hover:text-cyan-400",
      )}
    >
      {label}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════
// HOME VIEW — FIX: smaller Urdu font, proper RTL text alignment
// ══════════════════════════════════════════════════════════════════
function HomeView({
  onStart,
  language,
}: {
  onStart: () => void;
  language: Language;
}) {
  const [isLaunching, setIsLaunching] = useState(false);
  const t = translations[language].home;
  const isUrdu = language === "ur";

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onStart();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -200, scale: 0.8, transition: { duration: 0.5 } }}
      className="max-w-6xl w-full flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-between py-6 md:py-12 relative"
    >
      {/* ── Text block ── */}
      <div
        className={cn(
          "flex-1 relative z-10 w-full",
          isUrdu ? "text-right" : "text-left",
        )}
      >
        {/* Mission status badge */}
        <div
          className={cn(
            "mb-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 w-fit",
            isUrdu ? "flex-row-reverse" : "",
          )}
        >
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
            {t.missionStatus}: {isLaunching ? t.launching : t.ready}
          </span>
        </div>

        {/* ── FIX: Urdu title uses smaller responsive sizes ── */}
        <h1
          className={cn(
            "font-black leading-[0.9] tracking-tighter uppercase italic mb-6 md:mb-8",
            isUrdu
              ? "text-[30px] sm:text-[44px] md:text-[72px] leading-[1.1]"
              : "text-[40px] sm:text-[60px] md:text-[100px] leading-[0.85]",
          )}
        >
          {t.title}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            {t.universe}
          </span>
        </h1>

        <p
          className={cn(
            "text-base md:text-xl text-blue-100/70 max-w-md font-medium mb-8 md:mb-12 leading-relaxed",
            isUrdu && "mr-0 ml-auto md:ml-0",
          )}
        >
          {t.subtitle}
        </p>

        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4",
            isUrdu && "sm:flex-row-reverse",
          )}
        >
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={cn(
              "bg-gradient-to-r from-orange-500 to-red-600 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden",
              isLaunching && "scale-95 opacity-80",
            )}
          >
            {isLaunching ? t.launching.toUpperCase() : t.start}
            <Rocket
              className={cn("w-6 h-6", isLaunching && "animate-bounce")}
            />
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 md:px-8 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl hover:bg-white/20 transition-all text-center">
            {t.meetPlanets}
          </button>
        </div>
      </div>

      {/* ── Planet visual ── */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 shrink-0 flex items-center justify-center">
        <AnimatePresence>
          {isLaunching && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], scale: [1, 2.5, 3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-0 w-64 h-32 bg-white/20 blur-3xl rounded-full"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: [40, 120, 80] }}
                className="absolute top-[60%] w-12 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent blur-md rounded-full z-0"
              />
            </>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[80px]"></div>

        <motion.div
          animate={
            isLaunching
              ? {
                  y: [0, -10, 5, -800],
                  rotate: [5, -5, 5, 0],
                  scale: [1, 1.1, 1, 0.5],
                }
              : { y: [0, -15, 0], rotate: [5, -5, 5] }
          }
          transition={
            isLaunching
              ? { duration: 2.5, times: [0, 0.1, 0.3, 1], ease: "easeInOut" }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative w-full h-full z-20"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF9D6C] via-[#E27B58] to-[#69211B] shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(226,123,88,0.3)] overflow-hidden relative border-4 border-white/10">
            <div className="absolute top-1/4 left-1/3 w-12 h-10 bg-black/10 rounded-full blur-sm"></div>
            <div className="absolute bottom-1/3 right-1/4 w-20 h-16 bg-black/10 rounded-full blur-md"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-blue-400/20 rounded-full border-8 border-[#3d1a10] flex items-center justify-center">
              <div className="text-4xl sm:text-6xl animate-pulse">🧑‍🚀</div>
            </div>
          </div>

          <AnimatePresence>
            {!isLaunching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-0 -right-8 sm:-right-12 bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl rotate-6"
              >
                <span className="block text-[10px] uppercase font-bold text-orange-400 mb-1">
                  {t.targetPlanet}
                </span>
                <span className="block text-xl sm:text-2xl font-black italic tracking-tighter">
                  MARS
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isLaunching && (
              <motion.div
                exit={{ opacity: 0, y: 20 }}
                className="absolute -bottom-10 right-4 flex flex-col items-center"
              >
                <div className="bg-cyan-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">
                  {t.hiCosmo}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {isLaunching && (
        <motion.div
          animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
          transition={{ duration: 0.1, repeat: 20 }}
          className="fixed inset-0 pointer-events-none z-[100] border-[20px] border-orange-500/10"
        />
      )}
    </motion.div>
  );
}

function ExplorerView({
  setSelectedPlanet,
  hoveredPlanet,
  setHoveredPlanet,
  language,
}: any) {
  const t = translations[language as Language].explorer;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-12rem)] w-full relative"
    >
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
          {t.title}
        </h2>
        <p className="text-white/50 font-bold text-sm uppercase tracking-widest">
          {t.subtitle}
        </p>
      </div>

      <SolarSystemView
        onPlanetClick={setSelectedPlanet}
        hoveredPlanet={hoveredPlanet}
        setHoveredPlanet={setHoveredPlanet}
      />

      {/* Legend */}
      <div className="absolute top-24 left-4 right-4 flex flex-wrap justify-center gap-2 z-10 pointer-events-none">
        <div className="flex flex-wrap justify-center gap-2 p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 pointer-events-auto">
          {PLANETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlanet(p)}
              onMouseEnter={() => setHoveredPlanet(p.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-tight",
                hoveredPlanet === p.id
                  ? "bg-white text-black border-white scale-105"
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/30",
              )}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.name[language as Language]}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PlanetDetailPanel({
  planet,
  onClose,
  speak,
  language,
}: {
  planet: PlanetData;
  onClose: () => void;
  speak: (t: string) => void;
  language: Language;
}) {
  const [activeTab, setActiveTab] = useState<
    "facts" | "stats" | "can-i-live" | "compare"
  >("facts");
  const t = translations[language].planet;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a1a] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-[100] border-l border-white/10 overflow-y-auto scrollbar-hide"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Hero */}
      <div className="relative h-80 bg-gradient-to-b from-transparent to-[#0a0a1a] flex items-center justify-center p-12 overflow-hidden bg-[#020410]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 blur-3xl opacity-20"
          style={{ background: planet.color }}
        />
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-48 h-48 rounded-full relative overflow-hidden shadow-2xl"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 80px ${planet.color}33`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/60" />
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-black/40 skew-x-12"
            />
            <div className="absolute top-4 left-10 w-2 h-2 bg-white/20 rounded-full blur-sm" />
            <div className="absolute bottom-10 right-8 w-4 h-4 bg-black/10 rounded-full blur-md" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -inset-4 border-2 border-white/5 rounded-full"
          />
        </div>
      </div>

      <div className="px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {planet.tags[language].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] uppercase font-black tracking-widest opacity-60"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            {planet.name[language]}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            {planet.description[language]}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl mb-8">
          {(["facts", "stats", "can-i-live", "compare"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 min-w-[100px] py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                activeTab === tab
                  ? "bg-white text-black shadow-lg"
                  : "text-white/40 hover:text-white",
              )}
            >
              {tab === "facts"
                ? t.facts
                : tab === "stats"
                  ? t.stats
                  : tab === "can-i-live"
                    ? t.living
                    : t.compare}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {activeTab === "facts" && (
            <ul className="space-y-4">
              {planet.funFacts[language].map((f, i) => (
                <li
                  key={i}
                  className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                  onClick={() => speak(f)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 group-hover:bg-blue-500/40 transition-colors">
                    <Volume2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "stats" && (
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Thermometer />}
                label={language === "en" ? "Temperature" : "درجہ حرارت"}
                value={planet.stats.temp}
              />
              <StatCard
                icon={<Moon />}
                label={language === "en" ? "Moons" : "چاند"}
                value={planet.stats.moons.toString()}
              />
              <StatCard
                icon={<Orbit />}
                label={language === "en" ? "Year Length" : "سال کی لمبائی"}
                value={planet.stats.yearLength[language]}
              />
              <StatCard
                icon={<Ruler />}
                label={language === "en" ? "Day Length" : "دن کی لمبائی"}
                value={planet.stats.dayLength[language]}
              />
            </div>
          )}

          {activeTab === "can-i-live" && (
            <div className="p-6 bg-gradient-to-br from-[#0c0c2a] to-blue-900/20 border border-white/10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full" />
              <h4 className="text-lg font-black uppercase italic mb-3 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-cyan-400" />
                {t.livingConditions}
              </h4>
              <p className="text-white/80 italic leading-relaxed mb-6 bg-white/5 p-4 rounded-2xl font-medium">
                "{planet.livingCondition[language]}"
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-white/40 uppercase mb-2 tracking-widest">
                  {t.earthEquivalent}
                </p>
                <p className="font-bold text-lg">
                  {planet.comparison[language]}
                </p>
              </div>
            </div>
          )}

          {activeTab === "compare" && (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <h4 className="text-sm font-black uppercase tracking-widest text-white/50 mb-8 flex items-center justify-between">
                  {t.sizeVsEarth}
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">
                    1 : {planet.earthRatio}
                  </span>
                </h4>

                <div className="flex items-center justify-around relative z-10">
                  <div className="text-center group">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mb-3 mx-auto shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
                      Earth
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-white/10 italic font-black text-3xl mb-1">
                      X
                    </div>
                    <div className="h-px w-8 bg-white/20" />
                  </div>
                  <div className="text-center group">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="rounded-full mb-3 mx-auto shadow-lg"
                      style={{
                        width: `${Math.max(12, Math.min(100, planet.earthRatio * 12))}px`,
                        height: `${Math.max(12, Math.min(100, planet.earthRatio * 12))}px`,
                        backgroundColor: planet.color,
                        boxShadow: `0 0 30px ${planet.color}44`,
                      }}
                    />
                    <span
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: planet.color }}
                    >
                      {planet.name[language]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/40 mb-3 tracking-widest">
                    {t.volumeCapacity}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Rocket className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xl font-black italic">
                        {planet.volumeCapacity}x
                      </div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                        {t.earthsInside}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10">
                  <p className="text-[9px] font-black uppercase text-white/40 mb-3 tracking-widest">
                    {t.gravityScale}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xl font-black italic">
                        {planet.id === "jupiter"
                          ? "2.4"
                          : planet.id === "earth"
                            ? "1.0"
                            : "0.4"}
                        g
                      </div>
                      <div className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                        {planet.id === "earth" ? t.standard : t.relative}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-cyan-400/5 border border-cyan-400/20 rounded-[2.5rem] flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-xs font-bold leading-relaxed text-cyan-100/70 italic">
                  {planet.id === "jupiter"
                    ? "Even though it's massive, Jupiter is so light it's made mostly of gas. It's essentially a giant ball of clouds!"
                    : planet.id === "saturn"
                      ? "Saturn is so much less dense than Earth that it would actually float if you found a bathtub big enough!"
                      : "Earth is the densest planet in the solar system, making it perfect for life to walk on solid ground."}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════
// OBJECTS GALLERY VIEW — FIX: translate "Cosmic Wonders" heading
// ══════════════════════════════════════════════════════════════════
function ObjectsGalleryView({ language }: { language: Language }) {
  const [selectedType, setSelectedType] = useState<string>(
    language === "en" ? "All" : "سب",
  );

  // Reset filter when language changes
  React.useEffect(() => {
    setSelectedType(language === "en" ? "All" : "سب");
  }, [language]);

  const allLabel = language === "en" ? "All" : "سب";
  const types = [
    allLabel,
    ...new Set(SPACE_OBJECTS.map((o) => o.type[language])),
  ];

  const filtered =
    selectedType === allLabel
      ? SPACE_OBJECTS
      : SPACE_OBJECTS.filter((o) => o.type[language] === selectedType);

  // ── Localized heading text ──
  const headingWord1 = language === "en" ? "Cosmic" : "کائناتی";
  const headingWord2 = language === "en" ? "Wonders" : "عجائبات";
  const subheading =
    language === "en"
      ? "A journey through the deep reaches of space"
      : "خلا کی گہرائیوں میں ایک سفر";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl w-full py-12 relative"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              opacity: 0.1,
            }}
            animate={{
              y: [null, Math.random() * -100, null],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 relative z-10">
        {/* ── FIX: use localized heading words ── */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={cn(
              "font-black italic tracking-tighter uppercase mb-4 leading-none",
              language === "ur"
                ? "text-4xl md:text-6xl"
                : "text-6xl md:text-8xl",
            )}
          >
            {headingWord1} <span className="text-cyan-400">{headingWord2}</span>
          </h2>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
            {subheading}
          </p>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10"
        >
          {types.map((typeLabel) => (
            <button
              key={typeLabel}
              onClick={() => setSelectedType(typeLabel)}
              className={cn(
                "px-6 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                selectedType === typeLabel
                  ? "bg-white text-black shadow-xl"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              {typeLabel}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((obj, index) => (
            <motion.div
              layout
              key={obj.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-[3.5rem] relative overflow-hidden group shadow-2xl"
            >
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:opacity-80 opacity-40 blur-[50px]"
                style={{ background: obj.color }}
              />
              <div className="relative z-10">
                <motion.div
                  className="text-7xl mb-8 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] w-fit"
                  animate={{ rotate: [0, 5, -5, 0], y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {obj.emoji}
                </motion.div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400">
                    {obj.type[language]}
                  </span>
                </div>

                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors">
                  {obj.name[language]}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-10 h-20 overflow-y-auto scrollbar-hide font-medium">
                  {obj.description[language]}
                </p>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    {language === "en"
                      ? "Secret Mission Intel"
                      : "خفیہ معلومات"}
                  </p>
                  {obj.funFacts[language].map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex gap-3 text-[11px] font-bold text-white/80 leading-snug items-start"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: obj.color }}
                      />
                      {fact}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center gap-2 text-white/40 mb-2">
        {React.cloneElement(icon, { size: 14 })}
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function QuizView({ setScore, addBadge, language }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const t = translations[language as Language].quiz;

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    const correct = option === QUIZ_QUESTIONS[currentQuestion].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((s: number) => s + 50);
      confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 } });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
      addBadge("Explorer I");
    }
  };

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 bg-white/5 border border-white/10 rounded-3xl p-12">
        <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-4xl font-black uppercase mb-4">{t.complete}</h2>
        <p className="text-xl text-white/60 mb-8">{t.expert}</p>
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setShowResult(false);
            setSelectedOption(null);
            setIsCorrect(null);
          }}
          className="px-8 py-4 bg-white text-black font-black rounded-2xl"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-sm font-black text-white/40 uppercase tracking-widest">
            {t.question} {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
          </span>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            {q.question[language]}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {q.options.map((optionKey, idx) => (
          <button
            key={optionKey}
            disabled={selectedOption !== null}
            onClick={() => handleAnswer(optionKey)}
            className={cn(
              "p-6 rounded-3xl border text-xl font-bold transition-all text-left",
              selectedOption === optionKey
                ? isCorrect
                  ? "bg-green-500 border-green-400 text-white"
                  : "bg-red-500 border-red-400 text-white"
                : selectedOption !== null && optionKey === q.answer
                  ? "bg-green-500/20 border-green-400/50"
                  : "bg-white/5 border-white/10 hover:bg-white/10",
            )}
          >
            {q.localizedOptions[language][idx]}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-3xl mb-8 flex gap-4"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">
                {language === "en" ? "Cool Fact!" : "دلچسپ حقیقت!"}
              </p>
              <p className="text-lg font-medium">{q.fact[language]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedOption && (
        <button
          onClick={nextQuestion}
          className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center gap-2 group"
        >
          {currentQuestion === QUIZ_QUESTIONS.length - 1
            ? language === "en"
              ? "FINISH"
              : "مکمل"
            : language === "en"
              ? "NEXT QUESTION"
              : "اگلا سوال"}
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

function TimelineView({ language }: { language: Language }) {
  const t = translations[language].timeline;
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-12 text-center underline decoration-blue-500 decoration-8 underline-offset-8">
        {t.title} <span className="text-orange-500">{t.history}</span>
      </h2>
      <div className="relative border-l-4 border-white/10 ml-6 space-y-12 pl-12 pb-12">
        {TIMELINE.map((item, i) => (
          <div key={i} className="relative group">
            <div className="absolute -left-[62px] top-2 w-8 h-8 rounded-full bg-blue-500 border-4 border-[#05050a] z-10 group-hover:scale-125 transition-transform" />
            <div className="text-blue-400 font-black text-2xl mb-1">
              {item.year}
            </div>
            <h3 className="text-3xl font-black uppercase mb-3 tracking-tighter">
              {item.title[language]}
            </h3>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl">
              {item.description[language]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AcademyView({ addBadge, setSelectedModule, language }: any) {
  const [activeLab, setActiveLab] = useState<
    "dressup" | "rocket" | "launch" | null
  >(null);
  const t = translations[language as Language].academy;

  const learningModules = [
    {
      id: "training",
      title: language === "en" ? "Astronaut Training" : "خلاباز تربیت",
      icon: <BookOpen />,
      description:
        language === "en"
          ? "How humans prepare for space!"
          : "انسان خلا کے لیے کیسے تیاری کرتے ہیں!",
      longDescription:
        language === "en"
          ? "Becoming an astronaut takes years of hard work! They study science, math, and learn how to fly planes. They also train in underwater tanks to practice moving in zero gravity and learn how to repair the ISS."
          : "خلاباز بننے کے لیے سالوں کی محنت درکار ہوتی ہے! وہ سائنس، ریاضی پڑھتے ہیں اور ہوائی جہاز اڑانا سیکھتے ہیں۔ وہ پانی کے ٹینکوں میں بھی تربیت لیتے ہیں تاکہ بے وزنی میں حرکت کی مشق کر سکیں۔",
      reward: "Trained Pro",
    },
    {
      id: "suits",
      title: language === "en" ? "Astronaut Suits" : "خلائی لباس",
      icon: <Rocket />,
      description:
        language === "en"
          ? "Personal spaceships for your body!"
          : "آپ کے جسم کے لیے ذاتی خلائی جہاز!",
      longDescription:
        language === "en"
          ? "Space is very cold and has no air! Astronauts wear special suits that provide oxygen, keep them at the right temperature, and protect them from radiation. They're like personal spaceships!"
          : "خلا بہت ٹھنڈا ہے اور وہاں ہوا نہیں ہے! خلاباز خاص لباس پہنتے ہیں جو آکسیجن فراہم کرتے ہیں، درجہ حرارت مناسب رکھتے ہیں، اور تابکاری سے بچاتے ہیں۔",
      reward: "Safety First",
    },
    {
      id: "rockets",
      title: language === "en" ? "Rocket Science" : "راکٹ سائنس",
      icon: <Zap />,
      description:
        language === "en"
          ? "How do we get to the stars?"
          : "ہم ستاروں تک کیسے پہنچتے ہیں؟",
      longDescription:
        language === "en"
          ? "Rockets work by pushing fuel out of the back at very high speeds. This creates an upward force called thrust. Most rockets have multiple stages that fall off once their fuel is used up!"
          : "راکٹ پیچھے سے ایندھن بہت تیز رفتاری سے پھینک کر آگے بڑھتے ہیں۔ اس سے ایک اوپر کی طرف قوت پیدا ہوتی ہے جسے تھرسٹ کہتے ہیں۔",
      reward: "Engineer",
    },
    {
      id: "zerog",
      title: language === "en" ? "Zero Gravity" : "صفر کشش ثقل",
      icon: <Orbit />,
      description:
        language === "en"
          ? "Experience life without weight!"
          : "بے وزنی کی زندگی کا تجربہ کریں!",
      longDescription:
        language === "en"
          ? "In orbit, items don't fall—they float! This is called microgravity. Astronauts have to use velcro to keep things from drifting away, and they even sleep in sleeping bags tied to the wall!"
          : "مدار میں چیزیں نہیں گرتیں بلکہ تیرتی ہیں! اسے مائیکرو گریوٹی کہتے ہیں۔ خلاباز ویلکرو استعمال کرتے ہیں تاکہ چیزیں ادھر ادھر نہ جائیں۔",
      reward: "Float Master",
    },
    {
      id: "food",
      title: language === "en" ? "Space Food" : "خلائی خوراک",
      icon: <MapIcon />,
      description:
        language === "en" ? "What do astronauts eat?" : "خلاباز کیا کھاتے ہیں؟",
      longDescription:
        language === "en"
          ? "In space, food has to be light, nutritious, and easy to eat in zero gravity. Many foods are dehydrated and then rehydrated with a special water gun on the ISS!"
          : "خلا میں کھانا ہلکا، غذائیت سے بھرپور اور بے وزنی میں کھانے میں آسان ہونا چاہیے۔ کئی کھانے خشک کر کے بھیجے جاتے ہیں اور پھر پانی سے تیار کیے جاتے ہیں۔",
      reward: "Space Chef",
    },
    {
      id: "iss",
      title: language === "en" ? "The ISS" : "خلائی اسٹیشن",
      icon: <Moon />,
      description:
        language === "en"
          ? "Our home above the clouds!"
          : "بادلوں کے اوپر ہمارا گھر!",
      longDescription:
        language === "en"
          ? "The International Space Station is a giant laboratory orbiting Earth. It's as big as a football field and has been home to astronauts from all over the world for over 20 years!"
          : "بین الاقوامی خلائی اسٹیشن زمین کے گرد چکر لگانے والی ایک بڑی تجربہ گاہ ہے۔ یہ فٹ بال کے میدان جتنا بڑا ہے اور 20 سال سے زیادہ عرصے سے خلابازوں کا گھر ہے۔",
      reward: "ISS Resident",
    },
  ];

  if (activeLab === "dressup")
    return (
      <AstronautDressUp
        onBack={() => setActiveLab(null)}
        addBadge={addBadge}
        language={language}
      />
    );
  if (activeLab === "rocket")
    return (
      <RocketBuilder
        onBack={() => setActiveLab(null)}
        addBadge={addBadge}
        language={language}
      />
    );
  if (activeLab === "launch")
    return (
      <LaunchSimulator
        onBack={() => setActiveLab(null)}
        addBadge={addBadge}
        language={language}
      />
    );

  return (
    <div className="max-w-6xl w-full py-12">
      <div className="mb-16">
        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-4 leading-none">
          {t.title} <span className="text-purple-400">{t.academy}</span>
        </h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
          {t.prepare}
        </p>
      </div>

      <div className="mb-20">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
          <Sparkles className="text-yellow-500" />
          {t.labs}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LabCard
            title={t.dressUp}
            icon="🧑‍🚀"
            color="bg-blue-600"
            description={t.prepareGear}
            onClick={() => setActiveLab("dressup")}
            language={language}
          />
          <LabCard
            title={t.rocketBuilder}
            icon="🚀"
            color="bg-orange-600"
            description={t.assemble}
            onClick={() => setActiveLab("rocket")}
            language={language}
          />
          <LabCard
            title={t.launchSim}
            icon="🔥"
            color="bg-red-600"
            description={t.command}
            onClick={() => setActiveLab("launch")}
            language={language}
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
          <BookOpen className="text-cyan-400" />
          {t.knowledge}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningModules.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m)}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                {React.cloneElement(m.icon as any, {
                  size: 32,
                  className: "text-white",
                })}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                {m.title}
              </h3>
              <p className="text-white/50 font-medium mb-6">{m.description}</p>
              <div className="flex items-center gap-2 text-yellow-500 font-black text-[10px] uppercase tracking-widest">
                <Trophy className="w-3 h-3" />
                {language === "en" ? "Unlock Module" : "ماڈیول کھولیں"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabCard({ title, icon, color, description, onClick, language }: any) {
  const t = translations[language as Language].academy;
  return (
    <button
      onClick={onClick}
      className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all text-left group relative overflow-hidden"
    >
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40",
          color,
        )}
      />
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
        {title}
      </h3>
      <p className="text-white/40 text-sm font-bold uppercase tracking-wider">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {t.startTraining} <ChevronRight className="w-3 h-3" />
      </div>
    </button>
  );
}

function AstronautDressUp({ onBack, addBadge, language }: any) {
  const [parts, setParts] = useState({
    helmet: false,
    suit: false,
    gloves: false,
    boots: false,
  });
  const t = translations[language as Language].academy;
  const allEquipped = Object.values(parts).every((v) => v);

  return (
    <div className="max-w-4xl w-full py-12 mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-xs"
      >
        <ChevronLeft className="w-4 h-4" />{" "}
        {translations[language as Language].common.back}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden">
          <div className="text-[12rem] relative z-10 transition-all duration-500">
            {allEquipped ? "👨‍🚀" : "🏃‍♂️"}
          </div>
        </div>
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">
            {t.dressUp.split(" ")[0]}{" "}
            <span className="text-blue-400">
              {t.dressUp.split(" ").slice(1).join(" ")}
            </span>
          </h2>
          <p className="text-white/50 mb-10 font-medium">{t.equipAstronaut}</p>
          <div className="space-y-4 mb-10">
            {Object.entries(parts).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setParts((p) => ({ ...p, [key]: !p[key] }))}
                className={cn(
                  "w-full p-6 border rounded-2xl flex items-center justify-between transition-all font-black uppercase italic tracking-tighter",
                  value
                    ? "bg-white text-black border-white"
                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20",
                )}
              >
                {t.parts[key as keyof typeof t.parts]}
                <Plus
                  className={cn(
                    "w-5 h-5 transition-transform",
                    value && "rotate-45",
                  )}
                />
              </button>
            ))}
          </div>
          {allEquipped && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => addBadge("Best Dressed Astronaut")}
              className="w-full py-6 bg-cyan-400 text-black font-black text-xl rounded-2xl shadow-xl shadow-cyan-400/20"
            >
              {t.readyMission}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

function RocketBuilder({ onBack, addBadge, language }: any) {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const t = translations[language as Language].academy;
  const partOptions = [
    {
      name: language === "en" ? "Booster" : "بوسٹر",
      color: "bg-red-500",
      icon: "🔥",
      key: "Booster",
    },
    {
      name: language === "en" ? "Fuel Tank" : "فیول ٹینک",
      color: "bg-gray-400",
      icon: "⛽",
      key: "Fuel Tank",
    },
    {
      name: language === "en" ? "Capsule" : "کیپسول",
      color: "bg-cyan-400",
      icon: "🧑‍🚀",
      key: "Capsule",
    },
    {
      name: language === "en" ? "Wings" : "پر",
      color: "bg-blue-500",
      icon: "🦋",
      key: "Wings",
    },
    {
      name: language === "en" ? "Nose Cone" : "نوز کون",
      color: "bg-gray-300",
      icon: "🔺",
      key: "Nose Cone",
    },
  ];

  const getPartStyle = (key: string) => {
    switch (key) {
      case "Nose Cone":
        return "w-16 h-16 bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-full shadow-lg z-50";
      case "Capsule":
        return "w-20 h-16 bg-gradient-to-b from-cyan-300 to-cyan-600 rounded-t-[2rem] border-b-4 border-black/20 z-40 flex items-center justify-center";
      case "Fuel Tank":
        return "w-24 h-32 bg-gradient-to-r from-gray-300 via-white to-gray-300 border-x-8 border-gray-400 shadow-xl z-30 relative overflow-hidden";
      case "Booster":
        return "w-24 h-16 bg-gradient-to-b from-gray-600 to-red-600 rounded-b-3xl z-20 flex justify-around p-2";
      case "Wings":
        return "w-40 h-8 bg-blue-500 rounded-full -mx-8 z-10 opacity-80";
      default:
        return "w-20 h-12 bg-white";
    }
  };

  return (
    <div className="max-w-4xl w-full py-12 mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-xs"
      >
        <ChevronLeft className="w-4 h-4" />{" "}
        {translations[language as Language].common.back}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="h-[600px] bg-gradient-to-b from-black/60 to-blue-900/20 rounded-[4rem] border border-white/10 relative flex flex-col-reverse items-center justify-start p-12 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <div className="absolute bottom-0 w-full h-8 bg-gray-800 border-t-4 border-gray-700" />
          <AnimatePresence mode="popLayout">
            {selectedParts.map((pKey, i) => (
              <motion.div
                key={pKey + i}
                initial={{
                  y: -200,
                  opacity: 0,
                  scale: 0.8,
                  rotate: i % 2 === 0 ? 10 : -10,
                }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className={cn("relative group", getPartStyle(pKey))}
              >
                {pKey === "Capsule" && (
                  <div className="w-6 h-6 rounded-full bg-black/40 border-2 border-white/20" />
                )}
                {pKey === "Booster" && (
                  <motion.div
                    animate={{ height: [10, 20, 10], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -bottom-8 left-0 right-0 flex justify-around px-2"
                  >
                    <div className="w-4 h-full bg-orange-500 blur-md rounded-full" />
                    <div className="w-4 h-full bg-orange-500 blur-md rounded-full" />
                  </motion.div>
                )}
                {pKey === "Fuel Tank" && (
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-black/10" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {selectedParts.length === 0 && (
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/20 font-black uppercase italic text-center text-2xl tracking-tighter"
            >
              {language === "en" ? "Start Building" : "بنانا شروع کریں"}
              <br />
              <span className="text-sm opacity-50">
                {language === "en"
                  ? "Select components to begin"
                  : "آغاز کرنے کے لیے اجزاء کا انتخاب کریں"}
              </span>
            </motion.div>
          )}
        </div>
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">
              {t.rocketBuilder}
            </h2>
            <p className="text-white/40 mb-8 font-medium text-sm">
              {t.assemble}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {partOptions.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedParts((prev) => [...prev, p.key])}
                  className="group relative p-5 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-between overflow-hidden"
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 w-1 transition-all group-hover:w-2",
                      p.color,
                    )}
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                      {p.icon}
                    </span>
                    <span className="font-black uppercase italic tracking-widest text-xs group-hover:text-white transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedParts([])}
              className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500/10 hover:border-red-500/20 transition-all"
            >
              {t.scrapDesign}
            </button>
            {selectedParts.length >= 3 && (
              <button
                onClick={() => addBadge("Aerodynamics Master")}
                className="flex-[2] py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                {t.testEngine}
              </button>
            )}
          </div>
          {selectedParts.length > 0 && (
            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-3xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 mb-2">
                {t.buildStats}
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-xl font-black italic">
                    {selectedParts.length}
                  </p>
                  <p className="text-[9px] font-bold text-white/30 uppercase">
                    {t.stages}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black italic">
                    {selectedParts.includes("Booster")
                      ? language === "en"
                        ? "EXCELLENT"
                        : "بہترین"
                      : language === "en"
                        ? "LOW"
                        : "کم"}
                  </p>
                  <p className="text-[9px] font-bold text-white/30 uppercase">
                    {t.thrustProfile}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LaunchSimulator({ onBack, addBadge, language }: any) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [status, setStatus] = useState("IDLE");
  const t = translations[language as Language].academy;

  const startLaunch = () => {
    setCountdown(5);
    setStatus("COUNTDOWN");
  };

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStatus("LIFTOFF");
      setTimeout(() => {
        setStatus("SUCCESS");
        addBadge("Mission Commander");
      }, 3000);
    }
  }, [countdown, addBadge]);

  return (
    <div className="max-w-4xl w-full py-12 mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase tracking-widest text-xs"
      >
        <ChevronLeft className="w-4 h-4" />{" "}
        {translations[language as Language].common.back}
      </button>
      <div className="bg-[#050714] border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden h-[600px] flex flex-col items-center justify-center shadow-2xl">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {status === "IDLE" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
              <Rocket className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">
              {t.missionControl.split(" ")[0]}{" "}
              <span className="text-red-500">
                {t.missionControl.split(" ")[1]}
              </span>
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-10">
              {t.allSystemsGo}
            </p>
            <button
              onClick={startLaunch}
              className="group relative px-12 py-6 bg-red-600 text-white font-black text-2xl rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <span className="relative z-10">{t.initiateLaunch}</span>
              <motion.div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </motion.div>
        )}
        {status === "COUNTDOWN" && (
          <motion.div
            key={countdown}
            initial={{ scale: 3, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="text-[12rem] font-black italic relative z-10 text-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            {countdown}
          </motion.div>
        )}
        {status === "LIFTOFF" && (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-20">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -800, scale: 0.5 }}
              transition={{ duration: 3, ease: "easeIn" }}
              className="text-[10rem] filter drop-shadow-[0_20px_50px_rgba(249,115,22,0.8)]"
            >
              🚀
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [1, 1.2, 1] }}
              className="absolute bottom-40 w-40 h-80 bg-gradient-to-t from-transparent via-orange-500 to-yellow-300 blur-3xl opacity-50 rounded-full"
            />
            <div className="text-4xl font-black italic uppercase tracking-tighter text-white animate-pulse">
              {language === "en" ? "LIFTOFF!" : "پرواز!"}
            </div>
          </div>
        )}
        {status === "SUCCESS" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="w-32 h-32 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
              {t.accomplished}
            </h2>
            <div className="px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[.3em] text-cyan-400 w-fit mx-auto mb-10 border border-cyan-400/20">
              {t.safeOrbit}
            </div>
            <button
              onClick={() => setStatus("IDLE")}
              className="px-8 py-4 bg-white/5 border border-white/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              {t.resetMission}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SkyChartTool({ onBack }: { onBack: () => void }) {
  const constellations = ["Orion", "Ursa Major", "Cassiopeia", "Cygnus", "Leo"];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="aspect-square bg-black rounded-[3rem] border border-white/20 p-8 relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border border-white/10 rounded-full relative"
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 100 100"
          >
            <path
              d="M20,30 L40,20 L60,35 L80,25"
              fill="none"
              stroke="cyan"
              strokeWidth="0.5"
            />
            <path
              d="M10,70 L30,85 L50,75 L70,80"
              fill="none"
              stroke="purple"
              strokeWidth="0.5"
            />
            <circle cx="20" cy="30" r="1" fill="white" />
            <circle cx="40" cy="20" r="1.5" fill="white" />
            <circle cx="60" cy="35" r="1" fill="white" />
            <circle cx="80" cy="25" r="1.5" fill="white" />
          </svg>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {constellations.map((c) => (
          <div
            key={c}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-cyan-400"
          >
            {c}
          </div>
        ))}
      </div>
      <button
        onClick={onBack}
        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        GO BACK
      </button>
    </motion.div>
  );
}

function MeasureTool({ onBack }: { onBack: () => void }) {
  const [kilometers, setKilometers] = useState(1);
  const lightYears = kilometers / 9.461e12;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-[2.5rem]">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">
          Distance Intelligence
        </p>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-white/50 mb-2 uppercase">
              Kilometers
            </label>
            <input
              type="number"
              value={kilometers}
              onChange={(e) => setKilometers(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-black text-xl italic"
            />
          </div>
          <div className="flex items-center justify-center rotate-90 py-2">
            <ChevronRight className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/50 mb-2 uppercase">
              Light Years
            </p>
            <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
              <span className="text-3xl font-black italic tracking-tighter text-cyan-400">
                {lightYears < 0.000001
                  ? lightYears.toExponential(4)
                  : lightYears.toFixed(8)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-[10px] font-bold text-white/40 leading-relaxed italic">
          "Light travels at 300,000 kilometers per second. That's fast enough to
          go around the Earth 7.5 times in just one second!"
        </p>
      </div>
      <button
        onClick={onBack}
        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        GO BACK
      </button>
    </motion.div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-[#0a0a2a] border border-white/10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto scrollbar-hide">{children}</div>
      </motion.div>
    </div>
  );
}

function AIAssistant({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hello! I'm Cosmo, your space scout! Ask me anything about the universe! 🌌",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(cosmoApi("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Oops! My radio signal is weak. Try again later! 🛰️",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-[#0a0a2a] border border-white/20 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] z-[70] flex flex-col overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-black italic uppercase text-white leading-none">
              Cosmo
            </h4>
            <span className="text-[10px] text-white/70 uppercase tracking-tighter font-bold">
              Space Scout AI
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ x: m.role === "user" ? 20 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
              "max-w-[85%] p-4 rounded-3xl",
              m.role === "user"
                ? "ml-auto bg-white/10 text-white rounded-br-none"
                : "bg-blue-600/20 text-blue-100 rounded-bl-none border border-blue-500/20",
            )}
          >
            <p className="text-sm font-medium">{m.text}</p>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-2 p-4 bg-blue-600/10 rounded-3xl rounded-bl-none border border-blue-500/20 w-16">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>
      <div className="p-6 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Cosmo anything..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium placeholder:text-white/20"
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
