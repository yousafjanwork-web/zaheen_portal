import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { makeJazzCashPayment } from "@/modules/shared/services/subscriptionService";
import { useAuth } from "@/modules/shared/context/AuthContext";
import axios from "axios";

type Carrier = "jazzcash" | "zong";

const sparks = [
  { top: "12%", left: "8%",  delay: "0s",   dur: "2.6s" },
  { top: "22%", left: "88%", delay: "0.7s", dur: "2.1s" },
  { top: "72%", left: "14%", delay: "1.2s", dur: "2.8s" },
  { top: "80%", left: "90%", delay: "0.4s", dur: "2.3s" },
  { top: "10%", left: "55%", delay: "1.5s", dur: "2.0s" },
  { top: "62%", left: "47%", delay: "0.9s", dur: "2.5s" },
];

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { msisdn: authMsisdn } = useAuth();

  // Package passed from PackagesPage via navigate state
  const pkg = location.state?.package as
    | { id: string; name: string; price: string; amount: number }
    | undefined;

  const [carrier, setCarrier] = useState<Carrier>("jazzcash");
  const [mobileNumber, setMobileNumber] = useState(authMsisdn ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    if (!mobileNumber.trim()) {
      setError("Please enter your mobile number");
      return;
    }
    if (!pkg) {
      setError("No package selected. Please go back and choose a package.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await makeJazzCashPayment(mobileNumber.trim(), pkg.amount);

      const isSuccess =
        result?.success === true ||
        result?.status === "success" ||
        result?.status === 1 ||
        result?.status === "1";

      if (isSuccess) {
        setSuccess(true);
        setTimeout(() => navigate("/", { replace: true }), 2000);
      } else {
        setError(result?.message || result?.desc || "Payment failed. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.response?.data?.desc;
        setError(msg || "Payment failed. Please check your number and try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4 py-16">

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

        <div className="p-8">

          {success ? (
            /* ── Success state ── */
            <div className="text-center py-6">
              <div className="relative mx-auto mb-8 h-24 w-24">
                <svg viewBox="0 0 120 120" className="h-full w-full">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#F0B429" strokeOpacity="0.2" strokeWidth="2" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="#F0B429" strokeWidth="2.5"
                    strokeDasharray="327" strokeDashoffset="327" strokeLinecap="round"
                    style={{
                      animation: "seal-draw 1.1s ease-out forwards",
                      transform: "rotate(-90deg)",
                      transformOrigin: "60px 60px",
                    }}
                  />
                  <circle cx="60" cy="60" r="40" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                  <path
                    d="M42 61 L54 73 L79 46"
                    fill="none" stroke="#2DD4BF" strokeWidth="6"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="60" strokeDashoffset="60"
                    style={{ animation: "seal-check 0.5s ease-out 0.9s forwards" }}
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Payment successful
              </p>
              <h2
                className="text-2xl text-white mb-2"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                Welcome to Zaheen!
              </h2>
              <p className="text-slate-400 text-sm">Taking you to your dashboard…</p>
            </div>
          ) : (
            /* ── Payment form ── */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                  Final step
                </p>
                <h1
                  className="text-3xl text-white"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                >
                  Complete Payment
                </h1>
                {pkg && (
                  <div
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: "rgba(240,180,41,0.1)",
                      border: "1px solid rgba(240,180,41,0.25)",
                      color: "#fcd34d",
                    }}
                  >
                    <span>📦</span>
                    {pkg.name} Plan — {pkg.price}
                  </div>
                )}
              </div>

              {/* Carrier toggle */}
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Payment Method
              </label>
              <div
                className="flex mb-6 rounded-xl p-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {([
                  { key: "jazzcash", label: "JazzCash" },
                  { key: "zong",     label: "Zong" },
                ] as { key: Carrier; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => { setCarrier(key); setError(""); }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={
                      carrier === key
                        ? {
                            background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                            color: "#0f172a",
                            boxShadow: "0 2px 8px rgba(240,180,41,0.35)",
                          }
                        : { color: "#94a3b8" }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Mobile number input */}
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                {carrier === "jazzcash" ? "JazzCash" : "Zong"} Number
              </label>
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">
                  📱
                </span>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => { setMobileNumber(e.target.value); setError(""); }}
                  placeholder="923XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F0B429")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5",
                  }}
                >
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading
                    ? "rgba(240,180,41,0.4)"
                    : "linear-gradient(135deg, #F0B429, #f59e0b)",
                  color: "#0f172a",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
                    Processing…
                  </>
                ) : (
                  `Pay & Start Learning →`
                )}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 py-2.5 text-sm text-slate-500 hover:text-slate-400 transition-colors"
              >
                ← Back to packages
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes seal-draw { to { stroke-dashoffset: 0; } }
        @keyframes seal-check { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
};

export default PaymentPage;