import React, { useEffect, useRef } from 'react';

const PrepExamPage: React.FC = () => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const bgBlob3Ref = useRef<HTMLDivElement>(null);

  // Generate animated particles on mount
  useEffect(() => {
    const container = particlesContainerRef.current;
    if (!container) return;

    const count = 18;
    const tints = [
      'rgba(29,168,130,0.7)',
      'rgba(201,162,39,0.6)',
      'rgba(59,111,212,0.7)',
      'rgba(255,255,255,0.5)',
    ];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const left = Math.random() * 100;
      const height = 60 + Math.random() * 120;
      const duration = 6 + Math.random() * 10;
      const delay = -(Math.random() * 16);
      const tint = tints[Math.floor(Math.random() * tints.length)];

      p.style.cssText = `
        left: ${left}%;
        height: ${height}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
        background: linear-gradient(to bottom, transparent, ${tint});
      `;
      container.appendChild(p);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Cursor-tracking glow on bg blob 3
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const blob3 = bgBlob3Ref.current;
      if (!blob3) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      blob3.style.transform = `translate(calc(-50% + ${(x - 50) * 0.3}px), calc(-50% + ${(y - 50) * 0.3}px))`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="prep-exam-page">
      <style>{`
        /* ── Scoped reset ── */
        .prep-exam-page,
        .prep-exam-page *,
        .prep-exam-page *::before,
        .prep-exam-page *::after {
          box-sizing: border-box;
        }

        .prep-exam-page h1,
        .prep-exam-page h2,
        .prep-exam-page h3,
        .prep-exam-page h4,
        .prep-exam-page h5,
        .prep-exam-page h6,
        .prep-exam-page p,
        .prep-exam-page ul,
        .prep-exam-page li,
        .prep-exam-page a,
        .prep-exam-page button {
          margin: 0;
          padding: 0;
          font: inherit;
        }

        /* ── Scoped design tokens ── */
        .prep-exam-page {
          --bg: #080c18;
          --surface: #0d1324;
          --border: rgba(255,255,255,0.07);
          --text: #f0eee8;
          --muted: rgba(240,238,232,0.48);
          --mdcat: #1da882;
          --mdcat-glow: rgba(29,168,130,0.22);
          --issb: #c9a227;
          --issb-glow: rgba(201,162,39,0.22);
          --nat: #3b6fd4;
          --nat-glow: rgba(59,111,212,0.22);

          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          color: var(--text);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: clip;
          scrollbar-gutter: stable;
        }

        /* ── Animated background ── */
        .prep-exam-page .bg-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .prep-exam-page .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0;
          animation: prepBlobFloat 18s ease-in-out infinite;
        }
        .prep-exam-page .bg-blob-1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(29,168,130,0.18) 0%, transparent 70%);
          top: -200px; left: -200px;
          animation-delay: 0s;
        }
        .prep-exam-page .bg-blob-2 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(59,111,212,0.16) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation-delay: -6s;
        }
        .prep-exam-page .bg-blob-3 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%);
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -12s;
        }

        @keyframes prepBlobFloat {
          0%   { opacity: 0; transform: translate(0,0) scale(1); }
          10%  { opacity: 1; }
          50%  { transform: translate(40px, -30px) scale(1.08); }
          90%  { opacity: 1; }
          100% { opacity: 0; transform: translate(0,0) scale(1); }
        }

        .prep-exam-page .bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          animation: prepGridPulse 8s ease-in-out infinite;
        }
        @keyframes prepGridPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        .prep-exam-page .particle {
          position: absolute;
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.6));
          animation: prepShoot linear infinite;
          opacity: 0;
        }
        @keyframes prepShoot {
          0%   { opacity: 0; transform: translateY(-20px); }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh); }
        }

        /* ── Layout ── */
        .prep-exam-page .page {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* ── Top bar ── */
        .prep-exam-page .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          opacity: 0;
          animation: prepFadeDown 0.7s cubic-bezier(.2,.8,.2,1) 0.1s forwards;
        }
        @keyframes prepFadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .prep-exam-page .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--muted);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: color 0.3s;
        }
        .prep-exam-page .logo-link:hover { color: var(--text); }
        .prep-exam-page .logo-link .arrow {
          display: inline-flex;
          align-items: center;
          transition: transform 0.3s;
        }
        .prep-exam-page .logo-link:hover .arrow { transform: translateX(-3px); }

        .prep-exam-page .badge {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(240,238,232,0.3);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 5px 14px;
        }

        /* ── Hero ── */
        .prep-exam-page .hero {
          padding: 32px 48px 0;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          opacity: 0;
          animation: prepFadeUp 0.8s cubic-bezier(.2,.8,.2,1) 0.25s forwards;
        }
        @keyframes prepFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .prep-exam-page .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(240,238,232,0.38);
          margin-bottom: 18px;
        }
        .prep-exam-page .eyebrow-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--mdcat);
          animation: prepDotPulse 2s ease-in-out infinite;
        }
        @keyframes prepDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .prep-exam-page .hero h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(38px, 5.5vw, 68px);
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: var(--text);
          max-width: 14ch;
          margin-bottom: 20px;
        }

        .prep-exam-page .hero p {
          font-size: 17px;
          line-height: 1.65;
          color: var(--muted);
          max-width: 44ch;
          font-weight: 400;
        }

        /* ── Cards ── */
        .prep-exam-page .cards-section {
          flex: 1;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          padding: 40px 48px 48px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          align-items: start;
        }

        .prep-exam-page .card-wrap {
          opacity: 0;
          transform: translateY(40px);
          animation: prepCardIn 0.8s cubic-bezier(.2,.8,.2,1) forwards;
        }
        .prep-exam-page .card-wrap:nth-child(1) { animation-delay: 0.45s; }
        .prep-exam-page .card-wrap:nth-child(2) { animation-delay: 0.6s; }
        .prep-exam-page .card-wrap:nth-child(3) { animation-delay: 0.75s; }

        @keyframes prepCardIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .prep-exam-page .card {
          position: relative;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition:
            transform 0.5s cubic-bezier(.2,.8,.2,1),
            box-shadow 0.5s cubic-bezier(.2,.8,.2,1),
            border-color 0.4s ease;
          will-change: transform;
        }

        .prep-exam-page .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--card-glow, rgba(255,255,255,0.06)) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }

        .prep-exam-page .card:hover {
          transform: translateY(-12px) scale(1.015);
          box-shadow:
            0 0 0 1px var(--card-accent),
            0 24px 60px -12px rgba(0,0,0,0.7),
            0 0 80px -20px var(--card-glow);
          border-color: var(--card-accent);
        }
        .prep-exam-page .card:hover::before { opacity: 1; }

        .prep-exam-page .card[data-exam="mdcat"] { --card-accent: var(--mdcat); --card-glow: var(--mdcat-glow); }
        .prep-exam-page .card[data-exam="issb"]  { --card-accent: var(--issb);  --card-glow: var(--issb-glow); }
        .prep-exam-page .card[data-exam="nat"]   { --card-accent: var(--nat);   --card-glow: var(--nat-glow); }

        .prep-exam-page .card-header {
          position: relative;
          padding: 28px 26px 26px;
          z-index: 1;
        }

        .prep-exam-page .card-header::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--card-accent) 0%, transparent 70%);
          opacity: 0.12;
          transition: opacity 0.4s ease;
        }
        .prep-exam-page .card:hover .card-header::after { opacity: 0.2; }

        .prep-exam-page .card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
        }

        .prep-exam-page .card-code {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 38px;
          letter-spacing: -0.02em;
          color: var(--card-accent);
          line-height: 1;
        }

        .prep-exam-page .card-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-accent);
          transition: background 0.3s, transform 0.4s cubic-bezier(.2,.8,.2,1);
        }
        .prep-exam-page .card:hover .card-icon {
          background: var(--card-accent);
          color: #fff;
          transform: rotate(-8deg) scale(1.1);
        }

        .prep-exam-page .card-serial {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.09em;
          color: rgba(240,238,232,0.3);
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        .prep-exam-page .card-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--card-accent) 0%, transparent 80%);
          opacity: 0.25;
          margin: 0 26px;
          transition: opacity 0.4s;
        }
        .prep-exam-page .card:hover .card-divider { opacity: 0.5; }

        .prep-exam-page .card-body {
          padding: 22px 26px 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .prep-exam-page .card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 17px;
          line-height: 1.3;
          color: var(--text);
        }

        .prep-exam-page .card-desc {
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--muted);
          font-weight: 400;
        }

        .prep-exam-page .card-cta {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .prep-exam-page .card-cta-text {
          font-size: 13px;
          font-weight: 600;
          color: rgba(240,238,232,0.55);
          letter-spacing: 0.01em;
          transition: color 0.3s;
        }
        .prep-exam-page .card:hover .card-cta-text { color: var(--card-accent); }

        .prep-exam-page .card-arrow {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(240,238,232,0.4);
          transition:
            background 0.35s,
            border-color 0.35s,
            color 0.35s,
            transform 0.4s cubic-bezier(.2,.8,.2,1);
        }
        .prep-exam-page .card:hover .card-arrow {
          background: var(--card-accent);
          border-color: var(--card-accent);
          color: #fff;
          transform: translateX(4px);
        }

        .prep-exam-page .icon { display: block; }

        .prep-exam-page .card-shimmer {
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
          transition: left 0.7s ease;
          pointer-events: none;
          z-index: 2;
        }
        .prep-exam-page .card:hover .card-shimmer { left: 150%; }

        /* ── Scoped page footer ── */
        .prep-exam-page .prep-footer {
          text-align: center;
          padding: 0 20px 36px;
          font-size: 12px;
          color: rgba(240,238,232,0.2);
          letter-spacing: 0.04em;
          font-weight: 500;
          opacity: 0;
          animation: prepFadeUp 0.6s cubic-bezier(.2,.8,.2,1) 1s forwards;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .prep-exam-page .topbar { padding: 20px 24px; }
          .prep-exam-page .hero { padding: 24px 24px 0; }
          .prep-exam-page .cards-section {
            grid-template-columns: 1fr;
            max-width: 420px;
            padding: 28px 24px 40px;
            gap: 16px;
          }
          .prep-exam-page .hero h1 { font-size: clamp(34px, 8vw, 48px); }
        }

        @media (max-width: 1024px) and (min-width: 861px) {
          .prep-exam-page .topbar { padding: 20px 32px; }
          .prep-exam-page .hero { padding: 28px 32px 0; }
          .prep-exam-page .cards-section { padding: 32px 32px 44px; gap: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .prep-exam-page *,
          .prep-exam-page *::before,
          .prep-exam-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .prep-exam-page .card:hover { transform: none; }
        }
      `}</style>

      {/* Animated background */}
      <div className="bg-canvas">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" ref={bgBlob3Ref} />
        <div className="bg-grid" />
        <div id="particles" ref={particlesContainerRef} />
      </div>

      <div className="page">
        {/* Top bar */}
        <nav className="topbar">
          <span className="badge">PREP EXAM</span>
        </nav>

        {/* Hero */}
        <header className="hero" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Pakistan's top national exams
          </div>
          <h1>Where preparation meets purpose.</h1>
          <p>
            Three national exams, three routes into a career. Choose the exam you're preparing for and
            enter its full preparation pathway.
          </p>
        </header>

        {/* Cards */}
        <main className="cards-section">
          {/* MDCAT */}
          <div className="card-wrap">
            <a className="card" href="https://z.zaheen.com.pk/mdcat" data-exam="mdcat">
              <div className="card-shimmer" />
              <div className="card-header">
                <div className="card-top-row">
                  <div className="card-code">MDCAT</div>
                  <div className="card-icon">
                    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                </div>
                <div className="card-serial">2026 · Medical &amp; Dental</div>
              </div>
              <div className="card-divider" />
              <div className="card-body">
                <div className="card-title">Medical &amp; Dental College Admission Test</div>
                <div className="card-desc">
                  For students applying to MBBS and BDS programs at Pakistan's medical and dental colleges.
                </div>
                <div className="card-cta">
                  <span className="card-cta-text">Enter pathway</span>
                  <span className="card-arrow">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* ISSB */}
          <div className="card-wrap">
            <a className="card" href="https://z.zaheen.com.pk/issb" data-exam="issb" target="_blank" rel="noopener noreferrer">
              <div className="card-shimmer" />
              <div className="card-header">
                <div className="card-top-row">
                  <div className="card-code">ISSB</div>
                  <div className="card-icon">
                    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
                <div className="card-serial">2026 · Army Commission</div>
              </div>
              <div className="card-divider" />
              <div className="card-body">
                <div className="card-title">Inter Services Selection Board</div>
                <div className="card-desc">
                  For candidates on the path to a Pakistan Army commission, from initial screening to the final board.
                </div>
                <div className="card-cta">
                  <span className="card-cta-text">Enter pathway</span>
                  <span className="card-arrow">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* NAT */}
          <div className="card-wrap">
            <a className="card" href="https://z.zaheen.com.pk/nat" data-exam="nat" target="_blank" rel="noopener noreferrer">
              <div className="card-shimmer" />
              <div className="card-header">
                <div className="card-top-row">
                  <div className="card-code">NAT</div>
                  <div className="card-icon">
                    <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                </div>
                <div className="card-serial">2026 · National Aptitude Test</div>
              </div>
              <div className="card-divider" />
              <div className="card-body">
                <div className="card-title">National Aptitude Test</div>
                <div className="card-desc">
                  For candidates preparing for the National Aptitude Test, covering verbal, quantitative, and analytical reasoning.
                </div>
                <div className="card-cta">
                  <span className="card-cta-text">Enter pathway</span>
                  <span className="card-arrow">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </main>

        <footer className="prep-footer">zaheen — prep for what's next</footer>
      </div>
    </div>
  );
};

export default PrepExamPage;