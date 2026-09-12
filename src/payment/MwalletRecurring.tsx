import { useState } from "react";
import {
  ArrowRight,
  Lock,
  ShieldCheck,
  Smartphone,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const INITIATE_URL =
  "https://api.zaheen.com.pk/v2/api/jazzcash/wallet/initiate";

  // ─────────────────────────────────────────────────────────────
// Dashboard theme
// ─────────────────────────────────────────────────────────────

const amber = "#F0B429";
const amberDim = "rgba(240,180,41,0.12)";
const amberBdr = "rgba(240,180,41,0.28)";

const blue = "#3B82F6";
const blueDim = "rgba(59,130,246,0.12)";
const blueBdr = "rgba(59,130,246,0.28)";

const surface = "rgba(15,23,42,0.92)";
const surfaceEl = "rgba(255,255,255,0.04)";
const surfaceBdr = "rgba(255,255,255,0.07)";


interface InitiateResponse {
  success: boolean;
  message: string;

  data?: {
    actionUrl: string;
    pp_MerchantID: string;
    pp_Password: string;
    pp_MSISDN: string;
    pp_RequestID: string;
    pp_ReturnURL: string;
    pp_SecureHash: string;
  };
}

interface LocationState {
  accessToken?: string;
}

export default function MwalletRecurring() {
  const navigate = useNavigate();

  const location = useLocation();

  const state =
    location.state as LocationState | null;

  // ============================================================
  // TOKEN
  // ============================================================

  const accessToken =
    state?.accessToken ||
    sessionStorage.getItem(
      "zaheen_access_token"
    );


  const [msisdn, setMsisdn] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================================================
  // LINK WALLET
  // ============================================================

    const handleLinkWallet = async () => {
    setError("");

    const cleanedMsisdn = msisdn.trim();

    if (!cleanedMsisdn) {
        setError(
        "Please enter your JazzCash mobile number."
        );
        return;
    }

    if (!accessToken) {
        setError(
        "Authentication session is missing. Please return to the payment page."
        );
        return;
    }

    // Optional: get user_id from localStorage just for debugging
    const storedUserId = localStorage.getItem("user_id");



    setLoading(true);

    try {
        // ==========================================================
        // INITIATE WALLET LINKING
        // Backend gets userId from req.user.id
        // ==========================================================

        const initiateResponse = await fetch(INITIATE_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
            msisdn: cleanedMsisdn,
        }),
        });

        const initiateResult: InitiateResponse =
        await initiateResponse.json();


        if (
        !initiateResponse.ok ||
        !initiateResult.success ||
        !initiateResult.data
        ) {
        throw new Error(
            initiateResult.message ||
            "Unable to initiate JazzCash wallet linking."
        );
        }

        const {
        actionUrl,
        pp_MerchantID,
        pp_Password,
        pp_MSISDN,
        pp_RequestID,
        pp_ReturnURL,
        pp_SecureHash,
        } = initiateResult.data;

        if (!actionUrl) {
        throw new Error(
            "Failed to do transaction! Try again later."
        );
        }

        if (!pp_SecureHash) {
        throw new Error(
            "Failed to do transaction! Try again later."
        );
        }

        // ==========================================================
        // CREATE JAZZCASH FORM
        // ==========================================================

        const form = document.createElement("form");

        form.method = "POST";
        form.action = actionUrl;
        form.style.display = "none";

        const fields = {
        pp_MerchantID,
        pp_Password,
        pp_MSISDN,
        pp_RequestID,
        pp_ReturnURL,
        pp_SecureHash,
        };

        Object.entries(fields).forEach(
        ([name, value]) => {
            const input =
            document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value = value ?? "";

            form.appendChild(input);
        }
        );

        document.body.appendChild(form);

        // ==========================================================
        // REDIRECT TO JAZZCASH
        // ==========================================================

        form.submit();

    } catch (err) {
        console.error(
        "Recurring payment error:",
        err
        );

        setError(
          "Something went wrong. Please try again."
        );

        setLoading(false);
    }
    };


  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* =====================================================
          MAIN
      ===================================================== */}

<main className="mx-auto max-w-3xl px-6 py-10 lg:px-8 lg:py-14">

        <div
            className="overflow-hidden rounded-3xl shadow-2xl shadow-black/20"
            style={{
            background: surface,
            border: `1px solid ${surfaceBdr}`,
            }}
        >

            {/* ======================================================
                HERO INSIDE CARD
                ====================================================== */}

            <div
            className="p-6 sm:p-7"
            style={{
                background:
                "linear-gradient(135deg, #0F1B2D 0%, #14243B 55%, #0B1220 100%)",
                borderBottom: `1px solid ${surfaceBdr}`,
            }}
            >

            <div className="h-0.5 w-16 mb-5 rounded-full bg-gradient-to-r from-[#F0B429] to-[#3B82F6]" />

            <button
                type="button"
                onClick={() =>
                navigate("/pay-with-jazzcash", {
                    state: {
                    accessToken,
                    },
                })
                }
                className="mb-5 flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to payment methods
            </button>

            <div className="flex items-start gap-4">

                <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                    background: blueDim,
                    border: `1px solid ${blueBdr}`,
                }}
                >
                <Smartphone
                    className="h-6 w-6"
                    style={{ color: blue }}
                />
                </div>

                <div>

                <p
                    className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: blue }}
                >
                    Recurring Payment
                </p>

                <h1
                    className="text-2xl font-semibold text-white"
                    style={{
                    fontFamily: "'Fraunces', serif",
                    }}
                >
                    Link your JazzCash wallet
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Link your JazzCash wallet securely to enable recurring
                    payments for your Zaheen account.
                </p>

                </div>

            </div>

            </div>

            {/* ======================================================
                CARD CONTENT
                ====================================================== */}

            <div className="p-6 sm:p-7">

              <div className="mt-7">

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Enter your JazzCash number
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter the mobile number registered with your JazzCash
                  wallet. You will be redirected to JazzCash to complete
                  the wallet linking process.
                </p>

              </div>

              <div className="mt-8">

                <label
                  htmlFor="msisdn"
                  className="text-sm font-semibold text-slate-300"
                >
                  JazzCash Mobile Number
                </label>

                <div className="relative mt-2">

                  <Smartphone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="msisdn"
                    type="tel"
                    inputMode="numeric"
                    placeholder="03123456789"
                    value={msisdn}
                    onChange={(e) =>
                      setMsisdn(e.target.value)
                    }
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-[#0B1220] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-[#0D1728] focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Example: 03123456789
                </p>

              </div>

              {!accessToken && (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                  Your authentication session is missing.
                  Please return to the payment page and select
                  recurring payment again.
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleLinkWallet}
                disabled={loading || !accessToken}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all hover:bg-[#1D4ED8] hover:shadow-blue-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting to JazzCash...
                  </>
                ) : (
                  <>
                    Link JazzCash Wallet
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/5 bg-[#0B1220] p-4">

                  <div className="flex items-start gap-3">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                    <div>

                      <p className="text-sm font-semibold text-slate-200">
                        Secure Linking
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your wallet is linked securely through JazzCash.
                      </p>

                    </div>

                  </div>

                </div>

                <div className="rounded-2xl border border-white/5 bg-[#0B1220] p-4">

                  <div className="flex items-start gap-3">

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />

                    <div>

                      <p className="text-sm font-semibold text-slate-200">
                        Future Payments
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Once linked, your wallet can be used for recurring
                        payments.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                SSL encrypted connection
              </div>

            </div>

          </div>

        </main>

      </div>
  );
}