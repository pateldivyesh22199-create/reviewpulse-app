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

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ૧. બિઝનેસની વિગતો લેવી
    const { data: business } = await supabase.from("businesses").select("*").eq("id", businessId).single();

    // ૨. AI પ્રોમ્પ્ટ - હવે આપણે Sentiment પણ માંગીશું
    const prompt = `
      You are an advanced reputation agent for "${business?.name}".
      Context: ${business?.description}
      Tone: ${business?.ai_tone}
      Review: "${reviewText}"
      Rating: ${rating} stars
      
      Task:
      1. Analyze if this review is "positive", "neutral", or "negative".
      2. Write a sophisticated response.
      3. Format your entire response as a JSON object like this:
         { "sentiment": "mood_here", "reply": "ai_reply_here" }
    `;

    // ૩. AI Call
    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "qwen/qwen3.8-27b",
        response_format: { type: "json_object" } // આનાથી AI હંમેશા JSON માં જ જવાબ આપશે
      })
    });

    const data = await aiRes.json();
    const result = JSON.parse(data.choices[0].message.content);

    // ૪. ડેટાબેઝમાં Sentiment સાથે સેવ કરવું
    await supabase.from("reviews").insert({
      user_id: userId,
      business_id: businessId,
      reviewer_name: reviewerName || "Anonymous",
      rating,
      review_text: reviewText,
      ai_response_text: result.reply,
      sentiment: result.sentiment // આ નવું છે!
    });

    // ૫. ક્રેડિટ અપડેટ
    const { data: userRec } = await supabase.from("users").select("credits_used").eq("user_id", userId).single();
    await supabase.from("users").update({ credits_used: (userRec?.credits_used || 0) + 1 }).eq("user_id", userId);

    return NextResponse.json({ success: true, response: result.reply });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}