"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function ModulAjar({ namaGuru, namaSekolah }: { namaGuru: string, namaSekolah: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [formData, setFormData] = useState({ mapel: "", kelas: "", durasi: "", topik: "", kota: "", catatan: "" });

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePrint = () => window.print();

  // Animasi Mesin Tik saat Loading
  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Menganalisis Kurikulum 🧐", 
      "Menyusun Capaian Pembelajaran ✨", 
      "Membuat Tabel Kegiatan Seru 📝", 
      "Merancang Asesmen HOTS 🎯", 
      "Finalisasi Dokumen Cantik... 🚀"
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
    const printArea = document.getElementById("area-cetak-dokumen");
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
        .font-bold { font-weight: bold; }
        .mt-16 { margin-top: 40px; }
        .page-break { page-break-before: always; mso-break-type: page-break; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";

    let htmlContent = printArea.innerHTML;
    htmlContent = htmlContent.replace(/print:break-after-page/g, "page-break");

    const sourceHTML = header + htmlContent + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Modul_Ajar_${formData.mapel.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    const listTopik = formData.topik.split('\n').filter(t => t.trim() !== "");
    const instruksiTambahan = formData.catatan ? `CATATAN KHUSUS DARI GURU: ${formData.catatan}` : "";
    
    const prompt = `Bertindaklah sebagai Ahli Kurikulum Merdeka tingkat Nasional yang sangat berpengalaman. Tugas Anda adalah membuat Modul Ajar / RPP yang SANGAT DETAIL, KOMPREHENSIF, dan MENDALAM untuk mata pelajaran ${formData.mapel} kelas ${formData.kelas}. 
    
    Terdapat ${listTopik.length} topik yang harus dibuatkan modulnya secara terpisah: ${listTopik.join(', ')}. 
    
    ${instruksiTambahan}

    ATURAN KUALITAS KONTEN (WAJIB DIIKUTI):
    1. TUJUAN PEMBELAJARAN: Wajib mengandung unsur Audience, Behavior, Condition, dan Degree (ABCD) serta berorientasi pada HOTS (C4-C6).
    2. KKTP & DIFERENSIASI: Wajib sertakan Kriteria Ketercapaian Tujuan Pembelajaran dan strategi Pembelajaran Berdiferensiasi.
    3. KEGIATAN PEMBELAJARAN: Ini adalah bagian PALING PENTING. Buatlah seperti SKENARIO MENGAJAR/NASKAH yang sangat panjang dan praktis. Jangan gunakan kalimat pasif. Tulis instruksi pasti apa yang dilakukan guru dan apa yang merespons siswa berdasarkan Sintaks Model Pembelajaran (misal: PBL/PjBL).
    4. Buat instrumen Asesmen yang nyata (berikan contoh pertanyaannya/rubrik, bukan sekadar menyebutkan jenis asesmen).

    ATURAN FORMAT MUTLAK (SANGAT KRITIAL):
    1. DILARANG menggunakan format JSON. Wajib gunakan format TEKS MARKDOWN murni.
    2. PISAHKAN SETIAP MODUL TOPIK dengan teks persis seperti ini: ---PEMISAH---
    3. Langsung mulai setiap modul dengan "### I. INFORMASI UMUM".
    4. WAJIB gunakan format TABEL MARKDOWN ASLI (dengan tanda | )
    5. PENTING UNTUK TABEL: Untuk membuat baris baru ATAU list (bullet points) DI DALAM SEL TABEL, Anda WAJIB menggunakan tag <br>. DILARANG KERAS menekan tombol Enter (baris baru sungguhan) di dalam struktur tabel karena akan merusak kode markdown tabelnya!

    FORMAT WAJIB TIAP MODUL (Ulangi format ini untuk setiap topik):
    ### I. INFORMASI UMUM
    | Komponen | Keterangan |
    |---|---|
    | Nama Penyusun | ${namaGuru || "Guru Mata Pelajaran"} |
    | Institusi | ${namaSekolah || "Sekolah"} |
    | Mata Pelajaran | ${formData.mapel} |
    | Topik/Materi | (Sebutkan topik spesifik 1 per 1 di sini) |
    | Fase/Kelas | ${formData.kelas} |
    | Alokasi Waktu | ${formData.durasi} |
    | Kompetensi Awal | (Jabarkan spesifik) |
    | Profil Pelajar Pancasila | (Jabarkan penerapan nyatanya) |
    | Model Pembelajaran | (Sebutkan model dan pendekatannya) |

    ### II. KOMPONEN INTI
    **A. Tujuan Pembelajaran (HOTS & ABCD)**
    (Tuliskan minimal 3 tujuan pembelajaran secara lengkap)

    **B. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)**
    (Jelaskan rubrik atau interval ketuntasan)

    **C. Pemahaman Bermakna & Pertanyaan Pemantik**
    (Jelaskan secara filosofis dan berikan 2-3 pertanyaan kritis yang spesifik)

    **D. Pembelajaran Berdiferensiasi**
    (Jelaskan strategi spesifik untuk diferensiasi konten/proses/produk di materi ini)

    **E. Kegiatan Pembelajaran**
    (Gunakan tabel di bawah ini. Isi kolom deskripsi dengan SANGAT MENDETAIL, PANJANG, dan APLIKATIF. Ingat: Gunakan <br> untuk baris baru di dalam sel tabel!)
    
    | Tahap | Deskripsi Kegiatan Secara Detail (Skenario Mengajar) | Waktu |
    |---|---|---|
    | **Pendahuluan** | **1. Orientasi:** (Jelaskan cara guru membuka kelas, salam, doa, presensi)<br><br>**2. Apersepsi:** (Tuliskan rumusan Skenario Pertanyaan spesifik yang diucapkan guru untuk mengaitkan materi sebelumnya)<br><br>**3. Motivasi:** (Cara spesifik guru memotivasi siswa dan menyampaikan tujuan hari ini) | (waktu) |
    | **Kegiatan Inti** | **Sintaks 1: (Sebutkan Nama Sintaks Model Pembelajarannya)**<br>👉 **Aktivitas Guru:** (Jelaskan detail instruksi, pertanyaan pancingan, atau materi yang diberikan guru)<br>👉 **Aktivitas Siswa:** (Jelaskan detail apa yang dikerjakan, didiskusikan, atau dijawab oleh siswa)<br><br>**Sintaks 2: (Sebutkan Nama Sintaks)**<br>👉 **Aktivitas Guru:** ...<br>👉 **Aktivitas Siswa:** ... <br><br>*(Lanjutkan hingga semua sintaks selesai dijabarkan dengan skenario yang sangat padat)* | (waktu) |
    | **Penutup** | **1. Evaluasi & Refleksi:** (Tuliskan rumusan pertanyaan refleksi spesifik dari guru)<br><br>**2. Kesimpulan:** (Cara menyimpulkan bersama siswa)<br><br>**3. Tindak Lanjut:** (Tugas spesifik/arahan untuk pertemuan berikutnya) | (waktu) |

    ### III. ASESMEN & LAMPIRAN
    **A. Asesmen Formatif & Sumatif**
    (Berikan 3 contoh soal uraian HOTS berserta kunci jawabannya, atau rubrik penilaian proyek yang spesifik)

    **B. Bahan Ajar & LKPD**
    (Berikan ringkasan materi padat dan instruksi Lembar Kerja Peserta Didik yang nyata)`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      
      const rawResult = data?.result || ""; 
      
      if (!rawResult) {
        throw new Error("AI tidak mengembalikan teks (Respons Kosong). Silakan coba lagi.");
      }

      let cleanResult = rawResult
        .replace(/```markdown\n?/gi, '')
        .replace(/```json\n?/gi, '')
        .replace(/```/g, '')

      setResult(cleanResult);

    } catch (err: any) {
      alert("Gagal membuat dokumen: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const arrayModul = result.split('---PEMISAH---').filter(modul => modul.trim() !== "");

  return (
    // Bagian background akan menjadi putih murni saat diprint berkat 'print:bg-white'
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 print:bg-white py-6 md:py-10 px-4 print:py-0 print:px-0">
      
      {/* FORM KACA (GLASSMORPHISM) - Disembunyikan saat cetak dengan 'print:hidden' */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_15px_40px_rgb(99,102,241,0.1)] border border-indigo-100/80 p-6 md:p-10 mb-10 print:hidden transition-all max-w-7xl mx-auto">
        
        {/* Judul Form */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 md:mb-10 border-b border-slate-100 pb-6 text-center md:text-left">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white p-3 md:p-4 rounded-2xl shadow-lg">
                <span className="text-2xl">✨</span>
            </div>
            <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">AI Modul Ajar Generator</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-1">Standar Kurikulum Merdeka Professional.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600">Mata Pelajaran</label>
              <input type="text" name="mapel" onChange={handleInputChange} className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all shadow-sm" placeholder="Contoh: Biologi" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600">Kelas / Fase</label>
              <input type="text" name="kelas" onChange={handleInputChange} className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all shadow-sm" placeholder="Contoh: 10 / E" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600">Alokasi Waktu</label>
              <input type="text" name="durasi" onChange={handleInputChange} placeholder="Contoh: 2 x 45 Menit" className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all shadow-sm" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600">Kota TTD</label>
              <input type="text" name="kota" onChange={handleInputChange} placeholder="Contoh: Jakarta" className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all shadow-sm" required />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600">Daftar Topik (Pisah dg Enter)</label>
              <textarea name="topik" onChange={handleInputChange} rows={4} placeholder="Contoh:&#10;Ekosistem Laut&#10;Pencemaran Lingkungan" className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all shadow-sm" required />
            </div>
            
            <div className="md:col-span-2 bg-violet-50 rounded-2xl p-4 md:p-6 border border-violet-100">
              <label className="text-xs font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5"><span>💡</span> Instruksi Khusus (Opsional)</label>
              <textarea name="catatan" onChange={handleInputChange} rows={4} placeholder="Contoh: Tekankan pada model PBL (Project Based Learning). Gunakan studi kasus lingkungan terdekat." className="w-full mt-2.5 px-4 md:px-5 py-3 md:py-3.5 text-sm md:text-base rounded-xl border border-violet-200 bg-white focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none transition-all shadow-sm placeholder:text-violet-300 text-violet-900" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:scale-[1.01] text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-80 disabled:scale-100 flex justify-center items-center gap-3 relative overflow-hidden active:scale-[0.99]">
            {isLoading ? (
               <span className="flex items-center gap-3">
                 <span className="w-3 h-3 bg-amber-300 rounded-full animate-ping"></span> 
                 <span className="font-mono text-amber-100 border-r-2 border-amber-100 pr-2 animate-pulse text-sm md:text-base">{loadingText}</span>
               </span>
            ) : "🚀 Generate RPP Plus (HOTS) Sekarang"}
          </button>
        </form>
      </div>

      {/* HASIL RENDER */}
      {result && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto print:max-w-none print:w-full">
          
          {/* PANEL KENDALI DOKUMEN - Disembunyikan saat cetak dengan 'print:hidden' */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 print:hidden bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-emerald-100 sticky top-4 md:top-[100px] z-10 text-center md:text-left">
             <div className="flex items-center gap-3 md:gap-4">
               <div className="bg-emerald-100 p-2.5 md:p-3 rounded-xl shadow-inner text-xl md:text-2xl text-emerald-700">🎉</div>
               <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-800">Modul Ajar Berhasil Dibuat</h3>
                  <p className="text-xs md:text-sm text-slate-500">{arrayModul.length} Dokumen siap untuk digunakan.</p>
               </div>
             </div>
             
             <div className="flex w-full md:w-auto gap-2 md:gap-3">
               <button onClick={handleExportWord} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 transition-all active:scale-95 text-xs md:text-sm">
                 <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1.5 13.5l-1.5-1.5-1.5 1.5-2.5-3.5h2l1 1.5 1-1.5h2l-2.5 3.5zM13 9V3.5L18.5 9H13z"/></svg>
                 Export Word
               </button>
               <button onClick={handlePrint} className="flex-1 md:flex-none bg-slate-900 hover:bg-black text-white px-4 md:px-6 py-3 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 transition-all active:scale-95 text-xs md:text-sm">
                 <span className="text-lg md:text-xl">🖨️</span> PDF / Cetak
               </button>
             </div>
          </div>
          
          {/* AREA BUNGKUSAN DOKUMEN */}
          <div id="area-cetak-dokumen" className="print:bg-white print:text-black">
            {arrayModul.map((modulContent, index) => (
              /* KERTAS A4 - Setingan Print Sempurna */
              <div key={index} className="bg-white shadow-[0_20px_60px_rgb(0,0,0,0.05)] mx-auto p-6 md:p-[25mm] min-h-screen md:min-h-[297mm] w-full max-w-full md:max-w-[210mm] print:p-0 print:m-0 print:max-w-[210mm] print:shadow-none mb-12 print:mb-0 print:break-after-page flex flex-col relative text-black rounded-3xl print:rounded-none overflow-x-auto print:overflow-hidden">
                
                {/* KOP */}
                <div className="text-center mb-10 border-b-4 border-indigo-500 print:border-black pb-5">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-indigo-950 print:text-black">{namaSekolah || "NAMA SEKOLAH"}</h2>
                  <h1 className="text-lg md:text-xl font-bold mt-1.5 text-slate-700 print:text-black">MODUL AJAR / RPP PLUS</h1>
                </div>

                {/* ISI MARKDOWN - Solusi tabel terpotong: [&_tr]:break-inside-avoid */}
                <div className="flex-grow text-sm md:text-base text-slate-800 print:text-black
                  [&_h3]:font-black [&_h3]:mt-10 [&_h3]:mb-5 [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:uppercase [&_h3]:border-l-4 [&_h3]:border-indigo-500 [&_h3]:pl-3 [&_h3]:text-indigo-900 print:[&_h3]:text-black print:[&_h3]:border-black
                  [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:whitespace-pre-wrap [&_strong]:font-bold
                  [&_table]:w-full [&_table]:border-collapse [&_table]:border-2 [&_table]:border-black [&_table]:mb-10 [&_table]:text-xs md:[&_table]:text-sm print:[&_table]:border-black
                  [&_tr]:break-inside-avoid print:[&_tr]:break-inside-avoid
                  [&_th]:border [&_th]:border-black [&_th]:bg-indigo-50 [&_th]:p-2 md:[&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:align-top [&_th]:text-indigo-950 print:[&_th]:bg-transparent print:[&_th]:text-black
                  [&_td]:border [&_td]:border-black [&_td]:p-2 md:[&_td]:p-3 [&_td]:align-top print:[&_td]:border-black
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{modulContent}</ReactMarkdown>
                </div>

                {/* TTD */}
                <div className="mt-16 md:mt-20 flex flex-col md:flex-row justify-between gap-10 md:gap-0 text-xs md:text-sm pt-8 border-t border-slate-100 print:border-black print:flex-row">
                  <div className="text-center w-full md:w-56 print:w-56">
                    <p>Mengetahui,</p>
                    <p className="mb-20 md:mb-24">Kepala Sekolah</p>
                    <p className="font-bold underline">_________________________</p>
                  </div>
                  <div className="text-center w-full md:w-56 print:w-56">
                    <p>{formData.kota || "Kota"}, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="mb-20 md:mb-24">Guru Mata Pelajaran</p>
                    <p className="font-bold underline">{namaGuru || "_________________________"}</p>
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