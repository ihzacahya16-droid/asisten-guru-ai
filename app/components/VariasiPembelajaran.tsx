"use client";

import React, { useState } from "react";
import { Lightbulb, BookOpen, Target, Settings, Users, Clock, Loader2, Sparkles } from "lucide-react";

export default function VariasiPembelajaran() {
  const [topik, setTopik] = useState("");
  const [kelas, setKelas] = useState("");
  const [durasi, setDurasi] = useState("90");
  const [tujuan, setTujuan] = useState("");
  const [metode, setMetode] = useState("Pembelajaran Berdiferensiasi");
  const [kondisi, setKondisi] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const pilihanMetode = [
    "Pembelajaran Berdiferensiasi",
    "Problem Based Learning (PBL)",
    "Project Based Learning (PjBL)",
    "Discovery Learning",
    "Flipped Classroom",
    "Inquiry Based Learning",
    "Think-Pair-Share (Kooperatif)",
    "Gamifikasi (Berbasis Game)"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/generate-metode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topik, tujuan, metode, kelas, durasi, kondisi }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menyusun skenario.");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Area */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Lightbulb className="text-indigo-500" size={28} />
            Generator Variasi Mengajar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Rancang skenario pembelajaran interaktif yang disesuaikan dengan kondisi kelas Anda.
          </p>
        </div>
      </div>

      {/* UBAH DI SINI: Gap diperbesar agar tidak terlalu mepet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* KOLOM KIRI: Form Input (Sekarang hanya makan 4 kolom dari 12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <BookOpen size={14} className="text-indigo-500"/> Topik / Materi
                </label>
                <input
                  type="text" required placeholder="Contoh: Sistem Pencernaan Manusia"
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50"
                  value={topik} onChange={(e) => setTopik(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Users size={14} className="text-indigo-500"/> Fase / Kelas
                  </label>
                  <input
                    type="text" required placeholder="Contoh: Fase D"
                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
                    value={kelas} onChange={(e) => setKelas(e.target.value)}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                    <Clock size={14} className="text-indigo-500"/> Menit
                  </label>
                  <input
                    type="number" required placeholder="90"
                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
                    value={durasi} onChange={(e) => setDurasi(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <Target size={14} className="text-indigo-500"/> Tujuan Belajar
                </label>
                <textarea
                  required rows={2} placeholder="Siswa mampu mengidentifikasi organ."
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 resize-none"
                  value={tujuan} onChange={(e) => setTujuan(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <Settings size={14} className="text-indigo-500"/> Kondisi Kelas
                </label>
                <textarea
                  rows={2} placeholder="Misal: Kelas siang hari, mengantuk."
                  className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 resize-none"
                  value={kondisi} onChange={(e) => setKondisi(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <Sparkles size={14} className="text-indigo-500"/> Metode
                </label>
                <select
                  className="w-full p-2.5 text-sm font-semibold text-slate-800 border border-indigo-200 bg-indigo-50/50 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  value={metode} onChange={(e) => setMetode(e.target.value)}
                >
                  {pilihanMetode.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit" disabled={loading}
                className={`w-full mt-4 py-3 px-4 flex items-center justify-center gap-2 text-white font-bold rounded-xl shadow-md transition-all duration-300 ${
                  loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5"
                }`}
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Menyusun...</> : "Generate Skenario"}
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: Hasil Output (Sekarang lebih lega, makan 8 kolom dari 12) */}
        <div className="lg:col-span-8 w-full overflow-x-hidden">
          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm font-medium">
              🚨 {error}
            </div>
          )}

          {result ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-auto">
              
              {/* CSS UPDATE: Ukuran font diperbesar (1.05rem), spasi tabel dilegakan */}
              <style dangerouslySetInnerHTML={{__html: `
                .ai-content h3 { color: #312e81; font-weight: 800; font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid #e0e7ff; padding-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;}
                .ai-content p { color: #334155; font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.2rem; }
                .ai-content ul, .ai-content ol { color: #334155; font-size: 1.05rem; margin-left: 1.5rem; margin-bottom: 1.2rem; line-height: 1.7; }
                .ai-content li { margin-bottom: 0.5rem; }
                .ai-content table { width: 100%; min-width: 600px; border-collapse: collapse; margin-top: 1.5rem; margin-bottom: 2rem; border-radius: 8px; overflow: hidden; font-size: 1.05rem; }
                .ai-content th { background-color: #e0e7ff; color: #3730a3; padding: 14px 16px; text-align: left; font-weight: 700; border: 1px solid #cbd5e1; }
                .ai-content td { padding: 14px 16px; border: 1px solid #e2e8f0; color: #1e293b; vertical-align: top; line-height: 1.6; }
                .ai-content tr:nth-child(even) td { background-color: #f8fafc; }
                .ai-content strong { color: #0f172a; font-weight: 700; }
              `}} />
              
              <div 
                className="ai-content"
                dangerouslySetInnerHTML={{ __html: result }} 
              />
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <Lightbulb size={48} className="text-slate-300 mb-4" />
              <p className="font-medium text-sm">Skenario pembelajaran akan muncul di sini</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">Isi form di sebelah kiri untuk mulai membuat variasi mengajar yang ajaib.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}