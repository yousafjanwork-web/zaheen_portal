import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  CreditCard,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const WITHOUT_CNIC_URL =
  "https://api.zaheen.com.pk/v2/api/payment/without-cnic";

const STATUS_URL =
  "https://api.zaheen.com.pk/v2/api/payment/status";

const IPN_URL =
  "https://api.zaheen.com.pk/v2/api/payment/ipn";


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

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface LocationState {
  accessToken?: string;
}

interface WithoutCnicResponse {
  success: boolean;
  message?: string;

  data?: {
    txnRefNo?: string;
    retrievalRefNo?: string;
    amount?: number;
    responseCode?: string;
    msisdn?: string;
  };
}

interface IpnResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

interface StatusResponse {
  success: boolean;
  message?: string;

  data?: {
    txnRefNo?: string;
    responseCode?: string;
    responseMessage?: string;
    amount?: number;
    msisdn?: string;
    status?: string;
    authCode?: string;
    retrievalRefNo?: string;
  };
}

type PlanId = 2 | 3 | 4 | 5;

interface Plan {
  id: PlanId;
  name: string;
  amount: number;
  description: string;
}

const plans: Plan[] = [
  {
    id: 2,
    name: "Ultimate",
    amount: 100,
    description: "Access to the Ultimate plan",
  },
  {
    id: 3,
    name: "Premium",
    amount: 150,
    description: "Access to the Premium plan",
  },
  {
    id: 4,
    name: "Exclusive",
    amount: 300,
    description: "Access to the Exclusive plan",
  },
  {
    id: 5,
    name: "Lifetime",
    amount: 3000,
    description: "Lifetime access to Zaheen",
  },
];

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function PaymentWithoutCnic() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const accessToken =
    state?.accessToken ||
    sessionStorage.getItem(
      "zaheen_access_token"
    );

  // ───────────────────────────────────────────────────────────
  // Form state
  // ───────────────────────────────────────────────────────────

  const [msisdn, setMsisdn] = useState("");

  const [selectedPlan, setSelectedPlan] =
    useState<PlanId>(1);

  // ───────────────────────────────────────────────────────────
  // Payment state
  // ───────────────────────────────────────────────────────────

  const [loading, setLoading] = useState(false);

  const [resultType, setResultType] =
    useState<"success" | "failure" | null>(null);

  const [message, setMessage] = useState("");

  const [txnRefNo, setTxnRefNo] = useState("");

  const [retrievalRefNo, setRetrievalRefNo] =
    useState("");

  const selectedPlanData = plans.find(
    (plan) => plan.id === selectedPlan
  );

  // ───────────────────────────────────────────────────────────
  // Handle payment
  // ───────────────────────────────────────────────────────────

  const handlePayment = async () => {
    setMessage("");
    setResultType(null);
    setTxnRefNo("");
    setRetrievalRefNo("");

    const cleanedMsisdn = msisdn.trim();

    if (!accessToken) {
      setResultType("failure");

      setMessage(
        "Your authentication is missing. Please return to the payment page and try again."
      );

      return;
    }

    if (!cleanedMsisdn) {
      setMessage(
        "Please enter your JazzCash mobile number."
      );

      return;
    }

    if (!/^03\d{9}$/.test(cleanedMsisdn)) {
      setMessage(
        "Please enter a valid JazzCash mobile number, for example 03123456789."
      );

      return;
    }

    if (!selectedPlanData) {
      setMessage(
        "Please select a payment plan."
      );

      return;
    }

    setLoading(true);

    try {
      // ────────────────────────────────────────────────────────
      // STEP 1 — Without-CNIC payment
      // ────────────────────────────────────────────────────────

      const paymentBody = {
        msisdn: cleanedMsisdn,
        amount: selectedPlanData.amount,
        plan_id: selectedPlanData.id,
      };

      const paymentResponse = await fetch(
        WITHOUT_CNIC_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify(paymentBody),
        }
      );

      const paymentResult: WithoutCnicResponse =
        await paymentResponse.json();

      if (
        !paymentResponse.ok ||
        !paymentResult.success ||
        !paymentResult.data?.txnRefNo
      ) {
        throw new Error(
          // paymentResult.message ||
          "Unable to process JazzCash payment."
        );
      }

      const txnRef =
        paymentResult.data.txnRefNo;

      setTxnRefNo(txnRef);

      if (
        paymentResult.data.retrievalRefNo
      ) {
        setRetrievalRefNo(
          paymentResult.data.retrievalRefNo
        );
      }


      // ────────────────────────────────────────────────────────
      // STEP 2 — Payment status
      // ────────────────────────────────────────────────────────

      const statusResponse = await fetch(
        STATUS_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

          body: JSON.stringify({
            txnRefNo: txnRef,
          }),
        }
      );

      const statusResult: StatusResponse =
        await statusResponse.json();


      if (
        !statusResponse.ok ||
        !statusResult.success
      ) {
        throw new Error(
          // statusResult.message ||
          //   statusResult.data?.responseMessage ||
          "Unable to verify payment status."
        );
      }

      const responseCode =
        statusResult.data?.responseCode;

      const status = String(
        statusResult.data?.status || ""
      ).toLowerCase();

      if (
        responseCode === "000" ||
        status === "success" ||
        status === "successful" ||
        status === "completed"
      ) {
        // ────────────────────────────────────────────────────────
        // STEP 3 — Send successful transaction to our IPN API
        // ────────────────────────────────────────────────────────

        // Example:
        // Zah20260909175125
        //
        // becomes:
        // 20260909175125
        //
        // for pp_TxnDateTime

        const txnDateTime = txnRef.replace(/\D/g, "");

        if (!txnDateTime) {
          throw new Error(
            GENERIC_TRANSACTION_ERROR
          );
        }

        console.log(
          "================================="
        );
        console.log(
          "Sending Successful Transaction to IPN"
        );
        console.log(
          "================================="
        );

        console.log(
          "IPN Transaction Reference:",
          txnRef
        );

        console.log(
          "IPN Transaction DateTime:",
          txnDateTime
        );

        const ipnBody = {
          pp_Version: "2.0",
          pp_TxnType: "MWALLET",
          pp_BankID: "",
          pp_ProductID: null,
          pp_Password: "0123456789",
          pp_TxnRefNo: txnRef,
          pp_TxnDateTime: txnDateTime,
          pp_ResponseCode: "121",
          pp_ResponseMessage:
            "Transaction has been marked confirmed by Merchant.",
          pp_AuthCode:
            statusResult.data?.authCode || "",
          pp_SettlementExpiry: null,
          pp_RetreivalReferenceNo:
            statusResult.data?.retrievalRefNo ||
            paymentResult.data?.retrievalRefNo ||
            "",
        };

        console.log(
          "Complete IPN Request Body:",
          ipnBody
        );

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
          "Complete IPN Response:",
          ipnResult
        );

        if (
          !ipnResponse.ok ||
          !ipnResult.success
        ) {
          throw new Error(
            "Ipn service unavailable, will get to you soon."
          );
        }

        // ────────────────────────────────────────────────────────
        // STEP 4 — Only show success AFTER IPN succeeds
        // ────────────────────────────────────────────────────────

        setResultType("success");

        setMessage(
          "Payment processed successfully."
        );

        return;
      }

      setResultType("failure");

      setMessage(
        // statusResult.message ||
        //   statusResult.data?.responseMessage ||
        //   paymentResult.message ||
        "Payment procedure unsuccessful. Try again later"
      );
    } catch (err) {
      console.error(
        "Without-CNIC payment error:",
        err
      );

      setResultType("failure");

      setMessage(
        // err instanceof Error
        //   ? err.message
        //   : 
        "Unable to process your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ======================================================
          PAGE CONTAINER
          ====================================================== */}

      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div
          className="rounded-2xl p-6"
          style={{
            background: surface,
            border: `1px solid ${surfaceBdr}`,
          }}
        >
          <div className="mb-5 h-0.5 w-16 rounded-full bg-gradient-to-r from-[#F0B429] to-[#3B82F6]" />

          <button
            type="button"
            onClick={() =>
              navigate("/pay-with-jazzcash", {
                state: {
                  accessToken,
                },
              })
            }
            className="mb-6 flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
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
                JazzCash MWallet
              </p>

              <h1
                className="text-2xl font-semibold text-white"
                style={{
                  fontFamily: "'Fraunces', serif",
                }}
              >
                Pay with JazzCash
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details below to securely
                complete your payment.
              </p>
            </div>

          </div>
        </div>

        {/* ====================================================
            FORM
            ==================================================== */}

        <div
          className="mt-6 rounded-2xl p-6 md:p-8"
          style={{
            background: surface,
            border: `1px solid ${surfaceBdr}`,
          }}
        >

          {/* FORM HEADER */}

          <div className="mb-8 flex items-center gap-3">

            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: amberDim,
                border: `1px solid ${amberBdr}`,
              }}
            >
              <CreditCard
                className="h-5 w-5"
                style={{ color: amber }}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Payment Details
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Complete the form to continue
              </p>
            </div>

          </div>

          {/* ==================================================
              STEP 1 — PLAN
              ================================================== */}

          <div>

            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              1. Select your plan
            </label>

            <div className="space-y-2">

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
                    className="w-full rounded-xl p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: isSelected
                        ? blueDim
                        : surfaceEl,
                      border: `1px solid ${isSelected
                        ? blueBdr
                        : surfaceBdr
                        }`,
                    }}
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
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

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {plan.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {plan.description}
                          </p>
                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p
                          className="text-base font-bold"
                          style={{
                            color: isSelected
                              ? amber
                              : "white",
                          }}
                        >
                          PKR{" "}
                          {plan.amount.toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </button>
                );
              })}

            </div>

          </div>

          {/* DIVIDER */}

          <div
            className="my-7"
            style={{
              borderTop: `1px solid ${surfaceBdr}`,
            }}
          />

          {/* ==================================================
              STEP 2 — MOBILE NUMBER
              ================================================== */}

          <div>

            <label
              htmlFor="msisdn"
              className="mb-3 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              2. JazzCash mobile number
            </label>

            <div className="relative">

              <Smartphone
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                style={{
                  color: "#475569",
                }}
              />

              <input
                id="msisdn"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="03123456789"
                value={msisdn}
                onChange={(e) =>
                  setMsisdn(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                disabled={loading}
                className="w-full rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "rgba(255,255,255,0.035)",
                  border: `1px solid ${surfaceBdr}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    blueBdr;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    surfaceBdr;
                }}
              />

            </div>

            <p className="mt-2 text-xs text-slate-600">
              Enter the mobile number registered with
              your JazzCash account.
            </p>

          </div>

          {/* ==================================================
              ERROR
              ================================================== */}

          {message && !resultType && (
            <div
              className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
              style={{
                background:
                  "rgba(239,68,68,0.08)",
                border:
                  "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              <XCircle className="h-5 w-5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {/* ==================================================
              PAYMENT SUMMARY
              ================================================== */}

          <div
            className="mt-7 rounded-xl p-5"
            style={{
              background: surfaceEl,
              border: `1px solid ${surfaceBdr}`,
            }}
          >

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Selected plan
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  {selectedPlanData?.name}
                </p>
              </div>

              <div className="text-right">

                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Total
                </p>

                <p
                  className="mt-1 text-xl font-bold"
                  style={{
                    color: amber,
                  }}
                >
                  PKR{" "}
                  {selectedPlanData?.amount.toLocaleString()}
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              PAY BUTTON
              ================================================== */}

          <button
            type="button"
            onClick={handlePayment}
            disabled={
              loading ||
              !accessToken
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background:
                "linear-gradient(135deg,#F0B429,#f59e0b)",
              color: "#0f172a",
              boxShadow:
                "0 4px 18px rgba(240,180,41,0.18)",
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

          {/* ==================================================
              SECURITY
              ================================================== */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            <div
              className="rounded-xl p-4"
              style={{
                background: surfaceEl,
                border: `1px solid ${surfaceBdr}`,
              }}
            >
              <div className="flex items-start gap-3">

                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: blue }}
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure Payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your transaction is securely
                    processed through JazzCash.
                  </p>
                </div>

              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                background: surfaceEl,
                border: `1px solid ${surfaceBdr}`,
              }}
            >
              <div className="flex items-start gap-3">

                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: amber }}
                />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Instant Verification
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Your payment status will be
                    verified after the transaction.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* SECURITY FOOTER */}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
            <Lock className="h-3.5 w-3.5" />
            SSL encrypted connection
          </div>

        </div>

      </div>

      {/* ======================================================
          RESULT MODAL
          ====================================================== */}

      {resultType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 backdrop-blur-sm"
          style={{
            background: "rgba(2,6,23,0.75)",
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-7 text-center"
            style={{
              background: "#0F172A",
              border: `1px solid ${surfaceBdr}`,
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.5)",
            }}
          >

            {resultType === "success" ? (
              <>
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background:
                      "rgba(34,197,94,0.12)",
                    border:
                      "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  <CheckCircle2 className="h-9 w-9 text-green-400" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  Payment successful
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {message}
                </p>

                <div
                  className="mt-6 rounded-xl p-4 text-left"
                  style={{
                    background: surfaceEl,
                    border: `1px solid ${surfaceBdr}`,
                  }}
                >

                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">
                      Plan
                    </span>

                    <span
                      className="text-sm font-semibold"
                      style={{ color: amber }}
                    >
                      {selectedPlanData?.name}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-slate-500">
                      Amount
                    </span>

                    <span className="text-sm font-semibold text-white">
                      PKR{" "}
                      {selectedPlanData?.amount.toLocaleString()}
                    </span>
                  </div>

                  {txnRefNo && (
                    <div
                      className="mt-3 pt-3"
                      style={{
                        borderTop: `1px solid ${surfaceBdr}`,
                      }}
                    >
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Transaction Reference
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-300">
                        {txnRefNo}
                      </p>
                    </div>
                  )}

                  {retrievalRefNo && (
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Retrieval Reference
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-300">
                        {retrievalRefNo}
                      </p>
                    </div>
                  )}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background:
                      "linear-gradient(135deg,#F0B429,#f59e0b)",
                    color: "#0f172a",
                  }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background:
                      "rgba(239,68,68,0.12)",
                    border:
                      "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <XCircle className="h-9 w-9 text-red-400" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-white">
                  Payment unsuccessful
                </h2>

                <p className="mt-3 text-sm leading-6 text-red-400">
                  {message}
                </p>

                {txnRefNo && (
                  <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                      background: surfaceEl,
                      border: `1px solid ${surfaceBdr}`,
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Transaction Reference
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-300">
                      {txnRefNo}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setResultType(null)
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: blue,
                    color: "white",
                  }}
                >
                  Try Again
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
              <Lock className="h-3.5 w-3.5" />
              Secure encrypted checkout
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
