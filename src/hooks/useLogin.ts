import { useAuth } from "@/context/AuthContext";
import { getHE, checkSubscriberStatus } from "@/services/subscriptionService";

export const useLogin = (openModal: () => void) => {

  const { login } = useAuth();

  /* LOGIN USING HE */
  const handleLogin = async () => {

    try {

      const he = await getHE();

      console.log("HE Response:", he);

      const msisdn = he?.msisdn;

      if (!msisdn) {

        console.log("HE did not return MSISDN → opening login modal");

        openModal();
        return;

      }

      const status = await checkSubscriberStatus(msisdn);

      console.log("Subscriber Status:", status);

      if (status?.status === "ACTIVE") {

        login(msisdn);

      } else {

        alert("You are not subscribed. Please subscribe first.");

      }

    } catch (err) {

      console.error("HE Login error:", err);

      /* fallback → show manual login modal */
      openModal();

    }

  };

  /* LOGIN USING MANUAL MSISDN */
  const loginWithMsisdn = async (msisdn: string) => {

    try {

      console.log("Manual login MSISDN:", msisdn);

      const status = await checkSubscriberStatus(msisdn);

      console.log("Subscriber Status:", status);

      if (status?.status === "ACTIVE") {

        login(msisdn);
        return true;

      } else {

        alert("You are not subscribed. Please subscribe first.");
        return false;

      }

    } catch (err) {

      console.error("Manual login error:", err);
      return false;

    }

  };

  return {
    handleLogin,
    loginWithMsisdn
  };

};