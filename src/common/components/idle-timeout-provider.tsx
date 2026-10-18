"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Durasi idle timeout & grace period: 30 menit (30 * 60 * 1000 milidetik)
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Interval pengecekan keaktifan: setiap 15 detik
const CHECK_INTERVAL_MS = 15 * 1000;

interface IdleTimeoutProviderProps {
  children: React.ReactNode;
}

export default function IdleTimeoutProvider({
  children,
}: IdleTimeoutProviderProps) {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const isKickingRef = useRef<boolean>(false);

  useEffect(() => {
    // Fungsi universal untuk menendang user ke /login
    const kickToLogin = (reason?: string) => {
      if (isKickingRef.current) return;
      isKickingRef.current = true;

      fetch("/api/v1/auth/logout", { method: "POST", keepalive: true }).finally(() => {
        try {
          localStorage.removeItem("laz_user_profile");
          localStorage.removeItem("laz_last_active");
          localStorage.setItem("laz_session_kicked", "true");
          sessionStorage.clear();
        } catch {
          // ignore
        }
        const target = reason ? `/login?reason=${reason}` : "/login";
        window.location.replace(target);
      });
    };

    // 1. Validasi Sesi Browser/Tab dengan Grace Period 30 Menit saat browser keluar/ditutup
    const checkSession = (verifyServer = false) => {
      const isKicked =
        sessionStorage.getItem("laz_session_kicked") === "true" ||
        localStorage.getItem("laz_session_kicked") === "true";

      if (isKicked) {
        kickToLogin();
        return false;
      }

      const now = Date.now();
      const lastActiveStr = localStorage.getItem("laz_last_active");

      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        if (!isNaN(lastActive)) {
          const elapsed = now - lastActive;
          if (elapsed >= IDLE_TIMEOUT_MS) {
            // Sudah lewat 30 menit sejak terakhir aktif atau browser ditutup -> kick!
            kickToLogin("idle_timeout");
            return false;
          }
          // Masih dalam batas toleransi < 30 menit -> pulihkan sesi!
          sessionStorage.setItem("laz_session_active", "true");
          lastActivityRef.current = now;
          localStorage.setItem("laz_last_active", now.toString());
        }
      } else {
        // Jika tidak ada data last_active, cek flag active session biasa
        const activeSession = sessionStorage.getItem("laz_session_active");
        if (!activeSession) {
          kickToLogin();
          return false;
        }
      }

      // Verifikasi keaslian token di server hanya saat navigasi back/forward
      if (verifyServer) {
        fetch("/api/v1/users/me", { cache: "no-store" })
          .then((res) => {
            if (!res.ok) {
              kickToLogin();
            }
          })
          .catch(() => {});
      }

      return true;
    };

    if (!checkSession(false)) {
      return;
    }

    // 2. Pengecekan Idle Timeout 30 Menit
    const checkIdleTimeout = () => {
      const now = Date.now();
      const lastActiveStorage = localStorage.getItem("laz_last_active");
      const lastActive = lastActiveStorage
        ? Math.max(parseInt(lastActiveStorage, 10) || 0, lastActivityRef.current)
        : lastActivityRef.current;

      const elapsed = now - lastActive;

      if (elapsed >= IDLE_TIMEOUT_MS && !isKickingRef.current) {
        kickToLogin("idle_timeout");
      }
    };

    // 3. Proteksi Navigasi Forward/Backward Browser & Tab Visibility Change
    const handleNavigationCheck = () => {
      if (document.visibilityState === "visible") {
        checkSession(true);
        checkIdleTimeout();
      }
    };

    window.addEventListener("pageshow", handleNavigationCheck);
    window.addEventListener("popstate", handleNavigationCheck);
    document.addEventListener("visibilitychange", handleNavigationCheck);

    // 4. Catat aktivitas user & update timestamp ke localStorage
    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      try {
        localStorage.setItem("laz_last_active", now.toString());
        sessionStorage.setItem("laz_session_active", "true");
      } catch {
        // ignore
      }
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledUpdate = () => {
      if (!throttleTimeout) {
        updateActivity();
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
        }, 5000); // Throttling update setiap 5 detik agar performa optimal
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, throttledUpdate, { passive: true });
    });

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        checkIdleTimeout();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      window.removeEventListener("pageshow", handleNavigationCheck);
      window.removeEventListener("popstate", handleNavigationCheck);
      document.removeEventListener("visibilitychange", handleNavigationCheck);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, throttledUpdate);
      });
      clearInterval(intervalId);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [router]);

  return <>{children}</>;
}
