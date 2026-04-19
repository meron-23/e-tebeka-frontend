"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api/client";
import {
  SESSION_CHANGED_EVENT,
  type SessionUser,
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  persistSession,
  updateStoredUser,
} from "@/lib/session";

function getErrorStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status;
  }

  return undefined;
}

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<SessionUser | null>;
  setAuthenticatedSession: (token: string, user: SessionUser) => void;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const response = await api.get("/users/me");
      updateStoredUser(response.data);
      setUser(response.data);
      return response.data;
    } catch (error: unknown) {
      const status = getErrorStatus(error);
      if (status === 401 || status === 403) {
        clearStoredSession();
        setUser(null);
      }

      return cachedUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    void refreshSession();
  }, [pathname, refreshSession]);

  useEffect(() => {
    const syncSession = () => {
      setIsLoading(true);
      void refreshSession();
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener(SESSION_CHANGED_EVENT, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(SESSION_CHANGED_EVENT, syncSession);
    };
  }, [refreshSession]);

  const setAuthenticatedSession = useCallback((token: string, nextUser: SessionUser) => {
    persistSession(token, nextUser);
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear the browser session even if the backend logout request fails.
    } finally {
      clearStoredSession();
      setUser(null);
      setIsLoading(false);
      router.push("/");
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshSession,
      setAuthenticatedSession,
      logout,
    }),
    [user, isLoading, refreshSession, setAuthenticatedSession, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
