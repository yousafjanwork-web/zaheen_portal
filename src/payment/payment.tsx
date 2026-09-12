import { useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  Smartphone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentMethod = "mwallet" | "recurring" | "card";

const AUTH_URL =
  "https://api.zaheen.com.pk/v2/api/auth/token";

const paymentMethods = [
  {
    id: "mwallet" as PaymentMethod,
    title: "One-Time Payment",
    description:
      "Pay once using your JazzCash wallet",
    icon: Smartphone,
    badge: "Quick & Easy",
  },
  {
    id: "recurring" as PaymentMethod,
    title: "Subscription",
    description:
      "Link your JazzCash wallet for quick future payments",
    icon: RefreshCw,
    badge: "Recommended",
  },
  {
    id: "card" as PaymentMethod,
    title: "Credit / Debit Card",
    description:
      "Pay securely using your Visa or Mastercard",
    icon: CreditCard,
    badge: "Secure",
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("mwallet");

  const [loading, setLoading] = useState(false);

  // ============================================================
  // GET ZAHEEN AUTH TOKEN
  // ============================================================

  const getAuthToken = async (): Promise<string> => {
    const storedUserId = localStorage.getItem("user_id");

    const response = await fetch(AUTH_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-api-key": "zaheen_pk",
      },

      body: JSON.stringify({
        user_id: storedUserId,
      }),
    });

    const data = await response.json();


    if (!response.ok || !data?.success) {
      throw new Error(
        "Failed to generate authentication token. Kindly try again later."
      );
    }

    const accessToken =
      data?.data?.access_token ||
      data?.data?.data?.access_token;

    if (!accessToken) {
      throw new Error(
        "Authentication token was not returned."
      );
    }

    // Remove old token
    sessionStorage.removeItem("zaheen_access_token");

    // Store new token
    sessionStorage.setItem(
      "zaheen_access_token",
      accessToken
    );

    return accessToken;
  };
  // ============================================================
  // CONTINUE
  // ============================================================

  const handleContinue = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // ----------------------------------------------------------
      // GET AUTH TOKEN
      // ----------------------------------------------------------

      const accessToken = await getAuthToken();

      // ----------------------------------------------------------
      // CARD
      // ----------------------------------------------------------

      if (selectedMethod === "card") {
        navigate(
          "/pay-with-jazzcash/card",
          {
            state: {
              accessToken,
            },
          }
        );

        return;
      }

      // ----------------------------------------------------------
      // SAVE & PAY LATER
      // ----------------------------------------------------------

      if (selectedMethod === "recurring") {
        navigate(
          "/pay-with-jazzcash/mwallet-recurring",
          {
            state: {
              accessToken,
            },
          }
        );

        return;
      }

      // ----------------------------------------------------------
      // ONE-TIME PAYMENT
      // ----------------------------------------------------------

      if (selectedMethod === "mwallet") {
        navigate(
          "/pay-with-jazzcash/mwallet-withoutcnic",
          {
            state: {
              accessToken,
            },
          }
        );

        return;
      }
    } catch (error) {
      console.error(
        "Payment authentication error:",
        error
      );

      alert(
        "Unable to authenticate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="border-b border-white/5 bg-gradient-to-br from-[#0F1B2D] via-[#142744] to-[#0B1220]">

        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 lg:px-8">

          <div className="max-w-3xl">

            {/* BADGE */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">

              <div className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.7)]" />

              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-300">
                Secure Checkout
              </span>

            </div>

            {/* TITLE */}

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Complete your payment
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Select your preferred payment method below
              to securely complete your Zaheen payment.
            </p>

          </div>

        </div>

      </section>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">

          {/* ====================================================
              SUMMARY CARD
          ==================================================== */}

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#111C2E] p-7 shadow-2xl shadow-black/10">

            {/* HEADER */}

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">

                <CreditCard className="h-6 w-6 text-blue-400" />

              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  Zaheen Payment
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Secure checkout
                </p>

              </div>

            </div>

            <div className="my-7 border-t border-white/5" />

            {/* ORDER */}

            <div className="space-y-6">

              <div>

                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  Order ID
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-200">
                  ORD-2026-001
                </p>

              </div>

              <div>

                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                  Description
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-200">
                  Zaheen LMS Payment
                </p>

              </div>

            </div>

            {/* SECURITY BOX */}

            <div className="mt-8 rounded-2xl border border-white/5 bg-[#0B1424] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">

                  <ShieldCheck className="h-5 w-5 text-blue-400" />

                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-200">
                    Your payment is secure
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your payment information is encrypted
                    and securely processed.
                  </p>

                </div>

              </div>

            </div>

            {/* SSL */}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">

              <Lock className="h-3.5 w-3.5 text-blue-400" />

              SSL encrypted connection

            </div>

          </aside>

          {/* ====================================================
              PAYMENT METHODS
          ==================================================== */}

          <section>

            {/* SECTION HEADER */}

            <div className="mb-7">

              <p className="text-sm font-medium text-blue-400">
                Choose how you'd like to pay
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Select a payment method
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Choose one of the secure payment options
                below to complete your transaction.
              </p>

            </div>

            {/* METHODS */}

            <div className="space-y-4">

              {paymentMethods.map((method) => {

                const Icon = method.icon;

                const isSelected =
                  selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setSelectedMethod(method.id)
                    }
                    className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500/60 bg-[#13243C] shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
                        : "border-white/10 bg-[#111C2E] hover:border-white/20 hover:bg-[#142136] hover:-translate-y-0.5"
                    }`}
                  >

                    <div className="flex items-center gap-5">

                      {/* ICON */}

                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                          isSelected
                            ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/20"
                            : "bg-[#0B1424] text-slate-400 group-hover:text-slate-200"
                        }`}
                      >

                        <Icon className="h-6 w-6" />

                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-base font-bold text-white">
                            {method.title}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                              isSelected
                                ? "bg-blue-500/10 text-blue-300"
                                : "bg-white/5 text-slate-500"
                            }`}
                          >
                            {method.badge}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {method.description}
                        </p>

                      </div>

                      {/* RADIO + ARROW */}

                      <div className="flex shrink-0 items-center gap-4">

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-[#2563EB] bg-[#2563EB]"
                              : "border-slate-600 bg-transparent"
                          }`}
                        >

                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-white" />
                          )}

                        </div>

                        <ArrowRight
                          className={`hidden h-5 w-5 transition-transform sm:block ${
                            isSelected
                              ? "text-blue-400"
                              : "text-slate-600 group-hover:translate-x-1 group-hover:text-slate-400"
                          }`}
                        />

                      </div>

                    </div>

                  </button>
                );

              })}

            </div>

            {/* ==================================================
                CONTINUE
            ================================================== */}

            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Preparing secure checkout...
                </>
              ) : (
                <>
                  Continue with{" "}
                  {
                    paymentMethods.find(
                      (m) =>
                        m.id === selectedMethod
                    )?.title
                  }

                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>

            {/* TRUST INDICATORS */}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">

                <Lock className="h-3.5 w-3.5 text-blue-400" />

                256-bit encryption

              </span>

              <span className="flex items-center gap-1.5">

                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />

                Secure payment

              </span>

              <span className="flex items-center gap-1.5">

                <Check className="h-3.5 w-3.5 text-blue-400" />

                Trusted checkout

              </span>

            </div>

          </section>

        </div>

      </main>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="border-t border-white/5 bg-[#0F1B2D]">

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">

            <p>
              © {new Date().getFullYear()} Zaheen.
              All rights reserved.
            </p>

            <div className="flex items-center gap-5">

              <button
                type="button"
                onClick={() => navigate("/privacy")}
                className="transition hover:text-slate-300"
              >
                Privacy
              </button>

              <button
                type="button"
                onClick={() => navigate("/terms")}
                className="transition hover:text-slate-300"
              >
                Terms
              </button>

              <span className="flex items-center gap-1.5">

                <Lock className="h-3.5 w-3.5 text-blue-400" />

                Secure Checkout

              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}
