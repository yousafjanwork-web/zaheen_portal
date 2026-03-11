import React from "react";
import { BookOpen, Code, BarChart3, Brain } from "lucide-react";

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
            K-12 Curriculum
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">


            <li


              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >


              <BookOpen size={18} />  <a href={'/grade-view/kg'}>KG Foundation
              </a>
            </li>


            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18} />  <a href={'/grade-view/1-5'}>Grade 1-5</a>
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18} /> <a href={'/grade-view/6-8'}> Grade 6-8</a>
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BookOpen size={18} />  <a href={'/grade-view/9-12'}>Grade 9-12</a>
            </li>

          </ul>

        </div>

        {/* Professional Courses */}
        <div>

          <h4 className="font-semibold text-slate-900 mb-4">
            Professional Skills
          </h4>

          <ul className="space-y-3 text-sm text-slate-600">

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BarChart3 size={18} /> Digital Marketing
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <BarChart3 size={18} /> Trading & Finance
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <Code size={18} /> Web Development
            </li>

            <li
              onClick={onClose}
              className="flex items-center gap-3 hover:text-primary cursor-pointer"
            >
              <Brain size={18} /> AI & Automation
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
};

export default CoursesMenu;