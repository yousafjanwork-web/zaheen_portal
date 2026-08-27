import axios from "axios";

/* HE SERVICE */

export const getHE = async () => {
  const res = await axios.get("https://z.zaheen.com.pk/he/gethe");
  return res.data;
};

/* CHECK SUBSCRIBER STATUS */

export const checkSubscriberStatus = async (
  msisdn: string,
  serviceId: string
) => {
  console.log("Subscriber status  msisdn:" + msisdn + " serviceid " + serviceId);
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscriber/status",
    {
      params: {
        msisdn,
        serviceId
      }
    }
  );

  return res.data;
};

/* SEND PIN */

export const sendPin = async (
  msisdn: string,
  serviceId: string
) => {

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/send-pin",
    {
      params: {
        msisdn,
        serviceId
      }
    }
  );

  return res.data;

};

/* VERIFY PIN */

export const verifyPin = async (
  msisdn: string,
  pin: string,
  serviceId: string
) => {

  const transactionId = Date.now();
  const subMethod = "WEB";

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/verify-subscribe",
    {
      params: {
        msisdn,
        serviceId,
        pin,
        transactionId,
        subMethod
      }
    }
  );

  return res.data;

};

/* SUBSCRIBE USER */

export const subscribeUser = async (
  msisdn: string,
  serviceId: string
) => {


  const getSubMethod = () => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("mza") ||
      params.get("source")?.toLocaleLowerCase() === "mza" ||
      params.get("channel")?.toLowerCase() === "mza" ||
      sessionStorage.getItem("mzaMsisdn")
    ) {
      return "MZA";
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      return "MOBILE";
    }

    return "WEB";
  };

  const subMethod = getSubMethod();

  console.log(subMethod, "onsubmethod");

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscribe",
    {
      params: {
        msisdn,
        serviceId,
        subMethod,
        transactionId: Date.now()
      }
    }
  );

  return res.data;

};


/* HANDLE SUBSCRIBE ENTRY */

export const handleSubscribe = async (
  msisdn: string | null,
  login: (msisdn: string) => void,
  serviceId: string
) => {

  try {

    localStorage.setItem("pendingServiceId", serviceId);

    let finalMsisdn = msisdn;

    if (!finalMsisdn) {

      finalMsisdn =
        localStorage.getItem("msisdn") ||
        sessionStorage.getItem("mzaMsisdn");

    }

    if (!finalMsisdn) {

    const redirect = encodeURIComponent(
  `${window.location.origin}/subscribe`
);
      window.location.href =
        `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;

      return;

    }

    console.log("Using MSISDN:", finalMsisdn);

    const statusRes = await checkSubscriberStatus(finalMsisdn, serviceId);

    console.log("Subscriber status:", statusRes);

    if (statusRes.status === "ACTIVE") {

      login(finalMsisdn);

      sessionStorage.removeItem("mzaMsisdn");

      window.location.href = "/";

      return;

    }

    const subRes = await subscribeUser(finalMsisdn, serviceId);

    console.log("Subscribe response:", subRes);

    if (subRes.status === "1") {

      login(finalMsisdn);

      localStorage.setItem("activeServiceId", serviceId);
      sessionStorage.removeItem("mzaMsisdn");

      window.location.href = "/";

      return;

    }

    alert(subRes.desc || "Subscription failed");

  } catch (error) {

    console.error("Subscription failed:", error);

  }

};

/* =========================================================
   JAZZCASH / "OTHER SUBSCRIPTION" INTEGRATION (Zaheen API)
   =========================================================
   This uses the new /auth/payment-token endpoint, which does NOT
   require the x-api-key secret — only a user_id. That means it's
   safe to call directly from the frontend (no secret is exposed).
   ========================================================= */

const ZAHEEN_BASE_URL = "https://api.zaheen.com.pk/v2/api";

const TOKEN_STORAGE_KEY = "zaheen_access_token";
const TOKEN_EXPIRY_KEY = "zaheen_access_token_expiry";

/* Normalize any of the accepted mobile number formats into 03XXXXXXXXX,
   which is the format the JazzCash/Zaheen payment API expects.
   Accepted inputs: 03123456789 | 923123456789 | 3123456789 */

export const normalizeMsisdn = (raw: string): string => {

  const digits = raw.replace(/\D/g, "");

  // e.g. 923123456789 → strip leading "92", prepend "0"
  if (digits.length === 12 && digits.startsWith("92")) {
    return "0" + digits.slice(2);
  }

  // e.g. 03123456789 → already correct
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits;
  }

  // e.g. 3123456789 → prepend "0"
  if (digits.length === 10 && digits.startsWith("3")) {
    return "0" + digits;
  }

  throw new Error("Please enter a valid mobile number");

};

/* STEP 1 — Get (or reuse cached) access token. Token is valid 7 days. */

export const getZaheenToken = async (): Promise<string> => {

  const cachedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const cachedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (cachedToken && cachedExpiry && Date.now() < Number(cachedExpiry)) {
    return cachedToken;
  }

  // TODO: replace user_id with the actual logged-in user's ID from your auth system
  const res = await axios.post(
    `${ZAHEEN_BASE_URL}/auth/payment-token`,
    {
      user_id: 1
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const accessToken = res.data?.data?.access_token;

  if (!accessToken) {
    throw new Error("Failed to obtain JazzCash access token");
  }

  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now

  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));

  return accessToken;

};

/* STEP 2 — Make the JazzCash payment using the token from step 1. */

export const makeJazzCashPayment = async (
  msisdn: string,
  amount: number,
  cnic: string
) => {

  const normalizedMsisdn = normalizeMsisdn(msisdn);

  const token = await getZaheenToken();

  const res = await axios.post(
    `${ZAHEEN_BASE_URL}/payment`,
    { msisdn: normalizedMsisdn, amount, cnic },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;

};