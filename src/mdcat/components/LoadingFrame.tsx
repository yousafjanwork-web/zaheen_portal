// LoadingFrame.jsx
import { motion } from "framer-motion";

export default function LoadingFrame() {
  return (
    <motion.div
      key="loading-frame"
      className="p-16 text-center bg-white border border-brand-100 rounded-3xl min-h-[400px] flex flex-col items-center justify-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
      <p className="text-xs text-slate-500 font-mono-custom">
        Reading syllabus indices, preparing test engines...
      </p>
    </motion.div>
  );
}