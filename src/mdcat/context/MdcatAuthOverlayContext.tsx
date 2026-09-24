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

type OverlayMode = "login" | "subscribe" | "profile" | null;

interface MdcatAuthOverlayContextType {
  mode: OverlayMode;
  isOpen: boolean;
  openOverlay: (mode: "login" | "subscribe") => void;
  openProfileSetup: () => void;
  closeOverlay: () => void;
}

const MdcatAuthOverlayContext = createContext<MdcatAuthOverlayContextType | null>(null);

export const MdcatAuthOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<OverlayMode>(null);
  const location = useLocation();

  const openOverlay = useCallback((next: "login" | "subscribe") => {
    localStorage.setItem(
      "mdcat_return",
      JSON.stringify({ from: location.pathname, mdcat: true })
    );
    setMode(next);
  }, [location.pathname]);

  const openProfileSetup = useCallback(() => {
    setMode("profile");
  }, []);

  const closeOverlay = useCallback(() => {
    setMode(null);
    localStorage.removeItem("mdcat_return");
  }, []);

  return (
    <MdcatAuthOverlayContext.Provider
      value={{ mode, isOpen: mode !== null, openOverlay, openProfileSetup, closeOverlay }}
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