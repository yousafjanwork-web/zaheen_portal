import React from "react";
import { Link } from "react-router-dom";
import { t } from "@/i18n";

interface LearningMenuProps {
  open: boolean;
  onClose: () => void;
}

const LearningMenu: React.FC<LearningMenuProps> = ({ open, onClose }) => {

  if (!open) return null;

  return (
    <div className="absolute left-0 top-10 w-56 bg-white shadow-xl border rounded-xl p-3 z-50">

      <ul className="space-y-2 text-sm text-slate-600">

        <li>
          <Link
            to="/practice"
            onClick={onClose}
            className="block px-3 py-2 rounded-md hover:bg-slate-100"
          >
            {t("learning.practice")}
          </Link>
        </li>

        <li>
          <a
            href="https://blog.zaheen.com.pk/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="block px-3 py-2 rounded-md hover:bg-slate-100"
          >
            {t("learning.studyMaterial")}
          </a>
        </li>

        <li>
          <Link
            to="/results"
            onClick={onClose}
            className="block px-3 py-2 rounded-md hover:bg-slate-100"
          >
            {t("learning.boardResults")}
          </Link>
        </li>

      </ul>

    </div>
  );
};

export default LearningMenu;