import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  sendPin,
  verifyPin,
  checkSubscriberStatus
} from "@/services/subscriptionService";

import { useAuth } from "@/context/AuthContext";

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

      const res = await sendPin(number);

      if (res.status === "PIN_SENT") {
        setStep("OTP");
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

      const res = await sendPin(msisdn);

      if (res.status === "PIN_SENT") {
        setStep("OTP");
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

      if (verify.status !== "SUCCESS") {

        setError("Invalid PIN");
        setLoading(false);
        return;

      }

      /* CHECK SUBSCRIBER STATUS */

      const status = await checkSubscriberStatus(msisdn);

      if (status.status === "ACTIVE") {

        login(msisdn);
        navigate("/");

      } else {

        setError("You are not subscribed. Please subscribe first.");

      }

      setLoading(false);

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
              onChange={(e)=>setMsisdn(e.target.value)}
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
              onChange={(e)=>setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl mb-4"
            />

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
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