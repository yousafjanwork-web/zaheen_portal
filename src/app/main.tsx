import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "../styles/index.css";

import { AuthProvider } from "@/modules/shared/context/AuthContext.tsx";

// ✅ Hide loader once React is mounted
function hideLoader() {
  const loader = document.getElementById("zaheen-loader");
  if (!loader) return;
  loader.classList.add("hide");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

// ✅ Hide after React finishes first render
requestAnimationFrame(() => {
  setTimeout(hideLoader, 400); // small delay so it doesn't flash away
});