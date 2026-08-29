import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reviewText, rating, reviewerName } = body;

    // ૧. ડેટા બરાબર છે કે નહીં તેનો કડક ચેક
    if (!reviewText || String(reviewText).trim() === "" || rating === undefined || rating === null) {
      return NextResponse.json({ error: "Review text and rating are required." }, { status: 400 });
    }

    // ૨. Check User Credits & Plan Limits
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({ user_id: userId, email: "user@example.com", credits_used: 0 })
        .select()
        .single();
      user = newUser;
    }

    const currentCredits = user?.credits_used || 0;
    const creditLimit = user?.plan === "pro" || user?.plan === "agency" ? 999999 : 200;

    if (currentCredits >= creditLimit) {
      return NextResponse.json(
        { error: "Credit limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // ૩. Fetch Business Context
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const businessName = business?.name || "Our Business";
    const category = business?.category || "General Service";
    const description = business?.description || "";
    const phone = business?.phone || "";
    const aiTone = business?.ai_tone || "Professional & Formal";
    const customInstructions = business?.custom_instructions || "";

    // ૪. Build AI Prompt
    const prompt = `
You are an expert customer service representative for "${businessName}" (Category: ${category}).
Business Details: ${description}
Support Phone: ${phone}

Your task is to write a helpful, personalized response to a customer review.

Review Details:
- Customer Name: ${reviewerName || "Valued Customer"}
- Rating: ${rating} out of 5 Stars
- Customer Review: "${reviewText}"

Tone & Persona Instructions:
- Adopt a tone that is: ${aiTone}.
- Custom Instructions: ${customInstructions}
- If the review is negative (1-3 stars), offer sincere assistance and suggest contacting us at ${phone || "our support desk"}.
- If positive (4-5 stars), express gratitude warmly.
- Keep the reply concise, professional, and human-like (under 120 words). Do not use placeholders.
`;

    // ૫. Generate Response using Gemini AI (Correct Model Name Fixed)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // ૬. Update Credits in Supabase
    const updatedCredits = currentCredits + 1;
    await supabase
      .from("users")
      .update({ credits_used: updatedCredits })
      .eq("user_id", userId);

    // ૭. Save Review History in Supabase
    if (business) {
      await supabase.from("reviews").insert({
        business_id: business.id,
        user_id: userId,
        reviewer_name: reviewerName || "Anonymous",
        rating: Number(rating),
        review_text: reviewText,
        ai_response_text: aiResponseText,
      });
    }

    return NextResponse.json({
      success: true,
      aiResponse: aiResponseText,
      creditsUsed: updatedCredits,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate reply." }, { status: 500 });
  }
}