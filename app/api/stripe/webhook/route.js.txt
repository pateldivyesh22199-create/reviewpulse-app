import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // પેમેન્ટ સફળ થાય એટલે આ બ્લોક ચાલશે
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;

    console.log(`🎉 Success! Payment received from: ${customerEmail}`);

    // અહીં ભવિષ્યમાં ડેટાબેઝ અપડેટ અને ઓનબોર્ડિંગ મેઈલ મોકલવાનો કોડ આવશે
  }

  return NextResponse.json({ received: true }, { status: 200 });
}