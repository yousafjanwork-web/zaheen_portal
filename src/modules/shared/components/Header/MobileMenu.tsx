import React from "react";
import { Link } from "react-router-dom";

import { t } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";

interface MobileMenuProps {
  open: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open }) => {

  const { msisdn, isLoggedIn, logout } = useAuth();

  if (!open) return null;

  return (

    <div className="lg:hidden border-t bg-white px-4 py-4 space-y-4 text-sm font-medium">

      <Link to="/" className="block hover:text-primary">
        {t("menu.home")}
      </Link>

      <Link to="/practice" className="block hover:text-primary">
        {t("learning.practice")}
      </Link>

      <a
        href="https://blog.zaheen.com.pk"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:text-primary"
      >
        {t("learning.studyMaterial")}
      </a>

      <Link to="/results" className="block hover:text-primary">
        {t("learning.boardResults")}
      </Link>

      <Link to="/ai" className="block hover:text-primary">
        {t("menu.aiTutor")}
      </Link>

      {/* AUTH SECTION */}

      <div className="border-t pt-4 space-y-3">

        {isLoggedIn ? (

          <>
            <div className="text-gray-600 text-xs">
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

  );

};

export default MobileMenu;