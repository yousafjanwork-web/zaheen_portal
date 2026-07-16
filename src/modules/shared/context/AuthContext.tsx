import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  msisdn: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (msisdn: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

  const [msisdn, setMsisdn] = useState<string | null>(null);
  // Starts true: we don't actually know the auth state yet until the
  // localStorage check below has run. Any page gating on `isLoggedIn`
  // must wait for isLoading to become false before deciding to redirect.
  const [isLoading, setIsLoading] = useState(true);

  /* RESTORE SESSION */

  useEffect(() => {

    const stored = localStorage.getItem("msisdn");

    if (stored) {

      console.log("AuthContext: restoring session", stored);

      setMsisdn(stored);

    }

    setIsLoading(false);

  }, []);

  /* LOGIN */

  const login = (number: string) => {

    console.log("AuthContext: login", number);

    setMsisdn(number);

    localStorage.setItem("msisdn", number);

  };

  /* LOGOUT */

  const logout = () => {

    console.log("AuthContext: logout");

    setMsisdn(null);

    localStorage.removeItem("msisdn");

  };

  return (

    <AuthContext.Provider
      value={{
        msisdn,
        isLoggedIn: !!msisdn,
        isLoading,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth must be used inside AuthProvider");

  }

  return context;

};