import React, { useState } from "react";
<<<<<<< HEAD
import { Menu, X, ChevronDown, LogOut, XCircle } from "lucide-react";
=======
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

import logo from "@/assets/images/ZaheenLogo.png";
import { t, setLanguage, getLanguage } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useUserDisplayName, clearDisplayNameCache } from "@/modules/shared/hooks/useUserDisplayName";

const getInitials = (name: string) =>
  name.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
<<<<<<< HEAD
  const { msisdn, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const { handleSubscribe } = useSubscribe();
=======

  const { msisdn, userId, isLoggedIn, logout } = useAuth();
  const displayName = useUserDisplayName();
  const navigate = useNavigate();

  /* MZA active check */
  const mzaActive = sessionStorage.getItem("mzaStatus") === "ACTIVE";
  const isSubscribed = isLoggedIn || mzaActive;
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

  const handleLogout = () => {
    clearDisplayNameCache();
    logout();
    setMenuOpen(false);
    navigate("/");
  };

<<<<<<< HEAD
  const handleUnsubscribe = () => {
    handleSubscribe(); // your unsubscribe logic
    setMenuOpen(false);
  };
=======
  const close = () => setMenuOpen(false);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 px-4 py-3 lg:hidden">

      <div className="flex items-center justify-between">

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

<<<<<<< HEAD
        {/* CENTER LOGO */}
        <a href="/">
          <img src={logo} alt="Zaheen" className="h-8" />
        </a>
        {/* LANGUAGE */}
        <div className="relative">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className={`
                  flex items-center gap-1 border px-3 py-1 rounded-lg text-sm
                  ${getLanguage() === "ur" ? "flex-row-reverse" : ""}
                `}          >
            {getLanguage().toUpperCase()}
            <ChevronDown size={16} />
          </button>

          {languageOpen && (
            // <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg">
            <div
              className={`
                absolute mt-2 w-36 bg-white shadow-lg border rounded-lg
                ${getLanguage() === "ur" ? "left-0" : "right-0"}
              `}
            >
              <button
                onClick={() => {
                  setLanguage("en");
                  setLanguageOpen(false);
                }}
                className={`
                  block w-full px-4 py-2 text-sm hover:bg-slate-100
                  ${getLanguage() === "ur" ? "text-right" : "text-left"}
                `}              >
                {t("language.english")}
              </button>
=======
        {/* Logo */}
        <Link to="/" onClick={close}>
          <img src={logo} alt="Zaheen" className="h-8" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className={`flex items-center gap-1 border border-white/20 px-2.5 py-1 rounded-lg text-xs text-white hover:bg-white/10 transition-colors
                ${getLanguage() === "ur" ? "flex-row-reverse" : ""}`}
            >
              {getLanguage().toUpperCase()}
              <ChevronDown size={13} />
            </button>

            {languageOpen && (
              <div
                className={`absolute mt-2 w-36 rounded-xl overflow-hidden z-50
                  ${getLanguage() === "ur" ? "left-0" : "right-0"}`}
                style={{
                  background: "rgba(15,23,42,0.97)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                }}
<<<<<<< HEAD
                className={`
                  block w-full px-4 py-2 text-sm hover:bg-slate-100
                  ${getLanguage() === "ur" ? "text-right" : "text-left"}
                `}              >
                {t("language.urdu")}
              </button>
            </div>
=======
              >
                {[
                  { code: "en", label: t("language.english") },
                  { code: "ur", label: t("language.urdu") },
                ].map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => { setLanguage(code as "en" | "ur"); setLanguageOpen(false); }}
                    className={`block w-full px-4 py-2.5 text-xs text-slate-300 hover:bg-white/08 hover:text-white transition-colors
                      ${getLanguage() === "ur" ? "text-right" : "text-left"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile avatar (logged in only) */}
          {isLoggedIn && (
            <button
              onClick={() => { navigate("/profile"); close(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                color: "#0f172a",
                boxShadow: "0 0 10px rgba(240,180,41,0.35)",
              }}
              aria-label="Go to profile"
            >
              {displayName ? getInitials(displayName) : <User size={14} />}
            </button>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
          )}

        </div>
      </div>

      {/* Slide-down menu */}
      {menuOpen && (
<<<<<<< HEAD
        <div className="mt-4 space-y-3 text-sm">
          <a href="/" className="block">
            {t("menu.home")}
          </a>
          <a href="/grade-view/k-12" className="block">
            {t("menu.courses")}
          </a>

          <a href="/practice" className="block">
            {t("learning.practice")}
          </a>
          <a href="/results" className="block">
            {t("learning.boardResults")}
          </a>
          <a href="/ai" className="block">
            {t("menu.aiTutor")}
          </a>
          {/* 🔹 AUTH SECTION */}

          <div className="border-t pt-4 space-y-3">

            {isLoggedIn ? (

              <>
                <div className="text-gray-500 text-xs">
                  {t("auth.loggedInAs")}
                </div>

                <div className="font-semibold">
                  {msisdn}
                </div>

                <button
                  onClick={logout}
                  className="w-full border border-red-500 text-red-500 py-2 rounded-lg"
                >
                  {t("auth.logout")}
                </button>
              </>

            ) : (

              <>
                <button
                  onClick={() =>
                    window.location.href =
                    "http://he.zaheen.com.pk/gethe?redirect=https://z.zaheen.com.pk/login"
                  }
                  className="w-full border border-primary text-primary py-2 rounded-lg"
                >
                  {t("auth.login")}
                </button>

                <button
                  onClick={() =>
                    window.location.href =
                    "http://he.zaheen.com.pk/gethe?redirect=https://z.zaheen.com.pk/subscribe"
                  }
                  className="w-full bg-primary text-white py-2 rounded-lg"
                >
                  {t("auth.subscribe")}
                </button>
              </>

            )}

          </div>

          {/* {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-gray-300 hover:bg-red-50 text-red-600 font-semibold transition"
              >
                <LogOut size={18} />
                {t("menu.logout")}
              </button>

              <button
                onClick={handleUnsubscribe}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-gray-300 hover:bg-yellow-50 text-yellow-600 font-semibold transition"
              >
                <XCircle size={18} />
                {t("menu.unsubscribe")}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-gray-300 hover:bg-blue-50 text-blue-600 font-semibold transition"
            >
              {t("menu.login")}
            </button>
          )} */}
        </div>
=======
        <nav className="mt-4 pb-2 space-y-1">

         {[
            { href: "/",                label: t("menu.home") },
            { href: "/grade-view/k-12", label: t("menu.courses") },
            { href: "/practice",        label: t("learning.practice") },
            { href: "/results",         label: t("learning.boardResults") },
            { href: "/ai",              label: t("menu.ai_tutor") },
              { href: "/mdcat",           label: t("menu.mdcat_command") },
          ].map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              onClick={close}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}

          <div
            className="mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {isLoggedIn ? (
              <>
                {/* User card */}
                <div
                  className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
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

             <Link
                  to="/profile"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors"
                >
                  <User size={15} className="text-amber-400 flex-shrink-0" />
                  Edit Profile
                </Link>

                <Link
                  to="/dashboard"
                  onClick={close}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors"
                >
                  <LayoutDashboard size={15} className="text-teal-400 flex-shrink-0" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1"
                >
                  <LogOut size={15} className="flex-shrink-0" />
                  {t("auth.logout")}
                </button>
              </>
            ) : (
              <>
                {/* Login always visible */}
                             <button
                  onClick={() => { close(); navigate("/login"); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mb-2 transition-colors hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  {t("auth.login")}
                </button>

                {/* Subscribe button — hidden for MZA active users */}
                {!isSubscribed && (
                                <button
                  onClick={() => { close(); navigate("/subscribe"); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                    color: "#0f172a",
                    boxShadow: "0 4px 12px rgba(240,180,41,0.3)",
                  }}
                >
                  {t("auth.subscribe")}
                </button>
                )}
              </>
            )}
          </div>
        </nav>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      )}
    </header>
  );
};

export default MobileHeader;