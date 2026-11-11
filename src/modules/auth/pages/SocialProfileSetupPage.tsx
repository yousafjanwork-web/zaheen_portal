/**
 * SocialProfileSetupPage.tsx
 *
 * Shown after Google signup for MDCAT, ISSB, and NAT portals.
 * Two steps:
 *   Step 1 — Profile form (name auto-filled, email auto-filled, city + mobile required)
 *   Step 2 — App download page (Play Store link + Skip button)
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { updateUserProfile } from "@/modules/shared/services/profileService";
import { getSetupStatus } from "@/modules/shared/services/lmsService";
import { syncIssbSession } from "@/modules/shared/services/issbService";
import { goToPortal } from "@/modules/shared/utils/portalRedirect";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=pk.zaheen.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dwebsite";

// ── send-pin: detects the network and (for Zong) sends the OTP ──
const SEND_PIN_URL = "https://subgateway.fitsworld.com.pk/zongcharging/api/send-pin";
// All portals use service 205 today — change a value here if a portal gets its own service
const SERVICE_IDS: Record<string, string> = { mdcat: "205", issb: "205", nat: "205", trading: "205" };

type PinResult =
  | { ok: true; network: "zong" | "other"; transactionId?: string }
  | { ok: false; message: string };

const requestSendPin = async (msisdn: string, portal: string): Promise<PinResult> => {
  try {
    const params = new URLSearchParams({
      msisdn,
      serviceId: SERVICE_IDS[portal] ?? "205",
      subMethod: "WEB",
      source: localStorage.getItem("source") ?? "",
    });
    const res = await fetch(`${SEND_PIN_URL}?${params}`);
    const data = await res.json();
    const status = String(data?.status ?? "").toUpperCase();

    if (status === "PIN_SENT")  return { ok: true, network: "zong", transactionId: String(data?.transactionId ?? data?.data?.transactionId ?? "") };
    if (status === "NOT_FOUND") return { ok: true, network: "other" };
    return {
      ok: false,
      message: data?.message || data?.desc || "We couldn't verify your number. Please check it and try again.",
    };
  } catch {
    return { ok: false, message: "We couldn't check your number. Please check your connection and try again." };
  }
};

const PAKISTAN_CITIES = [
  "Abbottabad","Attock","Awaran","Badin","Bahawalpur","Bahawalnagar","Bannu",
  "Batagram","Bhalwal","Bhimber","Bhit Shah","Burewala","Chakdara","Chakwal",
  "Chaman","Charsadda","Chiniot","Chishtian","Chitral","Dadu","Daharki",
  "Dera Ghazi Khan","Dera Ismail Khan","Dina","Dinga","Dipalpur","Faisalabad",
  "Fateh Jang","Ghotki","Gilgit","Gojra","Gujranwala","Gujrat","Gujar Khan",
  "Hafizabad","Haripur","Hasilpur","Haveli Lakha","Hub","Hyderabad","Islamabad",
  "Jacobabad","Jampur","Jamshoro","Jhelum","Kamalia","Kamber","Kandhkot",
  "Karachi","Kasur","Khanewal","Kharian","Khushab","Khuzdar","Kohat","Kohlu",
  "Kot Addu","Kotli","Lahore","Larkana","Layyah","Lodhran","Loralai","Mailsi",
  "Malakand","Mandi Bahauddin","Mansehra","Mardan","Mianwali","Mingora",
  "Mirpur","Mirpur Khas","Multan","Muridke","Muzaffarabad","Muzaffargarh",
  "Narowal","Nawabshah","Nowshera","Okara","Pakpattan","Peshawar","Pind Dadan Khan",
  "Quetta","Rahim Yar Khan","Rajanpur","Rawalpindi","Sadiqabad","Sahiwal",
  "Saidu Sharif","Sambrial","Sanghar","Sargodha","Sheikhupura","Shikarpur",
  "Sialkot","Sibi","Sukkur","Swabi","Swat","Tando Adam","Tando Allah Yar",
  "Tando Muhammad Khan","Taxila","Thatta","Timergara","Toba Tek Singh",
  "Turbat","Umerkot","Vehari","Wah Cantonment","Wazirabad","Zhob",
];

type Portal = "mdcat" | "issb" | "nat" | "trading" | "uniprep";
type Step = "PROFILE" | "APP_DOWNLOAD";

interface SocialAuthState {
  token:   string;
  userId:  string;
  name:    string;
  email:   string;
  msisdn:  string;
  portal:  Portal;
  fromMsisdn?: boolean;
}

// Portal config
const PORTAL_CONFIG: Record<Portal, {
  label: string;
  accent: string;
  redirect: string;
}> = {
  mdcat:   { label: "MDCAT Prep",  accent: "#38bdf8", redirect: "/mdcat"  },
  issb:    { label: "ISSB Prep",   accent: "#D4FF00", redirect: "/issb/"  },
  nat:     { label: "NAT Prep",    accent: "#00C2FF", redirect: "/nat/"   },
  trading: { label: "Trading",     accent: "#00e676", redirect: "/skills/how-to-become-a-professional-trader" },
  uniprep: { label: "Entry Prep",  accent: "#6366f1", redirect: "/uniprep/" },
};

const ErrorBox: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
    ⚠ {msg}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

const SocialProfileSetupPage: React.FC = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loginWithUser } = useAuth();

  const state = location.state as SocialAuthState | null;

  const [step,    setStep]    = useState<Step>("PROFILE");
  const [name,          setName]          = useState(state?.name  ?? "");
  const [email,         setEmail]         = useState(state?.email ?? "");
  const [city,          setCity]          = useState("");
  const [cityInput,     setCityInput]     = useState("");
  const [cityDropdown,  setCityDropdown]  = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [mobile,        setMobile]        = useState(state?.fromMsisdn ? state.msisdn : "");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  // Guard
  if ((!state?.token && !state?.fromMsisdn) || !state?.userId) {
    navigate("/login", { replace: true });
    return null;
  }

  const portal  = state.portal as Portal;
  const config  = PORTAL_CONFIG[portal];

  // Validate Pakistani mobile number
  const isValidMobile = (num: string): boolean => {
    const d = num.replace(/\D/g, "");
    return (
      (d.length === 12 && d.startsWith("92")) ||
      (d.length === 11 && d.startsWith("0"))  ||
      (d.length === 10 && d.startsWith("3"))
    );
  };

  const normalizeMobile = (num: string): string => {
    const d = num.replace(/\D/g, "");
    if (d.length === 12 && d.startsWith("92")) return d;
    if (d.length === 11 && d.startsWith("0"))  return "92" + d.slice(1);
    if (d.length === 10 && d.startsWith("3"))  return "92" + d;
    return d;
  };

  const handleProfileSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name"); return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setError("Name should contain letters only, no numbers"); return;
    }
    if (!city.trim()) {
      setError("Please select your city from the dropdown"); return;
    }
    if (!PAKISTAN_CITIES.includes(city)) {
      setError("Please select a valid Pakistani city from the dropdown"); return;
    }
    if (!state.fromMsisdn) {
      if (!mobile.trim()) {
        setError("Please enter your mobile number"); return;
      }
      if (!/^\d+$/.test(mobile.replace(/[+\s]/g, ""))) {
        setError("Mobile number should contain numbers only"); return;
      }
      if (!isValidMobile(mobile)) {
        setError("Please enter a valid Pakistani mobile number (e.g. 923XXXXXXXXX)"); return;
      }
    }
    if (state.fromMsisdn && !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address"); return;
    }

    setLoading(true); setError("");
    try {
      const userIdNum = Number(state.userId);
      const normalizedMobile = normalizeMobile(mobile);

      // Save profile to backend (skipped on retry when this exact data is already saved)
      const savedKey = JSON.stringify([userIdNum, name.trim(), email.trim(), city.trim(), normalizedMobile]);
      if (sessionStorage.getItem("social_profile_saved") !== savedKey) await updateUserProfile(userIdNum, {
        name:   name.trim(),
        email:  email.trim(),
        city:   city.trim(),
        ...(state.fromMsisdn ? {} : { msisdn: normalizedMobile }),
      } as any);

      sessionStorage.setItem("social_profile_saved", savedKey);

      // Check the network with send-pin (this also sends the OTP when the number is Zong)
      const pinResult: PinResult = state.fromMsisdn
        ? { ok: true, network: "zong" }
        : await requestSendPin(normalizedMobile, portal);
      if (!pinResult.ok) {
        setError(pinResult.message);
        setLoading(false);
        return;
      }
      // Save the operator on the user record (non-blocking)
      if (!state.fromMsisdn) {
        updateUserProfile(userIdNum, { operator: pinResult.network } as any).catch(() => {});
      }

      // Login user in Zaheen AuthContext
      const setupStatus = await getSetupStatus(userIdNum).catch(() => null);
      loginWithUser({
        msisdn:           normalizedMobile,
        userId:           userIdNum,
        isKid:            false,
        role:             setupStatus?.role              ?? null,
        selectedClassId:  setupStatus?.selected_class_id  ?? null,
        selectedCourseId: setupStatus?.selected_course_id ?? null,
        displayName:      name.trim(),
        token:            state.token ?? null,
      });

      // For ISSB — sync session
      if (portal === "issb") {
        try {
          await syncIssbSession({
            id:     state.userId,
            name:   name.trim(),
            email:  email.trim(),
            msisdn: normalizedMobile,
          });
        } catch { /* non-critical */ }
      }

      // For UniPrep — write uniprep_auth
      if (portal === "uniprep") {
        localStorage.setItem("uniprep_auth", JSON.stringify({
          userId: userIdNum,
          msisdn: normalizedMobile,
          name:   name.trim(),
        }));
        localStorage.setItem("zaheen_user_id",   state.userId);
        localStorage.setItem("zaheen_user_name", name.trim());
      }

      // For NAT — write nat_auth
      if (portal === "nat") {
        const natAuth = {
          userId: userIdNum,
          msisdn: normalizedMobile,
          name:   name.trim(),
        };
        localStorage.setItem("nat_auth",         JSON.stringify(natAuth));
        localStorage.setItem("zaheen_user_id",   state.userId);
        localStorage.setItem("user_id",          state.userId);
        localStorage.setItem("zaheen_user_name", name.trim());
      }

      // MSISDN users are already subscribed, so skip payment and go straight to Thanku
      if (state.fromMsisdn) {
        navigate("/thanku?status=success", { replace: true, state: { portal } });
        return;
      }

      // Persist for the JazzCash redirect round-trip (Router state is lost on full page navigation)
      sessionStorage.setItem("zaheen_access_token", state!.token);
      sessionStorage.setItem("social_payment_state", JSON.stringify({
        accessToken: state!.token,
        portal,
        name:   name.trim(),
        email:  email.trim(),
        userId: state!.userId,
      }));

      // Navigate to payment page, pass all needed data
      navigate("/social-payment", {
        replace: true,
        state: {
          network: pinResult.network,
          fromMsisdn: !!state.fromMsisdn,
          transactionId: pinResult.transactionId,
          msisdn:  normalizedMobile,
          accessToken: state!.token,
          portal,
          name:   name.trim(),
          email:  email.trim(),
          userId: state!.userId,
        },
      });
    } catch (e: any) {
      setError(e?.message || "Failed to save profile. Please try again.");
    }
    setLoading(false);
  };

  const handleSkip = () => {
    goToPortal(config.redirect, navigate);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border:     "1px solid rgba(255,255,255,0.1)",
    outline:    "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = config.accent);
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  // ── Step 1: Profile Form ──────────────────────────────────────────────────

  if (step === "PROFILE") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background:    "rgba(15,23,42,0.97)",
            border:        "1px solid rgba(255,255,255,0.08)",
            backdropFilter:"blur(18px)",
            boxShadow:     "0 32px 64px rgba(0,0,0,0.55)",
          }}>
          <div className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, ${config.accent}, #2DD4BF)` }} />
          <div className="p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Almost there
              </p>
              <h1 className="text-2xl text-white font-semibold"
                style={{ fontFamily: "'Fraunces', serif" }}>
                Complete your profile
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                Just a few details to get you started on{" "}
                <span style={{ color: config.accent }}>{config.label}</span>
              </p>
            </div>

            {/* Name */}
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="mb-4">
              <input type="text" value={name}
                onChange={e => {
                  const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  setName(val);
                  setError("");
                }}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Email (auto-filled, user can click but not edit) */}
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="mb-4">
              <input type="email" value={email}
                onChange={e => { if (state.fromMsisdn) setEmail(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl text-slate-400 text-sm"
                style={{ ...inputStyle, opacity: 0.8 }}
                onFocus={onFocus}
                onBlur={onBlur} />
            </div>

            {/* City — searchable dropdown with arrow */}
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              City <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-4">
              <input
                type="text"
                value={cityInput}
                onChange={e => {
                  setCityInput(e.target.value);
                  setCity("");
                  setCityDropdown(true);
                  setShowAllCities(true);
                  setError("");
                }}
                onFocus={() => {
                  setCityDropdown(true);
                  setShowAllCities(true);
                }}
                onBlur={() => setTimeout(() => {
                  setCityDropdown(false);
                  setShowAllCities(false);
                }, 150)}
                placeholder="Type to search city..."
                className="w-full px-4 py-3 pr-10 rounded-xl text-white placeholder-slate-500 text-sm"
                style={inputStyle}
              />
              {/* Dropdown arrow button */}
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCityDropdown(!cityDropdown);
                  setShowAllCities(!cityDropdown);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {/* Checkmark when city selected */}
              {city && !cityDropdown && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</span>
              )}
              {/* Dropdown list */}
              {cityDropdown && (() => {
                const filtered = cityInput.trim().length > 0
                  ? PAKISTAN_CITIES.filter(c =>
                      c.toLowerCase().startsWith(cityInput.toLowerCase())
                    )
                  : PAKISTAN_CITIES;
                return filtered.length > 0 ? (
                  <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}>
                    {filtered.map(c => (
                      <button
                        key={c}
                        type="button"
                        onMouseDown={() => {
                          setCity(c);
                          setCityInput(c);
                          setCityDropdown(false);
                          setShowAllCities(false);
                          setError("");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-white hover:text-white transition-colors"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = `${config.accent}20`)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="absolute z-50 w-full mt-1 rounded-xl px-4 py-3 text-sm text-slate-500"
                    style={{
                      background: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                    No city found
                  </div>
                );
              })()}
            </div>

            {!state.fromMsisdn && (<>
            {/* Mobile */}
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative mb-5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">📱</span>
              <input type="text" value={mobile}
                onChange={e => {
                  const val = e.target.value.replace(/[^\d+\s]/g, "");
                  setMobile(val);
                  setError("");
                }}
                placeholder="923XXXXXXXXX"
                readOnly={!!state.fromMsisdn}
                inputMode="numeric"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            </>)}

            {error && <ErrorBox msg={error} />}

            <button onClick={handleProfileSubmit} disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-2"
              style={{
                background: loading
                  ? "rgba(240,180,41,0.4)"
                  : "linear-gradient(135deg,#F0B429,#f59e0b)",
                color:      "#0f172a",
                boxShadow:  loading ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                cursor:     loading ? "not-allowed" : "pointer",
              }}>
              {loading ? <><Spinner /> Saving…</> : "Continue →"}
            </button>

          </div>
        </div>
      </div>
    );
  }

  // App Download is now a separate page (/social-app-download)
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl overflow-hidden text-center"
        style={{
          background:    "rgba(15,23,42,0.97)",
          border:        "1px solid rgba(255,255,255,0.08)",
          backdropFilter:"blur(18px)",
          boxShadow:     "0 32px 64px rgba(0,0,0,0.55)",
        }}>
        <div className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${config.accent}, #2DD4BF)` }} />

        {/* Banner image — full width, no padding */}
              <img
          src="https://cdn.zaheen.com.pk/images/newbannerzaheen.jpeg"
          alt="Download Zaheen App"
          className="w-full object-cover"
        />

        <div className="p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            You're all set!
          </p>
          <h1 className="text-2xl text-white font-semibold mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}>
            Get the Zaheen App
          </h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Study on the go. Access all your {config.label} content anytime, anywhere.
          </p>

          {/* Play Store Button */}
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all mb-3"
            style={{
              background: "linear-gradient(135deg,#F0B429,#f59e0b)",
              color:      "#0f172a",
              boxShadow:  "0 4px 16px rgba(240,180,41,0.35)",
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.3.17.64.24.99.19l12.47-11.95L13.27 8.6 3.18 23.76zm17.15-10.95L17.6 11.5l-3.24 3.1 3.24 3.1 2.77-1.56c.79-.45.79-1.68-.04-2.33zM3 .25C2.7.08 2.35.02 2 .07L14.47 12 11.1 8.38 3 .25zm10.27 11.75L3 .25 2 .07 2 23.93l1-.18L13.27 12z"/>
            </svg>
            Download on Google Play
          </a>

          {/* Skip Button */}
          <button onClick={handleSkip}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border:     "1px solid rgba(255,255,255,0.1)",
              color:      "#94a3b8",
            }}>
            Skip for now → Continue to {config.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialProfileSetupPage;