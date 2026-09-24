/**
 * MdcatProfilePage.tsx
 * 
 * Full-page MDCAT profile setup for Google OAuth users.
 * Shown after Google login when mobile number is not yet saved.
 * 
 * Route: /mdcat-profile
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import MdcatProfileSetup from "../components/MdcatProfileSetup";
import { useAuth } from "@/modules/shared/context/AuthContext";

const MdcatProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const handleComplete = () => {
    // After profile saved, go back to where they came from
    try {
      const stored = localStorage.getItem("mdcat_return");
      const parsed = stored ? JSON.parse(stored) : null;
      const returnPath = parsed?.from ?? "/mdcat";
      localStorage.removeItem("mdcat_return");
      navigate(returnPath, { replace: true });
    } catch {
      navigate("/mdcat", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <MdcatProfileSetup
          onComplete={handleComplete}
          userIdOverride={userId}
        />
      </div>
    </div>
  );
};

export default MdcatProfilePage;