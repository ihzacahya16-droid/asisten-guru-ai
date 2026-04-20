"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Silabus() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [formData, setFormData] = useState({ 
    sekolah: "", 
    jurusan: "", 
    mapel: "", 
    waktu: "", 
    fase: "", 
    guru: "", 
    instruksi: "" 
  });

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePrint = () => window.print();

  // Animasi Mesin Tik saat Loading
  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Memetakan Capaian Pembelajaran 🧐", 
      "Menyusun Matriks ATP ✨", 
      "Mengintegrasikan Profil Pancasila 📝", 
      "Merancang Asesmen Terpadu 🎯", 
      "Menyempurnakan Dokumen Silabus... 🚀"
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
    const printArea = document.getElementById("area-cetak-silabus");
    if (!printArea) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export ATP To Doc</title>
      <style>
        body { font-family: 'Times New Roman', serif; color: black; line-height: 1.5; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1pt solid black; padding: 8px; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
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
    const sourceHTML = header + htmlContent + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Silabus_ATP_${formData.mapel.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    const instruksiTambahan = formData.instruksi ? `CATATAN KHUSUS DARI GURU: ${formData.instruksi}` : "";
    
    // PROMPT AI SUPER CANGGIH & SPESIFIK JENJANG SD-SMA
    const prompt = `Bertindaklah sebagai Konsultan Pendidikan Tingkat Nasional dan Ahli Pengembang Kurikulum Merdeka khusus jenjang Pendidikan Dasar hingga Menengah (SD, SMP, SMA/SMK).
    Tugas utama Anda adalah menyusun dokumen Silabus / Alur Tujuan Pembelajaran (ATP) yang SANGAT DETAIL, TERSTRUKTUR, dan SUPER CANGGIH untuk:
    
    - Mata Pelajaran: ${formData.mapel}
    - Fase / Kelas: ${formData.fase}
    - Institusi / Sekolah: ${formData.sekolah}
    - Program/Jurusan: ${formData.jurusan || 'Umum'}
    - Alokasi Waktu Total: ${formData.waktu}
    ${instruksiTambahan}

    ATURAN KONTEN & KUALITAS (WAJIB DITAATI):
    1. STRICT RULE: Hindari bahasa, istilah, atau level kognitif perkuliahan/kampus. Fokus penuh pada pedagogi, psikologi perkembangan, dan nalar anak usia sekolah (SD-SMA).
    2. ATP harus logis, berjenjang secara berurutan dari materi dasar hingga kompleks (Metode Scaffolding) selama 1 tahun ajaran.
    3. Integrasikan Profil Pelajar Pancasila (P3) secara spesifik dan rasional di setiap elemen (bukan sekadar tempelan nama).
    4. Jabarkan metode Asesmen yang modern, interaktif, dan aplikatif (Kombinasikan Formatif dan Sumatif seperti Proyek, Portofolio, Unjuk Kerja).

    ATURAN FORMAT MARKDOWN (SANGAT KRUSIAL):
    1. DILARANG KERAS menggunakan format JSON. Wajib gunakan format TEKS MARKDOWN murni.
    2. PENTING UNTUK TABEL: Gunakan tag <br> untuk membuat baris baru ATAU list bullet point ( - ) DI DALAM SEL TABEL. 
    3. DILARANG KERAS menekan tombol Enter (baris baru sungguhan) di dalam struktur tabel karena akan merusak kode syntax markdown.
    4. Gunakan tabel Markdown asli (dengan tanda | ).

    FORMAT WAJIB DOKUMEN ATP (Gunakan struktur ini persis, dan kembangkan isinya menjadi sangat komprehensif):
    
    ### I. IDENTITAS ALUR TUJUAN PEMBELAJARAN (ATP)
    | Komponen | Keterangan |
    |---|---|
    | Nama Sekolah | ${formData.sekolah} |
    | Mata Pelajaran | ${formData.mapel} |
    | Fase / Kelas | ${formData.fase} |
    | Program Keahlian/Jurusan | ${formData.jurusan || '-'} |
    | Alokasi Waktu Total | ${formData.waktu} |
    | Nama Penyusun | ${formData.guru || 'Guru Mata Pelajaran'} |

    ### II. RASIONAL & KARAKTERISTIK MATA PELAJARAN
    (Jelaskan dalam 2-3 paragraf komprehensif nan filosofis mengenai mengapa mata pelajaran ini sangat krusial diajarkan di fase ini, dan karakteristik utama kompetensi yang ingin dibangun sesuai kaidah BSKAP Kemdikbudristek).

    ### III. CAPAIAN PEMBELAJARAN (CP) FASE TERKAIT
    (Uraikan secara detail rumusan utuh Capaian Pembelajaran secara umum untuk fase ini sebelum dibedah ke dalam matriks).

    ### IV. MATRIKS ALUR TUJUAN PEMBELAJARAN (ATP) COMPREHENSIVE
    (Ini adalah "Jantung" dokumen. Buatkan tabel matriks super lengkap yang memetakan elemen, capaian, materi, hingga asesmen. Isi dengan penjabaran yang SANGAT DETAIL dan APLIKATIF, mencakup seluruh elemen CP hingga menutupi total alokasi waktu yang diminta).

    | Elemen CP | Capaian Pembelajaran (Per Elemen) | Tujuan Pembelajaran (TP) Berjenjang | Materi Inti & Glosarium | Dimensi Profil Pelajar Pancasila | Estimasi Waktu | Rencana Asesmen (Formatif & Sumatif) |
    |---|---|---|---|---|---|---|
    | **(Nama Elemen 1)** | (Deskripsi lengkap CP Elemen ini) | **1.1** (Tujuan level dasar)<br>**1.2** (Tujuan level lanjutan)<br>*(Gunakan prinsip ABCD dan KKO HOTS yang sesuai jenjang sekolah)* | 👉 **Materi Inti:**<br>- (Materi 1)<br>- (Materi 2)<br><br>👉 **Glosarium:**<br>- (Kata) : (Arti) | (Sebutkan dimensi dan elemen P3 yang paling relevan berserta wujud penerapannya) | (Berapa JP) | 👉 **Formatif:** (Cara asesmen berkala)<br>👉 **Sumatif:** (Bentuk penilaian akhir elemen) |
    | **(Nama Elemen 2)** | (Deskripsi lengkap CP Elemen ini) | **2.1** (Tujuan level dasar)<br>**2.2** (Tujuan level lanjutan) | 👉 **Materi Inti:**...<br><br>👉 **Glosarium:**... | (Dimensi P3) | (Berapa JP) | 👉 **Formatif:** ...<br>👉 **Sumatif:** ... |
    *(Lanjutkan format baris tabel di atas untuk SEMUA ELEMEN yang relevan pada mata pelajaran ini)*

    ### V. KETENTUAN PELAKSANAAN & STRATEGI TINDAK LANJUT
    (Berikan 3-4 rekomendasi canggih khusus bagi guru mengenai strategi pedagogik, penggunaan teknologi/media interaktif, serta pelibatan lingkungan sekitar agar implementasi ATP ini optimal bagi siswa SD/SMP/SMA).
    `;

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

      // ======================================================================
      // FITUR TAMBAHAN: MENYIMPAN KE RIWAYAT (LOCAL STORAGE) UNTUK REKAP DOKUMEN
      // ======================================================================
      const newDoc = {
        id: Date.now().toString(),
        type: "ATP", // Identitas agar dikenali oleh RekapDokumen.tsx sebagai ATP
        title: `Silabus ATP ${formData.mapel} - ${formData.fase}`,
        date: new Date().toISOString(),
        sekolah: formData.sekolah || "Sekolah Tidak Diketahui",
        mapel: formData.mapel || "Mapel Umum",
        fase: formData.fase || "-",
        guru: formData.guru || "Guru",
        content: cleanResult,
        formData: formData // Simpan form asli jika sewaktu-waktu butuh edit
      };

      // Tarik data riwayat yang sudah ada
      const existingDocs = JSON.parse(localStorage.getItem("all_teacher_docs") || "[]");
      
      // Gabungkan data baru di urutan paling atas
      const updatedDocs = [newDoc, ...existingDocs];
      
      // Simpan kembali ke browser
      localStorage.setItem("all_teacher_docs", JSON.stringify(updatedDocs));
      // ======================================================================

    } catch (err: any) {
      alert("Gagal membuat Silabus: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white py-6 md:py-10 px-4 print:py-0 print:px-0">
      
      {/* FORM GENERATOR - Sembunyikan saat di print */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-10 print:hidden transition-all max-w-7xl mx-auto">
        
        <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Silabus / ATP Generator</h2>
            <p className="text-slate-500 text-sm mt-1">Buat matriks Alur Tujuan Pembelajaran berstandar Nasional dalam hitungan detik khusus jenjang Pendidikan Dasar & Menengah.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Institusi / Sekolah */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">🏢</span> Institusi / Sekolah
              </label>
              <input type="text" name="sekolah" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: SDIT Yaa Bunayya / SMPN 1 / SMAN 5" required />
            </div>

            {/* Program Keahlian */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">🎓</span> Jurusan / Program Keahlian
              </label>
              <input type="text" name="jurusan" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: MIPA / IPS / DKV (Kosongkan jika SD/SMP)" />
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">📖</span> Mata Pelajaran
              </label>
              <input type="text" name="mapel" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: IPAS / Matematika Dasar / Pend. Pancasila" required />
            </div>

            {/* Alokasi Waktu */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">⏱️</span> Alokasi Waktu Total
              </label>
              <input type="text" name="waktu" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: 144 JP / 4 Jam Per Minggu" required />
            </div>

            {/* Fase / Kelas */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">👥</span> Fase / Kelas
              </label>
              <input type="text" name="fase" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: Fase A - Kelas 1 / Fase E - Kelas 10" required />
            </div>

            {/* Nama Guru */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2 mb-2">
                <span className="text-lg">👨‍🏫</span> Nama Guru Pengampu
              </label>
              <input type="text" name="guru" onChange={handleInputChange} className="w-full px-5 py-3.5 text-slate-800 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-300 outline-none transition-all" placeholder="Contoh: Nanang Triasmosari, S.Pd., M.Pd." required />
            </div>
            
            {/* Instruksi Khusus */}
            <div className="md:col-span-2 bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span> Instruksi Khusus AI (Opsional)
              </label>
              <textarea name="instruksi" onChange={handleInputChange} rows={3} placeholder="Contoh: Fokuskan pada elemen profil pelajar pancasila bernalar kritis dan gotong royong, serta rancang proyek akhir semester berbasis pelestarian lingkungan sekolah." className="w-full px-5 py-3.5 text-purple-900 rounded-xl border border-purple-200 bg-white focus:ring-2 focus:ring-purple-300 outline-none transition-all placeholder:text-purple-300" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-80 flex justify-center items-center gap-3">
            {isLoading ? (
               <span className="flex items-center gap-3">
                 <span className="w-3 h-3 bg-white rounded-full animate-ping"></span> 
                 <span className="animate-pulse">{loadingText}</span>
               </span>
            ) : "🚀 Generate Matriks ATP Sekarang"}
          </button>
        </form>
      </div>

      {/* HASIL RENDER */}
      {result && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto print:max-w-none print:w-full">
          
          {/* PANEL KENDALI DOKUMEN */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 print:hidden bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-4">
               <div className="bg-green-100 p-3 rounded-xl text-2xl">✅</div>
               <div>
                  <h3 className="text-lg font-bold text-slate-800">Silabus / ATP Selesai!</h3>
                  <p className="text-sm text-slate-500">Matriks siap dicetak dan tersimpan otomatis di Rekap Dokumen.</p>
               </div>
             </div>
             <div className="flex gap-3">
               <button onClick={handleExportWord} className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2">
                 📄 Export Word
               </button>
               <button onClick={handlePrint} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all text-sm flex items-center gap-2">
                 🖨️ Cetak PDF
               </button>
             </div>
          </div>
          
          {/* AREA DOKUMEN KERTAS (Lanscape Friendly untuk Tabel ATP) */}
          <div id="area-cetak-silabus" className="bg-white shadow-xl mx-auto p-8 md:p-[25mm] min-h-[297mm] w-full print:p-0 print:m-0 print:shadow-none mb-12 text-black rounded-xl print:rounded-none overflow-x-auto print:overflow-visible">
            
            <div className="text-center mb-10 border-b-4 border-slate-800 print:border-black pb-5">
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800">{formData.sekolah || "NAMA SEKOLAH"}</h2>
              <h1 className="text-xl font-bold mt-2 text-slate-600 print:text-black">DOKUMEN SILABUS & ALUR TUJUAN PEMBELAJARAN (ATP)</h1>
              <p className="font-medium mt-1">KURIKULUM MERDEKA</p>
            </div>

            {/* RENDER MARKDOWN */}
            <div className="text-sm md:text-base text-slate-800 print:text-black
              [&_h3]:font-black [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:uppercase [&_h3]:bg-slate-100 [&_h3]:p-3 [&_h3]:border-l-8 [&_h3]:border-blue-600 print:[&_h3]:bg-transparent print:[&_h3]:border-black print:[&_h3]:p-0
              [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:whitespace-pre-wrap [&_strong]:font-bold
              [&_table]:w-full [&_table]:border-collapse [&_table]:border-2 [&_table]:border-slate-800 [&_table]:mb-10 [&_table]:text-xs md:[&_table]:text-sm print:[&_table]:border-black
              [&_tr]:break-inside-avoid print:[&_tr]:break-inside-avoid
              [&_th]:border [&_th]:border-slate-800 [&_th]:bg-slate-100 [&_th]:p-3 [&_th]:text-center [&_th]:font-bold [&_th]:align-middle print:[&_th]:bg-transparent print:[&_th]:border-black
              [&_td]:border [&_td]:border-slate-800 [&_td]:p-3 [&_td]:align-top print:[&_td]:border-black
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{result}</ReactMarkdown>
            </div>

            {/* TTD */}
            <div className="mt-20 flex flex-row justify-between text-sm pt-8 border-t border-slate-300 print:border-black break-inside-avoid">
              <div className="text-center w-56">
                <p>Mengetahui,</p>
                <p className="mb-24">Kepala Sekolah</p>
                <p className="font-bold underline">_________________________</p>
                <p>NIP. </p>
              </div>
              <div className="text-center w-56">
                <p>Mengesahkan,</p>
                <p className="mb-24">Waka Kurikulum</p>
                <p className="font-bold underline">_________________________</p>
                <p>NIP. </p>
              </div>
              <div className="text-center w-56">
                <p>Dibuat Pada: {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                <p className="mb-24">Guru Mata Pelajaran</p>
                <p className="font-bold underline">{formData.guru || "_________________________"}</p>
                <p>NIP. </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}