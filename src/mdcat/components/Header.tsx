import { useState, useRef, useEffect } from "react";
import { Menu, X, Sparkles, BookMarked, BookOpen, ListChecks, Bot, LayoutDashboard, LogOut, FileQuestion, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
const ZaheenLogo = "https://cdn.zaheen.com.pk/zaheen-web-img/ZaheenLogo.png";
import { Quiz } from "./types";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useUserDisplayName } from '@/modules/shared/hooks/useUserDisplayName';

interface HeaderProps {
  setActiveTab: (name: "dashboard" | "ai-generator" | "past-papers" | "notes" | "repeated-questions") => void;
  activeTab: "dashboard" | "ai-generator" | "past-papers" | "notes" | "repeated-questions";
  setSelectedQuizId: (quizID: number | null) => void;
  selectedQuizId: number | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  daysLeft: number | null;
}

const Header = ({
  setActiveTab,
  activeTab,
  setSelectedQuizId,
  selectedQuizId,
  setActiveQuiz,
  daysLeft,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, logout } = useAuth();
  const displayName = useUserDisplayName();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiPrepDropdownOpen, setAiPrepDropdownOpen] = useState(false);
  const aiPrepDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiPrepDropdownRef.current && !aiPrepDropdownRef.current.contains(event.target as Node)) {
        setAiPrepDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/mdcat");
  };

  const aiPrepSubItems = [
    { key: "ai-prep" as const, label: "AI Prep Exams", path: "/mdcat/ai-prep", icon: Sparkles },
    { key: "ai-tutor" as const, label: "AI Tutor", path: "/mdcat/ai-tutor", icon: Bot },
  ];

  const mainNavItems = [
    { key: "past-papers" as const, label: "MDCAT Past Papers", path: "/mdcat/past-papers", icon: BookMarked },
    { key: "study-notes" as const, label: "Syllabus Notes", path: "/mdcat/study-notes", icon: BookOpen },
    { key: "repeated-questions" as const, label: "Repeated Questions", path: "/mdcat/repeated-questions", icon: ListChecks },
    { key: "guess-paper" as const, label: "AI 2026 Practice", path: "/mdcat/guess-paper", icon: FileQuestion },
  ];

  const allNavItems = [
    ...aiPrepSubItems,
    ...mainNavItems,
  ];

  const goTo = (tab: string, path: string) => {
    setActiveTab(tab as any);
    navigate(path);
    setSelectedQuizId(null);
    setActiveQuiz(null);
    setMenuOpen(false);
    setAiPrepDropdownOpen(false);
  };

  const isAiPrepActive = aiPrepSubItems.some(item => location.pathname === item.path) && !selectedQuizId;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sky-100 px-3 sm:px-6 py-3 sm:py-4 card-shadow">
      <div className="flex items-center justify-between gap-2">

        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <button onClick={() => navigate("/")} className="text-left">
            <div className="flex items-center rounded-2xl hover:bg-blue-50 py-2 px-3 transition-all duration-300">
              <img
                src={ZaheenLogo}
                alt="Zaheen Logo"
                className="w-12 h-8 sm:w-14 sm:h-9 select-none shrink-0"
              />
              <h1 className="text-sm sm:text-base font-black tracking-tight text-sky-900 uppercase whitespace-nowrap ml-2">
                MDCAT Prep
              </h1>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 mx-1 flex-1 justify-center">

          {/* AI Prep Exams Dropdown */}
          <div className="relative" ref={aiPrepDropdownRef}>
            <button
              onClick={() => setAiPrepDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-2 text-[10px] rounded-xl transition-all whitespace-nowrap ${
                isAiPrepActive
                  ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow"
                  : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>AI Prep Exams</span>
              <ChevronDown
                className={`w-2.5 h-2.5 ml-0 transition-transform duration-200 ${aiPrepDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Panel */}
            {aiPrepDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-44 rounded-2xl bg-white border border-sky-100 shadow-xl shadow-sky-100/60 overflow-hidden z-50">
                {aiPrepSubItems.map(({ key, label, path, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => goTo(key, path)}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                      location.pathname === path && !selectedQuizId
                        ? "bg-sky-600 text-white"
                        : "text-sky-900 hover:bg-sky-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Nav Items */}
          {mainNavItems.map(({ key, label, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => goTo(key, path)}
              className={`flex items-center gap-1 px-2 py-2 text-[10px] rounded-xl transition-all whitespace-nowrap ${
                location.pathname === path && !selectedQuizId
                  ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow"
                  : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Countdown Status Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Exam countdown */}
          {daysLeft !== null && (
            <div
              className="relative hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500 shadow-md"
              style={{ boxShadow: "0 0 10px rgba(249,115,22,0.5), 0 0 20px rgba(249,115,22,0.25)" }}
            >
              <span className="text-[8px] font-black text-orange-100 uppercase tracking-widest leading-none">Exam</span>
              <span className="text-[8px] font-black text-orange-100 uppercase tracking-widest leading-none">in</span>
              <span
                className="text-sm font-black text-white leading-none mx-0.5"
                style={{ animation: "countdown-pop 2s ease-in-out infinite" }}
              >
                {daysLeft}
              </span>
              <span className="text-[8px] font-black text-orange-100 uppercase tracking-widest leading-none">days</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white">
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
              </span>
              <style>{`
                @keyframes countdown-pop {
                  0%, 100% { transform: scale(1); text-shadow: 0 0 6px rgba(255,255,255,0.4); }
                  50%       { transform: scale(1.18); text-shadow: 0 0 12px rgba(255,255,255,0.9); }
                }
              `}</style>
            </div>
          )}

          {/* User dropdown */}
          {isLoggedIn && displayName ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-sky-50 border border-sky-100 hover:bg-sky-100 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-[10px] font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden xl:block text-xs font-black text-sky-900 max-w-[60px] truncate">{displayName}</span>
                <svg
                  className={`w-3 h-3 text-sky-500 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-white border border-sky-100 shadow-xl shadow-sky-100/60 overflow-hidden z-50">
                  <button
                    onClick={() => { goTo("dash-board", "/mdcat/dashboard"); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black uppercase tracking-wider transition-colors ${
                      location.pathname === "/mdcat/dashboard"
                        ? "bg-sky-600 text-white"
                        : "text-sky-900 hover:bg-sky-50"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                    Dashboard
                  </button>
                  {daysLeft !== null && (
                    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-sky-50">
                      <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
                        Exam in {daysLeft} days
                      </span>
                    </div>
                  )}
                  <div className="border-t border-sky-50" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-sky-100 text-sky-900 hover:bg-sky-50 transition-colors shrink-0"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[700px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1.5 pb-2">
          {allNavItems.map(({ key, label, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => goTo(key, path)}
              className={`flex items-center gap-3 px-4 py-3 text-xs rounded-xl transition-all w-full ${
                location.pathname === path && !selectedQuizId
                  ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow"
                  : "text-sky-950 font-black uppercase tracking-wider bg-sky-50/50 hover:bg-sky-100/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}

          {/* Mobile: user section */}
          {isLoggedIn && displayName && (
            <>
              <div className="border-t border-sky-100 my-1" />
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-[11px] font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-black text-sky-900 truncate">{displayName}</span>
                {daysLeft !== null && (
                  <span className="ml-auto text-[9px] font-black text-orange-500 uppercase tracking-widest whitespace-nowrap">
                    Exam in {daysLeft}d
                  </span>
                )}
              </div>
              <button
                onClick={() => { goTo("dash-board", "/mdcat/dashboard"); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 text-xs rounded-xl transition-all w-full font-black uppercase tracking-wider ${
                  location.pathname === "/mdcat/dashboard"
                    ? "bg-sky-600 text-white card-shadow"
                    : "text-sky-950 bg-sky-50/50 hover:bg-sky-100/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-xs rounded-xl transition-all w-full font-black uppercase tracking-wider text-red-500 bg-red-50/50 hover:bg-red-100/60"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;