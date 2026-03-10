import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  BookOpen,
  Code,
  BarChart3,
  Brain
} from "lucide-react";

import logo from "@/assets/images/ZaheenLogo.png";
import SubscribeModal from "@/components/SubscribeModal";
import { useSubscribe } from "@/hooks/useSubscribe";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const boards = [
  "Federal Board",
  "Punjab Board",
  "Sindh Board",
  "KPK Board",
  "Balochistan Board"
];

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {

  /* ✅ HOOK MUST BE INSIDE COMPONENT */
  const { handleSubscribe, showModal, setShowModal } = useSubscribe();

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("Federal Board");
  const [boardOpen, setBoardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState("EN");
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBoardOpen(false);
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200"
            : "bg-white"
        }`}
      >
        <div
          ref={dropdownRef}
          className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16"
        >

          {/* LEFT */}
          <div className="flex items-center gap-6">

            <img src={logo} alt="Zaheen" className="h-10" />

            {/* BOARD DROPDOWN */}
            <div className="relative hidden lg:block">

              <button
                onClick={() => setBoardOpen(!boardOpen)}
                className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200"
              >
                {selectedBoard}
                <ChevronDown size={16} />
              </button>

              {boardOpen && (
                <div className="absolute top-12 left-0 w-56 bg-white shadow-lg rounded-xl border p-2">

                  {boards.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setSelectedBoard(b);
                        setBoardOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-100"
                    >
                      {b}
                    </button>
                  ))}

                </div>
              )}
            </div>

            {/* NAV */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">

              <a href="#" className="hover:text-primary">Home</a>

              {/* MEGA MENU */}
              <div className="relative group">

                <button className="flex items-center gap-1 hover:text-primary">
                  Courses
                  <ChevronDown size={16} />
                </button>

                <div className="absolute left-0 top-10 w-[650px] bg-white shadow-xl border rounded-2xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                  <div className="grid grid-cols-2 gap-10">

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">
                        K-12 Curriculum
                      </h4>

                      <ul className="space-y-3 text-sm text-slate-600">

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BookOpen size={18} />
                          KG Foundation
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BookOpen size={18} />
                          Grade 1-5
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BookOpen size={18} />
                          Grade 6-8
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BookOpen size={18} />
                          Grade 9-12
                        </li>

                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">
                        Professional Skills
                      </h4>

                      <ul className="space-y-3 text-sm text-slate-600">

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BarChart3 size={18} />
                          Digital Marketing
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <BarChart3 size={18} />
                          Trading & Finance
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <Code size={18} />
                          Web Development
                        </li>

                        <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
                          <Brain size={18} />
                          AI & Automation
                        </li>

                      </ul>
                    </div>

                  </div>

                </div>
              </div>

              <a href="#">Practice Corner</a>
              <a href="#">Study Material</a>
              <a href="#">Board Results</a>
              <a href="#">AI Tutor</a>

            </nav>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Language */}
            <div className="relative">

              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"
              >
                {language}
                <ChevronDown size={16} />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-10 w-32 bg-white shadow-lg border rounded-xl py-2">

                  <button
                    onClick={() => {
                      setLanguage("EN");
                      setLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    EN – English
                  </button>

                  <button
                    onClick={() => {
                      setLanguage("UR");
                      setLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    UR – Urdu
                  </button>

                </div>
              )}

            </div>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Subscribe */}
            <button
              onClick={handleSubscribe}
              className="hidden lg:block bg-primary text-white px-5 py-2 rounded-full font-medium"
            >
              Subscribe
            </button>

            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </header>

      {/* ✅ MODAL MUST BE OUTSIDE HEADER BUT INSIDE COMPONENT */}
      {showModal && (
        <SubscribeModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default Header;