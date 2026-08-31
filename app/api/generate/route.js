import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { reviewText, rating, reviewerName } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // ૧. યુઝરનો પ્લાન અને ક્રેડિટ્સ ચેક કરવા
    const { data: userRecord } = await supabase
      .from("users")
      .select("credits_used, plan")
      .eq("user_id", userId)
      .single();

    const currentCredits = userRecord?.credits_used || 0;
    const userPlan = userRecord?.plan || "free";

    // લિમિટ સેટિંગ (ટેસ્ટિંગ માટે ૧૦ રિવ્યુ રાખ્યા છે, પછી આપણે વધારી શકીએ)
    const limit = (userPlan === "pro" || userPlan === "agency") ? 999999 : 10;

    if (currentCredits >= limit) {
      return NextResponse.json({ 
        error: "Credit limit reached. Please upgrade your plan for unlimited access." 
      }, { status: 403 });
    }

    // ૨. બિઝનેસ સેટિંગ્સ લેવા
    const { data: business } = await supabase.from("businesses").select("*").eq("user_id", userId).single();
    
    const prompt = `
      You are an AI assistant for "${business?.name || "Our Business"}".
      Context: ${business?.description || ""}
      Tone: ${business?.ai_tone || "Professional"}
      Customer: ${reviewerName || "Guest"} (${rating} stars)
      Review: "${reviewText}"
      Instructions: ${business?.custom_instructions || ""}
      If 1-2 stars, ask them to call ${business?.phone || "us"}.
    `;

    // ૩. AI Call
    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "qwen/qwen3.8-27b",
      })
    });

    const data = await aiRes.json();
    const aiResponseText = data.choices[0].message.content;

    // ૪. સેવ અને ક્રેડિટ અપડેટ
    await supabase.from("reviews").insert({
      user_id: userId, business_id: business?.id, reviewer_name: reviewerName || "Anonymous",
      rating, review_text: reviewText, ai_response_text: aiResponseText
    });

    await supabase.from("users").update({ credits_used: currentCredits + 1 }).eq("user_id", userId);

    return NextResponse.json({ success: true, response: aiResponseText });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}