import React from "react";
import { Link } from "react-router-dom";
import { t } from "@/modules/shared/i18n";
import { SKILL_SEGMENTS, SkillSegment } from "@/modules/shared/utils/skillsSegments";

interface SkillsMenuProps {
  open: boolean;
  onClose: () => void;
}

const segments: SkillSegment[] = SKILL_SEGMENTS;

const SkillsMenu: React.FC<SkillsMenuProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[780px] bg-white text-slate-900 shadow-xl border rounded-2xl p-5 z-50">
      <div className="grid grid-cols-3 gap-6">
        {segments.map((segment) => (
          <div key={segment.titleKey}>
            <h4 className="font-semibold text-slate-900 mb-3">
              {t(segment.titleKey)}
            </h4>

            {segment.items.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-600">
                {segment.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="block px-2 py-1.5 rounded-md hover:bg-slate-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">{t("skills.comingSoon")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsMenu;