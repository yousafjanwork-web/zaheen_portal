/**
 * MdcatAuthOverlayContext.tsx
 * ─────────────────────────────────────────────────────────────────
 * Local UI-only state for MDCAT's login/subscribe overlay.
 * Does NOT touch auth/subscription logic — it only tracks whether
 * the overlay is open and which mode ("login" | "subscribe") to show.
 *
 * Scoped to the MDCAT mini-app only (mounted inside MdcatApp /
 * MdcatAppMobile), so it has zero effect on Zaheen's own pages.
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

type OverlayMode = "login" | "subscribe" | null;

interface MdcatAuthOverlayContextType {
  mode: OverlayMode;
  isOpen: boolean;
  openOverlay: (mode: "login" | "subscribe") => void;
  closeOverlay: () => void;
}

const MdcatAuthOverlayContext = createContext<MdcatAuthOverlayContextType | null>(null);

export const MdcatAuthOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<OverlayMode>(null);
  const location = useLocation();

  const openOverlay = useCallback((next: "login" | "subscribe") => {
    // LoginPage / SubscribePage already read this exact key for their
    // existing "MDCAT fast-track" logic — this is the same contract,
    // just set here instead of via router state (since we don't navigate).
    localStorage.setItem(
      "mdcat_return",
      JSON.stringify({ from: location.pathname, mdcat: true })
    );
    setMode(next);
  }, [location.pathname]);

  const closeOverlay = useCallback(() => {
    setMode(null);
  }, []);

  return (
    <MdcatAuthOverlayContext.Provider
      value={{ mode, isOpen: mode !== null, openOverlay, closeOverlay }}
    >
      {children}
    </MdcatAuthOverlayContext.Provider>
  );
};

export const useMdcatAuthOverlay = () => {
  const ctx = useContext(MdcatAuthOverlayContext);
  if (!ctx) {
    throw new Error("useMdcatAuthOverlay must be used inside MdcatAuthOverlayProvider");
  }
  return ctx;
};