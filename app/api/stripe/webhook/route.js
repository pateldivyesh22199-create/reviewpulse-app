import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ૧. જ્યારે પેમેન્ટ સફળતાપૂર્વક પૂરું થાય
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // ૨. Stripe માંથી Price ID મેળવવી
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    let userPlan = "starter"; // Default

    // ૩. Price ID મુજબ સાચો પ્લાન નક્કી કરવો (તમારા .env મુજબ)
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) {
      userPlan = "pro";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY) {
      userPlan = "agency";
    }

    // ૪. ડેટાબેઝમાં યુઝરને અપગ્રેડ કરવો
    const { error } = await supabase
      .from("users")
      .update({
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        plan: userPlan,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("email", customerEmail);

    if (error) {
      console.error("Supabase update error:", error);
    } else {
      console.log(`🚀 Plan Upgraded: ${userPlan} for ${customerEmail}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}