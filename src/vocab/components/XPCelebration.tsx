import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, X } from 'lucide-react';

interface XPCelebrationProps {
  xp: number;
  reason: string;
  onClose: () => void;
}

export default function XPCelebration({ xp, reason, onClose }: XPCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const emojis = ['🎉', '⭐', '🌟', '💫', '✨', '🎊', '🏆', '💎'];

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          {/* Confetti-like floating emojis */}
          <div className="absolute inset-0 overflow-hidden">
            {emojis.map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  opacity: 0,
                  scale: 0,
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.5, 1, 0.5],
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  rotate: [0, Math.random() * 360],
                }}
                transition={{ duration: 2, delay: i * 0.15 }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          {/* Modal */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            className="pointer-events-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 border-2 border-amber-200 dark:border-amber-600 relative"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="inline-flex"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
                  <Star className="w-10 h-10 text-white fill-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Amazing!</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{reason}</p>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex items-center justify-center gap-2"
              >
                <Sparkles className="w-6 h-6 text-amber-500" />
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                  +{xp} XP
                </span>
                <Sparkles className="w-6 h-6 text-amber-500" />
              </motion.div>

              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="w-3 h-3 rounded-full bg-amber-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
