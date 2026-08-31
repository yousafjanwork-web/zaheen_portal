import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import { ChevronDown, Menu, X } from "lucide-react";
=======
import { ChevronDown, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
import { t, setLanguage, getLanguage } from "@/modules/shared/i18n";

import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/ZaheenLogo.png";

import CoursesMenu from "@/modules/shared/components/Header/CoursesMenu";
import LearningMenu from "@/modules/shared/components/Header/LearningMenu";
import MobileMenu from "@/modules/shared/components/MobileHeader";

import { useAuth } from "@/modules/shared/context/AuthContext";
import { useLogin } from "@/modules/shared/hooks/useLogin";
import { useUserDisplayName, clearDisplayNameCache } from "@/modules/shared/hooks/useUserDisplayName";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const boards = [{ key: "boards.federal" }];
<<<<<<< HEAD

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const { msisdn, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { handleLogin } = useLogin(() => setShowLoginModal(true));

=======

/* Derive initials from display name */
const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const { msisdn, userId, isLoggedIn, isKid, logout } = useAuth();
  const displayName = useUserDisplayName();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { handleLogin } = useLogin(() => setShowLoginModal(true));

  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("boards.federal");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // ← NEW

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null); // ← NEW

<<<<<<< HEAD
  /* Scroll */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Outside click */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
=======
  /* Outside click — close all menus */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        setBoardOpen(false);
        setCoursesOpen(false);
        setLearningOpen(false);
        setLanguageOpen(false);
<<<<<<< HEAD
=======
        setIntelligenceOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenus = () => {
    setCoursesOpen(false);
    setLearningOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    clearDisplayNameCache(); // clear scoped name cache BEFORE logout
    logout();
    navigate("/");
  };

  /* ── Render ── */

  return (
    <>
<<<<<<< HEAD
      <header
        className={`hidden lg:block sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-white/10`}
      >
=======
      <header className="hidden lg:block sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-white/10">
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        <div
          ref={dropdownRef}
          className="max-w-full mx-auto px-10 flex items-center justify-between h-16"
        >

<<<<<<< HEAD
          {/* LEFT */}
=======
          {/* ── LEFT ── */}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
          <div className="flex items-center gap-6">

            <Link to="/" onClick={closeMenus}>
              <img src={logo} alt="Zaheen" className="h-10 cursor-pointer" />
            </Link>

<<<<<<< HEAD
            {/* BOARD */}
=======
            {/* Board selector */}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            <div className="relative hidden lg:block">
              <button
                onClick={() => setBoardOpen(!boardOpen)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20"
              >
                {t(selectedBoard)}
                <ChevronDown size={16} />
              </button>
              {boardOpen && (
                <div className="absolute top-12 left-0 w-56 bg-white text-slate-900 shadow-lg rounded-xl border p-2">
                  {boards.map((b) => (
                    <button
                      key={b.key}
<<<<<<< HEAD
                      onClick={() => {
                        setSelectedBoard(b.key);
                        setBoardOpen(false);
                      }}
=======
                      onClick={() => { setSelectedBoard(b.key); setBoardOpen(false); }}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-100"
                    >
                      {t(b.key)}
                    </button>
                  ))}
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* NAV */}
=======
            {/* Nav links */}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">

              <Link to="/" onClick={closeMenus} className="hover:text-white/80">
                {t("menu.home")}
              </Link>

<<<<<<< HEAD
              <div className="relative">
                <button
                  onClick={() => {
                    setCoursesOpen(!coursesOpen);
                    setLearningOpen(false);
                  }}
                  className="flex items-center gap-1 hover:text-white/80"
                >
                  {t("menu.courses")}
                  <ChevronDown size={16} />
                </button>

                <CoursesMenu
                  open={coursesOpen}
                  onClose={() => setCoursesOpen(false)}
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setLearningOpen(!learningOpen);
                    setCoursesOpen(false);
                  }}
                  className="flex items-center gap-1 hover:text-white/80"
                >
                  {t("menu.learningHub")}
                  <ChevronDown size={16} />
                </button>

                <LearningMenu
                  open={learningOpen}
                  onClose={() => setLearningOpen(false)}
                />
              </div>

              <Link to="/ai" onClick={closeMenus} className="hover:text-white/80">
                {t("menu.aiTutor")}
              </Link>

            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* LANGUAGE */}
=======
             <div className="relative">
  <button
    onClick={() => { setCoursesOpen(!coursesOpen); setLearningOpen(false); setIntelligenceOpen(false); }}
    className="flex items-center gap-1 hover:text-white/80"
  >
    {t("menu.courses")} <ChevronDown size={16} />
  </button>
  <CoursesMenu open={coursesOpen} onClose={() => setCoursesOpen(false)} />
</div>

<div className="relative">
  <button
    onClick={() => { setLearningOpen(!learningOpen); setCoursesOpen(false); setIntelligenceOpen(false); }}
    className="flex items-center gap-1 hover:text-white/80"
  >
    {t("menu.learningHub")} <ChevronDown size={16} />
  </button>
  <LearningMenu open={learningOpen} onClose={() => setLearningOpen(false)} />
</div>

<div className="relative">
  <button
    onClick={() => { setIntelligenceOpen(!intelligenceOpen); setCoursesOpen(false); setLearningOpen(false); }}
    className="flex items-center gap-2 hover:text-white/80 transition-colors"
  >
                  {t("menu.intelligence_engine")}
                  <div className="flex flex-col items-center justify-center -space-y-0.5">
                    <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm uppercase leading-none">
                      AI
                    </span>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {intelligenceOpen && (
                  <div className="absolute left-0 top-10 w-60 bg-white text-slate-900 shadow-xl border rounded-xl p-2 z-50">
                    <Link to="/ai" onClick={() => setIntelligenceOpen(false)} className="block px-4 py-2 hover:bg-slate-100 rounded-md text-sm">
                      {t("menu.ai_tutor")}
                    </Link>
                    <Link to="/mdcat?tab=ai-generator" onClick={() => setIntelligenceOpen(false)} className="block px-4 py-2 hover:bg-slate-100 rounded-md text-sm">
                      {t("menu.mdcat_command")}
                    </Link>
                  </div>
                )}
              </div>

            </nav>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center gap-4">

            {/* Language */}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1 border border-white/20 px-3 py-1.5 rounded-lg text-sm hover:bg-white/10"
              >
                {getLanguage().toUpperCase()} <ChevronDown size={16} />
              </button>
              {languageOpen && (
                <div className="absolute right-0 top-10 w-36 bg-white text-slate-900 shadow-lg border rounded-xl py-2">
<<<<<<< HEAD
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    EN – {t("language.english")}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage("ur");
                      setLanguageOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
=======
                  <button onClick={() => { setLanguage("en"); setLanguageOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100">
                    EN – {t("language.english")}
                  </button>
                  <button onClick={() => { setLanguage("ur"); setLanguageOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100">
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
                    UR – {t("language.urdu")}
                  </button>
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* AUTH */}
            {msisdn ? (
              <>
                <span className="text-sm font-medium">{msisdn}</span>

                <button
                  onClick={logout}
                  className="border border-white/30 px-4 py-2 rounded-full hover:bg-white/10"
=======
            {/* ── AUTH ── */}
          {isLoggedIn ? (
              /* ── LOGGED IN: Avatar + dropdown ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 group"
                  aria-label="Open profile menu"
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                      color: "#0f172a",
                      boxShadow: "0 0 12px rgba(240,180,41,0.4)",
                    }}
                  >
                    {displayName ? getInitials(displayName) : <User size={16} />}
                  </div>
                  {/* Name (truncated) */}
                  <span className="text-sm font-medium max-w-[100px] truncate hidden xl:block">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-white/60 transition-transform"
                    style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
<<<<<<< HEAD
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    const redirect = encodeURIComponent(
                      "https://z.zaheen.com.pk/login"
                    );
                    window.location.href =
                      `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;
                  }}
                  className="border border-white/30 px-5 py-2 rounded-full hover:bg-white/10"
                >
                  {t("auth.login")}
                </button>

                <button
                  onClick={() =>
                    window.location.href =
                    "http://he.zaheen.com.pk/gethe?redirect=https://z.zaheen.com.pk/subscribe"
                  }
                  className="bg-primary text-white px-5 py-2 rounded-full"
                >
                  {t("auth.subscribe")}
                </button>
              </>
            )}

            {/* MOBILE */}
            <button
              className="lg:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
=======

                {/* Profile dropdown */}
                {profileOpen && (
                  <div
                    className="absolute right-0 top-12 w-64 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: "rgba(15,23,42,0.97)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(240,180,41,0.08)",
                    }}
                  >
                    {/* Accent top */}
                    <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

                    {/* User info */}
                    <div className="px-4 py-4 border-b border-white/08">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}
                        >
                          {displayName ? getInitials(displayName) : <User size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {displayName || "Zaheen User"}
                          </p>
                       {msisdn && <p className="text-slate-500 text-xs truncate">{msisdn}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-2">
                        <Link
    to="/dashboard"
    onClick={() => setProfileOpen(false)}
    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors"
  >
    <LayoutDashboard size={15} className="text-teal-400 flex-shrink-0" />
    Dashboard
  </Link>

  <div className="my-1 border-t border-white/06" />
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors"
                      >
                        <User size={15} className="text-amber-400 flex-shrink-0" />
                        Edit Profile
                      </Link>

                      <div className="my-1 border-t border-white/06" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={15} className="flex-shrink-0" />
                        {t("auth.logout")}
                      </button>
                    </div>

                    <div className="px-4 pb-3 pt-1">
                      <p className="text-[10px] text-slate-600 text-center">Zaheen Learning Portal</p>
                    </div>
                  </div>
                )}
              </div>
         ) : (

  /* ── GUEST: Login + Subscribe ── */
  <>
    <button
      onClick={() => navigate("/login")}
      className="border border-white/30 px-5 py-2 rounded-full hover:bg-white/10"
    >
      {t("auth.login")}
    </button>
    <button
      onClick={() => navigate("/subscribe")}
      className="bg-primary text-white px-5 py-2 rounded-full"
    >
      {t("auth.subscribe")}
    </button>
  </>
)}
            {/* Mobile toggle */}
            <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <MobileMenu open={menuOpen} />
      </header>
    </>
  );
};

export default Header;