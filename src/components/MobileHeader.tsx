import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import logo from "@/assets/images/ZaheenLogo.png";

import { t, setLanguage, getLanguage } from "@/i18n";

const MobileHeader = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  return (

    <header className="bg-white border-b px-4 py-3 lg:hidden">

      <div className="flex items-center justify-between">

        {/* LEFT MENU */}

        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        {/* CENTER LOGO */}

        <img
          src={logo}
          alt="Zaheen"
          className="h-8"
        />

        {/* LANGUAGE */}

        <div className="relative">

          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center gap-1 border px-3 py-1 rounded-lg text-sm"
          >
            {getLanguage().toUpperCase()}
            <ChevronDown size={16}/>
          </button>

          {languageOpen && (

            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg">

              <button
                onClick={()=>{
                  setLanguage("en")
                  setLanguageOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
              >
               {t("language.english")}
              </button>

              <button
                onClick={()=>{
                  setLanguage("ur")
                  setLanguageOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
              >
                 {t("language.urdu")}
              </button>

            </div>

          )}

        </div>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="mt-4 space-y-3 text-sm">

          <a href="/" className="block">
            {t("menu.home")}
          </a>

          <a href="/courses" className="block">
            {t("menu.courses")}
          </a>

          <a href="/practice" className="block">
            {t("menu.practiceCorner")}
          </a>

          <a href="/results" className="block">
            {t("menu.boardResults")}
          </a>

          <a href="/ai" className="block">
            {t("menu.aiTutor")}
          </a>

        </div>

      )}

    </header>

  );

};

export default MobileHeader;