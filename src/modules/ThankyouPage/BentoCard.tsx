import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface BentoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  delay?: number;
}

export default function BentoCard({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  accentColor,
  delay = 0
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/10 backdrop-blur-xl bg-white/60 relative overflow-hidden group"
    >
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}0D` }} // 0D is ~5% opacity
      />
      <div 
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${iconBg}`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">{title}</h3>
      <p className="text-on-surface-variant font-body leading-relaxed">{description}</p>
    </motion.div>
  );
}
