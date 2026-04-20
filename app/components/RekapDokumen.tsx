"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Search, Eye, Trash2, Download, Printer, X } from "lucide-react";

// Definisi Tipe Dokumen Diperbarui
type DocType = "ATP" | "Modul Ajar" | "Soal" | "Promes" | "Ice Breaking" | "Variasi Mengajar" | "Konselor" | "Lainnya";

interface SavedDocument {
  id: string;
  type: DocType;
  title: string;
  date: string;
  sekolah: string;
  mapel: string;
  fase: string;
  guru: string;
  content: string; 
  formData: any;    
}

export default function RekapDokumen() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<DocType | "Semua">("Semua");
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);

  // 1. AMBIL DATA DARI LOCAL STORAGE
  useEffect(() => {
    const data = localStorage.getItem("all_teacher_docs");
    if (data) {
      setDocuments(JSON.parse(data));
    }
  }, []);

  // 2. FUNGSI HAPUS
  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini secara permanen?")) {
      const updated = documents.filter(doc => doc.id !== id);
      setDocuments(updated);
      localStorage.setItem("all_teacher_docs", JSON.stringify(updated));
      if (selectedDoc?.id === id) setSelectedDoc(null);
    }
  };

  // 3. LOGIKA FILTER & PENCARIAN
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.mapel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "Semua" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  // 4. EXPORT WORD
  const exportToWord = (doc: SavedDocument) => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body { font-family: 'Times New Roman'; } table { border-collapse: collapse; width: 100%; } th, td { border: 1pt solid black; padding: 5px; }</style></head><body>`;
    const footer = "</body></html>";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `<h1>${doc.title}</h1>` + (document.getElementById("preview-content")?.innerHTML || "");
    
    const blob = new Blob(['\ufeff', header + tempDiv.innerHTML + footer], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.title.replace(/\s+/g, '_')}.doc`;
    link.click();
  };

  // 5. WARNA BADGE BERDASARKAN TIPE
  const getTypeColor = (type: string) => {
    switch(type) {
      case "ATP": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Modul Ajar": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Soal": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Promes": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Ice Breaking": return "bg-pink-100 text-pink-700 border-pink-200";
      case "Variasi Mengajar": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Konselor": return "bg-teal-100 text-teal-700 border-teal-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full">
      {/* HEADER & STATISTIK */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rekapitulasi Dokumen</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola dan unduh semua dokumen yang telah Anda buat.</p>
        
        {/* Grid disesuaikan menjadi 4 kolom agar pas dengan tambahan menu baru */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <p className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Total Dokumen</p>
            <p className="text-3xl font-black mt-1">{documents.length}</p>
          </div>
          
          {["Modul Ajar", "Promes", "Soal", "Variasi Mengajar", "Konselor", "Ice Breaking"].map((t) => (
            <div key={t} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider truncate">{t}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">
                {documents.filter(d => d.type === t).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari judul dokumen atau mata pelajaran..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="px-5 py-3 rounded-xl border border-slate-200 shadow-sm bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="Semua">Tampilkan Semua</option>
          <option value="ATP">ATP / Silabus</option>
          <option value="Modul Ajar">Modul Ajar</option>
          <option value="Promes">Prota / Promes</option>
          <option value="Soal">Bank Soal</option>
          <option value="Ice Breaking">Ice Breaking</option>
          <option value="Variasi Mengajar">Variasi Mengajar</option>
          <option value="Konselor">Asisten Konselor</option>
        </select>
      </div>

      {/* TAMPILAN TABEL DOKUMEN */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4 whitespace-nowrap">Tipe</th>
                <th className="px-6 py-4">Judul Dokumen</th>
                <th className="px-6 py-4 whitespace-nowrap">Mata Pelajaran</th>
                <th className="px-6 py-4 whitespace-nowrap">Fase/Kelas</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal Buat</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-slate-400 font-medium text-sm">Belum ada dokumen yang ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group">
                    
                    {/* Tipe Dokumen */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-md border ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    
                    {/* Judul & Sekolah */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{doc.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.sekolah}</p>
                    </td>
                    
                    {/* Mapel */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {doc.mapel}
                      </span>
                    </td>
                    
                    {/* Fase */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-600">{doc.fase}</p>
                    </td>
                    
                    {/* Tanggal */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-500">
                        {new Date(doc.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                      </p>
                    </td>
                    
                    {/* Aksi (Lihat & Hapus) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedDoc(doc)}
                          className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors shadow-sm"
                          title="Lihat Dokumen"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-2 rounded-lg transition-colors shadow-sm"
                          title="Hapus Dokumen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PREVIEW DOKUMEN */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] print:max-h-none print:h-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col print:rounded-none print:shadow-none">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
              <div>
                <h2 className="font-black text-xl text-slate-800">{selectedDoc.title}</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Dibuat oleh: {selectedDoc.guru}</p>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="text-slate-400 hover:text-red-500 bg-white border border-slate-200 hover:bg-red-50 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - AUTO DETECT HTML ATAU MARKDOWN */}
            <div className="flex-1 overflow-y-auto p-8 bg-white print:p-0 print:overflow-visible" id="preview-content">
               <div className="prose prose-sm md:prose-base prose-slate max-w-none 
                 [&_table]:w-full [&_table]:border-collapse [&_table]:border-2 [&_table]:border-slate-800
                 [&_th]:border [&_th]:border-slate-800 [&_th]:bg-slate-100 [&_th]:p-3 [&_th]:text-center
                 [&_td]:border [&_td]:border-slate-800 [&_td]:p-3 [&_td]:align-top
                 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-center [&_h1]:mb-6
                 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:border-b-2 [&_h2]:border-slate-200 [&_h2]:pb-2
                 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6
               ">
                 {/* JIKA KONTEN MENGANDUNG HTML (seperti <table> atau <h3>), render sebagai HTML murni.
                    JIKA TIDAK, render sebagai Markdown biasa. Ini memecahkan masalah tanpa perlu rehype-raw!
                 */}
                 {selectedDoc.content.includes("<table") || selectedDoc.content.includes("<h3") || selectedDoc.content.includes("<div") ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedDoc.content }} />
                 ) : (
                    <ReactMarkdown>
                      {selectedDoc.content}
                    </ReactMarkdown>
                 )}
               </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-3 justify-end print:hidden">
                <button 
                  onClick={() => exportToWord(selectedDoc)}
                  className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 flex items-center gap-2 transition-all shadow-sm"
                >
                  <Download size={18} />
                  Download Word
                </button>
                <button 
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center gap-2 transition-all"
                >
                  <Printer size={18} />
                  Cetak PDF
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}