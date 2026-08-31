import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import image from '../../../../assets/images/mdcat prep.png';
import zaheenLogo from '../../../../assets/logo/ZaheenLogo.png';

const features = [
  { icon: '🧠', title: 'AI-Powered Practice', desc: 'Smart MCQs & Explanations' },
  { icon: '⚡', title: 'Personalized Study Plan', desc: 'AI recommends what you need' },
  { icon: '⭐', title: 'Real Exam Simulation', desc: 'Full-length tests like real MDCAT' },
  { icon: '📊', title: 'Performance Analytics', desc: 'Track progress & improve fast' },
];

const tncItems = [
  'This is a mobile content subscription service.',
  'This service is applicable for Zong users only on those mobile phones which support GPRS settings.',
  'User will subscribe to Zaheen for 5 + tax PKR/week.',
  'User will be given a free subscription for one day, after which the user will be charged on the next day as per the subscription fee. Users will be able to access educational content, quizzes, and learning materials available on Zaheen at any time!',
];

export function MdcatEnrollmentLandingPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const txid = params.get('txid');
    const afflid = params.get('affid');
    const pubid = params.get('pubid');
    if (txid) localStorage.setItem('transaction_id', txid);
    if (afflid) localStorage.setItem('afflid', afflid);
    if (pubid) localStorage.setItem('pubid', pubid);
  }, []);

  const handleEnroll = () => {
    const transactionId = localStorage.getItem('transaction_id') || Date.now();
    const afflid = localStorage.getItem('afflid') || '';
    const pubid = localStorage.getItem('pubid') || '';
    window.location.href =
      `http://he.zaheen.com.pk/he?redirect=https://z.zaheen.com.pk/sub_enrollnow` +
      `&transaction_id=${transactionId}` +
      `&affid=${afflid}` +
      `&pubid=${pubid}` +
      `&page_name=enrollnow&service_id=205`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap');

        .mdcat-wrapper {
          width: 100%;
          max-width: 480px;
          min-height: 100vh;
          margin: 20px auto 0;
          background: #ffffff;
          overflow-x: hidden;
          font-family: 'Open Sans', sans-serif;
        }

        /* NAV */
        .mdcat-nav {
          background: #ffffff;
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .mdcat-ai-badge {
          font-family: 'Montserrat', sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          color: #2e7d32;
          border: 1.5px solid #2e7d32;
          border-radius: 100px;
          padding: 3px 9px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* HERO */
        .mdcat-hero {
          position: relative;
          background: #e8edf2;
        }

        .mdcat-hero-img {
          width: 100%;
          display: block;
          object-fit: cover;
          object-position: center top;
        }

        /* CONTENT */
        .mdcat-content {
          padding: 20px 22px 0;
        }

        .mdcat-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 900;
          color: #1565c0;
          text-align: center;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .mdcat-subtitle {
          font-size: 13px;
          color: #475569;
          text-align: center;
          line-height: 1.55;
          margin-bottom: 20px;
        }

        /* CTA BUTTON */
        .mdcat-cta-wrap { padding: 0 22px 4px; }

        .mdcat-btn {
          width: 100%;
          padding: 16px 24px;
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          background: linear-gradient(135deg, #1565c0 0%, #1e88e5 45%, #2e7d32 100%);
          background-size: 200% 200%;
          animation: mdcatGradient 4s ease infinite;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 24px rgba(30,136,229,0.4), 0 2px 6px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
        }

        .mdcat-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transition: left 0.5s ease;
        }

        .mdcat-btn:hover::before { left: 100%; }
        .mdcat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(30,136,229,0.5);
        }
        .mdcat-btn:active { transform: translateY(0); }

        @keyframes mdcatGradient {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        /* PRICE BADGE */
        .mdcat-price-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 0 2px;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }

        /* FEATURES GRID */
        .mdcat-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 16px 22px 20px;
        }

        .mdcat-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 12px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .mdcat-feature-card:hover {
          border-color: #1565c0;
          box-shadow: 0 2px 12px rgba(21,101,192,0.1);
        }

        .mdcat-chip-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #2e7d32;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .mdcat-chip-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 800;
          color: #1a2332;
          line-height: 1.25;
        }

        .mdcat-chip-desc {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
          margin-top: 2px;
        }

        /* SLOGAN BAR */
        .mdcat-slogan {
          background: linear-gradient(90deg, #1565c0, #2e7d32);
          padding: 13px 24px;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .mdcat-slogan .accent { color: #a5d6a7; }

        /* T&C */
        .mdcat-footer { padding: 0 22px 32px; }

        .mdcat-tnc {
          background: #f8fafc;
          border: 1px solid #e8edf2;
          border-radius: 16px;
          padding: 20px;
          margin-top: 16px;
        }

        .mdcat-tnc-price {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #1565c0;
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .mdcat-tnc-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: #1a2332;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .mdcat-tnc-list { list-style: none; padding: 0; }

        .mdcat-tnc-list li {
          font-size: 11.5px;
          line-height: 1.7;
          color: #64748b;
          margin-bottom: 6px;
          padding-left: 14px;
          position: relative;
        }

        .mdcat-tnc-list li::before {
          content: '';
          position: absolute;
          left: 0; top: 8px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #94a3b8;
        }

        .mdcat-tnc-list a {
          color: #1565c0;
          text-decoration: none;
          font-weight: 700;
        }

        .mdcat-tnc-list a:hover { text-decoration: underline; }

        .mdcat-bottom {
          text-align: center;
          padding: 10px 24px 24px;
          font-size: 11px;
          color: #94a3b8;
        }
      `}</style>

      <div className="mdcat-wrapper">

        {/* NAV */}
        <nav className="mdcat-nav">
          <img
            src={zaheenLogo}
            alt="Zaheen Logo"
            style={{ height: '38px', width: 'auto', display: 'block' }}
          />
          <div className="mdcat-ai-badge">The Real AI Enabler</div>
        </nav>

        {/* HERO */}
        <motion.div
          className="mdcat-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={image}
            alt="MDCAT Prep — AI, Meri Taiyaari"
            className="mdcat-hero-img"
          />
        </motion.div>

        {/* TAGLINE + SUBTITLE */}
        <motion.div
          className="mdcat-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mdcat-tagline">Smart Prep. Strong Future.</div>
          <p className="mdcat-subtitle">
            AI Tools se MDCAT easy, Success sure! — AI-powered practice,
            personalized study plans &amp; real exam simulation.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mdcat-cta-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className="mdcat-btn" onClick={handleEnroll}>
            Join Now
          </button>
          <div className="mdcat-price-row">
            <ShieldCheck size={16} color="#2e7d32" />
            <span>Only For Rs. 5+Tax / Week</span>
          </div>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div
          className="mdcat-features"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {features.map((f) => (
            <div key={f.title} className="mdcat-feature-card">
              <div className="mdcat-chip-icon">{f.icon}</div>
              <div>
                <div className="mdcat-chip-title">{f.title}</div>
                <div className="mdcat-chip-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* SLOGAN BAR */}
        <div className="mdcat-slogan">
          Smart Prep. <span className="accent">Strong Future.</span>
        </div>

        {/* TERMS & CONDITIONS */}
        <footer className="mdcat-footer">
          <section className="mdcat-tnc">
            <div className="mdcat-tnc-price">Only For Rs. 5+Tax / Week</div>
            <h2 className="mdcat-tnc-title">Terms and Conditions</h2>
            <ul className="mdcat-tnc-list">
              {tncItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              <li>
                To unsubscribe from Zaheen,{' '}
                <a href="#">Click Here</a> or send <strong>Unsub</strong> to{' '}
                <strong>7323</strong>.
              </li>
              <li>
                For help:{' '}
                <a href="mailto:support@zaheen.com.pk">support@zaheen.com.pk</a>
              </li>
              <li>
                For Complaints:{' '}
                <a href="tel:03111444974">03 111 444 974</a>
              </li>
            </ul>
          </section>
        </footer>

        <div className="mdcat-bottom">© 2025 Zaheen. All rights reserved.</div>
      </div>
    </>
  );
}