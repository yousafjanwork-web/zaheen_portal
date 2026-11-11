import React from "react";
import { BookOpen } from "lucide-react";
import { t, getLanguage } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";
import { classSlugFromId } from "@/config/classSlugs";

interface CoursesMenuProps {
  open: boolean;
  onClose: () => void;
}

interface GradeItem {
  label: string;
  link?: string;
  onClick?: () => void;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const isUrdu = getLanguage() === "ur";

  if (!open) return null;

  const items: GradeItem[] = [
    {
      label: t("courses.kg"),
      onClick: () => navigate(`/${classSlugFromId(1)}`, { state: { gradeType: "kg" } }),
    },
    { link: "/grade-view/1-5", label: t("courses.grade1to5") },
    { link: "/grade-view/6-8", label: t("courses.grade6to8") },
    { link: "/grade-view/9-12", label: t("courses.grade9to12") },
  ];

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className={`
        absolute top-10 z-50
        ${isUrdu ? "right-0" : "left-0"}
        w-[90vw] md:w-[300px] max-w-[95vw]
        bg-white shadow-xl border rounded-2xl p-6
      `}
    >
      <div className="grid grid-cols-1 gap-8">

        {/* K12 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.k12")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">
            {items.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.link) {
                    navigate(item.link);
                  }
                  onClose();
                }}
                className="flex items-center gap-2 hover:text-primary cursor-pointer"
              >
                <BookOpen size={18} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CoursesMenu;