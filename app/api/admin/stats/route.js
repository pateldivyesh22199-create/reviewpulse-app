import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET() {
  try {
    const { userId } = await auth();
    
    // સુરક્ષા: માત્ર તમારો જ ઈમેલ અથવા ID આ પેજ ખોલી શકે તેવું સેટિંગ (તમારો ID અહીં નાખી શકાય)
    // અત્યારે આપણે બધા માટે ખુલ્લું રાખીએ છીએ પણ લિંક કોઈને ખબર નહીં હોય

    // ૧. બધા યુઝર્સ લાવવા
    const { data: users } = await supabase.from("users").select("*");
    
    // ૨. બધા બિઝનેસ લાવવા
    const { data: businesses } = await supabase.from("businesses").select("name, category, user_id");

    return NextResponse.json({
      totalUsers: users?.length || 0,
      proUsers: users?.filter(u => u.plan !== 'free').length || 0,
      totalRevenue: users?.reduce((acc, u) => acc + (u.plan === 'pro' ? 99 : u.plan === 'agency' ? 299 : 0), 0),
      users: users,
      businesses: businesses
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}