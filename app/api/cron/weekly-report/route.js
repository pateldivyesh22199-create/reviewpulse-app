import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  try {
    // આ API દરેક યુઝર માટે રિપોર્ટ તૈયાર કરશે
    const { data: businesses } = await supabase.from("businesses").select("*");

    for (const biz of businesses) {
      if (!biz.owner_email) continue;

      // ૧. આ બિઝનેસના છેલ્લા ૭ દિવસના રિવ્યુ ગણવા
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count } = await supabase
        .from("reviews")
        .select('*', { count: 'exact', head: true })
        .eq("business_id", biz.id)
        .gte("created_at", oneWeekAgo.toISOString());

      const timeSaved = Math.round((count * 6) / 60); // કલાકમાં

      // ૨. ઇમેઇલ મોકલવો (Resend દ્વારા)
      if (count > 0) {
        await resend.emails.send({
          from: 'ReviewPulse Insights <onboarding@resend.dev>',
          to: biz.owner_email,
          subject: `📊 Weekly Reputation Report: ${biz.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px;">
              <h1 style="color: #2563eb; font-size: 24px;">Your Weekly Impact Report</h1>
              <p style="color: #64748b;">Hi Manager, here is how ReviewPulse AI managed your brand last week.</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 15px; text-align: center;">
                  <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold;">Reviews Managed</span>
                  <h2 style="margin: 5px 0; color: #1e293b;">${count}</h2>
                </div>
                <div style="background: #f8fafc; padding: 20px; border-radius: 15px; text-align: center;">
                  <span style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold;">Manual Time Saved</span>
                  <h2 style="margin: 5px 0; color: #1e293b;">${timeSaved} Hours</h2>
                </div>
              </div>

              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Your AI Agent is actively protecting <strong>${biz.name}</strong>. Most interactions were analyzed as positive, boosting your local SEO footprint.
              </p>

              <a href="https://reviewpulse-ai-app.vercel.app/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 25px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 20px;">Open Dashboard</a>
              
              <hr style="margin: 40px 0; border: 0; border-top: 1px solid #f1f5f9;" />
              <p style="font-size: 10px; color: #94a3b8; text-align: center;">© 2026 ReviewPulse AI • Whitby, Canada</p>
            </div>
          `
        });
      }
    }

    return NextResponse.json({ success: true, message: "Reports dispatched." });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}