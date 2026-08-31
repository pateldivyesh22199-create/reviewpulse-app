"use client";

import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.location.href='/'} className="flex items-center gap-2 text-blue-500 font-bold mb-10 hover:text-blue-400 transition">
          <ArrowLeft size={18} /> Back to Home
        </button>
        
        <h1 className="text-4xl font-black text-white mb-4">Terms & Refund Policy</h1>
        <p className="text-sm text-slate-500 mb-10 uppercase tracking-widest">Last Updated: August 2026</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Subscription Plans</h2>
            <p>ReviewPulse AI operates on a subscription basis. By subscribing, you authorize us to charge your payment method monthly. You may cancel at any time via your dashboard.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. No-Refund Policy</h2>
            <p className="bg-blue-600/10 border-l-4 border-blue-500 p-4 text-white">
              All sales are final. Since our AI tool provides immediate value through credits and instant generation, we do not offer refunds once a payment is processed. You are encouraged to use our 7-day free trial before committing to a paid plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Responsible AI Use</h2>
            <p>Users are responsible for the final content posted to public platforms. While our AI is 99% accurate, we recommend reviewing responses for high-stakes customer interactions.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Plan Upgrades</h2>
            <p>Upgrades are processed instantly, and any remaining credit from your current plan will be prorated by Stripe.</p>
          </section>
        </div>
      </div>
    </div>
  );
}