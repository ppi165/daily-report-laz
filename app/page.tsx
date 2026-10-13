"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/shared/context/ThemeContext";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleDarkMode = () => {
    toggleTheme();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    { name: "Web", id: "lazpersis.or.id", url: "https://lazpersis.or.id", icon: <IconWeb /> },
    { name: "Instagram", id: "@lazpersis_official", url: "https://instagram.com/lazpersis_official", icon: <IconInstagram /> },
    { name: "TikTok", id: "@lazpersis", url: "https://tiktok.com/@lazpersis", icon: <IconTikTok /> },
    { name: "Facebook", id: "lazpersisofficial", url: "https://facebook.com/lazpersisofficial", icon: <IconFacebook /> },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#111111] text-gray-100' : 'bg-[#f8faf8] text-gray-900'}`}>
      {/* 1. Header (Navbar) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? (isDarkMode 
                ? "bg-[#141414]/95 backdrop-blur-md shadow-md py-3 border-b border-white/10" 
                : "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-200")
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Kiri: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrfqFzaW-_PqKWqfCzm605ovRfiuJOBL1G8f3jyWWbV5yZe8-kuu_7uI5Ybb9MMbzmUAFlBNN-yOQaZk4Q_VRxHn2fVUewB6ei0JiqnD5jPvuRQGNhyS3uLiAwQggoyud3Ut6oHNy9n7jjpFIT1iYVEqG09qCrZDKUu5S0mZ53ziDTWvcuNl1oaVJI0enpA23AWA5mEJYDYe9Ia4iJ0ALWAZYRT2UNaQjmnsadUuy-xRHAfvI7YMuvGx9UlQQh1ACAoE8" 
              alt="Logo LAZ Persis" 
              className="h-9 sm:h-10 w-auto object-contain shrink-0 drop-shadow-sm transition-transform group-hover:scale-105" 
            />
            <span className={`${isScrolled ? (isDarkMode ? 'text-white' : 'text-primary') : 'text-white'} font-bold text-xl tracking-wide hidden sm:block transition-colors duration-300 drop-shadow-sm`}>
              LAZ Persis
            </span>
          </Link>

          {/* Tengah: Menu Navigasi Desktop */}
          <nav className="hidden md:flex gap-8">
            <button 
              onClick={() => scrollToSection("tentang")} 
              className={`${
                isScrolled 
                  ? (isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-primary') 
                  : 'text-white/90 hover:text-white drop-shadow'
              } transition-colors font-medium`}
            >
              Tentang
            </button>
            <button 
              onClick={() => scrollToSection("fitur")} 
              className={`${
                isScrolled 
                  ? (isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-primary') 
                  : 'text-white/90 hover:text-white drop-shadow'
              } transition-colors font-medium`}
            >
              Fitur
            </button>
            <button 
              onClick={() => scrollToSection("social")} 
              className={`${
                isScrolled 
                  ? (isDarkMode ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-primary') 
                  : 'text-white/90 hover:text-white drop-shadow'
              } transition-colors font-medium`}
            >
              Social
            </button>
          </nav>

          {/* Kanan: Tombol Masuk & Toggle Mobile */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                isScrolled 
                  ? (isDarkMode 
                      ? 'bg-white/10 text-yellow-300 hover:bg-white/20' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200')
                  : (isDarkMode 
                      ? 'bg-white/10 text-yellow-300 hover:bg-white/20 backdrop-blur-sm' 
                      : 'bg-black/30 text-yellow-200 hover:bg-black/40 backdrop-blur-sm')
              }`}
              title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              aria-label="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <Link
              href="/login"
              className="px-6 py-2 rounded-full bg-primary-container text-white font-semibold hover:bg-secondary transition-colors shadow-sm whitespace-nowrap hidden sm:flex"
            >
              Masuk
            </Link>
            <button 
              className={`md:hidden p-2 rounded-lg ${
                isScrolled 
                  ? (isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100') 
                  : 'text-white hover:bg-white/10'
              } transition-colors flex items-center justify-center`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className={`absolute top-0 bottom-0 right-0 w-64 ${isDarkMode ? 'bg-[#181818] border-l border-white/10 text-white' : 'bg-white border-l border-gray-200 text-gray-900'} shadow-2xl flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-primary'}`}>Menu Utama</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-white/10 text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:text-black'}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col p-4 gap-2 flex-1">
              <button 
                onClick={() => scrollToSection("tentang")} 
                className={`flex items-center gap-4 text-left p-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-emerald-400' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined ${isDarkMode ? 'text-emerald-400' : 'text-primary'}`}>info</span>
                Tentang
              </button>
              <button 
                onClick={() => scrollToSection("fitur")} 
                className={`flex items-center gap-4 text-left p-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-emerald-400' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined ${isDarkMode ? 'text-emerald-400' : 'text-primary'}`}>dashboard</span>
                Fitur
              </button>
              <button 
                onClick={() => scrollToSection("social")} 
                className={`flex items-center gap-4 text-left p-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-emerald-400' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined ${isDarkMode ? 'text-emerald-400' : 'text-primary'}`}>share</span>
                Social
              </button>
              
              <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-lg bg-primary-container text-white font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Masuk Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-bg.jpg"
            alt="Hero Background LAZ Persis"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-10">
          <img
            alt="Logo LAZ Persis"
            className="h-28 sm:h-36 w-auto max-w-[240px] object-contain mb-8 filter drop-shadow-2xl"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrfqFzaW-_PqKWqfCzm605ovRfiuJOBL1G8f3jyWWbV5yZe8-kuu_7uI5Ybb9MMbzmUAFlBNN-yOQaZk4Q_VRxHn2fVUewB6ei0JiqnD5jPvuRQGNhyS3uLiAwQggoyud3Ut6oHNy9n7jjpFIT1iYVEqG09qCrZDKUu5S0mZ53ziDTWvcuNl1oaVJI0enpA23AWA5mEJYDYe9Ia4iJ0ALWAZYRT2UNaQjmnsadUuy-xRHAfvI7YMuvGx9UlQQh1ACAoE8"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Sistem Laporan Harian <br className="hidden md:block" /> Amil Zakat
          </h1>
          <div className="bg-primary-container/85 border border-primary-fixed-dim/30 backdrop-blur-sm rounded-full px-6 py-2.5 mb-8 shadow-sm">
            <span className="text-white font-semibold tracking-wide">
              "Amanah, Profesional, Transparan"
            </span>
          </div>
          <p className="text-white/95 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow">
            Platform digital terintegrasi untuk pencatatan kinerja amil, pengelolaan ZIS, dan pelaporan harian yang cepat, akurat, serta dapat diandalkan demi kemaslahatan umat.
          </p>
        </div>
      </section>

      {/* 3. Section "Tentang" */}
      <section id="tentang" className={`py-24 ${isDarkMode ? 'bg-[#181818]' : 'bg-white'} px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Kolom Kiri */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-[4/3] md:aspect-square max-w-md mx-auto">
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-primary-container/20'} rounded-xl transform rotate-6 scale-95 transition-transform duration-500 hover:rotate-12`}></div>
              <div className={`absolute inset-0 ${isDarkMode ? 'bg-emerald-600/10' : 'bg-primary/10'} rounded-xl transform rotate-3 scale-100 transition-transform duration-500 hover:rotate-6`}></div>
              <img
                src="/dokumentasi-kegiatan.jpg"
                alt="Dokumentasi Kegiatan"
                className={`absolute inset-0 w-full h-full object-cover rounded-xl shadow-md border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
              />
            </div>
          </div>
          {/* Kolom Kanan */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-primary'} mb-6 uppercase tracking-wider`}>
              Tentang Daily Report
            </h2>
            <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} text-lg leading-relaxed mb-6 font-normal`}>
              Sistem Informasi Daily Report LAZ Persis dirancang khusus untuk mengumpulkan, mengelola, dan memonitor data laporan harian serta kinerja seluruh Amil Zakat secara real-time.
            </p>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base leading-relaxed`}>
              Dengan digitalisasi ini, kami berkomitmen untuk meningkatkan efisiensi operasional dan transparansi penyaluran ZIS. Melalui dashboard yang interaktif, setiap laporan dapat dievaluasi secara berkala, memastikan profesionalisme serta akuntabilitas yang lebih baik.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section "Fitur" */}
      <section id="fitur" className={`py-24 ${isDarkMode ? 'bg-[#121212] border-white/5' : 'bg-[#f4f7f4] border-gray-200'} border-t px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-16 uppercase tracking-wider`}>
            Sistem Informasi Pelaporan Harian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-white/10 hover:border-emerald-500/40 hover:bg-[#252525]' : 'bg-white border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md'} border p-8 rounded-2xl transition-all duration-300 group`}>
              <div className={`w-14 h-14 ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <span className="material-symbols-outlined text-[28px]">dashboard</span>
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Dashboard Kinerja</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Pantau ringkasan statistik harian, tingkat presensi kerja, dan grafik aktivitas amil secara terpadu.</p>
            </div>
            {/* Feature 2 */}
            <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-white/10 hover:border-emerald-500/40 hover:bg-[#252525]' : 'bg-white border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md'} border p-8 rounded-2xl transition-all duration-300 group`}>
              <div className={`w-14 h-14 ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <span className="material-symbols-outlined text-[28px]">edit_document</span>
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Input Laporan</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Formulir digital untuk mencatat semua kegiatan harian beserta bukti aktivitas dengan mudah dan cepat.</p>
            </div>
            {/* Feature 3 */}
            <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-white/10 hover:border-emerald-500/40 hover:bg-[#252525]' : 'bg-white border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md'} border p-8 rounded-2xl transition-all duration-300 group`}>
              <div className={`w-14 h-14 ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <span className="material-symbols-outlined text-[28px]">table_chart</span>
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Rekap Laporan</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Tabel rekapitulasi data laporan yang lengkap dengan fitur filter, memudahkan proses evaluasi dan verifikasi.</p>
            </div>
            {/* Feature 4 */}
            <div className={`${isDarkMode ? 'bg-[#1e1e1e] border-white/10 hover:border-emerald-500/40 hover:bg-[#252525]' : 'bg-white border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md'} border p-8 rounded-2xl transition-all duration-300 group`}>
              <div className={`w-14 h-14 ${isDarkMode ? 'bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Manajemen Profil</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>Kelola pengaturan akun pengguna secara mandiri untuk menunjang keamanan dan kelengkapan data pribadi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section "Social" */}
      <section id="social" className={`py-24 ${isDarkMode ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'} border-t px-4 relative transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-primary'} mb-2 uppercase tracking-wider`}>
            Media Sosial
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-12`}>
            Kunjungi social media kami
          </p>
          
          <div className={`${isDarkMode ? 'bg-[#1f1f1f] border-white/10 shadow-2xl' : 'bg-[#fcfdfc] border-gray-200 shadow-md'} p-8 md:p-12 rounded-2xl border transition-colors duration-300`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {socialLinks.map((social, index) => (
                <div key={index} className="flex items-center gap-5 group">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm ${
                    isDarkMode 
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500' 
                      : 'bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary'
                  }`}>
                    {social.icon}
                  </div>
                  <div>
                    <h4 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium mb-1`}>{social.name}</h4>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${
                        isDarkMode 
                          ? 'text-white hover:text-emerald-400 decoration-emerald-500/40 hover:decoration-emerald-400' 
                          : 'text-gray-900 hover:text-primary decoration-primary/40 hover:decoration-primary'
                      } font-semibold text-lg underline transition-all underline-offset-4`}
                    >
                      {social.id}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer & FAB */}
      <footer className={`${isDarkMode ? 'bg-[#0e0e0e] border-white/10' : 'bg-[#eef2ee] border-gray-200'} border-t py-8 text-center px-4 relative z-10 transition-colors duration-300`}>
        <p className={`${isDarkMode ? 'text-emerald-400' : 'text-primary'} font-semibold tracking-wide`}>
          &copy; 2026 Daily Report LAZ Persis
        </p>
      </footer>

      {/* FAB - Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full ${
          isDarkMode 
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 hover:scale-110' 
            : 'bg-primary hover:bg-primary-container text-white shadow-lg hover:scale-110'
        } flex items-center justify-center transition-all z-50 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Back to Top"
      >
        <span className="material-symbols-outlined text-[28px]">arrow_upward</span>
      </button>
    </div>
  );
}

// Icons
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const IconWeb = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
