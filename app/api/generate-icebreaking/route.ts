import { NextResponse } from 'next/server';

// ⚠️ WAJIB DITAMBAHKAN: Memberi izin Vercel untuk berpikir hingga 60 detik agar tidak Timeout
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    // 1. Menerima 'prompt' dari komponen IceBreaking.tsx
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt tidak boleh kosong" }, { status: 400 });
    }

    // 2. Mengambil API Key dari Vercel Environment Variables
    // Pastikan Anda sudah memasukkan GEMINI_API_KEY di setting Vercel Anda
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key belum dipasang di Vercel" }, 
        { status: 500 }
      );
    }

    // 3. Menghubungi Google Gemini AI (menggunakan model gemini-1.5-flash yang cepat)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    // Jika AI membalas dengan error
    if (!response.ok) {
      throw new Error(data.error?.message || "Gagal menghubungi server AI");
    }

    // 4. Mengambil teks hasil racikan AI
    const resultText = data.candidates[0].content.parts[0].text;

    // 5. Mengirimkannya kembali ke frontend (IceBreaking.tsx)
    return NextResponse.json({ result: resultText });

  } catch (error: any) {
    console.error("API Route Error:", error);
    // Jika terjadi error, kirim pesan error agar tidak merusak JSON frontend
    return NextResponse.json(
      { result: `Maaf, terjadi kesalahan: ${error.message}` }, 
      { status: 500 }
    );
  }
}