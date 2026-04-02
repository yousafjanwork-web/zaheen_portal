import { motion } from "motion/react";

const SubjectCard = ({ subject, navigate }: any) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/lectures/${subject.id}`)}
      className="bg-white rounded-2xl p-4 border hover:shadow-lg cursor-pointer"
    >
      <div className="h-32 bg-slate-100 rounded-xl mb-3 overflow-hidden">
        {subject.image && (
          <img
            src={subject.image}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h3 className="font-semibold text-lg">{subject.name}</h3>
    </motion.div>
  );
};

export default SubjectCard;