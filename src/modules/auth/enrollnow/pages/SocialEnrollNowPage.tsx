import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

const image = "https://cdn.zaheen.com.pk/images/enrollnow-social-1.png";

export function SocialEnrollmentLandingPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txid  = params.get("txid");
    const affid = params.get("affid");
    const pubid = params.get("pubid");
    if (txid)  localStorage.setItem("transaction_id", txid);
    if (affid) localStorage.setItem("afflid", affid);
    if (pubid) localStorage.setItem("pubid", pubid);
  }, []);

  const handleEnroll = () => {
    const transactionId = localStorage.getItem("transaction_id") || Date.now();
    const afflid = localStorage.getItem("afflid") || "";
    const pubid  = localStorage.getItem("pubid")  || "";
    window.location.href =
      `http://he.zaheen.com.pk/he?redirect=https://z.zaheen.com.pk/sub_enrollnow` +
      `&transaction_id=${transactionId}` +
      `&affid=${afflid}` +
      `&pubid=${pubid}` +
      `&page_name=enrollnow-social&service_id=205`;
  };

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes auroraShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbPulse1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.55; }
          33%       { transform: translate(40px, -30px) scale(1.08); opacity: 0.7; }
          66%       { transform: translate(-20px, 20px) scale(0.95); opacity: 0.45; }
        }
        @keyframes orbPulse2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.5; }
          33%       { transform: translate(-35px, 25px) scale(1.1); opacity: 0.65; }
          66%       { transform: translate(25px, -15px) scale(0.92); opacity: 0.4; }
        }
        @keyframes orbPulse3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50%       { transform: translate(-50%, -50%) scale(1.15); opacity: 0.45; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }
        @keyframes gridScroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(28px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes btnGlow {
          0%, 100% { box-shadow: 0 6px 36px rgba(124,58,237,0.5), 0 0 0 0 rgba(124,58,237,0.2); }
          50%       { box-shadow: 0 6px 50px rgba(124,58,237,0.75), 0 0 0 8px rgba(124,58,237,0); }
        }
        @keyframes pillFade {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sep-bg-aurora, .sep-orb, .sep-particle,
          .sep-grid-inner, .sep-btn, .sep-pill { animation: none !important; }
        }

        /* ── Background layers ── */
        .sep-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: #060818;
          overflow: hidden;
        }

        /* Aurora animated gradient */
        .sep-bg-aurora {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 180deg at 50% 50%,
            #0d0221 0deg,
            #1a0545 60deg,
            #0c1a6b 120deg,
            #0a3d8f 160deg,
            #0f2d6b 200deg,
            #1c0555 260deg,
            #2d0b6b 310deg,
            #0d0221 360deg
          );
          animation: auroraShift 18s ease infinite;
          background-size: 300% 300%;
          opacity: 0.9;
        }

        /* Radial vignette to darken edges */
        .sep-bg-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 70% at 50% 40%,
            transparent 0%,
            rgba(4,4,20,0.5) 60%,
            rgba(4,4,20,0.95) 100%
          );
        }

        /* Scrolling dot grid */
        .sep-grid {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .sep-grid-inner {
          position: absolute;
          inset: -28px 0 0 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: gridScroll 4s linear infinite;
        }

        /* Scanline sweep */
        .sep-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.15), rgba(96,165,250,0.2), rgba(139,92,246,0.15), transparent);
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }

        /* Glow orbs */
        .sep-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform, opacity;
        }
        .sep-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(124,58,237,0.65) 0%, rgba(79,70,229,0.3) 50%, transparent 70%);
          top: -200px; left: -160px;
          animation: orbPulse1 16s ease-in-out infinite;
        }
        .sep-orb-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(37,99,235,0.55) 0%, rgba(14,165,233,0.3) 50%, transparent 70%);
          bottom: -80px; right: -120px;
          animation: orbPulse2 19s ease-in-out infinite;
        }
        .sep-orb-3 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(16,185,129,0.2) 50%, transparent 70%);
          top: 50%; left: 55%;
          animation: orbPulse3 22s ease-in-out infinite;
        }
        .sep-orb-4 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(244,114,182,0.35) 0%, transparent 70%);
          top: 15%; right: 8%;
          animation: orbPulse1 25s ease-in-out infinite reverse;
          filter: blur(60px);
        }

        /* Floating particles */
        .sep-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          animation: particleDrift linear infinite;
        }
        .sep-p1  { width:2px;height:2px; left:12%; bottom:10%; animation-duration:7s;  animation-delay:0s; }
        .sep-p2  { width:3px;height:3px; left:25%; bottom:5%;  animation-duration:9s;  animation-delay:1.5s; }
        .sep-p3  { width:2px;height:2px; left:40%; bottom:8%;  animation-duration:11s; animation-delay:0.8s; }
        .sep-p4  { width:2px;height:2px; left:55%; bottom:3%;  animation-duration:8s;  animation-delay:3s; }
        .sep-p5  { width:3px;height:3px; left:68%; bottom:12%; animation-duration:13s; animation-delay:0.3s; }
        .sep-p6  { width:2px;height:2px; left:80%; bottom:6%;  animation-duration:10s; animation-delay:2.2s; }
        .sep-p7  { width:2px;height:2px; left:88%; bottom:9%;  animation-duration:6s;  animation-delay:4s; }
        .sep-p8  { width:3px;height:3px; left:5%;  bottom:20%; animation-duration:14s; animation-delay:1s; }
        .sep-p9  { width:2px;height:2px; left:93%; bottom:15%; animation-duration:12s; animation-delay:2.7s; }
        .sep-p10 { width:2px;height:2px; left:47%; bottom:18%; animation-duration:9s;  animation-delay:5s; }

        /* ── Content wrapper ── */
        .sep-root {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3.5rem 1.25rem 2.5rem;
          color: #fff;
        }

        /* ── Pill ── */
        .sep-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c4b5fd;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.3);
          padding: 0.4em 1.25em;
          border-radius: 999px;
          margin-bottom: 1.75rem;
          backdrop-filter: blur(8px);
          animation: pillFade 3s ease-in-out infinite;
        }
        .sep-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 8px #a78bfa, 0 0 16px rgba(167,139,250,0.5);
          flex-shrink: 0;
        }

        /* ── Headline ── */
        .sep-h1 {
          font-size: clamp(2rem, 6vw, 4.75rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.025em;
          max-width: 860px;
          margin-bottom: 1.5rem;
          color: #f0f4ff;
        }
        .sep-h1-accent {
          display: inline-block;
          background: linear-gradient(100deg, #a78bfa 0%, #60a5fa 45%, #34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
          font-style: italic;
        }

        /* ── Subheading ── */
        .sep-sub {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.5);
          max-width: 500px;
          line-height: 1.7;
          margin-bottom: 2.75rem;
        }

        /* ── Hero image ── */
        .sep-img-wrap {
          width: 100%;
          max-width: 880px;
          border-radius: 1.5rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(139,92,246,0.2);
          box-shadow:
            0 0 0 1px rgba(96,165,250,0.1),
            0 50px 120px rgba(0,0,0,0.65),
            0 0 100px rgba(124,58,237,0.15),
            0 0 40px rgba(14,165,233,0.1);
          background: rgba(255,255,255,0.02);
          position: relative;
        }
        .sep-img-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(180deg, rgba(124,58,237,0.06) 0%, transparent 40%);
          pointer-events: none;
          z-index: 1;
        }
        .sep-img-wrap img {
          width: 100%;
          height: auto;
          display: block;
          position: relative;
          z-index: 0;
        }

        /* ── CTA Button ── */
        .sep-btn {
          position: relative;
          overflow: hidden;
          padding: 1.1rem 3.5rem;
          border-radius: 999px;
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          border: none;
          cursor: pointer;
          background: linear-gradient(130deg, #7c3aed 0%, #2563eb 55%, #0ea5e9 100%);
          animation: btnGlow 3s ease-in-out infinite;
          transition: transform 0.2s ease;
          width: 100%;
          max-width: 340px;
          margin-bottom: 1.1rem;
          letter-spacing: 0.02em;
        }
        .sep-btn:hover  { transform: translateY(-3px) scale(1.03); }
        .sep-btn:active { transform: scale(0.97); }
        /* Shine sweep */
        .sep-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .sep-btn:hover::after { transform: translateX(100%); }
        /* Top highlight line */
        .sep-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          border-radius: 999px;
        }
        @media (min-width: 480px) {
          .sep-btn { width: auto; }
        }

        /* ── Price ── */
        .sep-price {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.92rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          margin-bottom: 2rem;
        }
        .sep-price-icon { color: #34d399; }

        /* ── T&C ── */
        .sep-tnc {
          font-size: 0.78rem;
          line-height: 1.9;
          color: rgba(255,255,255,0.28);
          max-width: 580px;
        }
        .sep-tnc b   { color: rgba(255,255,255,0.48); }
        .sep-tnc a   { color: #818cf8; text-underline-offset: 3px; }
        .sep-tnc a:hover { color: #c4b5fd; }
      `}</style>

      {/* ── Animated Background ── */}
      <div className="sep-bg" aria-hidden="true">
        <div className="sep-bg-aurora" />
        <div className="sep-bg-vignette" />
        <div className="sep-grid">
          <div className="sep-grid-inner" />
        </div>
        <div className="sep-scanline" />
        <div className="sep-orb sep-orb-1" />
        <div className="sep-orb sep-orb-2" />
        <div className="sep-orb sep-orb-3" />
        <div className="sep-orb sep-orb-4" />
        {/* Floating particles */}
        <div className="sep-particle sep-p1" />
        <div className="sep-particle sep-p2" />
        <div className="sep-particle sep-p3" />
        <div className="sep-particle sep-p4" />
        <div className="sep-particle sep-p5" />
        <div className="sep-particle sep-p6" />
        <div className="sep-particle sep-p7" />
        <div className="sep-particle sep-p8" />
        <div className="sep-particle sep-p9" />
        <div className="sep-particle sep-p10" />
      </div>

      {/* ── Content ── */}
      <div className="sep-root">



        <motion.div
          className="sep-img-wrap"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={image}
            alt="Zaheen Learning Dashboard"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.button
          className="sep-btn"
          onClick={handleEnroll}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.45 }}
        >
          Enroll Now
        </motion.button>

        <motion.div
          className="sep-price"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.46 }}
        >
          <ShieldCheck size={17} className="sep-price-icon" />
          <span>Only Rs. 5 + Tax / Day</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#34d399',
            marginTop: '-0.5rem',
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
          }}
        >
          🎁 Get One Day Free Trial
        </motion.p>

        <motion.p
          className="sep-tnc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.54 }}
        >
          <b>Terms and Conditions</b><br />
          This is a mobile content subscription service.<br />
          Applicable for Zong users only on mobile phones supporting GPRS settings.<br />
          Subscription: Rs. 5 + tax / week. One free day, then charged from day two.<br />
          Access educational content, quizzes, and learning materials anytime.<br />
          To unsubscribe: <a href="https://z.zaheen.com.pk">Click Here</a> or send <b>Unsub</b> to <b>7323</b><br />
          Support: support@zaheen.com.pk &nbsp;|&nbsp; Complaints: 03 111 444 974
        </motion.p>

      </div>
    </>
  );
}