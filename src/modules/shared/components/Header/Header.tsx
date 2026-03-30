import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, Moon, Sun } from "lucide-react";
import { t, setLanguage, getLanguage } from "@/modules/shared/i18n";

import { Link } from "react-router-dom";
import logo from "@/assets/images/ZaheenLogo.png";

import CoursesMenu from "@/modules/shared/components/Header/CoursesMenu";
import LearningMenu from "@/modules/shared/components/Header/LearningMenu";
import MobileMenu from "@/modules/shared/components/MobileHeader";




import { useAuth } from "@/modules/shared/context/AuthContext";
import { useLogin } from "@/modules/shared/hooks/useLogin";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const boards = [
  { key: "boards.federal" },
  { key: "boards.punjab" },
  { key: "boards.sindh" },
  { key: "boards.kpk" },
  { key: "boards.balochistan" }
];

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {

  const { msisdn, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { handleLogin } = useLogin(() => setShowLoginModal(true));



  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);

  const [boardOpen, setBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("boards.federal");

  const [languageOpen, setLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

        setBoardOpen(false);
        setCoursesOpen(false);
        setLearningOpen(false);
        setLanguageOpen(false);

      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const closeMenus = () => {
    setCoursesOpen(false);
    setLearningOpen(false);
  };

  return (
    <>
      <header
        className={`hidden lg:block sticky top-0 z-50 transition ${isScrolled
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

            <Link to="/" onClick={closeMenus}>
              <img src={logo} alt="Zaheen" className="h-10 cursor-pointer" />
            </Link>

            {/* BOARD */}

            <div className="relative hidden lg:block">

              <button
                onClick={() => setBoardOpen(!boardOpen)}
                className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium"
              >
                {t(selectedBoard)}
                <ChevronDown size={16} />
              </button>

              {boardOpen && (

                <div className="absolute top-12 left-0 w-56 bg-white shadow-lg rounded-xl border p-2">

                  {boards.map((b) => (

                    <button
                      key={b.key}
                      onClick={() => {
                        setSelectedBoard(b.key)
                        setBoardOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-100"
                    >
                      {t(b.key)}
                    </button>

                  ))}

                </div>

              )}

            </div>

            {/* NAV */}

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">

              <Link to="/" onClick={closeMenus} className="hover:text-primary">
                {t("menu.home")}
              </Link>

              {/* COURSES */}

              <div className="relative">

                <button
                  onClick={() => {
                    setCoursesOpen(!coursesOpen)
                    setLearningOpen(false)
                  }}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  {t("menu.courses")}
                  <ChevronDown size={16} />
                </button>

                <CoursesMenu
                  open={coursesOpen}
                  onClose={() => setCoursesOpen(false)}
                />

              </div>

              {/* LEARNING */}

              <div className="relative">

                <button
                  onClick={() => {
                    setLearningOpen(!learningOpen)
                    setCoursesOpen(false)
                  }}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  {t("menu.learningHub")}
                  <ChevronDown size={16} />
                </button>

                <LearningMenu
                  open={learningOpen}
                  onClose={() => setLearningOpen(false)}
                />

              </div>

              <Link to="/ai" onClick={closeMenus} className="hover:text-primary">
                {t("menu.aiTutor")}
              </Link>

            </nav>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">

            {/* LANGUAGE */}

            <div className="relative">

              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"
              >
                {getLanguage().toUpperCase()}
                <ChevronDown size={16} />
              </button>

              {languageOpen && (

                <div className="absolute right-0 top-10 w-36 bg-white shadow-lg border rounded-xl py-2">

                  <button
                    onClick={() => {
                      setLanguage("en")
                      setLanguageOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    EN – {t("language.english")}
                  </button>

                  <button
                    onClick={() => {
                      setLanguage("ur")
                      setLanguageOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    UR – {t("language.urdu")}
                  </button>

                </div>

              )}

            </div>

            {/* THEME */}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* AUTH */}

            {msisdn ? (

              <>

                <span className="text-sm font-medium">
                  {msisdn}
                </span>

                <button
                  onClick={logout}
                  className="border px-4 py-2 rounded-full"
                >
                  {t("auth.logout")}
                </button>

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
                  className="border border-primary text-primary px-5 py-2 rounded-full"
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
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
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