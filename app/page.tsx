"use client";

import { useState } from "react";
import LandingAuth from "./components/LandingAuth";
import ModulAjar from "./components/ModulAjar";
import Promes from "./components/Promes";
import Silabus from "./components/Silabus";
import SoalUjian from "./components/SoalUjian";
import VariasiPembelajaran from "./components/VariasiPembelajaran";
import IceBreaking from "./components/IceBreaking";
import Konselor from "./components/Konselor";
import RekapDokumen from "./components/RekapDokumen";

export default function Home() {
  // State untuk mengecek apakah user sudah login atau belum
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State untuk memilih menu di dashboard
  const [activeTab, setActiveTab] = useState("modul");

  // Jika BELUM login, tampilkan halaman LandingAuth
  if (!isLoggedIn) {
    return <LandingAuth onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Jika SUDAH login, tampilkan Dashboard Guru
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER DASHBOARD */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ASISTEN GURU AI</h1>
          </div>
          
          <button 
            onClick={() => setIsLoggedIn(false)} 
            className="text-sm font-semibold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {/* NAVIGASI MENU */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          {[
            { id: "modul", label: "📦 Modul Ajar", color: "blue" },
            { id: "soal", label: "🎯 Bank Soal", color: "violet" },
            { id: "promes", label: "📅 Promes", color: "emerald" },
            { id: "silabus", label: "📖 Silabus", color: "amber" },
            { id: "variasi", label: "✨ Variasi", color: "pink" },
            { id: "ice", label: "🎮 Ice Breaking", color: "orange" },
            { id: "konselor", label: "🤝 Konselor", color: "cyan" },
            { id: "rekap", label: "📊 Rekap", color: "slate" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* KONTEN DINAMIS BERDASARKAN TAB */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "modul" && <ModulAjar />}
          {activeTab === "soal" && <SoalUjian />}
          {activeTab === "promes" && <Promes />}
          {activeTab === "silabus" && <Silabus />}
          {activeTab === "variasi" && <VariasiPembelajaran />}
          {activeTab === "ice" && <IceBreaking />}
          {activeTab === "konselor" && <Konselor />}
          {activeTab === "rekap" && <RekapDokumen />}
        </div>
      </main>
    </div>
  );
}