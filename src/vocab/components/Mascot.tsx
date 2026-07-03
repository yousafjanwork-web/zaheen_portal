import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speech, SpeechManager } from '../utils/speech';
import { Volume2, VolumeX, X } from 'lucide-react';

interface MascotProps {
  message?: string;
  emotion?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'sleeping';
  autoSpeak?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onDismiss?: () => void;
  showDismiss?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/* ───────── Cute Robot SVG ───────── */
function RobotMascotSVG({ emotion, size = 'md', isSpeaking }: {
  emotion: string;
  size?: string;
  isSpeaking: boolean;
}) {
  const sizes: Record<string, number> = { sm: 64, md: 84, lg: 108 };
  const s = sizes[size] ?? 84;

  /* colour helpers */
  const bodyGrad = 'robotBody';
  // screen glass colour: #0F172A
  const accent = '#22D3EE';     // cyan accent
  const ledGreen = '#4ADE80';
  const ledAmber = '#FBBF24';
  const cheekPink = '#F472B6';

  /* emotion‑mapped eye parameters */
  const eyeMap: Record<string, { scaleY: number; rx: number; ry: number; pupilY: number }> = {
    happy:       { scaleY: 1, rx: 9, ry: 10, pupilY: 42 },
    excited:     { scaleY: 1.15, rx: 10, ry: 11, pupilY: 41 },
    thinking:    { scaleY: 0.85, rx: 9, ry: 9, pupilY: 43 },
    celebrating: { scaleY: 0.65, rx: 10, ry: 7, pupilY: 42 },
    encouraging: { scaleY: 1, rx: 9, ry: 10, pupilY: 42 },
    sleeping:    { scaleY: 0.18, rx: 9, ry: 2, pupilY: 43 },
  };
  const eye = eyeMap[emotion] ?? eyeMap.happy;

  return (
    <svg width={s} height={s} viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={bodyGrad} x1="20" y1="0" x2="100" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="screenGlass" x1="35" y1="24" x2="85" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </radialGradient>
      </defs>

      {/* ── ANTENNA ── */}
      <motion.line
        x1="60" y1="20" x2="60" y2="6"
        stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round"
        animate={isSpeaking ? { x2: [60, 62, 58, 60] } : emotion === 'excited' ? { x2: [60, 63, 57, 60] } : {}}
        transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : 0.6 }}
      />
      <motion.circle
        cx="60" cy="4" r="5"
        fill={isSpeaking ? accent : emotion === 'excited' ? '#F472B6' : '#818CF8'}
        animate={
          isSpeaking
            ? { r: [5, 7, 5], opacity: [1, 0.7, 1] }
            : emotion === 'sleeping'
            ? { opacity: [0.3, 0.5, 0.3] }
            : { opacity: 1 }
        }
        transition={{ repeat: Infinity, duration: isSpeaking ? 0.35 : 2 }}
      />

      {/* ── HEAD / SCREEN BEZEL ── */}
      <rect x="25" y="18" width="70" height="54" rx="16" fill="url(#robotBody)" />
      {/* Inner screen border */}
      <rect x="30" y="23" width="60" height="44" rx="12" fill="url(#screenGlass)" stroke="#4338CA" strokeWidth="1.5" />

      {/* ── FACE SCREEN CONTENT ── */}
      {/* LEFT EYE */}
      <motion.ellipse
        cx="44" cy={eye.pupilY}
        rx={eye.rx} ry={eye.ry}
        fill="url(#eyeGlow)"
        animate={{ scaleY: eye.scaleY }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ transformOrigin: `44px ${eye.pupilY}px` }}
      />
      {/* Left pupil / highlight */}
      <motion.circle
        cx="41" cy="40" r="3"
        fill="white" opacity="0.85"
        animate={emotion === 'thinking' ? { cx: [41, 39, 43, 41] } : {}}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />

      {/* RIGHT EYE */}
      <motion.ellipse
        cx="76" cy={eye.pupilY}
        rx={eye.rx} ry={eye.ry}
        fill="url(#eyeGlow)"
        animate={{ scaleY: eye.scaleY }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ transformOrigin: `76px ${eye.pupilY}px` }}
      />
      <motion.circle
        cx="73" cy="40" r="3"
        fill="white" opacity="0.85"
        animate={emotion === 'thinking' ? { cx: [73, 71, 75, 73] } : {}}
        transition={{ repeat: Infinity, duration: 1.6 }}
      />

      {/* Sleeping ZZZs */}
      {emotion === 'sleeping' && (
        <>
          <motion.text x="86" y="34" fill="#818CF8" fontSize="12" fontWeight="bold" fontFamily="monospace"
            animate={{ y: [34, 18], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          >z</motion.text>
          <motion.text x="94" y="24" fill="#818CF8" fontSize="9" fontWeight="bold" fontFamily="monospace"
            animate={{ y: [24, 10], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, delay: 0.5 }}
          >z</motion.text>
        </>
      )}

      {/* ── MOUTH / SPEAKER GRID ── */}
      {/* Speaker grill (mouth) */}
      <rect x="42" y="54" width="36" height="8" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
      {/* Speaker bars */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.rect
          key={`bar-${i}`}
          x={45 + i * 5.5} y="56"
          width="2.5" rx="1"
          fill={isSpeaking ? '#22D3EE' : '#334155'}
          animate={isSpeaking ? { height: [2, 5 + Math.random() * 3, 2] } : { height: 4 }}
          transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.25, delay: i * 0.06 }}
          style={{ transformOrigin: 'center' }}
        />
      ))}

      {/* Sound rings when speaking */}
      {isSpeaking && (
        <>
          <motion.path
            d="M82 42 Q90 48 82 54"
            stroke="#22D3EE" strokeWidth="1.5" fill="none" strokeLinecap="round"
            animate={{ opacity: [0, 0.6, 0], x: [0, 4, 8] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.path
            d="M86 38 Q96 48 86 58"
            stroke="#22D3EE" strokeWidth="1" fill="none" strokeLinecap="round"
            animate={{ opacity: [0, 0.4, 0], x: [0, 5, 10] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          />
        </>
      )}

      {/* ── CHEEK BLUSH ── */}
      {emotion !== 'sleeping' && (
        <>
          <motion.circle cx="33" cy="50" r="4" fill={cheekPink} opacity="0.35"
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.circle cx="87" cy="50" r="4" fill={cheekPink} opacity="0.35"
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          />
        </>
      )}

      {/* ── HEAD PHONE EARS ── */}
      {/* Left ear / headphone */}
      <rect x="15" y="32" width="10" height="20" rx="5" fill="#312E81" stroke="#6366F1" strokeWidth="1.5" />
      <motion.rect
        x="17" y="35" width="6" height="14" rx="3"
        fill={isSpeaking ? accent : '#4338CA'}
        animate={isSpeaking ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.3 }}
      />
      {/* Right ear / headphone */}
      <rect x="95" y="32" width="10" height="20" rx="5" fill="#312E81" stroke="#6366F1" strokeWidth="1.5" />
      <motion.rect
        x="97" y="35" width="6" height="14" rx="3"
        fill={isSpeaking ? accent : '#4338CA'}
        animate={isSpeaking ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
      />

      {/* ── NECK ── */}
      <rect x="52" y="72" width="16" height="6" rx="2" fill="#4338CA" />

      {/* ── BODY ── */}
      <rect x="30" y="78" width="60" height="34" rx="12" fill="url(#robotBody)" />

      {/* Chest plate / belly */}
      <rect x="40" y="82" width="40" height="26" rx="8" fill="#312E81" />

      {/* Heart / core light */}
      <motion.circle
        cx="60" cy="95" r="8"
        fill={emotion === 'celebrating' ? '#FBBF24' : emotion === 'encouraging' ? '#F472B6' : '#4ADE80'}
        animate={
          isSpeaking
            ? { r: [8, 10, 8], opacity: [0.8, 1, 0.8] }
            : emotion === 'sleeping'
            ? { opacity: [0.3, 0.5, 0.3], r: [8, 7, 8] }
            : { r: [8, 9, 8], opacity: [0.7, 1, 0.7] }
        }
        transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : 1.5 }}
      />
      {/* Core symbol */}
      <text x="55" y="99" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">
        {emotion === 'celebrating' ? '★' : emotion === 'sleeping' ? 'z' : '♥'}
      </text>

      {/* Chest LED indicators */}
      <motion.circle cx="44" cy="86" r="2.5" fill={ledGreen}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
      <motion.circle cx="52" cy="86" r="2.5" fill={ledAmber}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
      />
      <motion.circle cx="68" cy="86" r="2.5" fill={ledAmber}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: 0.6 }}
      />
      <motion.circle cx="76" cy="86" r="2.5" fill={ledGreen}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, delay: 0.9 }}
      />

      {/* Gear icons on belly */}
      <motion.text x="34" y="106" fill="#4F46E5" fontSize="9" opacity="0.4"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        style={{ transformOrigin: '38px 102px' }}
      >⚙</motion.text>
      <motion.text x="76" y="106" fill="#4F46E5" fontSize="9" opacity="0.4"
        animate={{ rotate: [360, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        style={{ transformOrigin: '80px 102px' }}
      >⚙</motion.text>

      {/* ── ARMS ── */}
      {/* Left arm */}
      <motion.g
        style={{ transformOrigin: '30px 84px' }}
        animate={
          isSpeaking
            ? { rotate: [0, -8, 0, -5, 0] }
            : emotion === 'celebrating'
            ? { rotate: [0, -30, 0, -30, 0] }
            : emotion === 'excited'
            ? { rotate: [0, -12, 0] }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: isSpeaking ? 0.5 : emotion === 'celebrating' ? 0.8 : 1,
        }}
      >
        <rect x="12" y="80" width="18" height="8" rx="4" fill="#4338CA" />
        {/* Left hand */}
        <circle cx="12" cy="84" r="5" fill="url(#robotBody)" />
        <circle cx="12" cy="84" r="3" fill="#312E81" />
      </motion.g>

      {/* Right arm */}
      <motion.g
        style={{ transformOrigin: '90px 84px' }}
        animate={
          isSpeaking
            ? { rotate: [0, 8, 0, 5, 0] }
            : emotion === 'celebrating'
            ? { rotate: [0, 30, 0, 30, 0] }
            : emotion === 'excited'
            ? { rotate: [0, 12, 0] }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: isSpeaking ? 0.5 : emotion === 'celebrating' ? 0.8 : 1,
        }}
      >
        <rect x="90" y="80" width="18" height="8" rx="4" fill="#4338CA" />
        <circle cx="108" cy="84" r="5" fill="url(#robotBody)" />
        <circle cx="108" cy="84" r="3" fill="#312E81" />
      </motion.g>

      {/* ── LEGS ── */}
      {/* Left leg */}
      <rect x="42" y="112" width="12" height="10" rx="4" fill="#4338CA" />
      <rect x="38" y="120" width="20" height="7" rx="4" fill="url(#robotBody)" />
      <rect x="40" y="120" width="16" height="3" rx="2" fill="#312E81" />

      {/* Right leg */}
      <rect x="66" y="112" width="12" height="10" rx="4" fill="#4338CA" />
      <rect x="62" y="120" width="20" height="7" rx="4" fill="url(#robotBody)" />
      <rect x="64" y="120" width="16" height="3" rx="2" fill="#312E81" />

      {/* ── CELEBRATION EFFECTS ── */}
      {emotion === 'celebrating' && (
        <>
          <motion.text x="8" y="20" fontSize="11"
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.7 }}
          >⭐</motion.text>
          <motion.text x="102" y="14" fontSize="9"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.55, delay: 0.25 }}
          >✨</motion.text>
          <motion.text x="4" y="50" fontSize="8"
            animate={{ y: [50, 40, 50], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}
          >🎉</motion.text>
          <motion.text x="108" y="55" fontSize="8"
            animate={{ y: [55, 45, 55], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.85, delay: 0.6 }}
          >🎊</motion.text>
        </>
      )}

      {/* Thinking dots */}
      {emotion === 'thinking' && (
        <>
          <motion.circle cx="98" cy="22" r="2.5" fill="#818CF8"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <motion.circle cx="105" cy="18" r="2" fill="#818CF8"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
          />
          <motion.circle cx="110" cy="14" r="1.5" fill="#818CF8"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
          />
        </>
      )}

      {/* Encouraging heart */}
      {emotion === 'encouraging' && (
        <motion.text x="98" y="18" fontSize="12"
          animate={{ scale: [0.9, 1.2, 0.9], y: [18, 14, 18] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >💖</motion.text>
      )}
    </svg>
  );
}

/* ───────── Mascot wrapper ───────── */
export default function Mascot({
  message = '',
  emotion = 'happy',
  autoSpeak = false,
  position = 'bottom-right',
  onDismiss,
  showDismiss = false,
  size = 'md',
}: MascotProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBubble, setShowBubble] = useState(!!message);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isMuted, setIsMuted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setCurrentMessage(message);
    if (message) {
      setShowBubble(true);
      if (autoSpeak && !isMuted) {
        speakMessage(message);
      }
    } else {
      setShowBubble(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const speakMessage = useCallback(async (text: string) => {
    if (isMuted || !SpeechManager.isAvailable()) return;
    setIsSpeaking(true);
    try {
      await speech.speakRobot(text, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  }, [isMuted]);

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      speech.cancel();
      setIsSpeaking(false);
    } else if (currentMessage) {
      speakMessage(currentMessage);
    }
  };

  const handleDismiss = () => {
    speech.cancel();
    setIsDismissed(true);
    onDismiss?.();
  };

  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6',
  };

  const bubblePositionClasses: Record<string, string> = {
    'bottom-right': 'bottom-full right-0 mb-3',
    'bottom-left': 'bottom-full left-0 mb-3',
    'top-right': 'top-full right-0 mt-3',
    'top-left': 'top-full left-0 mt-3',
  };

  if (isDismissed) return null;

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end pointer-events-none`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className={`relative ${bubblePositionClasses[position]} pointer-events-auto max-w-[300px]`}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-indigo-200 dark:border-indigo-700/50 p-3.5">
              {showDismiss && (
                <button
                  onClick={handleDismiss}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}

              <div className="flex items-start gap-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                  {currentMessage}
                </p>
                <button
                  onClick={handleSpeakerClick}
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isSpeaking
                      ? 'bg-indigo-500 text-white animate-pulse'
                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isSpeaking && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        className="w-1 bg-indigo-500 rounded-full"
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-indigo-400 ml-1">Speaking...</span>
                </div>
              )}
            </div>

            {/* Bubble tail */}
            <div className={`absolute -bottom-2 ${position.includes('right') ? 'right-10' : 'left-10'}`}>
              <div className="w-4 h-4 bg-white dark:bg-slate-800 border-b-2 border-r-2 border-indigo-200 dark:border-indigo-700/50 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot Body */}
      <motion.div
        className="pointer-events-auto cursor-pointer relative"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.92 }}
        animate={
          isSpeaking
            ? { y: [0, -4, 0, -2, 0] }
            : emotion === 'celebrating'
            ? { y: [0, -8, 0], rotate: [0, 3, -3, 0] }
            : emotion === 'sleeping'
            ? { rotate: [0, -2, 0, 2, 0] }
            : {}
        }
        transition={{
          repeat: isSpeaking || emotion === 'celebrating' || emotion === 'sleeping' ? Infinity : 0,
          duration: isSpeaking ? 0.6 : emotion === 'celebrating' ? 1.2 : 2.5,
        }}
        onClick={() => {
          if (currentMessage && !isSpeaking) speakMessage(currentMessage);
        }}
      >
        {/* Glow effect when speaking */}
        {isSpeaking && (
          <motion.div
            className="absolute inset-0 -m-4 rounded-full bg-indigo-400/25 blur-xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* Idle floating shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 dark:bg-black/30 rounded-full blur-sm"
          animate={
            isSpeaking || emotion === 'celebrating'
              ? { scaleX: [1, 0.8, 1], opacity: [0.15, 0.1, 0.15] }
              : { scaleX: 1, opacity: 0.15 }
          }
          transition={{ repeat: Infinity, duration: 1.2 }}
        />

        <RobotMascotSVG emotion={emotion} size={size} isSpeaking={isSpeaking} />

        {/* Mute toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
            if (!isMuted) {
              speech.cancel();
              setIsSpeaking(false);
            }
          }}
          className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md transition-colors ${
            isMuted ? 'bg-red-400' : 'bg-emerald-400'
          }`}
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </button>
      </motion.div>
    </motion.div>
  );
}
