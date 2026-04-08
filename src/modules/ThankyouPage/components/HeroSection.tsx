import { motion } from "motion/react";

export default function HeroSection() {
  const avatars = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCl8y6QeZjP9zD_adrq0BZ99lxiuJ5c4ImTBXSFDWwUroVU6Wv0QG4h1j-R4r6H8m0d409W31-xST4p13Tni144_mGdYzTpEHcr6h1Ycie6MwDj7Wnp0XMKYJPgWkjgclQ7ZN4HbpSPg_EuAJYzhLt92pNnz86JDricCicL2NyT6tnPJ-VmbBdrWRAKCkbyZowkXHDx9cAdbRL-sig7umUpgBRDyE2KszlHAjoJhPMpaBQq_8A8BxynXjEeeGkXEEaruCYSaztiCy_z",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAgjbYpcFmbWCmVVRARPr0FuMvJ7oY9oqHAmk3rH2SnN_nYlvzOGR6evYDX4puHxMGD5KPXOulLYeg_FGkO6B-Cx4Zn0Zd6bwkyvpPErNP1CMW3kxmWFmmqYo2Vtr9MbVKmQ-lp5xDwJ6xaQKJSMTQpBxgQTS3bXCulqZPv5HMuetRowluuaIgM3CZsNdu1Naip-n69n_4O4m-sLMcbStsyRRM1cPU8o0LBw70eioNLP3g-Tu6ZEsZozepq6LfP4b0tAcbQyUn06qRZ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD2-Us8XrmZemmSl5qCu_TvatFk8jZYphmmffzyua8b1QDspGJ9ZUZkORZW7wcwAH2qdtmsiIWJHJDCGM0GD_aKiNhNfqlZvm8wuVbo7sYzF4PeQZrrV8uyjbHlP0EUYNK5ad07woeEcPes9yVuncOlYEMWRyIJ1VMsNGqNYh1BndEGz6ypou9wLn3ycMVAQLNo2wiVNUtdswcsVHzgnJWeB8SgjnLgSnDdg-mh2Lg8RXhbFtmJwOZ9aBYCuHbcVBnxkN8FiRL1gRpm"
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/30 rounded-full mb-8 backdrop-blur-md"
      >
        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <img
              key={i}
              className="w-6 h-6 rounded-full border-2 border-surface"
              src={src}
              alt="Student"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-secondary-container">
          Welcome to the 12,000+ strong community.
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface mb-6 tracking-tight"
      >
        Congratulations!<br />
        <span className="text-primary text-shadow-glow">You're In!</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-16 leading-relaxed"
      >
        Your journey towards mastering the arts and sciences begins today at Zaheen. We've unlocked your curriculum and prepared your personal growth path.
      </motion.p>
    </>
  );
}