import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, XCircle, Loader2, LockKeyhole,
  ShieldCheck, Smartphone, Wallet, CalendarClock, RefreshCw,
} from "lucide-react";

const INITIATE_URL = "https://api.zaheen.com.pk/v2/api/jazzcash/wallet/initiate";
const CHARGE_URL = "https://api.zaheen.com.pk/v2/api/jazzcash/wallet/charge";
const ZONG_BASE_URL = "https://subgateway.fitsworld.com.pk/zongcharging/api";
const ZONG_SERVICE_ID = "205";

const INITIAL_PAYMENT_PKR = 1;
const DAILY_SUBSCRIPTION_PKR = 5;

// 03XXXXXXXXX or 923XXXXXXXXX -> 923XXXXXXXXX, otherwise null
const normalize = (raw) => {
  const d = String(raw).replace(/\D/g, "");
  if (/^03\d{9}$/.test(d)) return "92" + d.slice(1);
  if (/^923\d{9}$/.test(d)) return d;
  return null;
};

const primaryBtn =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60";

export default function JazzCashSubscriptionPage({ accessToken, onPaymentSuccess, onCancel }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [msisdn] = useState(
    location.state?.msisdn ??
      (() => {
        try { return JSON.parse(sessionStorage.getItem("social_payment_state") || "null")?.msisdn ?? ""; }
        catch { return ""; }
      })()
  );
  const [network, setNetwork] = useState(location.state?.network ?? null); // "zong" | "other" | null


  const [step, setStep] = useState("intro"); // intro | confirm | pending | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    location.state?.network === "zong" ? "We sent an OTP to your number. Enter it below." : ""
  );
  const [txnRefNo, setTxnRefNo] = useState("");

  const [zongOtp, setZongOtp] = useState("");
  const [zongOtpSent, setZongOtpSent] = useState(location.state?.network === "zong");
  const [zongTransactionId, setZongTransactionId] = useState("");


  const getToken = () =>
    accessToken || location.state?.accessToken || sessionStorage.getItem("zaheen_access_token");

  const getSubBy = () =>
    new URLSearchParams(location.search).get("page") || localStorage.getItem("page_name") || "";

  // Both Zong and JazzCash end here: the parent redirects to /thanku
  const finish = () => (onPaymentSuccess ? onPaymentSuccess() : navigate("/dashboard"));

  // Return from JazzCash wallet linking
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    // JazzCash returns ?status=success&userId=...&requestId=... (older links used ?wallet_linked=...)
    const status = q.get("wallet_linked") ?? q.get("status");
    if (status === "success") {
      setNetwork("other");
      setStep("confirm");
      setError("");
    } else if (status) {
      setStep("intro");
      setNetwork("other");
      setError("Wallet linking could not be completed. Please try again.");
    }
  }, [location.search]);

  /* ── Zong ───────────────────────────────────────────────────────────── */

  const handleZongSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    const normalized = normalize(msisdn);
    if (!normalized) { setError("Enter a valid Pakistani mobile number."); return; }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        msisdn: normalized,
        serviceId: ZONG_SERVICE_ID,
        subMethod: "WEB",
        source: localStorage.getItem("source") ?? "",
      });
      const res = await fetch(`${ZONG_BASE_URL}/send-pin?${params}`);
      const result = await res.json();

      if (!res.ok || String(result.status || "").toUpperCase() !== "PIN_SENT") {
        throw new Error(result.message || result.desc || "Unable to send OTP. Please try again.");
      }
      setZongTransactionId(result.transactionId || result.data?.transactionId || "");
      setZongOtpSent(true);
      setZongOtp("");
      setMessage("We sent an OTP to your number. Enter it below.");
    } catch (err) {
      setError(err.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleZongSubscribe = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    const pin = zongOtp.trim();
    if (!/^\d{4,8}$/.test(pin)) { setError("Enter a valid OTP."); return; }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        msisdn: normalize(msisdn),
        serviceId: ZONG_SERVICE_ID,
        pin,
        subMethod: "WEB",
        transactionId: zongTransactionId || String(Date.now()),
        subBy: getSubBy(),
      });

      const res = await fetch(`${ZONG_BASE_URL}/verify-subscribe?${params}`);
      const result = await res.json();

      // Same success rule as the Subscribe page
      if (!res.ok || String(result.status || "").toUpperCase() !== "SUCCESS") {
        throw new Error(result.message || result.desc || "OTP verification or subscription failed.");
      }

      // Same sequence as the Subscribe page: verify the PIN, then activate with /subscribe.
      // "already active" counts as success, so a repeat call does not fail or double-subscribe.
      const subParams = new URLSearchParams({
        msisdn: normalize(msisdn),
        serviceId: ZONG_SERVICE_ID,
        subMethod: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? "MOBILE" : "WEB",
        transactionId: String(Date.now()),
        subBy: getSubBy(),
      });
      const subRes = await fetch(`${ZONG_BASE_URL}/subscribe?${subParams}`);
      const sub = await subRes.json();
      const active =
        String(sub.status) === "1" || String(sub.desc || "").toLowerCase().includes("already active");
      if (!active) throw new Error(sub.desc || sub.message || "Subscription failed. Please try again.");

      localStorage.setItem("activeServiceId", ZONG_SERVICE_ID);

      setStep("success");
      finish();
    } catch (err) {
      setError(err.message || "Unable to complete your Zong subscription.");
    } finally {
      setLoading(false);
    }
  };

  /* ── JazzCash ───────────────────────────────────────────────────────── */

  const handleLinkWallet = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");

    const normalized = normalize(msisdn);
    if (!normalized) { setError("Enter a valid Pakistani mobile number."); return; }
    const digits = "0" + normalized.slice(2); // JazzCash expects 03XXXXXXXXX

    const token = getToken();
    if (!token) { setError("Your session has expired. Please log in again."); return; }

    setLoading(true);
    try {
      const res = await fetch(INITIATE_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn: digits }),
      });
      const result = await res.json();
      if (!res.ok || result.success !== true) {
        throw new Error(result.message || "Unable to initiate wallet linking.");
      }

      const data = result.data || {};
      if (!data.actionUrl || !data.pp_SecureHash) {
        throw new Error("JazzCash returned incomplete wallet-linking information.");
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.actionUrl;
      form.style.display = "none";
      ["pp_MerchantID", "pp_Password", "pp_MSISDN", "pp_RequestID", "pp_ReturnURL", "pp_SecureHash"].forEach((name) => {
        if (data[name] !== undefined && data[name] !== null) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = String(data[name]);
          form.appendChild(input);
        }
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.message || "Unable to link your JazzCash wallet.");
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setError(""); setMessage(""); setTxnRefNo("");

    const token = getToken();
    if (!token) { setError("Your session has expired. Please log in again."); return; }

    setLoading(true);
    try {
      const res = await fetch(CHARGE_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPKR: INITIAL_PAYMENT_PKR,
          billReference: `ZAHEEN-SUB-${Date.now()}`,
          description: "Zaheen subscription initial payment",
        }),
      });
      const result = await res.json();
      if (!res.ok || result.success !== true) {
        throw new Error(result.message || "Unable to process your payment.");
      }

      const data = result.data || {};
      const reference = data.pp_TxnRefNo || data.txnRefNo || data.transactionReference;
      if (reference) setTxnRefNo(String(reference));

      const code = String(data.pp_ResponseCode ?? data.responseCode ?? "");
      const status = String(data.paymentStatus ?? data.status ?? "").toUpperCase();
      const confirmed =
        code === "121" || status === "SUCCESS" || status === "SUCCESSFUL" || data.paymentConfirmed === true;

      if (confirmed) {
        setStep("success");
        finish();
      } else {
        setStep("pending");
        setMessage(
          "Your Rs. 1 payment is being verified. Please don't submit another payment while this one is processing."
        );
      }
    } catch (err) {
      setError(err.message || "Unable to process your payment.");
    } finally {
      setLoading(false);
    }
  };

  /* ── UI ─────────────────────────────────────────────────────────────── */

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">

        <div className="bg-blue-700 px-6 py-5 text-white">
          <h1 className="text-xl font-bold">Start your subscription</h1>
          <p className="mt-1 text-sm text-blue-100">One day free, then Rs. {DAILY_SUBSCRIPTION_PKR}/day. Cancel anytime.</p>
        </div>

        <div className="p-6">
          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* ── Step: enter number ── */}
          {step === "intro" && (
            <>
              <label htmlFor="msisdn" className="mb-1.5 block text-sm font-semibold text-slate-800">
                Mobile number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <Smartphone size={18} className="shrink-0 text-slate-400" />
                <input
                  id="msisdn"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="03XX XXXXXXX"
                  value={msisdn}
                  readOnly
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
                />
                {network && <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />}
              </div>
              {msisdn ? (
                <p className="mt-1.5 text-xs text-slate-500">This is the number from your profile.</p>
              ) : (
                <p className="mt-1.5 text-xs text-red-600">
                  Your number is missing.{" "}
                  <button type="button" onClick={() => navigate(-1)} className="font-semibold underline">
                    Go back to your profile
                  </button>
                </p>
              )}

              {/* Zong */}
              {network === "zong" && (
                <form onSubmit={zongOtpSent ? handleZongSubscribe : handleZongSendOtp} className="mt-5">
                  <div className="mb-4 flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                    <Smartphone size={20} className="shrink-0 text-blue-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Zong number detected</p>
                      <p className="text-xs text-slate-600">Rs. {DAILY_SUBSCRIPTION_PKR} + tax per day, billed to your Zong balance.</p>
                    </div>
                  </div>

                  {zongOtpSent && (
                    <>
                      <label htmlFor="zong-otp" className="mb-1.5 block text-sm font-semibold text-slate-800">
                        Enter OTP
                      </label>
                      <input
                        id="zong-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="Enter the OTP you received"
                        value={zongOtp}
                        onChange={(e) => setZongOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      />
                      {message && <p role="status" className="mt-2 text-xs text-blue-800">{message}</p>}
                    </>
                  )}

                  <button type="submit" disabled={loading} className={`${primaryBtn} ${zongOtpSent ? "mt-4" : ""}`}>
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" />{zongOtpSent ? "Subscribing…" : "Sending OTP…"}</>
                    ) : zongOtpSent ? (
                      <><ShieldCheck size={18} />Subscribe<ArrowRight size={16} /></>
                    ) : (
                      <>Send OTP<ArrowRight size={16} /></>
                    )}
                  </button>

                  {zongOtpSent && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleZongSendOtp}
                      
                      className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Resend OTP
                    </button>
                  )}
                </form>
              )}

              {/* Other network -> JazzCash */}
              {network === "other" && (
                <form onSubmit={handleLinkWallet} className="mt-5">
                  <div className="mb-4 rounded-xl bg-blue-50 p-3">
                    <div className="flex items-center gap-3">
                      <Wallet size={20} className="shrink-0 text-blue-700" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Pay with JazzCash</p>
                        <p className="text-xs text-slate-600">Link your wallet, then confirm a one-time payment.</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
                      <span>Pay now</span>
                      <span className="text-base font-bold text-blue-800">Rs. {INITIAL_PAYMENT_PKR}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                      <CalendarClock size={15} className="text-blue-700" />
                      Then Rs. {DAILY_SUBSCRIPTION_PKR}/day subscription fee
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className={primaryBtn}>
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" />Connecting to JazzCash…</>
                    ) : (
                      <><Wallet size={18} /> Continue<ArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <p className="text-[11px] leading-4 text-slate-500">
                  The Rs. {DAILY_SUBSCRIPTION_PKR} daily fee is shown before you pay. You can unsubscribe at any time.
                </p>
              </div>
            </>
          )}

          {/* ── Step: confirm JazzCash payment ── */}
          {step === "confirm" && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <CheckCircle2 size={28} className="shrink-0 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Wallet linked</h2>
                  <p className="text-xs text-slate-500">Review your payment before continuing.</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-500">Pay today</span>
                  <span className="text-xl font-bold text-blue-800">Rs. {INITIAL_PAYMENT_PKR}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 py-2.5">
                  <span className="text-sm text-slate-500">Then, per day</span>
                  <span className="text-sm font-semibold">Rs. {DAILY_SUBSCRIPTION_PKR}</span>
                </div>
                <p className="rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
                  By confirming, you authorize the initial Rs. {INITIAL_PAYMENT_PKR} payment and agree to the
                  recurring Rs. {DAILY_SUBSCRIPTION_PKR} daily subscription fee, subject to the subscription terms.
                </p>
              </div>

              <button type="button" onClick={handleConfirmPayment} disabled={loading} className={`${primaryBtn} mt-4`}>
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" />Processing…</>
                ) : (
                  <><LockKeyhole size={16} />Confirm and pay Rs. {INITIAL_PAYMENT_PKR}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => (onCancel ? onCancel() : navigate("/dashboard"))}
                disabled={loading}
                className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}

          {/* ── Step: pending ── */}
          {step === "pending" && (
            <div className="py-3 text-center">
              <RefreshCw size={32} className="mx-auto text-amber-600" />
              <h2 className="mt-3 text-lg font-bold text-slate-900">Payment is being verified</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
              {txnRefNo && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left">
                  <p className="text-[11px] text-slate-500">Transaction reference</p>
                  <p className="mt-1 break-all font-mono text-xs font-semibold">{txnRefNo}</p>
                </div>
              )}
              <button type="button" onClick={() => navigate("/dashboard")} className={`${primaryBtn} mt-5`}>
                Go to dashboard
              </button>
            </div>
          )}

          {/* ── Step: success (the parent's Thank You modal opens on top) ── */}
          {step === "success" && (
            <div className="py-3 text-center">
              <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
              <h2 className="mt-3 text-lg font-bold text-slate-900">Payment successful</h2>
              <p className="mt-2 text-sm text-slate-500">Your subscription is active.</p>
            </div>
          )}

          <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
            <LockKeyhole size={12} />
            Secure payment
          </div>
        </div>
      </div>
    </div>
  );
}