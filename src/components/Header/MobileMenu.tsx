import React from "react";
import { Link } from "react-router-dom";
import { t } from "@/i18n";

interface MobileMenuProps {
  open: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open }) => {

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

    </div>
  );
};

export default MobileMenu;