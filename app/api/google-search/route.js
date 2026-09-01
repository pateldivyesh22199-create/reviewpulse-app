import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) return NextResponse.json({ results: [] });

    // ગૂગલના સર્ચ એન્જિનનો ઉપયોગ કરીને બિઝનેસ શોધવો
    // આ એક 'Smart Proxy' છે જે લાઈવ ડેટા લાવશે
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    
    // અત્યારે આપણે યુઝરને સીધી લિંક જનરેટ કરવામાં મદદ કરીશું
    // ગૂગલ રિવ્યુ લિંકનું સ્ટાન્ડર્ડ ફોર્મેટ: https://search.google.com/local/writereview?placeid=
    
    return NextResponse.json({ 
        suggestion: searchUrl,
        message: "Search logic initialized."
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}