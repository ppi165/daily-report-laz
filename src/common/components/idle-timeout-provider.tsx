"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Durasi idle timeout: 30 menit (30 * 60 * 1000 milidetik)
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
    // 1. Validasi Sesi Browser/Tab & Proteksi Backward/Forward:
    // Jika sessionStorage kosong atau pernah ditandai di-kick saat di /login, paksa redirect ke /login
    const checkSession = () => {
      const activeSession = sessionStorage.getItem("laz_session_active");
      const isKicked = sessionStorage.getItem("laz_session_kicked") === "true";

      if (!activeSession || isKicked) {
        if (!isKickingRef.current) {
          isKickingRef.current = true;
          fetch("/api/v1/auth/logout", { method: "POST", keepalive: true }).finally(() => {
            localStorage.removeItem("laz_user_profile");
            sessionStorage.clear();
            window.location.replace("/login");
          });
        }
        return false;
      }

      // Verifikasi keaslian token sesi di server (mencegah manipulasi state)
      fetch("/api/v1/users/me", { cache: "no-store" })
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem("laz_user_profile");
            sessionStorage.clear();
            window.location.replace("/login");
          }
        })
        .catch(() => {});

      return true;
    };

    if (!checkSession()) {
      return;
    }

    // 2. Proteksi Navigasi Forward/Backward Browser:
    // Pastikan event pageshow, popstate, dan visibilitychange selalu mengecek keaktifan sesi
    const handleNavigationCheck = () => {
      checkSession();
    };

    window.addEventListener("pageshow", handleNavigationCheck);
    window.addEventListener("popstate", handleNavigationCheck);
    document.addEventListener("visibilitychange", handleNavigationCheck);

    // 3. Catat aktivitas user untuk Idle Mode
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
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
        }, 5000); // Throttling update setiap 5 detik agar efisien
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, throttledUpdate, { passive: true });
    });

    // 4. Interval Pengecekan Idle Timeout 30 Menit
    const intervalId = setInterval(async () => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= IDLE_TIMEOUT_MS && !isKickingRef.current) {
        isKickingRef.current = true;
        try {
          await fetch("/api/v1/auth/logout", { method: "POST" });
        } catch {
          // ignore
        } finally {
          localStorage.removeItem("laz_user_profile");
          sessionStorage.clear();
          window.location.href = "/login?reason=idle_timeout";
        }
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
