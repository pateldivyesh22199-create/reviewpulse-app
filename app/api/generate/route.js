import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { reviewText, rating, reviewerName, businessId } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    // ૧. ક્રેડિટ ચેક (માત્ર જો યુઝર લોગ-ઈન હોય)
    const { data: userRec } = await supabase.from("users").select("credits_used, plan").eq("user_id", userId).single();
    const plan = userRec?.plan || "free";
    const limit = (plan === "pro" || plan === "agency") ? 999999 : (plan === "starter" ? 150 : 10);

    if ((userRec?.credits_used || 0) >= limit) {
      return NextResponse.json({ error: "Limit reached. Please upgrade." }, { status: 403 });
    }

    // ૨. બિઝનેસ સેટિંગ્સ
    const { data: biz } = await supabase.from("businesses").select("*").eq("id", businessId).single();

    // ૩. AI પ્રોમ્પ્ટ
    const prompt = `You are an AI manager for ${biz?.name}. Review: "${reviewText}" (${rating} stars). Mood: Analyze sentiment. Response: Professional. Instructions: ${biz?.custom_instructions}. Format: JSON { "sentiment": "mood", "reply": "text" }`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: "qwen/qwen3.8-27b", response_format: { type: "json_object" } })
    });

    const aiData = await aiRes.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    // ૪. સેવ અને અપડેટ
    await supabase.from("reviews").insert({
      user_id: userId, business_id: businessId, reviewer_name: reviewerName || "Guest",
      rating, review_text: reviewText, ai_response_text: result.reply, sentiment: result.sentiment
    });

    await supabase.from("users").update({ credits_used: (userRec?.credits_used || 0) + 1 }).eq("user_id", userId);

    return NextResponse.json({ success: true, response: result.reply });

  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}