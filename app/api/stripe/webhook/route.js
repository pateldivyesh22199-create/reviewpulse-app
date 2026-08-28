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

    // Stripe Session માંથી લાઈન આઈટમ્સ મેળવવી જેથી Price ID મળે
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    let userPlan = "starter"; // Default

    // Price ID પ્રમાણે સાચો પ્લાન નક્કી કરવો
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER) {
      userPlan = "starter";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO) {
      userPlan = "pro";
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY) {
      userPlan = "enterprise";
    }

    // ડાયનેમિક રીતે સાચો પ્લાન Supabase માં અપડેટ કરવો
    const { error } = await supabase.from("users").upsert(
      {
        email: customerEmail,
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        plan: userPlan,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Supabase error:", error);
    } else {
      console.log(`🎉 Success! ${userPlan} plan activated for: ${customerEmail}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}