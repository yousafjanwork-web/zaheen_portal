import { motion } from "motion/react";

const GradeCard = ({ grade, navigate, type }: any) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() =>
        navigate(`/class/${grade.id}`, {
          state: { gradeType: type },
        })
      }
      className="bg-white rounded-3xl p-5 border border-slate-200 hover:shadow-xl cursor-pointer"
    >
      <div className="h-30 rounded-2xl overflow-hidden mb-4 relative">
        <img
          src={grade.image}
          className={`w-full h-full ${
            grade.id <= 6 ? "object-contain bg-slate-50 p-2" : "object-cover"
          }`}
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