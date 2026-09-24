import React from "react";
import { X } from "lucide-react";
import { useMdcatAuthOverlay } from "../context/MdcatAuthOverlayContext";
import { useAuth } from "@/modules/shared/context/AuthContext";
import LoginPage from "@/modules/auth/pages/LoginPage";
import SubscribePage from "@/modules/auth/pages/SubscribePage";
import MdcatProfileSetup from "./MdcatProfileSetup";

export default function MdcatAuthOverlay() {
  const { isOpen, mode, closeOverlay, openOverlay, openProfileSetup } = useMdcatAuthOverlay();
  const { userId } = useAuth();

  if (!isOpen) return null;

  const allowBackdropClose = mode !== "profile";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => {
        if (allowBackdropClose && e.target === e.currentTarget) closeOverlay();
      }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">

        {mode !== "profile" && (
          <button
            onClick={closeOverlay}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {mode === "login" && (
          <LoginPage
            onAuthSuccess={closeOverlay}
            onMdcatNeedsProfile={openProfileSetup}
            onNavigateToSubscribe={() => openOverlay("subscribe")}
          />
        )}

        {mode === "subscribe" && (
          <SubscribePage onSubscribeSuccess={openProfileSetup} />
        )}

        {mode === "profile" && (
          <MdcatProfileSetup
            onComplete={closeOverlay}
            userIdOverride={userId}
          />
        )}
      </div>
    </div>
  );
}