"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/src/common/context/theme-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function LoginForm() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, remember }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal masuk. Periksa kembali kredensial Anda.');
      }

      if (typeof window !== 'undefined' && data.data) {
        localStorage.setItem('laz_user_profile', JSON.stringify(data.data));
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak terduga.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative selection:bg-secondary selection:text-white transition-colors duration-300">
      <header className="w-full max-w-6xl flex justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-secondary"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">
            Sistem Laporan Amil
          </span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode
              ? "bg-surface-container text-amber-400 hover:bg-surface-container-high"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
          }`}
          title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </header>

      <main className="w-full max-w-md my-auto">
        <Card className="bg-surface-container-lowest rounded-2xl border-outline-variant/50 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <CardHeader className="p-0 flex flex-col items-center text-center gap-1">
            <div className="h-16 flex items-center justify-center mb-1">
              <img
                alt="Logo LAZ Persis"
                className="h-12 w-auto max-w-[200px] object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrfqFzaW-_PqKWqfCzm605ovRfiuJOBL1G8f3jyWWbV5yZe8-kuu_7uI5Ybb9MMbzmUAFlBNN-yOQaZk4Q_VRxHn2fVUewB6ei0JiqnD5jPvuRQGNhyS3uLiAwQggoyud3Ut6oHNy9n7jjpFIT1iYVEqG09qCrZDKUu5S0mZ53ziDTWvcuNl1oaVJI0enpA23AWA5mEJYDYe9Ia4iJ0ALWAZYRT2UNaQjmnsadUuy-xRHAfvI7YMuvGx9UlQQh1ACAoE8"
              />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-outline">
              Masuk untuk mengisi dan memantau daily report Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="border-error/20 bg-error-container text-on-error-container text-sm rounded-lg">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label
                  className="text-sm font-medium text-on-surface"
                  htmlFor="identifier"
                >
                  Email / Username
                </Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none select-none">
                    mail
                  </span>
                  <Input
                    className="w-full h-[44px] pl-11 pr-4 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline focus-visible:ring-secondary/15 transition-all duration-150"
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

              <div className="flex flex-col gap-2">
                <Label
                  className="text-sm font-medium text-on-surface"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] pointer-events-none select-none">
                    lock
                  </span>
                  <Input
                    className="w-full h-[44px] pl-11 pr-11 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline focus-visible:ring-secondary/15 transition-all duration-150 tracking-wider"
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Lihat atau sembunyikan password"
                    className="absolute right-3.5 text-outline hover:text-amber-500 transition-colors flex items-center justify-center p-0.5 rounded focus:outline-none cursor-pointer"
                    id="togglePassword"
                    title={showPassword ? "Sembunyikan Password (Lampu Mati)" : "Lihat Password (Lampu Bersinar)"}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className={`material-symbols-outlined text-[20px] transition-colors ${showPassword ? "text-amber-500" : "text-outline"}`}>
                      {showPassword ? "lightbulb" : "light_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm font-medium">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    className="size-4 rounded border-outline-variant/80 text-primary-container focus:ring-secondary/20 focus:ring-offset-0 transition-colors cursor-pointer"
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="text-on-surface-variant text-xs">Ingat saya</span>
                </label>
                <a
                  className="text-secondary hover:text-primary text-xs transition-colors duration-150 focus:underline focus:outline-none"
                  href="#"
                >
                  Lupa password?
                </a>
              </div>

              <div className="pt-2">
                <Button
                  disabled={loading}
                  className="w-full h-[46px] flex items-center justify-center bg-primary-container hover:bg-secondary active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                >
                  <span>{loading ? "MEMPROSES..." : "MASUK"}</span>
                </Button>
              </div>
            </form>
          </CardContent>

          <Separator className="bg-surface-container-high" />

          <CardFooter className="p-0 pb-6 sm:pb-8 pt-1 bg-transparent border-0 justify-center">
            <span className="text-xs text-on-surface-variant tracking-normal">
              Internal Lazis Persis • Akses Terenkripsi
            </span>
          </CardFooter>
        </Card>
      </main>

      <footer className="w-full max-w-6xl py-4 text-center">
        <p className="text-xs text-outline">
          © 2026 LAZ PERSIS. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </footer>
    </div>
  );
}
