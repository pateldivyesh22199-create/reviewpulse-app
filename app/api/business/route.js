import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ૧. યુઝરના તમામ બિઝનેસ લોકેશન મેળવવા
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // યુઝરના પ્લાન અને ક્રેડિટ્સની વિગત લાવો
    const { data: userData } = await supabase.from("users").select("*").eq("user_id", userId).single();

    // યુઝરના બધા જ બિઝનેસ લાવો
    const { data: bizData, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      businesses: bizData || [],
      plan: userData?.plan || "free",
      credits_used: userData?.credits_used || 0,
      max_locations: userData?.max_locations || 1
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ૨. નવો બિઝનેસ ઉમેરવો અથવા જૂનો સુધારવો
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, name, category, description, phone, tone, customInstructions, google_link, owner_email, email_alerts, whatsapp_alerts } = body;

    // જો નવો બિઝનેસ (id વગરનો) ઉમેરતા હોય, તો લિમિટ ચેક કરવી
    if (!id) {
      const { data: user } = await supabase.from("users").select("max_locations").eq("user_id", userId).single();
      const { count } = await supabase.from("businesses").select('*', { count: 'exact', head: true }).eq("user_id", userId);

      if (count >= (user?.max_locations || 1)) {
        return NextResponse.json({ error: "Location limit reached. Please upgrade your plan." }, { status: 403 });
      }
    }

    // ડેટા સેવ કરવો (જો ID હોય તો Update, ના હોય તો Insert)
    const { data, error } = await supabase
      .from("businesses")
      .upsert({
        id: id || undefined, // જો ID હોય તો એ જ રો અપડેટ થશે
        user_id: userId,
        name, category, description, phone,
        ai_tone: tone,
        custom_instructions: customInstructions,
        google_link,
        owner_email,
        email_alerts,
        whatsapp_alerts,
        updated_at: new Date(),
      })
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}