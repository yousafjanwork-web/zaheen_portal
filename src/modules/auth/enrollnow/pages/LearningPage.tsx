import { motion } from 'motion/react';
import { ShieldCheck, Star, Zap, Heart } from 'lucide-react';
const image = "https://cdn.zaheen.com.pk/zaheen-web-img/learning.png";
import { useEffect } from 'react';

export function LearningPage() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txid = params.get("txid");
    const afflid = params.get("affid");
    const pubid = params.get("pubid");

    if (txid) localStorage.setItem("transaction_id", txid);
    if (afflid) localStorage.setItem("afflid", afflid);
    if (pubid) localStorage.setItem("pubid", pubid);
  }, []);

  const handleEnroll = () => {
    const transactionId = localStorage.getItem("transaction_id") || Date.now();
    const afflid = localStorage.getItem("afflid") || "";
    const pubid = localStorage.getItem("pubid") || "";

    window.location.href =
      `http://he.zaheen.com.pk/he?redirect=https://z.zaheen.com.pk/sub_enrollnow` +
      `&transaction_id=${transactionId}` +
      `&affid=${afflid}` +
      `&pubid=${pubid}` +
      `&page_name=enrollnow&service_id=205`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Colorful animated background ── */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-pink-300 to-yellow-200" />

        {/* Floating blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-purple-400 rounded-full opacity-40 blur-3xl animate-pulse" />
        <div className="absolute top-[10%] right-[-60px] w-80 h-80 bg-pink-400 rounded-full opacity-40 blur-3xl animate-pulse delay-300" />
        <div className="absolute bottom-[15%] left-[5%] w-72 h-72 bg-yellow-300 rounded-full opacity-40 blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-[-60px] right-[10%] w-96 h-96 bg-sky-400 rounded-full opacity-30 blur-3xl animate-pulse delay-500" />
        <div className="absolute top-[45%] left-[40%] w-64 h-64 bg-green-300 rounded-full opacity-30 blur-3xl animate-pulse delay-1000" />

        {/* Decorative floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] left-[8%] text-5xl select-none pointer-events-none"
        >⭐</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[12%] right-[12%] text-4xl select-none pointer-events-none"
        >🎨</motion.div>
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] left-[4%] text-4xl select-none pointer-events-none"
        >📚</motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute bottom-[25%] right-[5%] text-5xl select-none pointer-events-none"
        >🚀</motion.div>
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[40%] right-[3%] text-3xl select-none pointer-events-none"
        >🌈</motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[55%] left-[2%] text-3xl select-none pointer-events-none"
        >🎯</motion.div>
      </div>

      {/* ── Page Content ── */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 min-h-screen flex flex-col items-center justify-center text-center relative z-10">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border-2 border-purple-300 text-purple-700 uppercase tracking-[0.2em] font-black text-xs md:text-sm px-5 py-2 rounded-full shadow-md">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            Comprehensive Digital Learning
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 max-w-4xl leading-[1.2] md:leading-[1.1]"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #db2777, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
          }}
        >
          Unlock Your Full Potential with{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Zaheen
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl font-bold text-white max-w-2xl mb-10 md:mb-12 leading-relaxed px-2"
          style={{ textShadow: '0 1px 6px rgba(80,0,120,0.25)' }}
        >
          Your all-in-one platform for school academics, professional growth, and educational fun.
        </motion.p>

        {/* Fun feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { icon: '🎓', label: 'School Academics' },
            { icon: '💼', label: 'Professional Growth' },
            { icon: '🎮', label: 'Educational Fun' },
            { icon: '🤖', label: 'AI Powered' },
          ].map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-2 bg-white/75 backdrop-blur-sm text-purple-800 font-bold text-xs md:text-sm px-4 py-2 rounded-full border-2 border-white shadow-md"
            >
              <span>{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </motion.div>

        {/* Image area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full max-w-4xl rounded-3xl overflow-hidden mb-10 md:mb-16 shadow-2xl border-4 border-white/80"
          style={{ background: 'linear-gradient(135deg, #f3e8ff, #fce7f3, #fef9c3)' }}
        >
         
           <img alt="Zaheen Learning" className="w-full h-auto object-cover block" src={image} referrerPolicy="no-referrer" />

          {/* Decorative corner stars on image */}
          <div className="absolute top-3 left-4 text-2xl pointer-events-none select-none">✨</div>
          <div className="absolute top-3 right-4 text-2xl pointer-events-none select-none">✨</div>
          <div className="absolute bottom-3 left-4 text-2xl pointer-events-none select-none">🌟</div>
          <div className="absolute bottom-3 right-4 text-2xl pointer-events-none select-none">🌟</div>
        </motion.div>

        {/* CTA + T&C */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 md:gap-6 w-full px-4"
        >
          {/* Enroll Button */}
          <button
            onClick={handleEnroll}
            className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-full text-white text-lg md:text-xl font-black hover:scale-105 transition-all duration-300 shadow-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
              backgroundSize: '200% 200%',
            }}
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              <Zap size={20} className="fill-yellow-300 text-yellow-300" />
              Enroll Now
              <Zap size={20} className="fill-yellow-300 text-yellow-300" />
            </span>
            <div className="absolute inset-0 bg-white/10 transition-opacity opacity-0 group-hover:opacity-100 duration-300" />
          </button>

          {/* Price badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-green-300 text-green-700 font-black text-sm md:text-base px-5 py-2.5 rounded-full shadow-md">
            <ShieldCheck size={18} className="text-green-500" />
            Only For Rs. 5+Tax / Week
            <Heart size={16} className="fill-pink-400 text-pink-400" />
          </div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-5 max-w-2xl text-sm text-purple-900 leading-relaxed text-left shadow-md"
          >
            <p className="font-black text-center text-base mb-3 text-purple-700">📋 Terms and Conditions</p>
            <p>This is a mobile content subscription service.</p>
            <p className="mt-1">This service is applicable for Zong users only on those mobile phones which support GPRS settings.</p>
            <p className="mt-1">User will subscribe to Zaheen for <strong>5 + tax PKR/week</strong>.</p>
            <p className="mt-1">User will be given a free subscription for one day, after which the user will be charged on the next day as per the subscription fee.</p>
            <p className="mt-1">Users will be able to access educational content, quizzes, and learning materials available on Zaheen at any time!</p>
            <p className="mt-2">
              To unsubscribe from Zaheen,{' '}
              <a href="https://z.zaheen.com.pk" className="text-blue-600 underline font-bold">Click Here</a>
              {' '}or send <strong>Unsub</strong> to <strong>7323</strong>
            </p>
            <p className="mt-1">For help, email: <strong>support@zaheen.com.pk</strong></p>
            <p className="mt-1">For Complaints Please Call: <strong>03 111 444 974</strong></p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}