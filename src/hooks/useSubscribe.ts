import { useState } from "react";
import {
  getHE,
  checkSubscriberStatus,
  subscribeUser
} from "@/services/subscriptionService";

export const useSubscribe = () => {

  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = async () => {

    try {

      const he = await getHE();

      const msisdn = he.msisdn;

      if (!msisdn) {
        setShowModal(true);
        return;
      }

      const status = await checkSubscriberStatus(msisdn);

      if (status.status === "ACTIVE") {

        alert("User already subscribed. Login.");

      } else {

        await subscribeUser(msisdn);

        alert("Subscription successful");

      }

    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleSubscribe,
    showModal,
    setShowModal
  };
};