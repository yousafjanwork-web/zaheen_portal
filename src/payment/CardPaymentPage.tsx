import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  X,
  Crown,
  Sparkles
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

type Plan = {
  id: number;
  name: string;
  description: string;
  amount: number;
};

const plans: Plan[] = [
  {
    id: 2,
    name: "Ultimate",
    description: "Complete access to Zaheen LMS features.",
    amount: 100
  },
  {
    id: 3,
    name: "Premium",
    description: "Enhanced learning experience with premium features.",
    amount: 150
  },
  {
    id: 4,
    name: "Exclusive",
    description: "Access to exclusive learning features and content.",
    amount: 300
  },
  {
    id: 5,
    name: "Lifetime",
    description: "One-time payment with lifetime access.",
    amount: 3000
  },
];

const amber = "#F0B429";
const amberDim = "rgba(240,180,41,0.12)";
const amberBdr = "rgba(240,180,41,0.28)";
const blue = "#3B82F6";
const blueDim = "rgba(59,130,246,0.12)";
const blueBdr = "rgba(59,130,246,0.28)";
const surface = "rgba(15,23,42,0.92)";
const surfaceEl = "rgba(255,255,255,0.04)";
const surfaceBdr = "rgba(255,255,255,0.07)";


type CardInitiateResponse = {
  success: boolean;
  data?: {
    txnRefNo?: string;
    postUrl?: string;
    params?: Record<string, string>;
  };
  message?: string;
};

const CardPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [transactionRef, setTransactionRef] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    const status = searchParams.get("status");
    const success = searchParams.get("success");

    const txnRefNo =
      searchParams.get("txnRefNo") ||
      searchParams.get("pp_TxnRefNo") ||
      "";

    const message =
      searchParams.get("message") ||
      searchParams.get("pp_ResponseMessage") ||
      "";

    // console.log("=================================");
    // console.log("JazzCash Return URL Detected");
    // console.log("=================================");
    // console.log("Full URL:", window.location.href);
    // console.log("Status:", status);
    // console.log("Success:", success);
    // console.log("Transaction:", txnRefNo);
    // console.log("Message:", message);

    const paymentSuccessful =
      status === "success" ||
      success === "true";

    if (paymentSuccessful) {
      setTransactionRef(txnRefNo);

      setPaymentMessage(
        message ||
          "Your card payment has been completed successfully."
      );

      setShowSuccessDialog(true);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      return;
    }

    if (status === "failed") {
      setError(
          "Your card payment could not be completed. Please try again."
      );

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [searchParams]);

  const getAuthToken = async (): Promise<string> => {

    const storedUserId = localStorage.getItem("user_id");

    const response = await fetch(
      "https://api.zaheen.com.pk/v2/api/auth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "zaheen_pk",
        },
        body: JSON.stringify({
          user_id: storedUserId
        }),
      }
    );

    const data = await response.json();

    // console.log("Auth token response:", data);

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message ||
          "Failed to generate authentication token."
      );
    }

    const accessToken = data?.data?.access_token;

    if (!accessToken) {
      throw new Error(
        "Authentication token was not returned."
      );
    }

    return accessToken;
  };

  const initiateCardPayment = async (
    token: string,
    planId: number
  ): Promise<CardInitiateResponse> => {
    const response = await fetch(
      "https://api.zaheen.com.pk/v2/api/card/initiate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          plan_id: planId,
        }),
      }
    );

    const data: CardInitiateResponse =
      await response.json();

    // console.log(
    //   "Complete Card Initiate Response:",
    //   data
    // );

    if (!response.ok || !data?.success) {
      throw new Error(
        data?.message ||
          "Failed to initiate card payment."
      );
    }

    return data;
  };

  const formatAmount = (
    amountInPaisa?: string
  ): string => {
    if (!amountInPaisa) {
      return "0";
    }

    const amount = Number(amountInPaisa) / 100;

    if (Number.isNaN(amount)) {
      return "0";
    }

    return amount.toLocaleString("en-PK", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const submitJazzCashForm = (
    postUrl: string,
    params: Record<string, string>
  ) => {
    const form = document.createElement("form");

    form.method = "POST";
    form.action = postUrl;
    form.style.display = "none";

    Object.entries(params).forEach(
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

    // console.log("=================================");
    // console.log("Submitting JazzCash Card Payment");
    // console.log("=================================");

    // console.log("Post URL:", postUrl);
    // console.log(
    //   "Transaction:",
    //   params.pp_TxnRefNo
    // );
    // console.log(
    //   "Amount:",
    //   params.pp_Amount
    // );
    // console.log(
    //   "Secure Hash:",
    //   params.pp_SecureHash
    // );
    // console.log(
    //   "Return URL:",
    //   params.pp_ReturnURL
    // );

    form.submit();
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      setError(
        "Please select a plan to continue."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      // console.log(
      //   "Getting Zaheen authentication token..."
      // );

      const token = await getAuthToken();

      // console.log(
      //   "Zaheen authentication token received."
      // );

      // console.log(
      //   "Initiating card payment for plan:",
      //   selectedPlan
      // );

      const paymentResponse =
        await initiateCardPayment(
          token,
          selectedPlan
        );

      // console.log(
      //   "Card initiation response:",
      //   paymentResponse
      // );

      const postUrl =
        paymentResponse?.data?.postUrl;

      if (!postUrl) {
        throw new Error(
          "JazzCash payment URL was not returned."
        );
      }

      const params =
        paymentResponse?.data?.params;

      if (!params) {
        throw new Error(
          "JazzCash payment parameters were not returned."
        );
      }

      const txnRefNo =
        params?.pp_TxnRefNo ||
        paymentResponse?.data?.txnRefNo;

      if (!txnRefNo) {
        throw new Error(
          "JazzCash transaction reference number was not returned."
        );
      }

      const amount =
        params?.pp_Amount;

      if (!amount) {
        throw new Error(
          "JazzCash payment amount was not returned."
        );
      }

      const secureHash =
        params?.pp_SecureHash;

      if (!secureHash) {
        throw new Error(
          "JazzCash secure hash was not returned."
        );
      }

      // console.log(
      //   "================================="
      // );

      // console.log(
      //   "JazzCash Card Payment Details"
      // );

      // console.log(
      //   "================================="
      // );

      // console.log(
      //   "Transaction:",
      //   txnRefNo
      // );

      // console.log(
      //   "Amount in paisa:",
      //   amount
      // );

      // console.log(
      //   "Amount in PKR:",
      //   formatAmount(amount)
      // );

      // console.log(
      //   "Secure Hash:",
      //   secureHash
      // );

      // console.log(
      //   "Post URL:",
      //   postUrl
      // );

      // console.log(
      //   "Return URL:",
      //   params.pp_ReturnURL
      // );

      // console.log(
      //   "Redirecting to JazzCash..."
      // );

      submitJazzCashForm(
        postUrl,
        params
      );

    } catch (err) {
      console.error(
        "Credit / Debit Card payment error:",
        err
      );

      setError(
         "Unable to start card payment. Please try again."
      );

      setLoading(false);
    }
  };

  const selectedPlanData = selectedPlan
    ? plans.find(
        (plan) => plan.id === selectedPlan
      )
    : null;

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  const goToPaymentMethods = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* =====================================================
          SUCCESS DIALOG
      ===================================================== */}

      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-[#111A2A] p-8 shadow-2xl">

            <button
              type="button"
              onClick={closeSuccessDialog}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20">
                  <Check className="h-8 w-8 text-white" />
                </div>

              </div>

            </div>

            <div className="mt-6 text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Payment Successful
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                Transaction Completed
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                {paymentMessage ||
                  "Your card payment has been successfully completed."}
              </p>

            </div>

            <div className="mt-7 rounded-2xl border border-slate-700 bg-[#0B1423] p-5">

              <div className="flex items-center justify-between border-b border-slate-700 pb-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-[#111A2A]">
                    <CreditCard className="h-5 w-5 text-[#3B82F6]" />
                  </div>

                  <div>

                    <p className="text-xs text-slate-500">
                      Payment Method
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-200">
                      Credit / Debit Card
                    </p>

                  </div>

                </div>

                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Paid
                </div>

              </div>

              {transactionRef && (
                <div className="mt-4">

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Transaction Reference
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-300">
                    {transactionRef}
                  </p>

                </div>
              )}

            </div>

            <button
              type="button"
              onClick={goToPaymentMethods}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-[#1D4ED8] hover:shadow-xl"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Payment securely processed by JazzCash
            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">

        <div
          className="overflow-hidden rounded-3xl shadow-2xl shadow-black/20"
          style={{
            background: "rgba(15,23,42,0.92)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >

          {/* ==================================================
              HERO INSIDE CARD
          ================================================== */}

          <div
            className="p-6 sm:p-7"
            style={{
              background:
                "linear-gradient(135deg, #0F1B2D 0%, #14243B 55%, #0B1220 100%)",
              borderBottom:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >

            <div className="mb-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#F0B429] to-[#3B82F6]" />

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-5 flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to payment methods
            </button>

            <div className="flex items-start gap-4">

              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background:
                    "rgba(59,130,246,0.12)",
                  border:
                    "1px solid rgba(59,130,246,0.28)",
                }}
              >
                <CreditCard
                  className="h-6 w-6"
                  style={{ color: "#3B82F6" }}
                />
              </div>

              <div>

                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#3B82F6" }}
                >
                  Credit / Debit Card
                </p>

                <h1
                  className="text-2xl font-semibold text-white"
                  style={{
                    fontFamily: "'Fraunces', serif",
                  }}
                >
                  Choose your plan
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select the plan you want to purchase. You will
                  be redirected to JazzCash's secure payment page
                  to complete your card payment.
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              FORM CONTENT
          ================================================== */}

          <div className="p-6 sm:p-7">

            <div className="mb-6 flex items-center gap-3">

              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "rgba(240,180,41,0.12)",
                  border:
                    "1px solid rgba(240,180,41,0.28)",
                }}
              >
                <CreditCard
                  className="h-5 w-5"
                  style={{ color: "#F0B429" }}
                />
              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  Complete your payment
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Select a plan to continue with your card payment.
                </p>

              </div>

            </div>

            {/* ==================================================
                PLANS
            ================================================== */}

            <div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Select your plan
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {plans.map((plan) => {

                  const isSelected =
                    selectedPlan === plan.id;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setSelectedPlan(plan.id)
                      }
                      disabled={loading}
                      className="relative rounded-2xl p-5 text-left transition-all duration-200"
                      style={{
                        background: isSelected
                          ? blueDim
                          : surface,
                        border: isSelected
                          ? `1px solid ${blueBdr}`
                          : `1px solid ${surfaceBdr}`,
                        boxShadow: isSelected
                          ? "0 8px 25px rgba(59,130,246,0.08)"
                          : "none",
                        opacity: loading
                          ? 0.7
                          : 1,
                        cursor: loading
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >

                      {/* Icon */}

                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          background: isSelected
                            ? blueDim
                            : surfaceEl,
                          color: isSelected
                            ? blue
                            : "#94a3b8",
                          border:
                            `1px solid ${
                              isSelected
                                ? blueBdr
                                : surfaceBdr
                            }`,
                        }}
                      >

                        {plan.id === 5 ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}

                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-1.5 min-h-[40px] text-sm leading-5 text-slate-500">
                        {plan.description}
                      </p>

                      <div className="mt-5">

                        <span className="text-xs font-medium text-slate-500">
                          PKR
                        </span>

                        <span
                          className="ml-1 text-2xl font-bold tracking-tight"
                          style={{
                            color: isSelected
                              ? amber
                              : "#f8fafc",
                          }}
                        >
                          {plan.amount.toLocaleString()}
                        </span>

                      </div>

                      <div className="mt-5 flex items-center gap-2">

                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                          style={{
                            borderColor: isSelected
                              ? blue
                              : "#475569",
                            background: isSelected
                              ? blue
                              : "transparent",
                          }}
                        >
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>

                        <span
                          className="text-sm font-medium"
                          style={{
                            color: isSelected
                              ? blue
                              : "#64748b",
                          }}
                        >
                          {isSelected
                            ? "Selected"
                            : "Select plan"}
                        </span>

                      </div>

                    </button>
                  );

                })}

              </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* ==================================================
                PAYMENT SUMMARY
            ================================================== */}

            <div
              className="mt-6 rounded-2xl p-5"
              style={{
                background:
                  "rgba(255,255,255,0.04)",
                border:
                  "1px solid rgba(255,255,255,0.07)",
              }}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Selected Plan
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    {selectedPlanData
                      ? selectedPlanData.name
                      : "No plan selected"}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Credit / Debit Card
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================================
                CONTINUE BUTTON
            ================================================== */}

            <button
              type="button"
              disabled={!selectedPlan || loading}
              onClick={handleContinue}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg,#2563EB,#1D4ED8)",
              }}
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Preparing secure payment...
                </>
              ) : (
                <>
                  Continue to Card Payment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}

            </button>

            {/* ==================================================
                SECURITY CARDS
            ================================================== */}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              <div
                className="rounded-2xl p-4"
                style={{
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: "#3B82F6" }}
                  />

                  <div>

                    <p className="text-sm font-semibold text-slate-200">
                      Secure Payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your card payment is securely processed
                      through JazzCash.
                    </p>

                  </div>

                </div>

              </div>

              <div
                className="rounded-2xl p-4"
                style={{
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                }}
              >

                <div className="flex items-start gap-3">

                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: "#F0B429" }}
                  />

                  <div>

                    <p className="text-sm font-semibold text-slate-200">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      You will be redirected to JazzCash's
                      secure card payment environment.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                SECURITY FOOTER
            ================================================== */}

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-500">

              <Lock className="h-3.5 w-3.5" />

              SSL encrypted connection

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
export default CardPaymentPage;
