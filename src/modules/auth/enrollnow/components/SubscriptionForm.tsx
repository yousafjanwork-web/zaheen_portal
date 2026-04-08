import { ShieldCheck } from "lucide-react";

export default function SubscriptionForm({
  msisdn,
  setMsisdn,
  pin,
  loading,
  step,
  timer,
  handleSendPin,
  handleVerify,
  handleResend,
  handlePinChange,
}: any) {
  return (
    <div className="lg:w-1/2 bg-white p-8 rounded-xl shadow">
      <div className="mb-8 text-center">
        <span className="uppercase tracking-widest text-primary font-semibold text-xs mb-3 block">
          Zaheen Educational Portal
        </span>

        <h1 className="text-3xl font-extrabold mb-3">
          Verify Your Subscription
        </h1>

        <p className="text-sm text-gray-500">
          Enter your mobile number and PIN to continue
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <label className="block text-sm font-semibold mb-2">
          Mobile Number
        </label>

        <input
          value={msisdn}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            setMsisdn(raw);
          }}
          inputMode="numeric"
          placeholder="923XXXXXXXXX"
          className="w-full p-3 border rounded-xl"
          disabled={step === "OTP"}
        />

        {step === "MSISDN" && (
          <button
            type="button"
            onClick={handleSendPin}
            className="w-full bg-blue-600 text-white py-3 rounded-full"
          >
            {loading ? "Sending..." : "Send PIN"}
          </button>
        )}

        {step === "OTP" && (
          <>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold">4-Digit PIN</label>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {pin.map((d: string, i: number) => (
                <input
                  key={i}
                  id={`pin-${i}`}
                  value={d}
                  maxLength={1}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    handlePinChange(i, val);
                  }}
                  inputMode="numeric"
                  className="text-center text-xl p-3 border rounded-xl"
                />
              ))}
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-full">
              {loading ? "Verifying..." : "Verify PIN"}
              <ShieldCheck className="inline ml-2" size={18} />
            </button>

            {timer > 0 ? (
              <p className="text-center text-sm">
                Resend in {timer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-blue-600 text-sm block mx-auto"
              >
                Resend PIN
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}