import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  sendPin,
  verifyPin,
  subscribeUser,
  makeJazzCashPayment
} from "@/modules/shared/services/subscriptionService";
import { useAuth } from "@/modules/shared/context/AuthContext";

type SubscriptionType = "ZONG" | "OTHER";

const SubscribePage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("ZONG");

  const [zongMsisdn, setZongMsisdn] = useState("");
  const [otherMsisdn, setOtherMsisdn] = useState("");
  const [cnic, setCnic] = useState("");

  // Whichever field is relevant for the currently selected toggle
  const msisdn = subscriptionType === "ZONG" ? zongMsisdn : otherMsisdn;
  const setMsisdn = subscriptionType === "ZONG" ? setZongMsisdn : setOtherMsisdn;
  const [serviceId, setServiceId] = useState<string>(
    searchParams.get("plan") ?? "205"
  );

  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"MSISDN" | "OTP" | "SUCCESS">("MSISDN");

  const [isAutoMsisdn, setIsAutoMsisdn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(30);

  /* Detect HE or MZA MSISDN */

  useEffect(() => {

    const heMsisdn = searchParams.get("msisdn");
    const mzaMsisdn = sessionStorage.getItem("mzaMsisdn");

    if (heMsisdn) {
      setMsisdn(heMsisdn);
      setIsAutoMsisdn(true);
    } else if (mzaMsisdn) {
      setMsisdn(mzaMsisdn);
      setIsAutoMsisdn(true);
    }

  }, []);

  /* Packages — "amount" is the numeric value sent to JazzCash payment API */

  const packages = [
    { id: "205", name: "Daily", price: "Rs 5+Tax", amount: 5 },
    { id: "206", name: "Weekly", price: "Rs 15+Tax", amount: 15 },
    { id: "207", name: "Monthly", price: "Rs 50+Tax", amount: 50 }
  ];

  const selectedPackage = packages.find(pkg => pkg.id === serviceId);

  /* Subscribe or Send PIN (Zong flow) */

  const handleZongSubscribe = async () => {

    if (!msisdn) {
      setError("Please enter mobile number");
      return;
    }

    try {

      setLoading(true);
      setError("");

      if (isAutoMsisdn) {

        console.log("call Subscriber:" + msisdn + " serviceid " + serviceId);
        const sub = await subscribeUser(msisdn, serviceId);

        if (sub.status === "1" || sub.desc?.toLowerCase().includes("already active")) {
          login(msisdn);
          localStorage.setItem("activeServiceId", serviceId);
          window.location.href = "/";
        } else {
          setError(sub.desc || "Subscription failed");
        }

      } else {

        const res = await sendPin(msisdn, serviceId);

        if (res.status === "PIN_SENT") {
          setStep("OTP");
          setTimer(30);
        } else {
          setError("Failed to send PIN");
        }

      }

    } catch {

      setError("Operation failed");

    }

    setLoading(false);

  };

  /* Pay via JazzCash ("Other Subscription" flow) */

  const handleJazzCashSubscribe = async () => {

    if (!msisdn) {
      setError("Please enter mobile number");
      return;
    }

    if (!/^\d{6}$/.test(cnic)) {
      setError("Please enter the last 6 digits of your CNIC");
      return;
    }

    if (!selectedPackage) {
      setError("Please select a package");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const result = await makeJazzCashPayment(msisdn, selectedPackage.amount, cnic);

      // NOTE: adjust this success check to match the real JazzCash/Zaheen
      // response shape once you can see a live response — this is a
      // reasonable default (success flag OR status "success"/1).
      const isSuccess =
        result?.success === true ||
        result?.status === "success" ||
        result?.status === 1 ||
        result?.status === "1";

      if (isSuccess) {
        login(msisdn);
        localStorage.setItem("activeServiceId", serviceId);
        setStep("SUCCESS");
      } else {
        setError(result?.message || result?.desc || "Payment failed");
      }

    } catch (err) {

      console.error("JazzCash payment failed:", err);
      setError("Payment failed. Please try again.");

    }

    setLoading(false);

  };

  const handleSubscribe = () => {
    if (subscriptionType === "ZONG") {
      handleZongSubscribe();
    } else {
      handleJazzCashSubscribe();
    }
  };

  /* Verify PIN (Zong flow only) */

  const handleVerifyPin = async () => {

    try {

      setLoading(true);
      setError("");

      const verify = await verifyPin(msisdn, pin, serviceId);

      if (verify.status === "SUCCESS") {

        const sub = await subscribeUser(msisdn, serviceId);

        if (sub.status === "1" || sub.desc?.toLowerCase().includes("already active")) {
          login(msisdn);
          localStorage.setItem("activeServiceId", serviceId);
          window.location.href = "/";
        } else {
          setError(sub.desc || "Subscription failed");
        }

      } else {

        setError(verify.message || "Invalid PIN. Please try again.");

      }

    } catch {

      setError("Verification failed");

    }

    setLoading(false);

  };

  /* OTP Timer */

  useEffect(() => {

    if (step !== "OTP") return;
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer, step]);

  const handleResend = async () => {

    setTimer(30);
    await sendPin(msisdn, serviceId);

  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 flex items-center justify-center px-4">

      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8">

        {step === "MSISDN" && (

          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              Subscribe to Zaheen
            </h2>

            {/* Subscription type toggle */}

            <div className="grid grid-cols-2 gap-3 mb-6">

              <button
                onClick={() => {
                  setSubscriptionType("ZONG");
                  setError("");
                }}
                className={`p-3 rounded-xl border text-center font-semibold transition
                ${subscriptionType === "ZONG"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"}`}
              >
                Zong
              </button>

              <button
                onClick={() => {
                  setSubscriptionType("OTHER");
                  setError("");
                }}
                className={`p-3 rounded-xl border text-center font-semibold transition
                ${subscriptionType === "OTHER"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"}`}
              >
                Other Subscription
              </button>

            </div>

            <label className="text-sm font-semibold mb-2 block">
              Mobile Number
            </label>

            <input
              type="text"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              disabled={isAutoMsisdn}
              className="border w-full p-3 rounded-lg mb-6"
              placeholder="923XXXXXXXXX"
            />

            {subscriptionType === "OTHER" && (

              <>
                <label className="text-sm font-semibold mb-2 block">
                  CNIC (last 6 digits) <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className="border w-full p-3 rounded-lg mb-6"
                  placeholder="XXXXXX"
                />
              </>

            )}

            <label className="text-sm font-semibold mb-3 block">
              Choose Package
            </label>

            <div className="grid grid-cols-3 gap-3 mb-6">

              {packages.map(pkg => (

                <button
                  key={pkg.id}
                  onClick={() => setServiceId(pkg.id)}
                  className={`p-3 rounded-xl border text-center transition
                  ${serviceId === pkg.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className="font-semibold">{pkg.name}</div>
                  <div className="text-sm">{pkg.price}</div>
                </button>

              ))}

            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Processing..."
                : subscriptionType === "OTHER"
                  ? "Pay via JazzCash"
                  : isAutoMsisdn
                    ? "Subscribe Now"
                    : "Send PIN"}
            </button>

          </>

        )}

        {step === "OTP" && (

          <>
            <h2 className="text-xl font-bold text-center mb-4">
              Verify PIN
            </h2>

            <p className="text-center text-sm mb-4">
              PIN sent to {msisdn}
            </p>

            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl mb-4 rounded-lg"
              placeholder="----"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <button
              onClick={handleVerifyPin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify & Subscribe"}
            </button>

            {timer > 0 ? (
              <p className="text-center text-sm mt-3">
                Resend in {timer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-600 text-sm block mx-auto mt-3"
              >
                Resend PIN
              </button>
            )}

          </>

        )}

        {step === "SUCCESS" && (

          <div className="text-center">

            <div className="text-green-500 text-5xl mb-4">✓</div>

            <h2 className="text-2xl font-bold mb-2">
              Subscription Activated
            </h2>

            <p className="text-gray-500 mb-6">
              Welcome to Zaheen Learning Portal
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Continue
            </button>

          </div>

        )}

      </div>

    </div>

  );

};

export default SubscribePage;