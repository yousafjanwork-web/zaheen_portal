import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  ShieldCheck,
  ArrowRight,
  Crown,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHARGE_URL =
  "https://api.zaheen.com.pk/v2/api/jazzcash/wallet/charge";

const IPN_URL =
  "https://api.zaheen.com.pk/v2/api/payment/ipn";

interface ChargeResponse {
  success: boolean;
  message?: string;

  data?: {
    pp_ResponseCode?: string;
    pp_ResponseMessage?: string;
    pp_TxnRefNo?: string;
    pp_Amount?: string;
  };
}

interface IpnResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

type PlanId = "ultimate" | "premium" | "exclusive" | "lifetime";

interface Plan {
  id: PlanId;
  name: string;
  amount: number;
  description: string;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "ultimate",
    name: "Ultimate",
    amount: 100,
    description: "Access to the Ultimate plan",
  },
  {
    id: "premium",
    name: "Premium",
    amount: 150,
    description: "Access to the Premium plan",
    badge: "Popular",
  },
  {
    id: "exclusive",
    name: "Exclusive",
    amount: 300,
    description: "Access to the Exclusive plan",
    badge: "Most Popular",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    amount: 3000,
    description: "Lifetime access to Zaheen",
    badge: "Best Value",
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

export default function RecurringSuccess() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] =
    useState<PlanId>("premium");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [txnRefNo, setTxnRefNo] = useState("");

  const selectedPlanData = plans.find(
    (plan) => plan.id === selectedPlan
  );

  const handlePayment = async () => {
    setMessage("");
    setSuccess(false);

    if (!selectedPlanData) {
      setMessage("Please select a payment plan.");
      return;
    }

    setLoading(true);

    try {
      const accessToken = sessionStorage.getItem(
        "zaheen_access_token"
      );

      if (!accessToken) {
        throw new Error(
          "Authentication session has expired. Please start the payment again."
        );
      }

      /*
        Replace this with the actual logged-in user's ID
        once your authentication system is connected.

        Testing user:
        327731
      */
      const userId = localStorage.getItem("user_id");

      const amountPKR = selectedPlanData.amount;

      const billReference =
        `ZAHEEN-${selectedPlanData.id.toUpperCase()}`;

      const description = "Monthly subscription";

      const requestBody = {
        userId,
        amountPKR,
        billReference,
        description,
      };

      const response = await fetch(CHARGE_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(requestBody),
      });

      const result: ChargeResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          // result.message ||
          //   result.data?.pp_ResponseMessage ||
          "Payment charge failed."
        );
      }
      const chargeTxnRefNo =
        result.data?.pp_TxnRefNo;

      if (!chargeTxnRefNo) {
        throw new Error(
          GENERIC_TRANSACTION_ERROR
        );
      }

      setTxnRefNo(chargeTxnRefNo);

      // ─────────────────────────────────────────────
      // IPN — Notify JazzCash of successful payment
      // IMPORTANT:
      // IPN failure does NOT make the payment fail.
      // ─────────────────────────────────────────────

      const txnDateTime =
        chargeTxnRefNo.replace(/\D/g, "");

      const ipnBody = {
        pp_Version: "2.0",
        pp_TxnType: "MWALLET",
        pp_BankID: "",
        pp_ProductID: null,
        pp_Password: "0123456789",

        pp_TxnRefNo: chargeTxnRefNo,

        pp_TxnDateTime: txnDateTime,

        pp_ResponseCode: "121",

        pp_ResponseMessage:
          "Transaction has been marked confirmed by Merchant.",

        pp_AuthCode: "",

        pp_SettlementExpiry: null,

        pp_RetreivalReferenceNo: "",
      };

      console.log(
        "================================="
      );

      console.log(
        "Sending Recurring Payment IPN"
      );

      console.log(
        "================================="
      );

      console.log(
        "IPN Request Body:",
        ipnBody
      );

      try {
        const ipnResponse = await fetch(
          IPN_URL,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },

            body: JSON.stringify(ipnBody),
          }
        );

        const ipnResult: IpnResponse =
          await ipnResponse.json();

        console.log(
          "IPN Response:",
          ipnResult
        );

        if (
          !ipnResponse.ok ||
          !ipnResult.success
        ) {
          console.error(
            "Recurring payment IPN failed:",
            ipnResult
          );
        }
      } catch (ipnError) {
        console.error(
          "Recurring payment IPN request error:",
          ipnError
        );
      }

      // ─────────────────────────────────────────────
      // Payment remains SUCCESS even if IPN fails
      // ─────────────────────────────────────────────

      setSuccess(true);

      setMessage(
        "Payment completed successfully."
      );

      sessionStorage.removeItem(
        "recurring_bill_reference"
      );

      sessionStorage.removeItem(
        "recurring_description"
      );

      sessionStorage.removeItem(
        "recurring_msisdn"
      );
      
    } catch (err) {
      console.error(
        "Recurring charge error:",
        err
      );

      setSuccess(false);

      setMessage(
        // err instanceof Error
        //   ? err.message
        //   : 
        "Unable to process payment. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">

      {/* =========================================================
        MAIN CARD
    ========================================================= */}

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">

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

            {/* Accent line */}

            <div
              className="mb-5 h-0.5 w-16 rounded-full"
              style={{
                background:
                  `linear-gradient(90deg, ${amber}, ${blue})`,
              }}
            />

            {/* Back button */}

            <button
              type="button"
              onClick={() =>
                navigate("/pay-with-jazzcash")
              }
              className="mb-5 flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to payment methods
            </button>

            {/* Hero content */}

            <div className="flex flex-wrap items-start justify-between gap-5">

              <div className="flex items-start gap-4">

                {/* Icon */}

                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: blueDim,
                    border: `1px solid ${blueBdr}`,
                  }}
                >
                  <Sparkles
                    className="h-6 w-6"
                    style={{ color: blue }}
                  />
                </div>

                {/* Text */}

                <div>

                  <p
                    className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: blue }}
                  >
                    JazzCash Payment
                  </p>

                  <h1
                    className="text-2xl font-semibold text-white sm:text-3xl"
                    style={{
                      fontFamily: "'Fraunces', serif",
                    }}
                  >
                    Choose your plan
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Your JazzCash wallet is linked. Select a plan below
                    and the amount will be charged directly from your
                    wallet.
                  </p>

                </div>

              </div>

              {/* Wallet status */}

              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border:
                    "1px solid rgba(34,197,94,0.25)",
                }}
              >
                <CheckCircle2
                  className="h-4 w-4"
                  style={{ color: "#4ade80" }}
                />

                <span
                  className="text-xs font-semibold"
                  style={{ color: "#4ade80" }}
                >
                  Wallet Linked
                </span>
              </div>

            </div>

          </div>

          {/* ======================================================
            CARD CONTENT
        ====================================================== */}

          <div className="p-6 sm:p-7">

            {/* ====================================================
              SUCCESS
          ==================================================== */}

            {success ? (

              <div
                className="rounded-2xl p-6 text-center sm:p-8"
                style={{
                  background: surfaceEl,
                  border: `1px solid ${surfaceBdr}`,
                }}
              >

                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background:
                      "rgba(34,197,94,0.1)",
                    border:
                      "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <CheckCircle2
                    className="h-9 w-9"
                    style={{
                      color: "#4ade80",
                    }}
                  />
                </div>

                <p
                  className="mt-6 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: "#4ade80",
                  }}
                >
                  Payment Complete
                </p>

                <h2
                  className="mt-2 text-2xl font-semibold text-white"
                  style={{
                    fontFamily:
                      "'Fraunces', serif",
                  }}
                >
                  Payment successful
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {message}
                </p>

                <div
                  className="mt-6 rounded-xl p-5 text-left"
                  style={{
                    background: surface,
                    border: `1px solid ${surfaceBdr}`,
                  }}
                >

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Plan
                    </span>

                    <span className="font-semibold text-white">
                      {selectedPlanData?.name}
                    </span>

                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Amount
                    </span>

                    <span
                      className="font-semibold"
                      style={{ color: amber }}
                    >
                      PKR{" "}
                      {selectedPlanData?.amount.toLocaleString()}
                    </span>

                  </div>

                </div>

                {txnRefNo && (
                  <div
                    className="mt-3 rounded-xl p-4 text-left"
                    style={{
                      background: surface,
                      border: `1px solid ${surfaceBdr}`,
                    }}
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Transaction Reference
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-300">
                      {txnRefNo}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background:
                      `linear-gradient(135deg, ${amber}, #f59e0b)`,
                    color: "#0f172a",
                    boxShadow:
                      "0 4px 16px rgba(240,180,41,0.25)",
                  }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Payment securely processed by JazzCash
                </div>

              </div>

            ) : (

              /* ====================================================
                 PLAN SELECTION
              ==================================================== */

              <div>

                <div className="mb-5">

                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: blue }}
                  >
                    Subscription Plans
                  </p>

                  <h3
                    className="mt-1 text-xl font-semibold text-white"
                    style={{
                      fontFamily:
                        "'Fraunces', serif",
                    }}
                  >
                    Select a plan
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose the plan you would like to continue with.
                  </p>

                </div>

                {/* PLAN CARDS */}

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

                        {/* Badge */}

                        {plan.badge && (
                          <div
                            className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                            style={{
                              background: isSelected
                                ? blueDim
                                : surfaceEl,
                              color: isSelected
                                ? blue
                                : "#64748b",
                              border:
                                `1px solid ${isSelected
                                  ? blueBdr
                                  : surfaceBdr
                                }`,
                            }}
                          >
                            {plan.badge}
                          </div>
                        )}

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
                              `1px solid ${isSelected
                                ? blueBdr
                                : surfaceBdr
                              }`,
                          }}
                        >

                          {plan.id === "lifetime" ? (
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

                {/* PAYMENT SUMMARY */}

                <div
                  className="mt-5 rounded-2xl p-5 sm:p-6"
                  style={{
                    background: surface,
                    border: `1px solid ${surfaceBdr}`,
                  }}
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Selected plan
                      </p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        {selectedPlanData?.name}
                      </p>

                    </div>

                    <div className="sm:text-right">

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Amount
                      </p>

                      <p
                        className="mt-1 text-2xl font-bold"
                        style={{ color: amber }}
                      >
                        PKR{" "}
                        {selectedPlanData?.amount.toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {message && (
                    <div
                      className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{
                        background:
                          "rgba(239,68,68,0.08)",
                        border:
                          "1px solid rgba(239,68,68,0.2)",
                      }}
                    >
                      <XCircle
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{
                          color: "#f87171",
                        }}
                      />

                      <p
                        className="text-sm"
                        style={{
                          color: "#fca5a5",
                        }}
                      >
                        {message}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background:
                        `linear-gradient(135deg, ${amber}, #f59e0b)`,
                      color: "#0f172a",
                      boxShadow:
                        "0 4px 16px rgba(240,180,41,0.2)",
                    }}
                  >

                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing payment...
                      </>
                    ) : (
                      <>
                        Pay PKR{" "}
                        {selectedPlanData?.amount.toLocaleString()}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}

                  </button>

                </div>

                {/* SECURITY */}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500">

                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    256-bit encryption
                  </span>

                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure payment
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    JazzCash protected
                  </span>

                </div>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}