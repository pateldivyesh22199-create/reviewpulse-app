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

    if (!reviewText || !rating) {
      return NextResponse.json({ error: "Review text and rating are required." }, { status: 400 });
    }

    // 1. Check User Credits & Plan Limits
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({ user_id: userId, email: "user@example.com" })
        .select()
        .single();
      user = newUser;
    }

    const creditLimit = user.plan === "pro" || user.plan === "agency" ? 999999 : 200;
    if (user.credits_used >= creditLimit) {
      return NextResponse.json(
        { error: "Credit limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // 2. Fetch Business Context
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .single();

    const businessName = business?.name || "Our Business";
    const category = business?.category || "General Service";
    const description = business?.description || "";
    const phone = business?.phone || "";
    const aiTone = business?.ai_tone || "Professional & Formal";
    const customInstructions = business?.custom_instructions || "";

    // 3. Build AI Prompt
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

    // 4. Generate Response using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // 5. Update Credits in Supabase
    await supabase
      .from("users")
      .update({ credits_used: user.credits_used + 1 })
      .eq("user_id", userId);

    // 6. Save Review History in Supabase
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
      creditsUsed: user.credits_used + 1,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate reply." }, { status: 500 });
  }
}