import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { reviewText, businessType, tone, includeContact, contactInfo } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    let prompt = `Write a professional review response for a ${businessType || "business"}.\n\nReview: "${reviewText}"\n\nTone: ${tone || "Professional"}\n`;

    if (includeContact && contactInfo) {
      prompt += `Include this contact info in the response: ${contactInfo}\n`;
    }

    prompt += "\nGenerate only the response text.";

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
