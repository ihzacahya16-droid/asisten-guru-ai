import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topik, tujuan, metode, kelas, durasi, kondisi } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest", 
      generationConfig: { temperature: 1, maxOutputTokens: 65536 },
    });

    const finalPrompt = `
      Anda adalah Instruktur Nasional Kurikulum Merdeka, seorang Pakar Pedagogik tingkat dewa, dan konsultan pendidikan yang sangat kreatif.
      Tugas Anda adalah merancang "Skenario Pembelajaran" yang inovatif, praktis, dan berpusat pada siswa (student-centered).

      INFORMASI KELAS:
      - Topik/Materi: ${topik}
      - Fase / Kelas: ${kelas}
      - Tujuan Pembelajaran: ${tujuan}
      - Model/Metode Pembelajaran: ${metode}
      - Alokasi Waktu: ${durasi} Menit
      - Catatan Kondisi Kelas/Siswa: ${kondisi}

      INSTRUKSI OUTPUT (WAJIB DIIKUTI):
      Buat output berupa dokumen terstruktur menggunakan HTML MURNI yang valid.
      Gunakan tag HTML semantik (<h3>, <h4>, <ul>, <ol>, <li>, <p>, <strong>, <em>).
      DILARANG KERAS menggunakan Markdown (seperti \`\`\`html atau **tebal**).
      
      Struktur HTML wajib terdiri dari:
      1. <h3>🌟 Analisis Singkat</h3>
         (Jelaskan 1-2 paragraf mengapa metode ${metode} ini sangat brilian dan cocok untuk topik dan kondisi kelas tersebut).
      2. <h3>🛠️ Persiapan Guru (Ammunition)</h3>
         (Gunakan <ul>. Sebutkan alat/bahan/skenario spesifik yang harus disiapkan guru sebelum masuk kelas).
      3. <h3>🚀 Skenario Pembelajaran (${durasi} Menit)</h3>
         (Gunakan tag <table> HTML yang rapi dengan kolom: "Tahapan", "Kegiatan Guru & Siswa", dan "Waktu". Tahapan wajib dibagi menjadi: Pendahuluan, Kegiatan Inti yang menyesuaikan sintaks metode ${metode}, dan Penutup). Berikan styling inline sederhana pada <th> (misal: background-color: #e0e7ff; padding: 10px; border: 1px solid #cbd5e1; text-align: left;).
      4. <h3>🎯 Asesmen Formatif</h3>
         (Satu paragraf tentang bagaimana guru mengecek pemahaman siswa di tengah atau akhir kelas tanpa ujian tulis formal).
      5. <h3>💡 Tips Ekstra (Plan B)</h3>
         (Berikan 2 tips praktis jika skenario macet atau waktu kurang).

      Jangan berikan teks pembuka atau penutup, berikan langsung kode HTML-nya.
    `;

    const result = await model.generateContent(finalPrompt);
    const text = await result.response.text();

    return NextResponse.json({ result: text });
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}