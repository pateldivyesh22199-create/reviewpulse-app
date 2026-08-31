import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ૧. બિઝનેસ અને યુઝરનો પ્લાન મેળવવો
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // આપણે હવે 'users' ટેબલમાંથી સાચો પ્લાન અને ક્રેડિટ્સ લાવીશું
    const { data: userData } = await supabase
      .from("users")
      .select("plan, credits_used")
      .eq("user_id", userId)
      .single();

    // બિઝનેસની વિગતો લાવવી
    const { data: bizData } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .single();

    // બંને ડેટાને ભેગા કરીને મોકલવા
    return NextResponse.json({
      ...bizData,
      plan: userData?.plan || "free",
      credits_used: userData?.credits_used || 0
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ૨. સેવ કરવાની લોજિક (જૂની હતી એમ જ રહેશે, બસ થોડી સુરક્ષિત કરી છે)
export async function POST(req) {
  try {
    const { userId } = await auth();
    const clerkUser = await currentUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, category, description, phone, tone, customInstructions, google_link, owner_email, email_alerts, whatsapp_alerts } = body;

    const { data, error } = await supabase
      .from("businesses")
      .upsert({
        user_id: userId,
        name, category, description, phone,
        ai_tone: tone,
        custom_instructions: customInstructions,
        google_link,
        owner_email,
        email_alerts,
        whatsapp_alerts,
        updated_at: new Date(),
      }, { onConflict: "user_id" })
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}