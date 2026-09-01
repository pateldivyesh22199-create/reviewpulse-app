import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();
    const { businessId, googleLink } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!googleLink) return NextResponse.json({ error: "No Link" });

    // ૧. ગૂગલમાંથી રિવ્યુ ખેંચવા (Serper API)
    const serperRes = await fetch("https://google.serper.dev/maps", {
      method: "POST",
      headers: { "X-API-KEY": process.env.SERPER_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ q: googleLink })
    });
    const serperData = await serperRes.json();
    const reviews = serperData.places?.[0]?.reviews || [];

    // ૨. આ બધા રિવ્યુ માટે એકસાથે જવાબ લખાવવા
    for (const rev of reviews) {
      const prompt = `Write a short professional response for this review: "${rev.text}" (${rev.rating} stars). Name the business as owner.`;
      
      const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: "qwen/qwen3.8-27b",
        })
      });
      const aiData = await aiRes.json();
      const reply = aiData.choices[0].message.content;

      // ૩. ડેટાબેઝમાં સેવ કરવું
      await supabase.from("reviews").insert({
        user_id: userId,
        business_id: businessId,
        reviewer_name: rev.user || "Google User",
        rating: rev.rating,
        review_text: rev.text,
        ai_response_text: reply,
        sentiment: rev.rating >= 4 ? 'positive' : 'negative'
      });
    }

    return NextResponse.json({ success: true, count: reviews.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}