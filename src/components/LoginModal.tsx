import React, { useState } from "react";
import { X } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

interface Props {
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {

  const [msisdn, setMsisdn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithMsisdn } = useLogin(() => {});

  const handleLogin = async () => {

    if (!msisdn) {
      setError("Please enter mobile number");
      return;
    }

    try {

      setLoading(true);

      const success = await loginWithMsisdn(msisdn);

      if (success) {
        onClose();
      } else {
        setError("You are not subscribed.");
      }

    } catch {

      setError("Login failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-2xl p-8 shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Login
        </h2>

        <p className="text-slate-500 text-center mb-6">
          Enter your Zong mobile number
        </p>

        <input
          type="text"
          placeholder="923XXXXXXXXX"
          value={msisdn}
          onChange={(e) => setMsisdn(e.target.value)}
          className="border w-full p-3 rounded-xl mb-4 focus:ring-2 focus:ring-primary"
        />

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90"
        >
          {loading ? "Checking..." : "Login"}
        </button>

      </div>

    </div>
  );
};

export default LoginModal;