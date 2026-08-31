import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "learner" | "parent" | "both" | null;

interface AuthUser {
  msisdn: string;
  userId: number;
  isKid: boolean;
  role: UserRole;
  selectedClassId?: number | null;
  selectedCourseId?: number | null;
  displayName?: string;
  token?: string | null;
}

interface AuthContextType {
  msisdn: string | null;
  userId: number | null;
  isKid: boolean;
  role: UserRole;
  displayName: string | null;
  token: string | null;
  selectedClassId: number | null;
  selectedCourseId: number | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithUser: (user: AuthUser) => void;
  login: (msisdn: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setSelectedGrade: (classId: number | null, courseId?: number | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "zaheen_auth";

interface StoredAuth {
  msisdn: string;
  userId: number;
  isKid: boolean;
  role: UserRole;
  selectedClassId?: number | null;
  selectedCourseId?: number | null;
  displayName?: string | null;
  token?: string | null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [msisdn,           setMsisdn]           = useState<string | null>(null);
  const [userId,           setUserId]           = useState<number | null>(null);
  const [isKid,            setIsKid]            = useState(false);
  const [displayName,      setDisplayName]      = useState<string | null>(null);
  const [token,            setToken]            = useState<string | null>(null);
  const [role,             setRoleState]        = useState<UserRole>(null);
  const [selectedClassId,  setSelectedClassId]  = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isLoading,        setIsLoading]        = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredAuth = JSON.parse(raw);
       setMsisdn(stored.msisdn);
        setUserId(stored.userId);
        setIsKid(stored.isKid ?? false);
        setRoleState(stored.role ?? null);
        setSelectedClassId(stored.selectedClassId ?? null);
        setSelectedCourseId(stored.selectedCourseId ?? null);
             setDisplayName(stored.displayName ?? null);
        setToken(stored.token ?? null);
      } else {
        const legacyMsisdn = localStorage.getItem("msisdn");
        if (legacyMsisdn) setMsisdn(legacyMsisdn);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const persist = (data: StoredAuth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem("msisdn", data.msisdn);
  };

const loginWithUser = (user: AuthUser) => {
    setMsisdn(user.msisdn);
    setUserId(user.userId);
    setIsKid(user.isKid);
    if (user.userId) localStorage.setItem("user_id", String(user.userId));
    // Inject userId into video progress module for users without msisdn (kids)
    if (user.userId) {
      localStorage.setItem("user_id", String(user.userId));
    }
    setRoleState(user.role);
    setSelectedClassId(user.selectedClassId ?? null);
    setSelectedCourseId(user.selectedCourseId ?? null);
      setDisplayName(user.displayName ?? null);
    setToken(user.token ?? null);
    persist({
      msisdn:           user.msisdn,
      userId:           user.userId,
      isKid:            user.isKid,
      role:             user.role,
      selectedClassId:  user.selectedClassId ?? null,
      selectedCourseId: user.selectedCourseId ?? null,
      displayName:      user.displayName ?? null,
      token:            user.token ?? null,
    });
  };

  const login = (number: string) => {
    setMsisdn(number);
    localStorage.setItem("msisdn", number);
  };

const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Fix: use userId check only — msisdn can be empty for social users
    // isKid is always false here — setRole is only called for adult users
    if (userId !== null) {
      persist({ msisdn: msisdn ?? "", userId, isKid: false, role: newRole, selectedClassId, selectedCourseId });
    }
  };

const setSelectedGrade = (classId: number | null, courseId?: number | null) => {
    setSelectedClassId(classId);
    setSelectedCourseId(courseId ?? null);
    // Fix: use userId check only — msisdn can be empty for social users
    // isKid is always false here — setSelectedGrade is only called for adult users during setup
    if (userId !== null) {
      persist({ msisdn: msisdn ?? "", userId, isKid: false, role, selectedClassId: classId, selectedCourseId: courseId ?? null });
    }
  };
 const logout = () => {
    setMsisdn(null);
    setUserId(null);
    setIsKid(false);
    setRoleState(null);
    setSelectedClassId(null);
    setSelectedCourseId(null);
        setDisplayName(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("msisdn");
    localStorage.removeItem("user_id");   // ← clear injected child userId
    localStorage.removeItem("user_name");
  };

    return (
  <AuthContext.Provider value={{
      msisdn, userId, isKid, role,
      displayName, token,
      selectedClassId, selectedCourseId,
      isLoggedIn: !!userId,
      isLoading,
      loginWithUser, login, logout, setRole, setSelectedGrade,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};