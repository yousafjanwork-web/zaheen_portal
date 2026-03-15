import React, { JSX, useEffect, useState } from "react";
import { BookOpen, Code, BarChart3, Brain } from "lucide-react";
import { t } from "@/i18n";

interface CoursesMenuProps {
  open: boolean;
  onClose: () => void;
}

// Mapping some subjects to icons (fall back to BarChart3)
const iconMap: { [key: string]: JSX.Element } = {
  "Website Development": <Code size={18} />,
  "Auto Cad 2D": <BarChart3 size={18} />,
  "Microsoft Excel": <BarChart3 size={18} />,
  "Video Editing": <BarChart3 size={18} />,
  "Beautify Yourself": <Brain size={18} />
};

interface ProfessionalSubject {
  id: number;
  name: string;
  urdu_name: string;
  thumbnailUrl: string;
}

const CoursesMenu: React.FC<CoursesMenuProps> = ({ open, onClose }) => {
  const [professionalSkills, setProfessionalSkills] = useState<ProfessionalSubject[]>([]);

  useEffect(() => {
    const fetchProfessionalSkills = async () => {
      try {
        const res = await fetch("https://api.zaheen.com.pk/api/get-subjects-with-course-type-id/3");
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
    <div className="absolute left-0 top-10 w-[650px] bg-white shadow-xl border rounded-2xl p-8 z-50">

      <div className="grid grid-cols-2 gap-10">

        {/* K12 Curriculum */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">K-12 Curriculum</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-3 hover:text-primary cursor-pointer">
              <BookOpen size={18} /> <a href={'/grade-view/kg'}>KG Foundation</a>
            </li>
            <li className="flex items-center gap-3 hover:text-primary cursor-pointer" onClick={onClose}>
              <BookOpen size={18} /> <a href={'/grade-view/1-5'}>Grade 1-5</a>
            </li>
            <li className="flex items-center gap-3 hover:text-primary cursor-pointer" onClick={onClose}>
              <BookOpen size={18} /> <a href={'/grade-view/6-8'}>Grade 6-8</a>
            </li>
            <li className="flex items-center gap-3 hover:text-primary cursor-pointer" onClick={onClose}>
              <BookOpen size={18} /> <a href={'/grade-view/9-12'}>Grade 9-12</a>
            </li>
          </ul>
        </div>

        {/* Professional Skills */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Professional Skills</h4>
          <ul className="space-y-3 text-sm text-slate-600">
            {professionalSkills.length > 0 ? (
              professionalSkills.map(skill => (
                <li
                  key={skill.id}
                  onClick={onClose}
                  className="flex items-center gap-3 hover:text-primary cursor-pointer"
                >
                  {iconMap[skill.name] || <BarChart3 size={18} />} {skill.name}
                </li>
              ))
            ) : (
              <li className="text-gray-400">Loading skills...</li>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default CoursesMenu;