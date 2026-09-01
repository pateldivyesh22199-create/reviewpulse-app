import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const payload = await req.json();
    const { data } = payload;

    // જ્યારે Clerk માં નવો યુઝર બને
    if (payload.type === "user.created") {
      const { id, email_addresses } = data;
      const email = email_addresses[0].email_address;

      // ડેટાબેઝમાં એન્ટ્રી કરવી
      await supabase.from("users").upsert({
        user_id: id,
        email: email,
        plan: "free",
        credits_used: 0,
        max_locations: 1
      }, { onConflict: "user_id" });

      console.log("New User Synced to Database:", email);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}