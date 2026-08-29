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
    // 1. Safe Auth Check (Demo mode support if not logged in)
    const { userId } = await auth();

    const body = await req.json();
    const { reviewText, rating = 5, reviewerName, businessType, tone } = body;

    // 2. Strict Input Validation
    if (!reviewText || String(reviewText).trim() === "") {
      return NextResponse.json(
        { error: "Review text is required." },
        { status: 400 }
      );
    }

    let user = null;
    let currentCredits = 0;

    // 3. User Credits Check (Only if user is logged in)
    if (userId) {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();

      user = userData;

      if (!user) {
        const { data: newUser } = await supabase
          .from("users")
          .insert({ user_id: userId, email: "user@example.com", credits_used: 0 })
          .select()
          .single();
        user = newUser;
      }

      currentCredits = user?.credits_used || 0;
      const creditLimit = user?.plan === "pro" || user?.plan === "agency" ? 999999 : 200;

      if (currentCredits >= creditLimit) {
        return NextResponse.json(
          { error: "Credit limit reached. Please upgrade your plan." },
          { status: 403 }
        );
      }
    }

    // 4. Business Context Fetching
    let business = null;
    if (userId) {
      const { data: bData } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      business = bData;
    }

    const businessName = business?.name || "Our Business";
    const category = business?.category || businessType || "General Service";
    const description = business?.description || "";
    const phone = business?.phone || "";
    const aiTone = business?.ai_tone || tone || "Professional & Formal";
    const customInstructions = business?.custom_instructions || "";

    // 5. Build AI Prompt
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

    // 6. Gemini AI Call
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    // 7. Update Credits & History (Only for Logged-In Users)
    let updatedCredits = currentCredits;
    if (userId) {
      updatedCredits = currentCredits + 1;
      await supabase
        .from("users")
        .update({ credits_used: updatedCredits })
        .eq("user_id", userId);

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
    }

    return NextResponse.json({
      success: true,
      aiResponse: aiResponseText,
      creditsUsed: updatedCredits,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate reply." },
      { status: 500 }
    );
  }
}