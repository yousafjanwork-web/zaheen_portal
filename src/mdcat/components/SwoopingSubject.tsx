import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";
 
interface Subject {
  name: string;
  gradient: string;
  icon: React.ComponentType;
  desc: string;
}
 
export default function SwoopingSubject({ SUBJECTS }: { SUBJECTS: Subject[] }) {
  const [index, setIndex] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SUBJECTS.length);
    }, 2300);
    return () => clearInterval(interval);
  }, []);
 
  const current = SUBJECTS[index];
 
  return (
    <span className="relative inline-grid h-[1.2em] items-center align-bottom">
      {/* Invisible sizer: stacks every subject name in the same grid cell,
          forcing the container to be as wide as the longest one */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap font-black uppercase tracking-tight pr-1">
        {SUBJECTS.reduce((a, b) => (a.name.length > b.name.length ? a : b)).name}
      </span>
 
      <span className="col-start-1 row-start-1 relative h-full w-full overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={current.name}
            initial={{ x: '130%', opacity: 0, rotate: 8 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: '-130%', opacity: 0, rotate: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`absolute left-0 whitespace-nowrap font-black uppercase tracking-tight bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}
          >
            {current.name}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}