import { useState } from "react";
import { Menu, X, Sparkles, BookMarked, BookOpen, HelpCircle, Bot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ZaheenLogo from "./ZaheenLogo";
import { Quiz } from "./types";
import path from "path";

interface HeaderProps {
  setActiveTab: (name: "dashboard" | "ai-generator" | "past-papers" | "notes" | "faq") => void;
  activeTab: "dashboard" | "ai-generator" | "past-papers" | "notes" | "faq";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { key: "ai-prep" as const, label: "AI Prep Exams", path: "/mdcat/ai-prep", icon: Sparkles },
    { key: "past-papers" as const, label: "MDCAT Past Papers", path: "/mdcat/past-papers", icon: BookMarked },
    { key: "study-notes" as const, label: "Syllabus Notes", path: "/mdcat/study-notes", icon: BookOpen },
    { key: "faq" as const, label: "FAQ", path: "/mdcat/faq", icon: HelpCircle },
    {key:"ai-tutor" as const, label:"AI Tutor",path:"/mdcat/ai-tutor",icon:Bot}
  ];

  const goTo = (tab: typeof navItems[number]["key"] | "dashboard", path: string) => {
    setActiveTab(tab);
    navigate(path);
    setSelectedQuizId(null);
    setActiveQuiz(null);
    setMenuOpen(false); // close the mobile menu after navigating
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-sky-100 px-3 sm:px-6 py-3 sm:py-4 card-shadow">
      <div className="flex items-center justify-between gap-2">
        {/* Logo Section */}
        <div className="flex items-center gap-1.5 min-w-0 shrink">
          <div className="relative flex items-center rounded-2xl hover:bg-blue-50 py-2 px-2 sm:px-5 sm:mx-2 ease-in-out transition-all duration-500 min-w-0">
           <button 
  onClick={() => goTo("dashboard", "/")}
  className="flex items-center min-w-0"
>
  <ZaheenLogo 
    className="w-10 h-7 sm:w-16 sm:h-10 -ml-2 select-none shrink-0 mx-3" 
  />

  <div className="min-w-0 text-left">
    <h1 className="text-[11px] sm:text-sm md:text-base font-black tracking-tight text-sky-900 uppercase truncate">
      zaheen MDCAT Prep
    </h1>

    <p className="hidden xs:block text-[8px] sm:text-[9px] text-sky-400 font-bold tracking-widest uppercase truncate">
      Pakistan Curriculum Standard
    </p>
  </div>
</button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 mx-4 max-w-4xl flex-1 justify-center">
          {navItems.map(({ key, label, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => goTo(key, path)}
              className={`flex items-center gap-2 px-3 py-2 text-[10px] md:text-xs rounded-xl transition-all whitespace-nowrap ${
                  location.pathname === path && !selectedQuizId
                  ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow"
                  : "text-sky-950 font-black uppercase tracking-wider hover:bg-sky-50/50"
              }`}
            >
              <Icon className="w-4 h-6 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Countdown Status Section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="text-right hidden sm:block">
            <p className="text-[9px] sm:text-[10px] font-black text-sky-400 tracking-wider">EXAM IN</p>
            <p className="text-[11px] sm:text-xs md:text-sm font-black text-sky-900">{daysLeft} DAYS</p>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center font-display text-xs font-black text-sky-800 shrink-0">
            ZH
          </div>

          {/* Hamburger toggle — only visible below lg */}
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
          menuOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1.5 pb-2">
          {navItems.map(({ key, label, path, icon: Icon }) => (
            <button
              key={key}
              onClick={() => goTo(key, path)}
              className={`flex items-center gap-3 px-4 py-3 text-xs rounded-xl transition-all w-full ${
                activeTab === key && !selectedQuizId
                  ? "bg-sky-600 text-white font-black uppercase tracking-wider card-shadow"
                  : "text-sky-950 font-black uppercase tracking-wider bg-sky-50/50 hover:bg-sky-100/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;