"use client";

import React, { useState, useEffect } from 'react';
import { 
  Smile, Zap, Users, Clock, Gamepad2, 
  Brain, Sparkles, CheckCircle, Lightbulb,
  Activity, ArrowRight, BookOpen, Menu, X 
} from 'lucide-react';

interface IceBreaker {
  judul: string;
  durasi: string;
  jenis: string;
  persiapan: string;
  manfaat_psikologis: string;
  langkah_langkah: string[];
}

interface AiResponseData {
  analisis_situasi: string;
  ice_breakers: IceBreaker[];
}

export default function IceBreaking() {
  const [mapel, setMapel] = useState("");
  const [kelas, setKelas] = useState("");
  const [kondisi, setKondisi] = useState("Mengantuk / Kurang Fokus");
  const [durasi, setDurasi] = useState("5 - 10 Menit");
  const [catatan, setCatatan] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [aiData, setAiData] = useState<AiResponseData | null>(null);
  const [loadingText, setLoadingText] = useState("");

  // --- STATE MENU HAMBURGER (MOBILE ONLY) ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isGenerating) return;
    const texts = [
      "Menganalisis Psikologi Siswa 🧠", 
      "Mencari Ide Permainan Seru 🎲", 
      "Menyelipkan Materi Pelajaran 📚", 
      "Menyusun Langkah demi Langkah 📝", 
      "Menyiapkan 3 Opsi Terbaik... 🚀"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapel || !kelas) return alert("Mohon isi Mata Pelajaran dan Kelas!");

    setIsGenerating(true);
    
    const systemPrompt = `Bertindaklah sebagai Ahli Psikologi Pendidikan dan Master Ice Breaking yang sangat kreatif. Tugas Anda adalah menciptakan 3 ide aktivitas Ice Breaking (pencair suasana) yang EDUKATIF dan MENYENANGKAN berdasarkan situasi berikut:
Mata Pelajaran: ${mapel}
Fase/Kelas: ${kelas}
Kondisi Siswa Saat Ini: ${kondisi}
Target Durasi: ${durasi}
Instruksi Tambahan: ${catatan || "Tidak ada"}

ATURAN WAJIB:
1. Aktivitas HARUS secara psikologis dapat mengatasi kondisi siswa saat ini.
2. Selipkan unsur materi/konsep dari Mata Pelajaran tersebut ke dalam permainan agar tetap relevan.
3. Buat 3 opsi yang BERBEDA JENIS (misal: Opsi 1 Fisik, Opsi 2 Asah Otak, Opsi 3 Kolaborasi).

WAJIB KEMBALIKAN HANYA DALAM FORMAT JSON MURNI BERIKUT (tanpa markdown blok kode \`\`\`json):
{
  "analisis_situasi": "Beri 1 kalimat analisis singkat mengapa kondisi siswa ini butuh penanganan khusus.",
  "ice_breakers": [
    {
      "judul": "Nama Permainan Catchy",
      "durasi": "5 Menit",
      "jenis": "Kategori Permainan",
      "persiapan": "Alat yang dibutuhkan (jika ada)",
      "manfaat_psikologis": "Manfaat spesifik permainan ini untuk otak/psikologi siswa",
      "langkah_langkah": [
        "Langkah instruksi 1 yang sangat jelas",
        "Langkah instruksi 2",
        "Langkah instruksi 3"
      ]
    }
  ]
}`;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal menghubungi server");

      let cleanJsonString = data.result;
      cleanJsonString = cleanJsonString.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsedData: AiResponseData = JSON.parse(cleanJsonString);
      setAiData(parsedData);
      setHasGenerated(true);
      setIsMobileMenuOpen(false); // Reset menu state jika ada

    } catch (error) {
      console.error("Gagal memproses Ice Breaking:", error);
      alert("Terjadi kesalahan saat AI meracik JSON. Silakan coba klik Generate lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 py-6 md:py-10 px-4 md:px-8 overflow-x-hidden">
      
      {!hasGenerated ? (
        <div className="max-w-4xl mx-auto">
          {/* Penyesuaian padding (p-6 di HP, p-10 di PC) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-[0_15px_40px_rgb(244,63,94,0.1)] border border-rose-100 relative overflow-hidden transition-all">
            
            <div className="absolute -top-10 -right-10 p-8 opacity-10 md:opacity-5 pointer-events-none text-rose-500 transform rotate-12">
              <Smile size={200} className="md:w-[300px] md:h-[300px]" />
            </div>

            <div className="relative z-10 mb-8 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center gap-4 text-center md:text-left">
              <div className="mx-auto md:mx-0 bg-gradient-to-br from-rose-500 to-orange-500 text-white p-4 rounded-2xl shadow-lg w-max">
                <Zap size={28} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">AI Ice Breaking Generator</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Kembalikan fokus & energi siswa secara interaktif.</p>
              </div>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-500">
                    <Gamepad2 size={28} className="animate-bounce" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-700 mt-8 animate-pulse text-rose-900">Meracik Keseruan...</h3>
                <p className="text-rose-600 font-mono text-xs md:text-sm mt-3 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 max-w-[280px] md:max-w-md mx-auto truncate">
                  {loadingText}
                </p>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-rose-600 flex items-center gap-2">
                      <BookOpen size={16} /> Mata Pelajaran
                    </label>
                    <input type="text" value={mapel} onChange={(e) => setMapel(e.target.value)} placeholder="Contoh: Sejarah" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-rose-600 flex items-center gap-2">
                      <Users size={16} /> Kelas / Fase
                    </label>
                    <input type="text" value={kelas} onChange={(e) => setKelas(e.target.value)} placeholder="Contoh: Kelas 11 SMA" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-rose-600 flex items-center gap-2">
                      <Brain size={16} /> Kondisi Siswa Saat Ini
                    </label>
                    <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all shadow-sm appearance-none cursor-pointer">
                      <option>🥱 Mengantuk / Kurang Fokus (Jam Rawan)</option>
                      <option>😬 Tegang (Mau Ujian / Kuis)</option>
                      <option>😶 Pasif / Sepi (Butuh interaksi)</option>
                      <option>🤝 Belum Saling Kenal (Awal Semester)</option>
                      <option>🤯 Lelah Otak (Materi Terlalu Berat)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-xs uppercase tracking-wider text-rose-600 flex items-center gap-2">
                      <Clock size={16} /> Target Durasi
                    </label>
                    <select value={durasi} onChange={(e) => setDurasi(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm md:text-base text-slate-700 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all shadow-sm appearance-none cursor-pointer">
                      <option>⚡ Singkat (3 - 5 Menit)</option>
                      <option>⏱️ Sedang (5 - 10 Menit)</option>
                      <option>⏳ Agak Lama (10 - 15 Menit)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 bg-orange-50 rounded-2xl p-4 md:p-6 border border-orange-100">
                    <label className="font-bold text-xs uppercase tracking-wider text-orange-700 flex items-center gap-1.5 mb-2">
                      <span>💡</span> Request Khusus AI (Opsional)
                    </label>
                    <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: Tolong buat yang tidak perlu murid beranjak dari bangku." className="w-full bg-white border border-orange-200 rounded-xl px-4 py-3 text-sm md:text-base text-orange-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm placeholder:text-orange-300" />
                  </div>

                </div>

                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-base md:text-lg py-4 md:py-5 rounded-xl shadow-xl shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group">
                  <Sparkles className="group-hover:rotate-12 transition-transform text-white" size={20} />
                  Buat Ice Breaking Sekarang
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (

        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
          
          {/* ==========================================
              ACTION BAR DENGAN HAMBURGER MENU (MOBILE)
              ========================================== */}
          <div className="flex justify-between items-start md:items-center mb-8 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-lg border border-rose-100 relative">
            
            <div className="flex gap-3 md:gap-4 pr-12 md:pr-0">
              <div className="bg-rose-100 p-2 md:p-3 rounded-xl shadow-inner text-rose-600 flex-shrink-0">
                <CheckCircle className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 leading-tight">3 Opsi Berhasil Dibuat</h3>
                <p className="text-xs md:text-sm text-slate-500 italic mt-1 line-clamp-2 md:line-clamp-none">
                  AI: "{aiData?.analisis_situasi}"
                </p>
              </div>
            </div>

            {/* Tombol Desktop (Hanya tampil di layar md ke atas) */}
            <div className="hidden md:flex gap-3">
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center gap-2 active:scale-95 print:hidden">
                <span>🖨️</span> Cetak Kartu
              </button>
              <button onClick={() => setHasGenerated(false)} className="px-5 py-2.5 bg-white text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 border border-rose-200 transition-all shadow-sm flex items-center gap-2 active:scale-95 print:hidden">
                Buat Ulang
              </button>
            </div>

            {/* Tombol Hamburger Mobile (Hanya tampil di layar kecil) */}
            <div className="md:hidden absolute top-4 right-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 active:bg-rose-100 print:hidden"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Dropdown Menu Mobile */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 print:hidden animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { setIsMobileMenuOpen(false); window.print(); }} className="w-full text-left px-5 py-3 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center gap-3 border-b border-slate-100">
                    <span>🖨️</span> Cetak PDF / Kartu
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); setHasGenerated(false); }} className="w-full text-left px-5 py-3 hover:bg-rose-50 text-rose-600 font-semibold text-sm flex items-center gap-3">
                    <span>🔄</span> Buat Ulang Topik
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Kumpulan Kartu */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {aiData?.ice_breakers.map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full relative overflow-hidden group hover:border-rose-300 transition-colors print:shadow-none print:border-2 print:border-black print:break-inside-avoid">
                
                {/* Pita Nomor */}
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-rose-500 to-orange-500 text-white font-black text-lg md:text-xl w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-bl-3xl">
                  {index + 1}
                </div>

                <div className="mb-5 md:mb-6 pr-10">
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">{item.judul}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md">
                      <Clock size={12} /> {item.durasi}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md">
                      <Gamepad2 size={12} /> {item.jenis}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 flex-grow text-xs md:text-sm text-slate-600">
                  <div className="bg-rose-50 rounded-xl p-3 md:p-4 border border-rose-100">
                    <h4 className="font-bold text-rose-800 flex items-center gap-1.5 mb-1.5 md:mb-2">
                      <Lightbulb size={14} className="md:w-4 md:h-4" /> Manfaat
                    </h4>
                    <p className="text-rose-700 leading-relaxed">{item.manfaat_psikologis}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2 md:mb-3 mt-4">
                      <Activity size={14} className="text-orange-500 md:w-4 md:h-4" /> Persiapan Alat
                    </h4>
                    <p className="bg-slate-50 px-3 py-2 rounded-lg font-medium border border-slate-200 inline-block">{item.persiapan}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2 md:mb-3 mt-4">
                      <ArrowRight size={14} className="text-rose-500 md:w-4 md:h-4" /> Cara Bermain
                    </h4>
                    <ul className="space-y-2.5 md:space-y-3">
                      {item.langkah_langkah.map((langkah, i) => (
                        <li key={i} className="flex gap-2.5 md:gap-3">
                          <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[10px] md:text-xs mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{langkah}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}