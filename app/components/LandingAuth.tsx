"use client";

import { useState } from "react";

export default function LandingAuth({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [formData, setFormData] = useState({ nama: "", email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah browser reload & bocornya URL /?email=
    setIsLoading(true);
    setError(""); 
    
    // Simulasi proses API (loading 1.5 detik)
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        // Mode MASUK: Cek kecocokan email dan password
        if (formData.email === "yaabunayya@gmail.com" && formData.password === "guru1234") {
          onLoginSuccess(); 
        } else {
          setError("Email atau kata sandi yang Anda masukkan salah.");
        }
      } else {
        // Mode DAFTAR: Langsung loloskan saja untuk keperluan demo
        onLoginSuccess();
      }
    }, 1500);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nama: "", email: "", password: "" });
    setError(""); 
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* =========================================
          BAGIAN KIRI: HERO SECTION (PREMIUM DARK MODE)
          ========================================= */}
      <div className="relative hidden lg:flex lg:w-5/12 bg-[#0F172A] p-12 flex-col justify-between overflow-hidden">
        {/* Efek Cahaya / Glowing Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[100px]"></div>
        </div>

        {/* Header / Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white italic">
            ASISTEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 font-light pr-2">GURU AI</span>
          </h1>
        </div>

        {/* Tengah: Copywriting & Floating Element */}
        <div className="relative z-10 my-12">
          <h2 className="text-4xl font-bold text-white leading-[1.2] mb-6">
            Masa Depan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Pendidikan Indonesia.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10">
            Otomatisasi pembuatan Modul Ajar, ATP, Promes, hingga Bank Soal Kurikulum Merdeka hanya dengan satu klik.
          </p>

          {/* Floating Glass Card (Motivasi Guru) */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/50 max-w-sm transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-inner shadow-white/30">
                💡
              </div>
              <div>
                <p className="text-white font-bold text-sm tracking-wide">Pesan untuk Pendidik</p>
                <p className="text-slate-400 text-xs">Inspirasi Hari Ini</p>
              </div>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              "Guru yang hebat tidak hanya mentransfer ilmu, tetapi juga menginspirasi. Biarkan AI mengurus beban administrasi Anda, agar Anda bisa kembali fokus menyentuh hati dan mendidik siswa."
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-slate-500 text-sm flex items-center justify-between">
          <span>© 2026 Tarbiyah Tech</span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Sistem Aktif & Online
          </span>
        </div>
      </div>


      {/* =========================================
          BAGIAN KANAN: AUTH FORM (CLEAN & MODERN)
          ========================================= */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        
        <div className="w-full max-w-[420px]">
          
          {/* HEADER AUTH */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
            </h2>
            <p className="text-slate-500 text-base">
              {isLogin ? "Masukkan detail akun Anda untuk melanjutkan." : "Mulai tingkatkan produktivitas mengajar Anda."}
            </p>
          </div>

          {/* MENAMPILKAN PESAN ERROR JIKA ADA */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-600 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
              <span className="text-lg">⚠️</span>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          {/* FORM UTAMA */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Nama: Hanya muncul saat mode "Daftar" */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama" 
                  value={formData.nama}
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3.5 text-slate-900 text-sm rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400" 
                  placeholder="Misal: Budi Santoso" 
                  required={!isLogin} 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange} 
                className="w-full px-4 py-3.5 text-slate-900 text-sm rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400" 
                placeholder="guru@sekolah.sch.id" 
                required 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Kata Sandi</label>
                {isLogin && (
                  <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">Lupa sandi?</a>
                )}
              </div>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleInputChange} 
                className="w-full px-4 py-3.5 text-slate-900 text-sm rounded-xl border border-slate-200 bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder:text-slate-400" 
                placeholder="••••••••" 
                required 
              />
            </div>

            {/* INFORMASI AKUN DEMO */}
            {isLogin && (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-800 text-center font-medium mt-2">
                Email demo: <strong>yaabunayya@gmail.com</strong><br/>
                Sandi demo: <strong>guru1234</strong>
              </div>
            )}

            {/* TOMBOL SUBMIT (FULL INTERAKTIF) */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full group mt-6 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isLogin ? "Masuk ke Dashboard" : "Daftar Sekarang"}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            
          </form>

          {/* PEMISAH */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Atau lanjutkan dengan</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* TOMBOL GOOGLE (FULL INTERAKTIF) */}
          <button 
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-slate-300 active:scale-[0.97]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* TOGGLE DAFTAR / MASUK */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Belum memiliki akun? " : "Sudah memiliki akun? "}
              <button 
                type="button"
                onClick={toggleAuthMode}
                className="font-bold text-slate-900 hover:text-indigo-600 transition-all duration-300 cursor-pointer underline decoration-slate-300 hover:decoration-indigo-600 underline-offset-4 hover:underline-offset-8 active:scale-[0.95]"
              >
                {isLogin ? "Daftar sekarang" : "Masuk di sini"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}