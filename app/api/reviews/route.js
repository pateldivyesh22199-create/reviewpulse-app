import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const bizId = searchParams.get("bizId"); // લિંકમાંથી આઈડી લેવું

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let query = supabase.from("reviews").select("*").eq("user_id", userId);

    // જો કોઈ ચોક્કસ બિઝનેસ પસંદ કર્યો હોય તો તેની જ હિસ્ટ્રી બતાવો
    if (bizId) {
      query = query.eq("business_id", bizId);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(20);

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}