import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";

interface Subject {
  name: string;
  gradient: string;
  icon: React.ComponentType;
  desc: string;
}

export default function SwoopingSubject({SUBJECTS}:{SUBJECTS:Subject[]}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SUBJECTS.length);
    }, 2300); // ~0.4s swoop in + 0.5s hold + ~0.4s swoop out
    return () => clearInterval(interval);
  }, []);

  const current = SUBJECTS[index];

  

  return (
<span className="relative inline-flex h-[1.2em] w-[220px] xs:w-[280px] sm:w-[390px] md:w-[493px] items-center overflow-hidden align-bottom">      <AnimatePresence mode="popLayout">
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
  );
}
