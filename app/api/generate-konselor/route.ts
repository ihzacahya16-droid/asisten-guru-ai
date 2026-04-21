import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kasus } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest", 
      generationConfig: { temperature: 1, maxOutputTokens: 65536 },
    });

    const finalPrompt = `
      Anda adalah seorang Pakar Multidisiplin Sekolah yang menjabat sebagai Konselor Pendidikan, Psikolog Anak, dan Penasihat Kesehatan Sekolah (UKS).
      Tugas Anda adalah memberikan panduan komprehensif kepada guru yang menghadapi siswa dengan masalah:
      1. KESEHATAN FISIK (Gejala sakit, lemas, cedera, atau keluhan fisik).
      2. PSIKOLOGIS (Masalah emosional, perilaku, atau kesehatan mental).
      3. AKADEMIS (Kesulitan belajar, motivasi, atau arah karir).

      KASUS YANG DIHADAPI GURU:
      "${kasus}"

      INSTRUKSI OUTPUT (WAJIB DIIKUTI):
      Buat output menggunakan HTML MURNI yang valid. Gunakan tag semantik (<h3>, <ul>, <li>, <p>, <strong>, <em>). 
      DILARANG KERAS menggunakan Markdown.
      
      Struktur HTML WAJIB terdiri dari:
      1. <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px; color: #991b1b; font-size: 0.9rem;">
         <strong>⚠️ DISCLAIMER KRITIS:</strong> Analisis ini adalah panduan pendukung berbasis AI untuk guru. Informasi ini <strong>BUKAN</strong> diagnosis medis/psikologis resmi. Jika ada tanda bahaya (sesak napas, hilang kesadaran, kejang, atau ancaman menyakiti diri sendiri), <strong>SEGERA</strong> hubungi ambulans, dokter, atau rumah sakit terdekat.
         </div>

      2. <h3>🔍 Analisis Diagnostik Awal</h3>
         (Bedah kasus dari 3 sudut pandang: Fisik/Medis, Psikologis, dan Dampak Pendidikan. Jelaskan akar masalah yang mungkin terjadi).

      3. <h3>🚨 Tindakan Pertama & P3K (First Response)</h3>
         (Berikan langkah konkret: Apa yang harus dilakukan guru detik ini juga? Misal: penanganan di UKS, cara bicara empat mata, atau pemberian bantuan pertama jika sakit fisik).

      4. <h3>🚩 Tanda Bahaya (Kapan Harus Dirujuk?)</h3>
         (Berikan daftar gejala atau situasi di mana guru WAJIB berhenti menangani sendiri dan harus segera memanggil profesional/medis).

      5. <h3>💡 Strategi Pendampingan Lanjutan</h3>
         (Saran jangka panjang untuk guru dalam membimbing siswa tersebut di kelas agar tetap nyaman belajar).

      6. <h3>🚫 Pantangan (Do Not Do)</h3>
         (Sebutkan hal-hal yang dapat memperburuk kondisi fisik atau mental siswa).

      7. <h3>📚 Referensi & Dasar Teori</h3>
         (Cantumkan referensi kredibel seperti Panduan P3K, teori psikologi (CBT/Erikson), atau literatur pendidikan yang relevan).

      Jangan berikan basa-basi, langsung berikan kode HTML-nya.
    `;

    const result = await model.generateContent(finalPrompt);
    const text = await result.response.text();

    return NextResponse.json({ result: text });
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}