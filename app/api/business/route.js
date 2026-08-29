import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get Business Details
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Save or Update Business Details
export async function POST(req) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Ensure User exists in 'users' table (Foreign Key Requirement)
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "no-email@example.com";
    await supabase.from("users").upsert({
      user_id: userId,
      email: userEmail,
      updated_at: new Date(),
    }, { onConflict: "user_id" });

    // 2. Insert or Update Business Data
    const body = await req.json();
    const { name, category, description, phone, tone, customInstructions } = body;

    const { data, error } = await supabase
      .from("businesses")
      .upsert({
        user_id: userId,
        name: name || "My Business",
        category,
        description,
        phone,
        ai_tone: tone, // SQL Column match
        custom_instructions: customInstructions,
        updated_at: new Date(),
      }, { onConflict: "user_id" })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}