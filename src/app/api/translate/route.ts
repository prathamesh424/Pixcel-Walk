import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const data = await req.json();
    const text: string = data.text;
    const targetLanguage: string = data.targetLanguage;

   // console.log("Text:", text, "Target Language:", targetLanguage);

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required." },
        { status: 400 }
      );
    }

    // Properly formatted prompt to get only the translated text
    const prompt = `Translate this text into ${targetLanguage} and return only the translated text without any explanations:
    "${text}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let translatedText = response.text().trim(); // Clean and trim output

    if (!translatedText) {
      return NextResponse.json(
        { error: "Failed to generate the translation." },
        { status: 500 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the translation." },
      { status: 500 }
    );
  }
}
