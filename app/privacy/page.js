"use client";

import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => window.location.href='/'} className="flex items-center gap-2 text-blue-500 font-bold mb-10 hover:text-blue-400 transition">
          <ArrowLeft size={18} /> Back to Home
        </button>
        
        <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10 uppercase tracking-widest">Last Updated: August 2026</p>

        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Data Sovereignty</h2>
            <p>At ReviewPulse AI, we believe your business data belongs to you. We do not sell or lease your customer reviews or business information to third-party advertisers. All data is processed securely to enhance your reputation management.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. AI Data Usage</h2>
            <p>Your business profile and reviews are used solely to calibrate our AI engine for your specific brand voice. We utilize enterprise-grade encryption for all API interactions with our AI partners (Groq, Google, and OpenAI).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Security</h2>
            <p>We use Clerk for world-class authentication and Supabase for secure cloud storage. Your payment information is handled exclusively by Stripe, ensuring PCI-DSS compliance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Contact Us</h2>
            <p>If you have questions regarding your data in Canada or internationally, contact us at support@reviewpulse.ai</p>
          </section>
        </div>
      </div>
    </div>
  );
}