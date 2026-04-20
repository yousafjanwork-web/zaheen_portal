import React, { JSX, useEffect, useState } from "react";
import { BookOpen, Code, BarChart3, Brain } from "lucide-react";
import { t, getLanguage } from "@/modules/shared/i18n";
import { useNavigate } from "react-router-dom";

interface CoursesMenuProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  "Website Development": <Code size={18} />,
  "Auto Cad 2D": <BarChart3 size={18} />,
  "Microsoft Excel": <BarChart3 size={18} />,
  "Video Editing": <BarChart3 size={18} />,
  "Beautify Yourself": <Brain size={18} />,
};

interface ProfessionalSubject {
  id: number;
  name: string;
  urdu_name: string;
  thumbnailUrl: string;
  class_id: number;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ open, onClose }) => {
  const [professionalSkills, setProfessionalSkills] = useState<ProfessionalSubject[]>([]);
  const navigate = useNavigate();

  const isUrdu = getLanguage() === "ur";

  useEffect(() => {
    const fetchProfessionalSkills = async () => {
      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3?ts=${Date.now()}`
        );
        const data = await res.json();
        setProfessionalSkills(data);
      } catch (err) {
        console.error("Failed to fetch professional skills:", err);
      }
    };

    fetchProfessionalSkills();
  }, []);

  if (!open) return null;

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className={`
        absolute top-10 z-50
        ${isUrdu ? "right-0" : "left-0"}
        w-[90vw] md:w-[650px] max-w-[95vw]
        bg-white shadow-xl border rounded-2xl p-6
      `}
    >
      <div className="grid grid-cols-2 gap-8">

        {/* K12 */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.k12")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">

            {[
              { link: "/grade-view/kg", label: t("courses.kg") },
              { link: "/grade-view/1-5", label: t("courses.grade1to5") },
              { link: "/grade-view/6-8", label: t("courses.grade6to8") },
              { link: "/grade-view/9-12", label: t("courses.grade9to12") },
            ].map((item, i) => (
              <li
                key={i}
                onClick={onClose}
                className="flex items-center gap-2 hover:text-primary cursor-pointer"
              >
                <span className="flex-shrink-0">
                  <BookOpen size={18} />
                </span>

                <a href={item.link}>
                  {item.label}
                </a>
              </li>
            ))}

          </ul>
        </div>

        {/* Professional */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">
            {t("courses.professional")}
          </h4>

          <ul className="space-y-3 text-sm text-slate-600"
            dir={isUrdu ? "rtl" : "ltr"}
          >
            {professionalSkills.length > 0 ? (
              professionalSkills.map((skill) => (
                <li
                  key={skill.id}
                  onClick={() => {
                    navigate(`skills/${skill.class_id}`);
                    onClose();
                  }}
                  className={`
    flex items-center hover:text-primary cursor-pointer
    ${isUrdu ? "flex-row-reverse text-right" : ""}
  `}
                >
                  <span className={`${isUrdu ? "mr-2" : "mr-3"} flex-shrink-0`}>
                    {iconMap[skill.name] || <BarChart3 size={18} />}
                  </span>

                  {isUrdu ? skill.urdu_name || skill.name : skill.name}
                </li>
              ))
            ) : (
              <li className="text-gray-400">
                {t("common.loading") || "Loading..."}
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CoursesMenu;