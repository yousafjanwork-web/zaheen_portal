import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  checkSubscriberStatus
} from "@/modules/shared/services/subscriptionService";

import { loginPin, verifyLoginPin } from "@/modules/shared/services/loginService";

import { useAuth } from "@/modules/shared/context/AuthContext";

const LoginPage = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { login } = useAuth();

  const [step, setStep] = useState<"MSISDN" | "OTP">("MSISDN");

  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* READ MSISDN FROM HE */

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
      const res = await loginPin(number);

      console.log("LOGIN PIN RESPONSE:", res);

      if (res.pin) {
        // ✅ PIN actually sent
        setStep("OTP");
      } else {
        // ❌ Not subscribed
        setError("You are currently inactive. Please subscribe first.");
        setMsisdn("");
      }

    } catch {
      setError("Failed to send PIN");
    }
  };

  /* MANUAL SEND PIN */

  const handleSendPin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginPin(msisdn);

      console.log("LOGIN PIN RESPONSE:", res);

      if (res.pin) {
        setStep("OTP");
      } else {
        setError("You are currently inactive. Please subscribe first.");
        setMsisdn("");
      }

    } catch {
      setError("Failed to send PIN");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY PIN */

  const handleVerifyPin = async () => {
    try {
      setLoading(true);
      setError("");

      const verify = await verifyLoginPin(msisdn, pin);

      console.log("VERIFY LOGIN RESPONSE:", verify);

      if (verify.status !== "ACTIVE") {
        setError("Invalid PIN or not subscribed");
        setLoading(false);
        return;
      }

      /* LOGIN SUCCESS */
      login(msisdn);
      navigate("/");

    } catch {
      setLoading(false);
      setError("Login failed");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-[420px] rounded-2xl p-8 shadow-xl">

        {step === "MSISDN" && (

          <>
            <h2 className="text-2xl font-bold mb-4">
              Login
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

        {step === "OTP" && (

          <>
            <h2 className="text-2xl font-bold mb-4">
              Enter PIN
            </h2>

            <p className="text-sm mb-4">
              PIN sent to {msisdn}
            </p>

            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl mb-4"
            />

            {error && (
              <div className="mb-4">
                <p className="text-red-500 text-sm mb-2">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleVerifyPin}
              className="w-full bg-primary text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify PIN"}
            </button>

          </>

        )}

      </div>

    </div>

  );

};

export default LoginPage;