/**
 * SocialAppDownloadPage.tsx
 * Shown after successful payment.
 * Contains banner image + Get App + Skip buttons.
 */
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=pk.zaheen.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dwebsite";

type Portal = "mdcat" | "issb" | "nat" | "trading" | "uniprep";

const PORTAL_CONFIG: Record<Portal, { label: string; accent: string; redirect: string }> = {
  mdcat:    { label: "MDCAT Prep",  accent: "#38bdf8", redirect: "/mdcat"  },
  issb:     { label: "ISSB Prep",   accent: "#D4FF00", redirect: "/issb/"  },
  nat:      { label: "NAT Prep",    accent: "#00C2FF", redirect: "/nat/"   },
  trading:  { label: "Trading",     accent: "#00e676", redirect: "/skills/how-to-become-a-professional-trader" },
  uniprep:  { label: "Entry Prep",  accent: "#6366f1", redirect: "/uniprep/" },
};

const SocialAppDownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state    = location.state as { portal: Portal } | null;

  const portal = (state?.portal ?? "mdcat") as Portal;
  const config = PORTAL_CONFIG[portal] ?? PORTAL_CONFIG.mdcat;

  const handleSkip = () => {
    if (portal === "issb" || portal === "nat" || portal === "uniprep") {
      window.location.href = config.redirect;
    } else {
      navigate(config.redirect, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl overflow-hidden text-center"
        style={{
          background:     "rgba(15,23,42,0.97)",
          border:         "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow:      "0 32px 64px rgba(0,0,0,0.55)",
        }}>
        <div className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${config.accent}, #2DD4BF)` }} />

        {/* Banner */}
        <img
          src="https://cdn.zaheen.com.pk/images/newbannerzaheen.jpeg"
          alt="Download Zaheen App"
          className="w-full object-cover"
        />

        <div className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            You're all set!
          </p>
          <h1 className="text-2xl text-white font-semibold mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}>
            Get the Zaheen App
          </h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Study on the go. Access all your {config.label} content anytime, anywhere.
          </p>

          {/* Play Store Button */}
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all mb-3"
            style={{
              background: "linear-gradient(135deg,#F0B429,#f59e0b)",
              color:      "#0f172a",
              boxShadow:  "0 4px 16px rgba(240,180,41,0.35)",
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.24.99.19l12.47-11.95L13.27 8.6 3.18 23.76zm17.15-10.95L17.6 11.5l-3.24 3.1 3.24 3.1 2.77-1.56c.79-.45.79-1.68-.04-2.33zM3 .25C2.7.08 2.35.02 2 .07L14.47 12 11.1 8.38 3 .25zm10.27 11.75L3 .25 2 .07 2 23.93l1-.18L13.27 12z"/>
            </svg>
            Download on Google Play
          </a>

          {/* Skip Button */}
          <button onClick={handleSkip}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border:     "1px solid rgba(255,255,255,0.1)",
              color:      "#94a3b8",
            }}>
            Skip for now → Continue to {config.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialAppDownloadPage;