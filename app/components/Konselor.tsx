"use client";

import React, { useState } from "react";
import { HeartHandshake, Loader2, BookHeart, ShieldAlert, GraduationCap, Thermometer } from "lucide-react";

export default function Konselor() {
  const [kasus, setKasus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/generate-konselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kasus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghubungi konselor AI.");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <HeartHandshake className="text-emerald-500" size={28} />
            Konselor Multi-Fungsi (Psikologi, Pendidikan & Kesehatan)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Panduan lengkap menghadapi kendala belajar, masalah emosional, hingga keluhan kesehatan siswa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <div className="flex items-start gap-3 p-3 mb-5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-[11px] leading-relaxed">
              <Thermometer size={18} className="shrink-0 text-blue-500" />
              <p>
                <strong>Baru: Fitur Kesehatan Terintegrasi.</strong> Kini Anda bisa berkonsultasi mengenai penanganan pertama siswa yang mengeluh sakit fisik di sekolah.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <GraduationCap size={14} className="text-emerald-500"/> Deskripsi Kondisi/Keluhan Siswa
                </label>
                <textarea
                  required rows={8} 
                  placeholder="Contoh Kasus Medis: Seorang siswa tiba-tiba pucat, berkeringat dingin, dan mengeluh nyeri perut hebat di tengah pelajaran. Ia belum sarapan dan tadi pagi sempat kehujanan..."
                  className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all bg-slate-50 resize-none leading-relaxed"
                  value={kasus} onChange={(e) => setKasus(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-white font-bold rounded-xl shadow-md transition-all duration-300 ${
                  loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200 hover:-translate-y-0.5"
                }`}
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Menganalisis Kasus...</> : "Minta Analisis & Solusi"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm font-medium">
              🚨 {error}
            </div>
          )}

          {result ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <style dangerouslySetInnerHTML={{__html: `
                .konselor-content h3 { color: #065f46; font-weight: 800; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 2px solid #d1fae5; padding-bottom: 0.25rem; display: flex; align-items: center; gap: 8px;}
                .konselor-content p { color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem; }
                .konselor-content ul, .konselor-content ol { color: #475569; font-size: 0.95rem; margin-left: 1.5rem; margin-bottom: 1rem; }
                .konselor-content li { margin-bottom: 0.4rem; line-height: 1.5; }
                .konselor-content strong { color: #1e293b; font-weight: 700; }
              `}} />
              <div className="konselor-content" dangerouslySetInnerHTML={{ __html: result }} />
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 p-6 text-center">
              <HeartHandshake size={48} className="text-emerald-200 mb-4" />
              <p className="font-medium text-sm text-slate-600">Panduan multi-dimensi akan muncul di sini</p>
              <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                Gunakan asisten ini untuk membantu Anda mengambil keputusan awal yang tepat saat siswa mengalami masalah kesehatan, psikologis, atau akademis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}