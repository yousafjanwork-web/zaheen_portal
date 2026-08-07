import React, { useState } from "react";
import { t } from "@/modules/shared/i18n";

const privacySections = [
  { key: "collect",    num: "01", titleKey: "privacy.collectTitle",    textKey: "privacy.collectText",    icon: "📋" },
  { key: "use",        num: "02", titleKey: "privacy.useTitle",        textKey: "privacy.useText",        icon: "⚙️" },
  { key: "zong",       num: "03", titleKey: "privacy.zongTitle",       textKey: "privacy.zongText",       icon: "📶" },
  { key: "cookies",    num: "04", titleKey: "privacy.cookiesTitle",    textKey: "privacy.cookiesText",    icon: "🍪" },
  { key: "sharing",    num: "05", titleKey: "privacy.sharingTitle",    textKey: "privacy.sharingText",    icon: "🤝" },
  { key: "security",   num: "06", titleKey: "privacy.securityTitle",   textKey: "privacy.securityText",   icon: "🔒" },
  { key: "retention",  num: "07", titleKey: "privacy.retentionTitle",  textKey: "privacy.retentionText",  icon: "🗄️" },
  { key: "rights",     num: "08", titleKey: "privacy.rightsTitle",     textKey: "privacy.rightsText",     icon: "⚖️" },
  { key: "children",   num: "09", titleKey: "privacy.childrenTitle",   textKey: "privacy.childrenText",   icon: "👦" },
  { key: "thirdParty", num: "10", titleKey: "privacy.thirdPartyTitle", textKey: "privacy.thirdPartyText", icon: "🔗" },
  { key: "updates",    num: "11", titleKey: "privacy.updatesTitle",    textKey: "privacy.updatesText",    icon: "🔄" },
];

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FA", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0F1B2D 0%, #1A3152 60%, #0F1B2D 100%)",
        padding: "72px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "rgba(59,130,246,0.08)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "rgba(245,166,35,0.07)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)",
            borderRadius: 24, padding: "6px 16px", marginBottom: 28,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6" }} />
            <span style={{ color: "#93C5FD", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
              Legal Document
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
            color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 20px",
          }}>
            {t("privacy.title")}
          </h1>

          <p style={{ color: "#94A3B8", fontSize: 17, lineHeight: 1.7, maxWidth: 620, margin: "0 0 36px" }}>
            {t("privacy.intro")}
          </p>

          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
            {[
              { icon: "🔒", label: "Your Data is Safe" },
              { icon: "🇵🇰", label: "Governed by Pakistani Law" },
              { icon: "📶", label: "Zong Partnership" },
            ].map((pill) => (
              <div key={pill.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: "8px 16px",
              }}>
                <span style={{ fontSize: 14 }}>{pill.icon}</span>
                <span style={{ color: "#CBD5E1", fontSize: 13, fontWeight: 500 }}>{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── SECURITY HIGHLIGHT CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
          borderRadius: 20, padding: "36px 40px", marginBottom: 40,
          boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />
          <p style={{ color: "#BFDBFE", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>
           {t("privacy.securityTitle")}
          </p>
          <h3 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {t("privacy.securityTitle")}
          </h3>
          <p style={{ color: "#BFDBFE", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            {t("privacy.securityText")}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
            {[
              { label: "Encrypted Data",   icon: "🔐" },
              { label: "Secure Servers",   icon: "🛡️" },
              { label: "Zong Verified",    icon: "✅" },
            ].map((item) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.12)", borderRadius: 12,
                padding: "12px 20px", border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHILDREN SAFETY CARD ── */}
        <div style={{
          background: "#FFFFFF", borderRadius: 20, padding: "36px 40px", marginBottom: 40,
          boxShadow: "0 2px 16px rgba(15,27,45,0.08)",
          borderLeft: "5px solid #F5A623",
        }}>
          <p style={{ color: "#D97706", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>
             {t("privacy.childrenTitle")}
          </p>
          <h3 style={{ color: "#0F1B2D", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            {t("privacy.childrenTitle")}
          </h3>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.75 }}>
            {t("privacy.childrenText")}
          </p>
        </div>

        {/* ── ACCORDION SECTIONS ── */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {privacySections.map((sec) => {
            const isOpen = activeSection === sec.key;
            return (
              <div
                key={sec.key}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: isOpen
                    ? "0 4px 24px rgba(15,27,45,0.12)"
                    : "0 1px 6px rgba(15,27,45,0.06)",
                  border: isOpen ? "1px solid #DBEAFE" : "1px solid #E9EEF6",
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  onClick={() => setActiveSection(isOpen ? null : sec.key)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 20,
                    padding: "22px 32px", textAlign: "left" as const,
                  }}
                >
                  {/* Icon badge */}
                  <span style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 12,
                    background: isOpen ? "#EFF6FF" : "#F8FAFC",
                    border: isOpen ? "2px solid #BFDBFE" : "2px solid #E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, transition: "all 0.2s",
                  }}>
                    {sec.icon}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: "block",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
                      textTransform: "uppercase" as const,
                      color: isOpen ? "#2563EB" : "#94A3B8",
                      marginBottom: 4,
                    }}>
                      Section {sec.num}
                    </span>
                    <span style={{
                      fontSize: 15, fontWeight: 650,
                      color: isOpen ? "#1E3A5F" : "#1E293B",
                      lineHeight: 1.4,
                    }}>
                      {t(sec.titleKey)}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span style={{
                    flexShrink: 0, fontSize: 22, color: isOpen ? "#2563EB" : "#94A3B8",
                    display: "inline-block",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    lineHeight: 1,
                  }}>
                    ›
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: "20px 32px 28px 96px",
                    borderTop: "1px solid #EFF6FF",
                  }}>
                    <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                      {t(sec.textKey)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CONTACT CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #0F1B2D, #1A3152)",
          borderRadius: 20, padding: "40px",
          marginTop: 40,
          display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center",
          boxShadow: "0 8px 32px rgba(15,27,45,0.2)",
        }}>
          <div>
            <p style={{ color: "#F5A623", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
              12 — {t("privacy.contactTitle")}
            </p>
            <h3 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              {t("privacy.contactTitle")}
            </h3>
            <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 6 }}>
              {t("privacy.contactEmail")}
            </p>
            <p style={{ color: "#94A3B8", fontSize: 15 }}>
              {t("privacy.contactPhone")}
            </p>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(245,166,35,0.15)",
            border: "2px solid rgba(245,166,35,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, flexShrink: 0,
          }}>
            ✉️
          </div>
        </div>

        {/* ── UPDATES NOTICE BANNER ── */}
        <div style={{
          marginTop: 32, background: "#EFF6FF",
          border: "1px solid #BFDBFE", borderRadius: 16,
          padding: "28px 32px", display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <div style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: 10,
            background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>
            🔄
          </div>
          <div>
            <p style={{ color: "#1E3A5F", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              {t("privacy.updatesTitle")}
            </p>
            <p style={{ color: "#3B82F6", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {t("privacy.updatesText")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;