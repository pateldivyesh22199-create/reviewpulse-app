import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { businessId, rating, feedback } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const { data: biz } = await supabase.from("businesses").select("*").eq("id", businessId).single();
    if (!biz) throw new Error("Business not found");

    const prompt = `You are the Guest Relations AI for "${biz.name}". A customer gave a ${rating}-star private feedback: "${feedback}". Sincerely acknowledge the issue and use this exact closing: "Your experience is of utmost importance to us. I have forwarded this message directly to our General Manager. Please provide your contact details if you would like us to reach out and resolve this personally."`;

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], model: "qwen/qwen3.8-27b" })
    });

    const data = await aiRes.json();
    const aiResponseText = data.choices[0].message.content;

    await supabase.from("reviews").insert({
      business_id: businessId, user_id: biz.user_id, reviewer_name: "Private Guest", rating, review_text: feedback, ai_response_text: aiResponseText
    });

    if (rating <= 3 && biz.owner_email && biz.email_alerts !== false) {
      await resend.emails.send({
        from: 'ReviewPulse Alerts <onboarding@resend.dev>',
        to: biz.owner_email,
        subject: `🚨 Crisis Alert: ${rating}-Star Review for ${biz.name}`,
        html: `<h3>Negative Feedback Received</h3><p><strong>Feedback:</strong> ${feedback}</p><p>A sophisticated AI response has been sent. Please follow up personally.</p>`
      });
    }

    return NextResponse.json({ response: aiResponseText });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}