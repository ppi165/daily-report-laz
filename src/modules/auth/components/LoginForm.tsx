"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/src/shared/context/ThemeContext";

export default function LoginForm() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, remember }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Gagal login, periksa kembali data Anda.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col justify-between items-center px-4 py-8 antialiased selection:bg-secondary-container selection:text-primary transition-colors duration-300">
      {/* Top Security / Institutional Tag */}
      <header className="w-full max-w-md flex items-center justify-between px-2 pt-2 pb-6 text-on-surface-variant">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-outline hover:text-primary transition-colors group cursor-pointer"
          title="Kembali ke Landing Page"
        >
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-outline">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span>Portal Resmi</span>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDarkMode
                ? 'bg-white/10 text-yellow-300 hover:bg-white/20'
                : 'bg-surface-container-high text-gray-800 hover:bg-surface-variant border border-outline-variant/60'
            }`}
            title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
        </div>
      </header>

      {/* Login Card Container */}
      <main className="w-full max-w-md my-auto">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/40 custom-shadow">
          {/* Card Header: Brand Logo & Title */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 flex items-center justify-center mb-1">
              <img
                alt="Logo LAZ Persis"
                className="h-12 w-auto max-w-[200px] object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrfqFzaW-_PqKWqfCzm605ovRfiuJOBL1G8f3jyWWbV5yZe8-kuu_7uI5Ybb9MMbzmUAFlBNN-yOQaZk4Q_VRxHn2fVUewB6ei0JiqnD5jPvuRQGNhyS3uLiAwQggoyud3Ut6oHNy9n7jjpFIT1iYVEqG09qCrZDKUu5S0mZ53ziDTWvcuNl1oaVJI0enpA23AWA5mEJYDYe9Ia4iJ0ALWAZYRT2UNaQjmnsadUuy-xRHAfvI7YMuvGx9UlQQh1ACAoE8"
              />
            </div>
            <h1 className="text-2xl font-semibold text-on-surface mt-4 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-outline mt-1.5">
              Masuk untuk mengisi daily report Anda.
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-error-container text-on-error-container text-sm rounded-lg border border-error/20">
                {error}
              </div>
            )}
            
            {/* Field Email / Username */}
            <div>
              <label
                className="block text-sm font-medium text-on-surface mb-2"
                htmlFor="identifier"
              >
                Email / Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none select-none">
                  mail
                </span>
                <input
                  className="w-full h-[44px] pl-11 pr-4 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all duration-150"
                  id="identifier"
                  name="identifier"
                  placeholder="nama@lazpersis.or.id atau username"
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {/* Field Password */}
            <div>
              <label
                className="block text-sm font-medium text-on-surface mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none select-none">
                  lock
                </span>
                <input
                  className="w-full h-[44px] pl-11 pr-11 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all duration-150 tracking-wider"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 text-outline hover:text-primary transition-colors flex items-center justify-center p-0.5 rounded focus:outline-none"
                  id="togglePassword"
                  title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Row Opsi: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-sm font-medium">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  className="w-4 h-4 rounded border-outline-variant/80 text-primary-container focus:ring-secondary/20 focus:ring-offset-0 transition-colors cursor-pointer"
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="text-on-surface-variant text-xs">Ingat saya</span>
              </label>
              <a
                className="text-primary-container hover:text-secondary text-xs transition-colors duration-150 focus:underline focus:outline-none"
                href="#"
              >
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                disabled={loading}
                className="w-full h-[46px] flex items-center justify-center gap-2 bg-primary-container hover:bg-secondary active:scale-[0.99] text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                <span>{loading ? 'MEMPROSES...' : 'MASUK'}</span>
                {!loading && (
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Institutional Assurance Badge */}
          <div className="mt-6 pt-5 border-t border-surface-container-high flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              verified
            </span>
            <span className="text-xs text-on-surface-variant tracking-normal">
              Pusat Akuntabilitas & Transparansi Amanah
            </span>
          </div>
        </div>

        <footer className="mt-6 text-center px-4">
          <p className="text-xs text-outline leading-relaxed">
            &copy; 2026 Daily Report LAZ Persis
          </p>
        </footer>
      </main>

      {/* Clean Bottom Margin Anchor */}
      <div className="w-full max-w-md flex justify-center py-2 text-outline-variant text-[11px] font-semibold">
        <span>v2.4.0 • Build ID: LZP-DR-2026</span>
      </div>
    </div>
  );
}
