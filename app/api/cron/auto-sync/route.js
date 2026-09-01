import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  try {
    // ૧. બધા બિઝનેસનું લિસ્ટ લાવો
    const { data: businesses } = await supabase.from("businesses").select("*");

    for (const biz of businesses) {
      if (!biz.google_link) continue;

      // ૨. ગૂગલમાંથી નવા રિવ્યુ ખેંચવા (Serper API)
      const serperRes = await fetch("https://google.serper.dev/maps", {
        method: "POST",
        headers: { "X-API-KEY": process.env.SERPER_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ q: biz.google_link })
      });
      const serperData = await serperRes.json();
      const reviews = serperData.places?.[0]?.reviews || [];

      for (const rev of reviews) {
        // ૩. ચેક કરો કે આ રિવ્યુ જૂનો છે કે નવો
        const { data: existing } = await supabase.from("reviews").select("id").eq("review_text", rev.text).maybeSingle();
        if (existing) continue;

        // ૪. જો નવો હોય તો AI પાસે જવાબ લખાવો
        const prompt = `Write a professional reply for ${biz.name}: "${rev.text}" (${rev.rating} stars). Tone: ${biz.ai_tone}.`;
        const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: "qwen/qwen3.8-27b" })
        });
        const aiData = await aiRes.json();
        const reply = aiData.choices[0].message.content;

        // ૫. ડેટાબેઝમાં સેવ કરો
        await supabase.from("reviews").insert({
          user_id: biz.user_id, business_id: biz.id, reviewer_name: rev.user,
          rating: rev.rating, review_text: rev.text, ai_response_text: reply,
          sentiment: rev.rating >= 4 ? 'positive' : 'negative'
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}