import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { sendPin, verifyPin, subscribeUser } from "@/modules/shared/services/subscriptionService";
import { useAuth } from "@/modules/shared/context/AuthContext";

const SubscribePage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [msisdn, setMsisdn] = useState("");
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
    }
    else if (mzaMsisdn) {
      setMsisdn(mzaMsisdn);
      setIsAutoMsisdn(true);
    }

  }, []);

  /* Subscribe or Send PIN */

  const handleSubscribe = async () => {

    if (!msisdn) {
      setError("Please enter mobile number");
      return;
    }

    try {

      setLoading(true);
      setError("");

      if (isAutoMsisdn) {

        /* Direct subscribe for HE/MZA */
        console.log("call Subscriber:"+ msisdn +" serviceid "+ serviceId);
        const sub = await subscribeUser(msisdn, serviceId);

        if (sub.status === "1") {

          login(msisdn);

          localStorage.setItem("activeServiceId", serviceId);

          setStep("SUCCESS");

        } else {

          setError(sub.desc || "Subscription failed");

        }

      } else {

        /* Manual user → Send PIN */

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

  /* Verify PIN */

  const handleVerifyPin = async () => {

    try {

      setLoading(true);
      setError("");

      const verify = await verifyPin(msisdn, pin, serviceId);

      if (verify.status === "SUCCESS") {

        const sub = await subscribeUser(msisdn, serviceId);

        if (sub.status === "1") {

          login(msisdn);

          localStorage.setItem("activeServiceId", serviceId);

          setStep("SUCCESS");

        } else {

          setError(sub.desc || "Subscription failed");

        }

      } else {

        setError("Invalid PIN");

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

  const packages = [
    { id: "205", name: "Daily", price: "Rs 5+Tax" },
    { id: "206", name: "Weekly", price: "Rs 15+Tax" },
    { id: "207", name: "Monthly", price: "Rs 50+Tax" }
  ];

  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-900 flex items-center justify-center px-4">

      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8">

        {step === "MSISDN" && (

          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              Subscribe to Zaheen
            </h2>

            <label className="text-sm font-semibold mb-2 block">
              Mobile Number
            </label>

            <input
              type="text"
              value={msisdn}
              onChange={(e)=>setMsisdn(e.target.value)}
              disabled={isAutoMsisdn}
              className="border w-full p-3 rounded-lg mb-6"
              placeholder="923XXXXXXXXX"
            />

            <label className="text-sm font-semibold mb-3 block">
              Choose Package
            </label>

            <div className="grid grid-cols-3 gap-3 mb-6">

              {packages.map(pkg => (

                <button
                  key={pkg.id}
                  onClick={()=>setServiceId(pkg.id)}
                  className={`p-3 rounded-xl border text-center transition
                  ${serviceId === pkg.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 hover:bg-gray-100"}`}
                >

                  <div className="font-semibold">
                    {pkg.name}
                  </div>

                  <div className="text-sm">
                    {pkg.price}
                  </div>

                </button>

              ))}

            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleSubscribe}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Processing..."
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
              onChange={(e)=>setPin(e.target.value)}
              className="border w-full p-3 text-center text-xl mb-4 rounded-lg"
              placeholder="----"
            />

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

            <div className="text-green-500 text-5xl mb-4">
              ✓
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Subscription Activated
            </h2>

            <p className="text-gray-500 mb-6">
              Welcome to Zaheen Learning Portal
            </p>

            <button
              onClick={()=>navigate("/")}
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