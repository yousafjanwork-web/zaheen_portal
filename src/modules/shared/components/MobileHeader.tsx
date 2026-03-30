import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/modules/shared/context/AuthContext";

import logo from "@/assets/images/ZaheenLogo.png";

import { t, setLanguage, getLanguage } from "@/modules/shared/i18n";

const MobileHeader = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const { msisdn, isLoggedIn, logout } = useAuth();

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

        </div>

      )}

    </header>

  );

};

export default MobileHeader;