import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { speech, SpeechManager } from '../utils/speech';
import { Volume2, VolumeX } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  type?: 'word' | 'definition' | 'example' | 'sentence' | 'generic';
  word?: string;
  pronunciation?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  autoColor?: boolean;
}

export default function SpeakButton({
  text,
  type = 'generic',
  word,
  pronunciation,
  size = 'sm',
  className = '',
  label,
  autoColor = true,
}: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isSpeaking) {
      speech.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!SpeechManager.isAvailable()) return;

    setIsSpeaking(true);
    try {
      switch (type) {
        case 'word':
          await speech.speakWord(word || text, pronunciation || '');
          break;
        case 'definition':
          await speech.speakDefinition(word || '', text);
          break;
        case 'example':
          await speech.speakExample(text);
          break;
        case 'sentence':
          await speech.speak(text, { rate: 0.85, pitch: 1.1 });
          break;
        default:
          await speech.speak(text, { rate: 0.85, pitch: 1.2 });
      }
    } catch {
      // Speech error - silently fail
    }
    setIsSpeaking(false);
  }, [text, type, word, pronunciation, isSpeaking]);

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const colorClasses = autoColor ? (
    isSpeaking
      ? 'bg-violet-500 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30'
      : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/40'
  ) : '';

  return (
    <motion.button
      onClick={handleSpeak}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isSpeaking ? {
        scale: [1, 1.15, 1],
      } : {}}
      transition={{
        repeat: isSpeaking ? Infinity : 0,
        duration: 0.6,
      }}
      className={`
        inline-flex items-center justify-center rounded-xl
        transition-all duration-200 flex-shrink-0
        ${sizes[size]} ${colorClasses} ${className}
      `}
      title={label || (isSpeaking ? 'Stop speaking' : 'Listen')}
    >
      {isSpeaking ? (
        <div className="flex items-center gap-0.5">
          <VolumeX className={iconSizes[size]} />
        </div>
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}

      {/* Sound wave animation when speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-violet-400"
          animate={{ scale: [1, 1.3, 1.5], opacity: [0.5, 0.2, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.button>
  );
}
