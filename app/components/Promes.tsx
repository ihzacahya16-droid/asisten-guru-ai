"use client";

import { useState, useEffect } from "react";

export default function Promes() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [formData, setFormData] = useState({
    mapel: "",
    kelas: "",
    tahunAjaran: "2024/2025",
    jenis: "Program Semester Ganjil (Promes)",
    topik: "",
    catatan: ""
  });

  const handleInputChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handlePrint = () => window.print();

  useEffect(() => {
    if (!isLoading) return;
    const texts = [
      "Mengkalibrasi format HTML murni...",
      "Memecah materi menjadi detail yang sangat mendalam...",
      "Menyuntikkan warna blok kuning pada sel minggu (JP)...",
      "Membangun struktur colspan & rowspan anti-rusak...",
      "Finalisasi dokumen berstandar nasional...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[i]);
      i = (i + 1) % texts.length;
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleExportWord = () => {
    const printArea = document.getElementById("area-cetak-promes");
    if (!printArea) return;

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML To Doc</title>
      <style>
        body { font-family: 'Times New Roman', serif; color: black; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1pt solid black; padding: 5px; font-size: 10pt; text-align: center; }
        th { background-color: #d9e8b4; font-weight: bold; }
        td.kuning { background-color: #ffff00; font-weight: bold; }
        td.kiri { text-align: left; }
        h1, h2, h3 { color: black; text-align: center; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";
    const clone = printArea.cloneNode(true) as HTMLElement;
    const sourceHTML = header + clone.innerHTML + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Perangkat_${formData.jenis.replace(/\s+/g, '_')}_${formData.mapel}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    const instruksiTambahan = formData.catatan ? `<br/>INSTRUKSI KHUSUS: ${formData.catatan}` : "";
    const isGanjil = formData.jenis.toLowerCase().includes("ganjil");

    // PROMPT ENGINEERING SPESIFIK HTML MURNI & BLOK WARNA
    const prompt = `Bertindaklah sebagai Ahli Kurikulum Senior. Buat dokumen "${formData.jenis}" untuk mapel "${formData.mapel}" tingkat "${formData.kelas}" pada Tahun Ajaran ${formData.tahunAjaran}.

Materi dasar yang harus dibedah:
${formData.topik}
${instruksiTambahan}

ATURAN SANGAT KETAT (WAJIB DIPATUHI):
1. HASILKAN 100% DALAM FORMAT HTML MURNI. JANGAN ADA MARKDOWN SAMA SEKALI. (Jangan pakai # atau **). Gunakan <h3>, <p>, <strong>, dan <table>.
2. SANGAT DETAIL: Bedah materi dasar di atas menjadi setidaknya 10-15 baris data (sub-topik). Jangan sekadar menyalin ulang. Pecah menjadi Kompetensi Dasar/TP yang sangat spesifik (contoh: menganalisis sifat, membedakan jenis, mempraktikkan, dll).
3. ATURAN WARNA BLOK (PENTING!): Pada kolom minggu (1, 2, 3, 4, 5) di mana materi tersebut diajarkan, WAJIB isikan angka Jam Pelajaran (JP) DAN tambahkan atribut warna kuning pada <td> tersebut. Contoh penulisannya WAJIB seperti ini: <td style="background-color: #fef08a; font-weight: bold;">4</td>
4. Kosongkan <td> yang tidak ada jadwal pengajaran (tulis <td></td>).

STRUKTUR HTML TABEL PROMES WAJIB SEPERTI INI (Gunakan struktur Thead ini secara presisi):
<table style="width:100%; border-collapse: collapse;" border="1">
  <thead>
    <tr>
      <th rowspan="2" style="width:3%;">NO</th>
      <th rowspan="2" style="width:25%;">KOMPETENSI DASAR / TP</th>
      <th rowspan="2" style="width:20%;">MATERI POKOK</th>
      <th rowspan="2" style="width:5%;">AW (JP)</th>
      ${isGanjil ? `
      <th colspan="4">JULI</th><th colspan="5">AGUSTUS</th><th colspan="4">SEPTEMBER</th><th colspan="5">OKTOBER</th><th colspan="4">NOVEMBER</th><th colspan="4">DESEMBER</th>
      ` : `
      <th colspan="4">JANUARI</th><th colspan="5">FEBRUARI</th><th colspan="4">MARET</th><th colspan="5">APRIL</th><th colspan="4">MEI</th><th colspan="4">JUNI</th>
      `}
    </tr>
    <tr>
      <th>1</th><th>2</th><th>3</th><th>4</th>
      <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
      <th>1</th><th>2</th><th>3</th><th>4</th>
      <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
      <th>1</th><th>2</th><th>3</th><th>4</th>
      <th>1</th><th>2</th><th>3</th><th>4</th>
    </tr>
  </thead>
  <tbody>
    </tbody>
</table>

Jangan berikan penjelasan apapun di luar kode HTML. Langsung mulai dengan <h3>Pendahuluan</h3> atau langsung tabelnya.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      let cleanResult = data?.result || "";
      if (!cleanResult) throw new Error("AI gagal menyusun jadwal.");

      // Membersihkan wrapper markdown jika AI masih bandel membungkusnya
      cleanResult = cleanResult.replace(/```html\n?/gi, '').replace(/```/g, '').trim();

      setResult(cleanResult);

      // Simpan ke Rekap Dokumen Dashboard
      const newDoc = {
        id: Date.now().toString(),
        type: "Promes", 
        title: `${formData.jenis} - ${formData.mapel}`,
        date: new Date().toISOString(),
        sekolah: "-", 
        mapel: formData.mapel || "-",
        fase: formData.kelas || "-",
        guru: "-", 
        content: cleanResult,
        formData: formData 
      };

      const existingDocs = JSON.parse(localStorage.getItem("all_teacher_docs") || "[]");
      localStorage.setItem("all_teacher_docs", JSON.stringify([newDoc, ...existingDocs]));

    } catch (err: any) {
      alert("Gagal membuat dokumen: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* FORM GENERATE */}
      <div className="bg-emerald-50/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100 p-6 md:p-8 mb-10 print:hidden transition-all">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-emerald-800 tracking-tight">Generator Prota & Promes Pro</h2>
          <p className="text-emerald-600/80 text-sm mt-2 font-medium">Render HTML Native: Anti rusak, otomatis blok warna jadwal, & rincian materi ultra-detail.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Mata Pelajaran</label>
              <input type="text" name="mapel" onChange={handleInputChange} placeholder="Contoh: Matematika" className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Fase / Kelas</label>
              <input type="text" name="kelas" onChange={handleInputChange} placeholder="Contoh: Fase C / V" className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Tahun Ajaran</label>
              <input type="text" name="tahunAjaran" value={formData.tahunAjaran} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium" required />
            </div>
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Jenis Dokumen</label>
              <select name="jenis" value={formData.jenis} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold text-slate-700 cursor-pointer">
                <option value="Program Tahunan (Prota)">Prota (1 Tahun)</option>
                <option value="Program Semester Ganjil (Promes)">Promes - Ganjil</option>
                <option value="Program Semester Genap (Promes)">Promes - Genap</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Garis Besar Materi</label>
              <textarea name="topik" onChange={handleInputChange} rows={5} placeholder="Contoh:&#10;1. Bilangan Bulat dan Pecahan&#10;2. KPK dan FPB&#10;3. Sifat Bangun Datar" className="w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm" required />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-teal-600 ml-1 flex items-center gap-1.5">
                Instruksi Khusus AI (Opsional)
              </label>
              <textarea name="catatan" onChange={handleInputChange} rows={5} placeholder="Contoh: Pastikan ada PTS di bulan September minggu ke-3." className="w-full mt-1.5 px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm placeholder:text-teal-400/70" />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3">
            {isLoading ? (
               <span className="flex items-center gap-3">
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
                 <span className="font-mono text-sm tracking-wide text-emerald-100">{loadingText}</span>
               </span>
            ) : "Buat Dokumen Sekarang"}
          </button>
        </form>
      </div>

      {/* HASIL RENDER */}
      {result && !isLoading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6 print:hidden">
               <button onClick={handleExportWord} className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                 Export Word
               </button>
               <button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all">
                 Cetak PDF
               </button>
          </div>
          
          {/* AREA DOKUMEN CETAK */}
          <div className="bg-slate-200/50 p-4 sm:p-8 rounded-3xl print:p-0 print:bg-transparent overflow-x-auto">
            <div id="area-cetak-promes" className="bg-white shadow-xl mx-auto p-[15mm] sm:p-[20mm] min-h-[297mm] min-w-[1200px] print:min-w-0 print:w-full text-black">
              
              {/* KOP DOKUMEN */}
              <div className="text-center mb-8 border-b-2 border-black pb-4">
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest leading-tight">
                  {formData.jenis.toUpperCase()}
                </h2>
                <div className="mt-4 flex flex-col justify-center text-sm font-bold text-left mx-auto max-w-xl">
                  <div className="grid grid-cols-[200px_10px_1fr] gap-2">
                    <p>MATA PELAJARAN</p><p>:</p><p>{formData.mapel}</p>
                    <p>KELAS / SMSTR</p><p>:</p><p>{formData.kelas}</p>
                    <p>TAHUN PELAJARAN</p><p>:</p><p>{formData.tahunAjaran}</p>
                  </div>
                </div>
              </div>

              {/* MENGGUNAKAN dangerouslySetInnerHTML AGAR HTML TIDAK RUSAK SAMA SEKALI */}
              <div 
                className="
                  w-full text-black font-sans
                  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-6 [&_h3]:hidden
                  [&_p]:mb-4 [&_p]:text-sm
                  [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-black [&_table]:text-[10px] md:[&_table]:text-xs
                  [&_th]:border [&_th]:border-black [&_th]:bg-[#d9e8b4] [&_th]:px-1 [&_th]:py-2 [&_th]:text-center [&_th]:font-bold [&_th]:align-middle
                  [&_td]:border [&_td]:border-black [&_td]:px-2 [&_td]:py-2 [&_td]:text-center [&_td]:align-top
                  [&_td[style*='text-align: left']]:text-left
                  [&_td[style*='text-align:left']]:text-left
                "
                dangerouslySetInnerHTML={{ __html: result }}
              />
              
              <div className="mt-16 text-sm">
                  <table className="w-full border-none !border-0 [&_td]:!border-0 [&_td]:!p-0">
                    <tbody>
                      <tr>
                        <td className="w-1/2 text-center align-top border-none">
                          <p className="mb-24">Mengetahui,<br/>Kepala Sekolah</p>
                          <p className="font-bold underline mb-0">_________________________</p>
                          <p className="mt-1">NIP. .....................................</p>
                        </td>
                        <td className="w-1/2 text-center align-top border-none">
                          <p className="mb-24">..........., ..................... 20...<br/>Guru Mata Pelajaran</p>
                          <p className="font-bold underline mb-0">_________________________</p>
                          <p className="mt-1">NIP. .....................................</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}