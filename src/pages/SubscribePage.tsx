import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  sendPin,
  verifyPin,
  subscribeUser
} from "@/services/subscriptionService";

import { useAuth } from "@/context/AuthContext";

const SubscribePage = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { login } = useAuth();

  const [step, setStep] = useState<"MSISDN" | "OTP" | "SUCCESS">("MSISDN");

  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  /* READ MSISDN FROM QUERY */

  useEffect(() => {

    const queryMsisdn = searchParams.get("msisdn");

    if (queryMsisdn) {

      setMsisdn(queryMsisdn);
      autoSendPin(queryMsisdn);

    }

  }, []);

  /* AUTO SEND PIN */

  const autoSendPin = async (number: string) => {

    try {

      const res = await sendPin(number,login);

      if (res.status === "PIN_SENT") {

        setStep("OTP");
        setTimer(30);

      }

    } catch {

      setError("Failed to send PIN");

    }

  };

  /* SEND PIN */

  const handleSendPin = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await sendPin(msisdn,login);

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

  /* VERIFY PIN */

  const handleVerifyPin = async () => {

    try {

      setLoading(true);
      setError("");

      const verify = await verifyPin(msisdn, pin);

      if (verify.status === "SUCCESS") {

        const subRes = await subscribeUser(msisdn);

        if (subRes.status === "1") {

          login(msisdn);
          setStep("SUCCESS");

        } else {

          setError(subRes.desc);

        }

      } else {

        setError("Invalid PIN");

      }

      setLoading(false);

    } catch {

      setLoading(false);
      setError("Verification failed");

    }

  };

  /* TIMER */

  useEffect(() => {

    if (step !== "OTP") return;
    if (timer === 0) return;

    const interval = setInterval(() => {

      setTimer((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [timer, step]);

  const handleResend = async () => {

    setTimer(30);

    try {

      await sendPin(msisdn,login);

    } catch {

      setError("Failed to resend PIN");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-[420px] rounded-2xl p-8 shadow-xl">

        {/* STEP 1 */}

        {step === "MSISDN" && (

          <>
            <h2 className="text-2xl font-bold mb-4">
              Enter Mobile Number
            </h2>

            <input
              type="text"
              placeholder="923XXXXXXXXX"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              className="border w-full p-3 rounded-lg mb-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSendPin}
              className="w-full bg-primary text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send PIN"}
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === "OTP" && (

          <>
            <h2 className="text-2xl font-bold mb-4">
              Enter PIN
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              PIN sent to {msisdn}
            </p>

            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl mb-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleVerifyPin}
              className="w-full bg-primary text-white py-3 rounded-lg mb-3"
            >
              {loading ? "Verifying..." : "Verify PIN"}
            </button>

            {timer > 0 ? (
              <p className="text-center text-sm">
                Resend in {timer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary text-sm"
              >
                Resend PIN
              </button>
            )}

          </>
        )}

        {/* SUCCESS */}

        {step === "SUCCESS" && (

          <div className="text-center">

            <div className="text-green-500 text-5xl mb-4">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Subscription Activated
            </h2>

            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-6 py-3 rounded-lg"
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