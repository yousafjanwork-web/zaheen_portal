import React from "react";
import { BookOpen, Code, BarChart3, Brain } from "lucide-react";
import { t } from "@/i18n";

interface CoursesMenuProps {
  open: boolean;
  onClose: () => void;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ open, onClose }) => {

  if (!open) return null;

  return (
    <div className="absolute left-0 top-10 w-[650px] bg-white shadow-xl border rounded-2xl p-8 z-50">

      <div className="grid grid-cols-2 gap-10">

        {/* K12 Curriculum */}
        <div>

          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.k12")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18}/> {t("courses.kg")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18}/> {t("courses.grade1to5")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18}/> {t("courses.grade6to8")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18}/> {t("courses.grade9to12")}
            </li>

          </ul>

        </div>

        {/* Professional Courses */}
        <div>

          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.professional")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BarChart3 size={18}/> {t("courses.digitalMarketing")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BarChart3 size={18}/> {t("courses.trading")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <Code size={18}/> {t("courses.webDevelopment")}
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <Brain size={18}/> {t("courses.ai")}
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default CoursesMenu;