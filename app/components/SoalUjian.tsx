"use client";

import { useState, useEffect } from "react";

export default function SoalUjian() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [formData, setFormData] = useState({
    mapel: "",
    kelas: "",
    jumlahPG: "10",
    jumlahEssay: "5",
    topik: "",
    catatan: ""
  });

  const handleInputChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePrint = () => window.print();

  // Animasi Mesin Tik saat Loading
  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Menganalisis cakupan materi...",
      "Merancang stimulus kasus (HOTS)...",
      "Membuat soal Pilihan Ganda...",
      "Meracik pengecoh (distraktor) logis...",
      "Menyusun soal Essay analitik...",
      "Mempersiapkan kunci & pembahasan...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Fitur EXPORT KE WORD
  const handleExportWord = () => {
    const printArea = document.getElementById("area-cetak-soal");
    if (!printArea) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML To Doc</title>
      <style>
        body { font-family: 'Times New Roman', serif; color: black; line-height: 1.5; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1pt solid black; padding: 8px; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: left; }
        h1, h2, h3 { color: black; }
        .text-center { text-align: center; }
        .page-break { page-break-before: always; mso-break-type: page-break; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";

    let htmlContent = printArea.innerHTML;
    // Deteksi pemisah halaman (garis horizontal) untuk kunci jawaban
    htmlContent = htmlContent.replace(/<hr\s*\/?>/g, "<br clear=all style='mso-special-character:line-break;page-break-before:always'>");

    const sourceHTML = header + htmlContent + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bank_Soal_${formData.mapel.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    const instruksiTambahan = formData.catatan ? `INSTRUKSI KHUSUS/KISI-KISI: ${formData.catatan}` : "";

    const prompt = `Bertindaklah sebagai Ahli Evaluasi Pendidikan dan Pembuat Soal berstandar HOTS (Higher Order Thinking Skills) tingkat Nasional. 
    Tugas Anda adalah membuat instrumen tes untuk mata pelajaran ${formData.mapel} kelas ${formData.kelas}.

    Materi / Topik Utama:
    ${formData.topik}

    Jumlah Soal:
    - ${formData.jumlahPG} Soal Pilihan Ganda (Opsi A, B, C, D, E)
    - ${formData.jumlahEssay} Soal Essay/Uraian

    ${instruksiTambahan}

    ATURAN KUALITAS SOAL (WAJIB DIIKUTI 100%):
    1. STANDAR HOTS: Hindari soal hafalan (C1/C2). Buat soal level Analisis (C4), Evaluasi (C5), atau Mencipta (C6).
    2. WAJIB ADA STIMULUS: Setiap soal (PG maupun Essay) HARUS didahului dengan stimulus berupa paragraf cerita pendek, data fiktif, studi kasus, atau fenomena nyata. Siswa harus membaca stimulus untuk bisa menjawab.
    3. PENGECOH LOGIS: Untuk Pilihan Ganda, pastikan opsi jawaban salah (distraktor) sangat masuk akal dan merupakan kesalahan berpikir (miskonsepsi) yang umum dialami siswa.
    4. PEMBAHASAN MENDALAM: Di bagian akhir, berikan Kunci Jawaban. Untuk PG, jelaskan MENGAPA opsi itu benar dan MENGAPA opsi lain salah. Untuk Essay, berikan RUBRIK PENILAIAN lengkap dengan pembagian skor poinnya.

    ATURAN FORMAT OUTPUT (MUTLAK WAJIB HTML):
    1. Output WAJIB berupa HTML MURNI yang valid. DILARANG MENGGUNAKAN MARKDOWN.
    2. Gunakan tag semantik seperti <h3>, <h4>, <p>, <ul>, <ol>, <li>, <strong>, <em>, dan <table> jika diperlukan.
    3. Pisahkan antara lembar soal dan lembar kunci jawaban dengan tag <hr>.
    4. Langsung berikan hasil tanpa basa-basi kalimat pembuka/penutup.

    STRUKTUR YANG DIHARAPKAN:
    <h3>📄 SOAL UJIAN: ${formData.mapel.toUpperCase()} (KELAS ${formData.kelas})</h3>
    (Tuliskan alokasi waktu dan instruksi pengerjaan)

    <h4>A. PILIHAN GANDA</h4>
    <ol>
      <li>(Soal dengan stimulus di sini)
        <ol type="A">
           <li>Opsi A</li>
           <li>Opsi B</li>
           ...
        </ol>
      </li>
    </ol>

    <h4>B. ESSAY / URAIAN</h4>
    <ol>
      <li>(Soal essay dengan stimulus di sini)</li>
    </ol>

    <hr>
    <h3>🔐 KUNCI JAWABAN DAN PEMBAHASAN</h3>
    <h4>PEMBAHASAN PILIHAN GANDA</h4>
    <ol>
      <li><strong>Jawaban: [A/B/C/D/E]</strong><br><em>Pembahasan:</em> (Jelaskan rasionalisasi lengkap di sini)</li>
    </ol>
    
    <h4>RUBRIK PENILAIAN ESSAY</h4>
    <ol>
       <li><strong>Jawaban Diharapkan:</strong> (Tuliskan kunci)<br><strong>Kriteria Skor:</strong> (misal: 5 poin jika menjawab A)</li>
    </ol>`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      const rawResult = data?.result || "";
      if (!rawResult) {
        throw new Error("AI gagal meracik soal. Silakan coba lagi.");
      }

      // Pembersih otomatis dari markdown block dan tag html yang mungkin bocor
      let cleanResult = rawResult
        .replace(/```html\n?/gi, '')
        .replace(/```\n?/g, '');

      setResult(cleanResult);
    } catch (err: any) {
      alert("Gagal membuat soal: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* FORM KACA (GLASSMORPHISM) */}
      <div className="bg-violet-50/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-violet-100 p-8 mb-10 print:hidden transition-all">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-violet-900">AI Bank Soal Berstandar HOTS</h2>
          <p className="text-violet-600/70 text-sm">Buat soal analitis dengan stimulus cerdas, lengkap dengan kunci & rubrik pembahasan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mata Pelajaran</label>
              <input type="text" name="mapel" onChange={handleInputChange} placeholder="Biologi" className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-400 outline-none transition-all shadow-sm" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Kelas / Fase</label>
              <input type="text" name="kelas" onChange={handleInputChange} placeholder="11 SMA" className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-400 outline-none transition-all shadow-sm" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Jml. Pilihan Ganda</label>
              <input type="number" name="jumlahPG" value={formData.jumlahPG} onChange={handleInputChange} min="0" max="40" className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-400 outline-none transition-all shadow-sm" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Jml. Soal Essay</label>
              <input type="number" name="jumlahEssay" value={formData.jumlahEssay} onChange={handleInputChange} min="0" max="10" className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-400 outline-none transition-all shadow-sm" required />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Materi / Indikator Soal</label>
              <textarea name="topik" onChange={handleInputChange} rows={4} placeholder="Contoh:&#10;- Mutasi Genetik&#10;- Kelainan Kromosom pada Manusia" className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-400 outline-none transition-all shadow-sm" required />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1"><span>✨</span> Setelan Tingkat Kesulitan (Opsional)</label>
              <textarea name="catatan" onChange={handleInputChange} rows={4} placeholder="Contoh: Buat level kesulitannya sangat tinggi untuk seleksi Olimpiade. Fokus pada studi kasus pencemaran lingkungan terkini." className="w-full mt-2 px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition-all shadow-sm placeholder:text-indigo-300 text-indigo-900" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-violet-500/30 transition-all disabled:opacity-80 flex justify-center items-center gap-3">
            {isLoading ? (
               <span className="flex items-center gap-2">
                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> 
                 <span className="font-mono text-violet-100">{loadingText}</span>
               </span>
            ) : "🎯 Generate Soal HOTS & Pembahasan"}
          </button>
        </form>
      </div>

      {/* HASIL RENDER */}
      {result && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* PANEL KENDALI DOKUMEN */}
          <div className="flex justify-between items-center mb-8 print:hidden bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-[100px] z-10">
             <div className="flex items-center gap-3">
               <div className="bg-violet-100 p-2 rounded-full"><span className="text-xl">✅</span></div>
               <div>
                  <h3 className="text-md font-bold text-slate-800">Instrumen Evaluasi Selesai</h3>
                  <p className="text-xs text-slate-500">Dilengkapi dengan Kunci Jawaban di halaman terbawah.</p>
               </div>
             </div>
             
             <div className="flex gap-3">
               <button onClick={handleExportWord} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1.5 13.5l-1.5-1.5-1.5 1.5-2.5-3.5h2l1 1.5 1-1.5h2l-2.5 3.5zM13 9V3.5L18.5 9H13z"/></svg>
                 Export Word
               </button>
               <button onClick={handlePrint} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
                 <span className="text-lg">🖨️</span> PDF / Cetak
               </button>
             </div>
          </div>
          
          {/* AREA DOKUMEN */}
          <div id="area-cetak-soal" className="bg-white shadow-2xl mx-auto p-[20mm] min-h-[297mm] w-full max-w-[210mm] print:shadow-none mb-10 print:mb-0 text-black">
            
            {/* Header Dokumen */}
            <div className="border-b-2 border-black pb-4 mb-6 hidden print:block">
              <h2 className="text-2xl font-bold text-center">NASKAH SOAL UJIAN</h2>
              <table className="mt-4 w-full text-sm font-bold">
                <tbody>
                  <tr><td className="w-32 pb-2">Mata Pelajaran</td><td className="pb-2">: {formData.mapel}</td></tr>
                  <tr><td className="w-32 pb-2">Kelas / Fase</td><td className="pb-2">: {formData.kelas}</td></tr>
                  <tr><td className="w-32 pb-2">Nama Siswa</td><td className="pb-2">: ____________________</td></tr>
                </tbody>
              </table>
            </div>

            <div 
              className="
                [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mb-6 [&_h3]:text-center [&_h3]:uppercase [&_h3]:border-b-2 [&_h3]:pb-2 [&_h3]:border-slate-800
                [&_h4]:font-bold [&_h4]:text-lg [&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:uppercase
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ol_li]:pl-2 [&_ol_li]:mb-4
                [&_hr]:my-10 [&_hr]:border-2 [&_hr]:border-dashed [&_hr]:border-slate-300
                [&_strong]:font-bold [&_em]:italic
                [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-black [&_table]:mb-6
                [&_th]:border [&_th]:border-black [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:text-center
                [&_td]:border [&_td]:border-black [&_td]:p-2
              "
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </div>
        </div>
      )}
    </div>
  );
}