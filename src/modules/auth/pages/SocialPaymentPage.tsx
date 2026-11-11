/**
 * SocialPaymentPage.tsx
 * Shown after profile form submit for ISSB/NAT/MDCAT/Trading.
 * On payment success → shows Thank You modal → navigates to App Download page.
 * On payment failure → shows error with retry option.
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import JazzCashSubscriptionPage from "./JazzCashSubscriptionPage";

type Portal = "mdcat" | "issb" | "nat" | "trading";

const SocialPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routerState = location.state as {
    accessToken: string;
    portal:      Portal;
    name:        string;
    email:       string;
    userId:      string;
  } | null;

  // After the JazzCash redirect, Router state is gone — restore from sessionStorage
  const savedState = (() => {
    try { return JSON.parse(sessionStorage.getItem("social_payment_state") || "null"); }
    catch { return null; }
  })();
  const state = (routerState?.portal ? routerState : savedState) as typeof routerState;

  const [showThankYou, setShowThankYou] = useState(false);

  if (!state?.portal) {
    navigate("/login", { replace: true });
    return null;
  }

  const handlePaymentSuccess = () => {
    navigate("/thanku?status=success", { replace: true, state: { portal: state.portal } });
  };

  const handleContinue = () => {
    sessionStorage.removeItem("social_payment_state");
    navigate("/social-app-download", {
      replace: true,
      state: { portal: state.portal },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden text-center"
            style={{
              background:  "rgba(15,23,42,0.97)",
              border:      "1px solid rgba(255,255,255,0.08)",
              boxShadow:   "0 32px 64px rgba(0,0,0,0.55)",
            }}>
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />
            <div className="p-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Welcome aboard!
              </p>
              <h2 className="text-2xl text-white font-semibold mb-2"
                style={{ fontFamily: "'Fraunces', serif" }}>
                Thanks for subscribing!
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Your subscription is confirmed. You now have full access to all content.
              </p>
              <button onClick={handleContinue}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color:      "#0f172a",
                  boxShadow:  "0 4px 16px rgba(240,180,41,0.35)",
                }}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

           {/* JazzCash Payment Component */}
      <JazzCashSubscriptionPage
        accessToken={state?.accessToken || sessionStorage.getItem("zaheen_access_token") || ""}
        onPaymentSuccess={handlePaymentSuccess}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default SocialPaymentPage;