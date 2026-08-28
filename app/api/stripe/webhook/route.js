import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Supabase કનેક્શન
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
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // જ્યારે પેમેન્ટ સક્સેસ થાય
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Supabase ડેટાબેઝમાં યુઝરને Pro પ્લાન આપી દો
    const { error } = await supabase.from("users").upsert(
      {
        email: customerEmail,
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        plan: "pro",
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Supabase error:", error);
    } else {
      console.log(`🎉 Success! Pro plan activated for: ${customerEmail}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}