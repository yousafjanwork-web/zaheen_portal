import { useEffect, useState } from "react";
import { sendPin, verifyPin } from "@/modules/shared/services/subscriptionService";

export const useSubscription = () => {
  const [msisdn, setMsisdn] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [txid, setTxid] = useState("");

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"MSISDN" | "OTP">("MSISDN");
  const [timer, setTimer] = useState(30);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const params = new URLSearchParams(window.location.search);

  const serviceId =
    params.get("service_id") ||
    params.get("serviceid") ||
    localStorage.getItem("service_id") ||
    "205";

  const normalizeMsisdn = (value: string) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("92")) return digits;
    if (digits.startsWith("0")) return "92" + digits.slice(1);
    if (digits.length === 10) return "92" + digits;

    return digits;
  };


  const getSubMethod = (msisdnFromParams: string | null) => {
    const params = new URLSearchParams(window.location.search);

    // MZA
    if (
      params.get("mza") ||
      params.get("source")?.toLowerCase() === "mza" ||
      params.get("channel")?.toLowerCase() === "mza" ||
      sessionStorage.getItem("mzaMsisdn")
    ) {
      return "MZA";
    }

    // Campaign (auto msisdn)
    if (msisdnFromParams && msisdnFromParams.trim() !== "") {
      return "CAMPAIGN";
    }

    // Default
    return "WEB";
  };

  const resetForm = () => {
    setMsisdn("");
    setPin(["", "", "", ""]);
    setTimer(0);
    setStep("MSISDN");
  };

  useEffect(() => {
    const urlMsisdn = params.get("msisdn");
    const urlTransactionId = params.get("transaction_id");
    const urlPin = params.get("pin");

    if (urlMsisdn && urlMsisdn.trim() !== "") {
      setMsisdn(urlMsisdn);
      setStep("OTP");
    } else {
      setStep("MSISDN");
    }

    if (urlTransactionId) setTxid(urlTransactionId);

    if (urlPin && urlPin.length === 4) {
      setPin(urlPin.split(""));
    }
  }, []);

  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  useEffect(() => {
    if (step !== "OTP" || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleSendPin = async () => {
    if (!msisdn) {
      setAlert({ type: "error", message: "Enter mobile number" });
      return;
    }

    try {
      setLoading(true);
      const formatted = normalizeMsisdn(msisdn);

      const res = await sendPin(formatted, serviceId);

      if (res.status === "PIN_SENT") {
        setStep("OTP");
        setTimer(30);
        setAlert({ type: "success", message: "PIN sent successfully" });
      } else {
        setAlert({ type: "error", message: "Failed to send PIN" });
      }
    } catch {
      setAlert({ type: "error", message: "Error sending PIN" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPin = pin.join("");

    if (!msisdn || fullPin.length !== 4) {
      setAlert({ type: "error", message: "Enter valid PIN" });
      return;
    }

    try {
      setLoading(true);
      const formatted = normalizeMsisdn(msisdn);

      const urlMsisdn = params.get("msisdn");
      const subMethod = getSubMethod(urlMsisdn);

      console.log("VERIFY SUBMETHOD:", subMethod); // ✅ testing log

      const res = await verifyPin(
        formatted,
        fullPin,
        serviceId,
        txid,
        subMethod // ✅ pass this
      );

      if (res.status === "SUCCESS") {
        setAlert({ type: "success", message: "Subscription successful" });

        resetForm();
        window.location.href = "/thanks-for-subscribing";
      } else {
        setAlert({ type: "error", message: "Invalid PIN" });
      }
    } catch {
      setAlert({ type: "error", message: "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(30);
    await sendPin(msisdn, serviceId);
  };

  return {
    msisdn,
    setMsisdn,
    pin,
    setPin,
    loading,
    step,
    timer,
    alert,
    handleSendPin,
    handleVerify,
    handleResend,
    handlePinChange,
  };
};