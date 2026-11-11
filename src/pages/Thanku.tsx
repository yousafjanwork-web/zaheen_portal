/**
 * Thanku.tsx
 *
 * Display-only:
 *   /thanku?status=success
 *   /thanku?status=fail
 *
 * Payment processing:
 *   /thanku?status=success&userId=327822&requestId=ReqIdmvgmyb6i61e946fa3fee
 *
 * Only the complete success URL executes the charge and IPN APIs.
 */
 
import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
 
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
 
type Portal = "mdcat" | "issb" | "nat" | "trading" | "uniprep";

const PORTALS: Portal[] = ["mdcat", "issb", "nat", "trading", "uniprep"];
 
const readPortal = (statePortal?: string): Portal | null => {
  if (statePortal && PORTALS.includes(statePortal as Portal)) {
    return statePortal as Portal;
  }
 
  try {
    const saved = JSON.parse(
      sessionStorage.getItem("social_payment_state") || "null"
    );
 
    if (saved?.portal && PORTALS.includes(saved.portal)) {
      return saved.portal as Portal;
    }
  } catch {
    // Ignore invalid saved state.
  }
 
  return null;
};
 
const readAccessToken = (): string | null => {
  const sessionToken = sessionStorage.getItem("zaheen_access_token");
 
  if (sessionToken) {
    return sessionToken;
  }
 
  try {
    const auth = JSON.parse(
      localStorage.getItem("zaheen_auth") || "{}"
    );
 
    return auth?.token || null;
  } catch {
    return null;
  }
};
 
const Thanku: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
 
  const status = params.get("status")?.toLowerCase();
  const userId = params.get("userId")?.trim() || "";
  const requestId = params.get("requestId")?.trim() || "";
 
  // A plain success URL must remain display-only.
  const isGatewaySuccess = status === "success";
 
  // APIs run only when all three required query parameters are present.
  const shouldProcessPayment =
    isGatewaySuccess && Boolean(userId) && Boolean(requestId);
 
  const portal = readPortal(
    (location.state as { portal?: string } | null)?.portal
  );
 
  const startedRef = useRef(false);
 
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [txnRefNo, setTxnRefNo] = useState("");
 
  useEffect(() => {
    // Critical: never call an API for a URL that lacks userId/requestId.
    if (!shouldProcessPayment) {
      return;
    }
 
    // Avoid starting the charge more than once in this mounted page.
    if (startedRef.current) {
      return;
    }
 
    startedRef.current = true;
 
    const chargeOneRupee = async () => {
      setLoading(true);
      setMessage("");
 
      try {
        const accessToken = readAccessToken();
 
        if (!accessToken) {
          throw new Error(
            "Your session has expired. Please sign in and try again."
          );
        }
 
        const amountPKR = 1;
 
        // Stable reference derived from requestId, rather than Date.now(),
        // so retries can reuse the same reference if the backend supports it.
        const billReference = `ZAHEEN-THANKU-${requestId}`;
        const description = "Zaheen subscription initial payment";
 
        const response = await fetch(CHARGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            userId,
            amountPKR,
            billReference,
            description,
          }),
        });
 
        const result: ChargeResponse = await response.json();
 
        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              result.data?.pp_ResponseMessage ||
              "Payment charge failed. Please try again."
          );
        }
 
        const chargeTxnRefNo = result.data?.pp_TxnRefNo;
 
        if (!chargeTxnRefNo) {
          throw new Error(
            "The charge response did not contain a transaction reference. Please verify the payment before retrying."
          );
        }
 
        setTxnRefNo(chargeTxnRefNo);
 
        // Notify the backend using the existing IPN payload structure.
        const txnDateTime = chargeTxnRefNo.replace(/\D/g, "");
 
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
 
        try {
          const ipnResponse = await fetch(IPN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(ipnBody),
          });
 
          const ipnResult: IpnResponse = await ipnResponse.json();
 
          if (!ipnResponse.ok || !ipnResult.success) {
            console.error("Payment IPN failed:", ipnResult);
          }
        } catch (ipnError) {
          console.error("Payment IPN request failed:", ipnError);
        }
 
        // Preserve the behavior of the supplied RecurringSuccess code:
        // an IPN error does not turn a successful charge into a failure.
        setPaymentSuccess(true);
        setMessage("Your PKR 1 payment was processed successfully.");
 
        sessionStorage.removeItem("recurring_bill_reference");
        sessionStorage.removeItem("recurring_description");
        sessionStorage.removeItem("recurring_msisdn");
      } catch (error) {
        console.error("Thanku payment error:", error);
 
        setPaymentSuccess(false);
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to process payment. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
 
    void chargeOneRupee();
  }, [shouldProcessPayment, userId, requestId]);
 
  const handleContinue = () => {
    sessionStorage.removeItem("social_payment_state");
 
    if (portal) {
      navigate("/social-app-download", {
        replace: true,
        state: { portal },
      });
    } else {
      navigate("/", { replace: true });
    }
  };
 
  // A plain success URL uses the original success dialogue.
  // A complete success URL shows the API result after processing.
  const isSuccess = shouldProcessPayment
    ? paymentSuccess
    : isGatewaySuccess;
 
  const isFailure = !isSuccess && !loading;
 
  const accent = loading
    ? "#60a5fa"
    : isSuccess
      ? "#2DD4BF"
      : "#f87171";
 
  const displayMessage = shouldProcessPayment
    ? message
    : isGatewaySuccess
      ? "Your payment was successful and your subscription is confirmed. You now have full access to all content."
      : "";
 
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden text-center"
        role={loading || isSuccess ? "status" : "alert"}
        style={{
          background: "rgba(15,23,42,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55)",
        }}
      >
        <div
          className="h-1 w-full"
          style={{
            background: loading
              ? "linear-gradient(90deg,#F0B429,#3B82F6)"
              : isSuccess
                ? "linear-gradient(90deg,#F0B429,#2DD4BF)"
                : "linear-gradient(90deg,#f87171,#F0B429)",
          }}
        />
 
        <div className="p-8">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{
              background: loading
                ? "rgba(59,130,246,0.1)"
                : isSuccess
                  ? "rgba(45,212,191,0.1)"
                  : "rgba(248,113,113,0.1)",
              border: `1px solid ${
                loading
                  ? "rgba(59,130,246,0.25)"
                  : isSuccess
                    ? "rgba(45,212,191,0.25)"
                    : "rgba(248,113,113,0.25)"
              }`,
            }}
          >
            {loading ? (
              <Loader2
                size={34}
                className="animate-spin"
                style={{ color: accent }}
              />
            ) : isSuccess ? (
              <CheckCircle2 size={34} style={{ color: accent }} />
            ) : (
              <XCircle size={34} style={{ color: accent }} />
            )}
          </div>
 
          <p
            className="text-sm font-medium mb-2"
            style={{ color: accent }}
          >
            {loading
              ? "Processing payment"
              : isSuccess
                ? "Payment successful"
                : "Payment unsuccessful"}
          </p>
 
          <h1
            className="text-3xl text-white font-semibold mb-3"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {loading
              ? "Please wait..."
              : isSuccess
                ? "Thank you!"
                : "Something went wrong"}
          </h1>
 
          <p className="text-slate-400 text-sm mb-7 leading-relaxed">
            {loading
              ? "We are processing your PKR 1 JazzCash wallet payment. Please do not close this page."
              : isFailure && shouldProcessPayment
                ? message
                : isFailure
                  ? (
                      <>
                        We couldn't complete your payment. Please try again.
                        If an amount was deducted from your account, contact
                        us at{" "}
                        <a
                          href="mailto:support@zaheen.com.pk"
                          className="text-teal-400 hover:underline"
                        >
                          support@zaheen.com.pk
                        </a>{" "}
                        or call 03 111 444 974.
                      </>
                    )
                  : displayMessage}
          </p>
 
          {!loading && isSuccess && (
            <>
              {shouldProcessPayment && (
                <div
                  className="mb-5 rounded-xl p-4 text-left"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Amount paid</span>
                    <span className="font-semibold text-[#F0B429]">
                      PKR 1
                    </span>
                  </div>
 
                  {txnRefNo && (
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Transaction reference
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-200">
                        {txnRefNo}
                      </p>
                    </div>
                  )}
                </div>
              )}
 
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 16px rgba(240,180,41,0.35)",
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
 
              {shouldProcessPayment && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={14} />
                  Payment securely processed by JazzCash
                </div>
              )}
            </>
          )}
 
          {!loading && isFailure && (
            <>
              <button
                type="button"
                onClick={() =>
                  navigate("/social-payment", { replace: true })
                }
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 16px rgba(240,180,41,0.35)",
                }}
              >
                Try again
              </button>
 
              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="w-full mt-3 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                Back to home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Thanku;