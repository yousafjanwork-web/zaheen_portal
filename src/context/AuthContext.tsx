import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  msisdn: string | null;
  login: (msisdn: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

  const [msisdn, setMsisdn] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("msisdn");
    if (stored) setMsisdn(stored);
  }, []);

  const login = (number: string) => {
    setMsisdn(number);
    localStorage.setItem("msisdn", number);
  };

  const logout = () => {
    setMsisdn(null);
    localStorage.removeItem("msisdn");
  };

  return (
    <AuthContext.Provider value={{ msisdn, login, logout }}>
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