import React, { useState } from "react";
import { sendPin, verifyPin, subscribeUser } from "@/services/subscriptionService";

interface Props {
  onClose: () => void;
}

const SubscribeModal: React.FC<Props> = ({ onClose }) => {

  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"MSISDN" | "PIN">("MSISDN");
  const [loading, setLoading] = useState(false);

  const handleSendPin = async () => {
    try {

      setLoading(true);

      const res = await sendPin(msisdn);

      if (res.status === "PIN_SENT") {
        setStep("PIN");
      }

      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert("Failed to send PIN");
    }
  };

  const handleVerifyPin = async () => {
    try {

      setLoading(true);

      const res = await verifyPin(msisdn, pin);

      if (res.status === "SUCCESS") {

        await subscribeUser(msisdn);

        alert("Subscription Successful");

        onClose();
      }

      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert("PIN verification failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-8 rounded-2xl w-96 shadow-xl">

        {step === "MSISDN" && (
          <>
            <h3 className="text-xl font-bold mb-4">
              Enter Mobile Number
            </h3>

            <input
              type="text"
              placeholder="923XXXXXXXXX"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              className="border w-full p-3 rounded-lg mb-4"
            />

            <button
              onClick={handleSendPin}
              className="w-full bg-primary text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send PIN"}
            </button>
          </>
        )}

        {step === "PIN" && (
          <>
            <h3 className="text-xl font-bold mb-4">
              Enter PIN
            </h3>

            <input
              type="text"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-3 rounded-lg mb-4"
            />

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

export default SubscribeModal;