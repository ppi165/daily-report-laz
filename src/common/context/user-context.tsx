"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  username: string;
  division: string;
  role: "SUPERADMIN" | "ADMIN" | "SUPERVISOR" | "STAFF" | string;
  position?: string | null;
  avatar?: string;
  createdAt?: string | Date;
}

interface UserContextType {
  user: UserSession | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "laz_user_profile";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/daily-report",
  "/rekap-report",
  "/reports",
  "/verifikasi",
  "/feed",
  "/settings",
  "/admin",
  "/profil",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/users/me");
      const json = await res.json();
      if (json.success && json.data) {
        setUser(json.data);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        }
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    // Baca cache instan di client saat mount HANYA jika sesi browser aktif dan belum di-kick (dengan toleransi 30 menit)
    try {
      const isKicked =
        sessionStorage.getItem("laz_session_kicked") === "true" ||
        localStorage.getItem("laz_session_kicked") === "true";

      const lastActiveStr = localStorage.getItem("laz_last_active");
      let isValidSession = false;

      if (!isKicked) {
        if (lastActiveStr) {
          const lastActive = parseInt(lastActiveStr, 10);
          if (!isNaN(lastActive)) {
            const elapsed = Date.now() - lastActive;
            if (elapsed < 30 * 60 * 1000) {
              isValidSession = true;
              sessionStorage.setItem("laz_session_active", "true");
            }
          }
        } else if (sessionStorage.getItem("laz_session_active") === "true") {
          isValidSession = true;
        }
      }

      if (!isValidSession) {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } else {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
          setIsLoading(false);
        }
      }
    } catch {
      // ignore
    }

    async function initUser() {
      try {
        const res = await fetch("/api/v1/users/me");
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          setUser(json.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        } else if (!ignore) {
          // Gagal verifikasi sesi di server atau token sudah tidak valid
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("laz_last_active");
          sessionStorage.clear();
          if (
            typeof window !== "undefined" &&
            isProtectedRoute(window.location.pathname)
          ) {
            window.location.replace("/login");
          }
        }
      } catch (err) {
        console.error("Gagal memuat sesi user:", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    initUser();

    return () => {
      ignore = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("laz_last_active");
        localStorage.setItem("laz_session_kicked", "true");
        sessionStorage.clear();
      }
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan di dalam UserProvider");
  }
  return context;
}
