/**
 * SetupGuard.tsx
 *
 * Wraps routes that require the user to be logged in AND have completed setup.
 *
 * Usage in AppRoutes:
 *   <Route element={<SetupGuard requireSetupComplete />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 *   <Route element={<SetupGuard />}>
 *     <Route path="/setup/role" element={<SetupRolePage />} />
 *   </Route>
 *
 * requireSetupComplete = true  → redirect to /setup/role if userId is present
 *                                but setup hasn't been checked yet. The dashboard
 *                                itself handles the full guard via setup-status.
 */

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";

interface SetupGuardProps {
  /** If true, redirects unauthenticated users to /login */
  requireAuth?: boolean;
}

const SetupGuard: React.FC<SetupGuardProps> = ({ requireAuth = true }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  /* Wait until auth is restored from localStorage */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default SetupGuard;