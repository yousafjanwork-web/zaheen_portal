import React, { useState } from "react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const logo = "https://cdn.zaheen.com.pk/zaheen-web-img/ZaheenLogo.png";
import { t, setLanguage, getLanguage } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useUserDisplayName, clearDisplayNameCache } from "@/modules/shared/hooks/useUserDisplayName";
import { classSlugFromId } from "@/config/classSlugs";
import { SKILL_SEGMENTS } from "@/modules/shared/utils/skillsSegments";

type SectionKey = "courses" | "skills" | "ai" | "prep" | null;

const getInitials = (name: string) =>
  name.trim().split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [section, setSection] = useState<SectionKey>(null);

  const { msisdn, isLoggedIn, logout } = useAuth();
  const displayName = useUserDisplayName();
  const navigate = useNavigate();

  /* MZA active check */
  const mzaActive = sessionStorage.getItem("mzaStatus") === "ACTIVE";
  const isSubscribed = isLoggedIn || mzaActive;

  const handleLogout = () => {
    clearDisplayNameCache();
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const close = () => setMenuOpen(false);
  const toggle = (k: Exclude<SectionKey, null>) => setSection(section === k ? null : k);

  const itemCls =
    "flex items-center px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/07 hover:text-white transition-colors";
  const subCls =
    "block px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/07 transition-colors";
  const headCls =
    "px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500";

  const accordion = (k: Exclude<SectionKey, null>, label: React.ReactNode) => (
    <button onClick={() => toggle(k)} className={`${itemCls} w-full justify-between`}>
      <span className="flex items-center gap-2">{label}</span>
      <ChevronDown
        size={15}
        className="transition-transform"
        style={{ transform: section === k ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  );

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

        {/* Logo */}
        <Link to="/" onClick={close}>
          <img src={logo} alt="Zaheen" className="h-8" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">

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
          )}

        </div>
      </div>

      {/* Slide-down menu */}
      {menuOpen && (
        <nav className="mt-4 pb-2 space-y-1">

          {/* Home */}
          <Link to="/" onClick={close} className={itemCls}>
            {t("menu.home")}
          </Link>

          {/* Courses (K-12 only) */}
          <div>
            {accordion("courses", t("menu.courses"))}
            {section === "courses" && (
              <div className="ml-3 border-l border-white/10">
                <p className={headCls}>{t("courses.k12")}</p>

                <button
                  onClick={() => {
                    navigate(`/${classSlugFromId(1)}`, { state: { gradeType: "kg" } });
                    close();
                  }}
                  className={`${subCls} w-full text-left`}
                >
                  {t("courses.kg")}
                </button>
                <Link to="/grade-view/1-5" onClick={close} className={subCls}>{t("courses.grade1to5")}</Link>
                <Link to="/grade-view/6-8" onClick={close} className={subCls}>{t("courses.grade6to8")}</Link>
                <Link to="/grade-view/9-12" onClick={close} className={subCls}>{t("courses.grade9to12")}</Link>
              </div>
            )}
          </div>

          {/* Skills (three segments) */}
          <div>
            {accordion("skills", t("menu.skills"))}
            {section === "skills" && (
              <div className="ml-3 border-l border-white/10 pb-1">
                {SKILL_SEGMENTS.map((seg) => (
                  <div key={seg.titleKey}>
                    <p className={headCls}>{t(seg.titleKey)}</p>
                    {seg.items.map((item) => (
                      <Link key={item.to} to={item.to} onClick={close} className={subCls}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zaheen Intelligence Engine */}
          <div>
            {accordion(
              "ai",
              <>
                {t("menu.intelligence_engine")}
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none">
                  AI
                </span>
              </>
            )}
            {section === "ai" && (
              <div className="ml-3 border-l border-white/10">
                <Link to="/ai" onClick={close} className={subCls}>{t("menu.ai_tutor")}</Link>
                <a
                  href="https://zaheen.com.pk/ai_counselor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className={subCls}
                >
                  {t("menu.ai_counselor")}
                </a>
              </div>
            )}
          </div>

          {/* Test Prep */}
          <div>
            {accordion(
              "prep",
              <>
                {t("menu.test_prep")}
                <span
                  dir="ltr"
                  className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase leading-none"
                  style={{ background: "linear-gradient(90deg,#ef4444,#f97316)" }}
                >
                  🔥 ISSB
                </span>
              </>
            )}
            {section === "prep" && (
              <div className="ml-3 border-l border-white/10">
                <Link to="/prep-exam" onClick={close} className={subCls}>{t("menu.all_test_prep")}</Link>
                <a href="https://zaheen.com.pk/issb/" target="_blank" rel="noopener noreferrer" onClick={close} className={subCls}>
                  {t("menu.issb")}
                </a>
                <a href="https://zaheen.com.pk/nat/" target="_blank" rel="noopener noreferrer" onClick={close} className={subCls}>
                  {t("menu.nat")}
                </a>
                <Link to="/mdcat" onClick={close} className={subCls}>{t("menu.mdcat")}</Link>
                <a href="https://zaheen.com.pk/uniprep/" target="_blank" rel="noopener noreferrer" onClick={close} className={subCls}>
                  {t("menu.uniprep")}
                </a>
              </div>
            )}
          </div>

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
      )}
    </header>
  );
};

export default MobileHeader;