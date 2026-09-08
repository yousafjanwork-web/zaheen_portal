/**
 * MdcatAuthOverlay.tsx
 * ─────────────────────────────────────────────────────────────────
 * Renders Zaheen's ACTUAL LoginPage / SubscribePage components on
 * top of the current MDCAT page as a blurred-background modal.
 *
 * All auth/subscription logic still lives in LoginPage.tsx /
 * SubscribePage.tsx — this file only supplies presentation
 * (backdrop + close button) and tells those pages to call
 * closeOverlay() instead of navigating away, once they succeed.
 */

import React from "react";
import { X } from "lucide-react";
import { useMdcatAuthOverlay } from "../context/MdcatAuthOverlayContext";
import LoginPage from "@/modules/auth/pages/LoginPage";
import SubscribePage from "@/modules/auth/pages/SubscribePage";

export default function MdcatAuthOverlay() {
  const { isOpen, mode, closeOverlay, openOverlay } = useMdcatAuthOverlay();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeOverlay();
      }}
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
        <button
          onClick={closeOverlay}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {mode === "login" ? (
          <LoginPage
            onAuthSuccess={closeOverlay}
            onNavigateToSubscribe={() => openOverlay("subscribe")}
          />
        ) : (
          <SubscribePage onSubscribeSuccess={closeOverlay} />
        )}
      </div>
    </div>
  );
}