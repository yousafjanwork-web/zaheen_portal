import { motion } from "motion/react";
import { classSlugFromId } from "@/config/classSlugs";


const GradeCard = ({ grade, navigate, type }: any) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
    onClick={() => {
        // Yeh direct usey usi class ke slug par bhejega jo clicked hai
        navigate(`/${classSlugFromId(grade.id)}`, {
          state: { gradeType: type === "k-12" ? undefined : type }, // k-12 ke waqt undefined bhejenge taake router khud check kare
        });
      }}
      className="bg-white rounded-3xl p-5 border border-slate-200 hover:shadow-xl cursor-pointer"
    >
    <div className="h-52 sm:h-44 rounded-2xl overflow-hidden mb-4 relative">
       <img
  src={grade.image}
  className="w-full h-full object-cover"
  alt={grade.title}
/>
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary border">
          {grade.lessons}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-1">{grade.title}</h3>
      <p className="text-sm text-slate-500 mb-4">{grade.description}</p>

      <div className="flex flex-wrap gap-2 text-xs">
        {grade.subjects.map((s: string, i: number) => (
          <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg">
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default GradeCard;