import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest", 
      generationConfig: { temperature: 1, maxOutputTokens: 65536 },
    });

    const finalPrompt = `
      ${prompt}
      
      CATATAN TAMBAHAN UNTUK AI:
      - Berikan rincian Kompetensi Dasar / TP secara mendalam dan rapi.
      - WAJIB gunakan warna blok kuning (#fef08a) pada sel minggu yang terisi JP. Contoh penulisan wajib: <td style="background-color: #fef08a; font-weight: bold;">4</td>
      - Pastikan output 100% HTML murni yang valid. DILARANG KERAS membungkus dengan markdown (seperti \`\`\`html atau menggunakan **).
      - Jangan berikan basa-basi, langsung berikan kode tabel HTML-nya.
    `;

    const result = await model.generateContent(finalPrompt);
    const text = await result.response.text();

    return NextResponse.json({ result: text });
    
  } catch (error: any) {
    console.error("Gemini Error Terjadi:", error);
    return NextResponse.json(
      { error: error.message || "Gagal menghubungi Gemini API" },
      { status: 500 }
    );
  }
}