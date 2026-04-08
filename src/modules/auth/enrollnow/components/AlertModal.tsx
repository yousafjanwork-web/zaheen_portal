import { motion } from "motion/react";

export default function AlertModal({ alert }: any) {
  if (!alert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        className={`px-8 py-5 rounded-2xl shadow-2xl text-white text-lg font-semibold max-w-sm w-full text-center
        ${alert.type === "success" ? "bg-green-600" : "bg-red-500"}`}
      >
        {alert.message}
      </div>
    </motion.div>
  );
}