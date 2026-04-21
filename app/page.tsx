"use client";

import { useState } from "react";
import { 
  LayoutDashboard, FileText, Route, CalendarDays, 
  Target, Gamepad2, LogOut, User, School, ChevronRight, Sparkles, Lightbulb, HeartHandshake 
} from "lucide-react";

import ModulAjar from "./components/ModulAjar";
import Silabus from './components/Silabus';
import SoalUjian from "./components/SoalUjian";
import IceBreaking from "./components/IceBreaking";
import Promes from "./components/Promes";
import LandingAuth from "./components/LandingAuth";
import RekapDokumen from "./components/RekapDokumen";
import VariasiPembelajaran from "./components/VariasiPembelajaran";
import Konselor from "./components/Konselor";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [activeTab, setActiveTab] = useState("rekap"); 
  const [namaGuru, setNamaGuru] = useState("Bpk/Ibu Guru"); 
  const [namaSekolah, setNamaSekolah] = useState("Nama Instansi");

  const tabs = [
    { id: "rekap", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { id: "rpp", icon: <FileText size={18} />, label: "Modul Ajar" },
    { id: "silabus", icon: <Route size={18} />, label: "Silabus / ATP" },
    { id: "promes", icon: <CalendarDays size={18} />, label: "Prota / Promes" },
    { id: "soal", icon: <Target size={18} />, label: "Bank Soal" },
    { id: "icebreaking", icon: <Gamepad2 size={18} />, label: "Ice Breaking" },
    { id: "variasi", icon: <Lightbulb size={18} />, label: "Variasi Mengajar" },
    { id: "konselor", icon: <HeartHandshake size={18} />, label: "Asisten Konselor" },
  ];

  const activeLabel = tabs.find(t => t.id === activeTab)?.label || "Dashboard";

  if (!isLoggedIn) return <LandingAuth onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    // Tambahkan class global-cursor di sini
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* CSS Injection untuk memastikan kursor tangan di semua elemen klik */}
      <style jsx global>{`
        button, a, input[type="submit"], select, .cursor-pointer {
          cursor: pointer !important;
        }
      `}</style>
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none uppercase">
                Asisten <span className="text-indigo-600">Guru AI</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Workspace v1.0</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]" 
                  : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`}>
                  {tab.icon}
                </span>
                <span className="font-bold text-sm">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight size={14} className="text-indigo-200" />}
            </button>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 mb-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{namaGuru}</p>
              <p className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-tight">{namaSekolah}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full py-3 rounded-xl border border-red-100 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeLabel}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tersinkronasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 flex items-center gap-2">
               <User size={12} className="text-indigo-500" /> {namaGuru}
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {activeTab === "rekap" && <RekapDokumen />}
            {activeTab === "modul" && <ModulAjar namaGuru={namaGuru} namaSekolah={namaSekolah} />}
            {activeTab === "silabus" && <Silabus />}
            {activeTab === "soal" && <SoalUjian />}
            {activeTab === "icebreaking" && <IceBreaking />}
            {activeTab === "promes" && <Promes />}
            {activeTab === "variasi" && <VariasiPembelajaran />}
            {activeTab === "konselor" && <Konselor />}
          </div>
        </div>
      </main>
    </div>
  );
}