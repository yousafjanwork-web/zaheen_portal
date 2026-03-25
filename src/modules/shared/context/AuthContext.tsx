import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  msisdn: string | null;
  isLoggedIn: boolean;
  login: (msisdn: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

  const [msisdn, setMsisdn] = useState<string | null>(null);

  /* RESTORE SESSION */

  useEffect(() => {

    const stored = localStorage.getItem("msisdn");

    if (stored) {

      console.log("AuthContext: restoring session", stored);

      setMsisdn(stored);

    }

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