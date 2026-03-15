import React, { useState, useEffect } from "react";
import {
  sendPin,
  verifyPin,
  subscribeUser
} from "@/services/subscriptionService";

import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
interface Props {
  onClose: () => void;
}

const SubscribeModal: React.FC<Props> = ({ onClose }) => {
const { login } = useAuth();
  const [step, setStep] = useState<"MSISDN" | "OTP" | "SUCCESS">("MSISDN");

  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(30);

  useEffect(() => {

    if (step !== "OTP") return;

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer, step]);

  /* Send PIN */
  const handleSendPin = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await sendPin(msisdn);

      if (res.status === "PIN_SENT") {
        setStep("OTP");
        setTimer(30);
      }

      setLoading(false);

    } catch {

      setLoading(false);
      setError("Failed to send PIN");

    }
  };

  /* Verify PIN */
  const handleVerifyPin = async () => {

    try {

      setLoading(true);
      setError("");

      const verify = await verifyPin(msisdn, pin);

      if (verify.status === "SUCCESS") {
      const subRes = await subscribeUser(msisdn);
         // CHECK SUBSCRIPTION RESPONSE
      if (subRes.status === "1") {

        // subscription success
        login(msisdn);
        setStep("SUCCESS");

      } else {

        // subscription failed
        setError(subRes.desc || "Subscription failed");

      }
      }

      setLoading(false);

    } catch {

      setLoading(false);
      setError("Invalid PIN");

    }
  };

  const handleResend = async () => {

    setTimer(30);

    try {
      await sendPin(msisdn);
    } catch {
      setError("Failed to resend PIN");
    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-2xl p-8 shadow-2xl relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        {/* STEP 1 */}
        {step === "MSISDN" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Enter Mobile Number
            </h2>

            <p className="text-slate-500 text-center mb-6">
              Please enter your Zong number
            </p>

            <input
              type="text"
              placeholder="923XXXXXXXXX"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              className="border w-full p-3 rounded-xl mb-4 focus:ring-2 focus:ring-primary"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSendPin}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90"
            >
              {loading ? "Sending..." : "Send PIN"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === "OTP" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Enter Verification PIN
            </h2>

            <p className="text-slate-500 text-center mb-6">
              PIN sent to {msisdn}
            </p>

            <input
              type="text"
              placeholder="----"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl tracking-widest rounded-xl mb-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleVerifyPin}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold mb-3"
            >
              {loading ? "Verifying..." : "Verify PIN"}
            </button>

            <div className="text-center text-sm text-slate-500">

              {timer > 0 ? (
                <p>Resend PIN in {timer}s</p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-primary font-medium"
                >
                  Resend PIN
                </button>
              )}

            </div>
          </>
        )}

        {/* SUCCESS */}
        {step === "SUCCESS" && (
          <div className="text-center">

            <div className="text-green-500 text-5xl mb-4">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Subscription Activated
            </h2>

            <p className="text-slate-500 mb-6">
              Welcome to Zaheen Learning Portal
            </p>

            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-3 rounded-xl"
            >
              Continue
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default SubscribeModal;