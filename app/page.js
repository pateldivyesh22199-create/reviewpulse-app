"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { 
  Zap, Clock, ShieldCheck, Star, ArrowRight, BarChart3, 
  Globe, Smartphone, ShieldAlert, Sparkles, Lock, Check 
} from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  const STRIPE_PRICES = {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
    agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY || "",
  };

  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [monthlyReviews, setMonthlyReviews] = useState(150);
  const [demoReview, setDemoReview] = useState("");
  const [demoRating, setDemoRating] = useState(5);
  const [demoResponse, setDemoResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoCount, setDemoCount] = useState(0);

  const hoursSaved = Math.round((monthlyReviews * 6) / 60);
  const moneySaved = hoursSaved * 25;

  const handleDemoGenerate = async () => {
    if (demoCount >= 3 && !isSignedIn) { alert("Trial limit reached! Sign up for free."); return; }
    if (!demoReview) return alert("Please enter feedback.");
    setIsGenerating(true);
    setDemoResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: demoReview, rating: demoRating, tone: "Friendly" }),
      });
      const data = await res.json();
      setDemoResponse(data.response);
      setDemoCount(prev => prev + 1);
    } catch (err) { alert("Error."); } finally { setIsGenerating(false); }
  };

  const handleCheckout = async (priceId, planKey) => {
    if (!isSignedIn) { alert("Please sign in first."); return; }
    setCheckoutLoading(planKey);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setCheckoutLoading(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans scroll-smooth">
      <div className="bg-blue-600 text-white text-[10px] py-2 text-center font-black uppercase tracking-widest">🚀 7-Day Free Trial Active on All Plans</div>
      
      <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">⚡</div><h1 className="text-xl font-bold">ReviewPulse<span className="text-blue-500">.AI</span></h1></div>
          <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#features">Features</a><a href="#demo">Live Demo</a><a href="#roi">Calculator</a><a href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignUpButton mode="modal"><button className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-blue-600/20">Get Started</button></SignUpButton>
            ) : (
              <div className="flex items-center gap-4"><a href="/dashboard" className="text-xs font-bold text-blue-400">Dashboard →</a><UserButton afterSignOutUrl="/" /></div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Automate Google Reviews <br /> With <span className="text-blue-600">AI Precision.</span></h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Enterprise-grade reputation engine. Protect brand sentiment and save 40+ manual hours each month.</p>
        <a href="#demo" className="bg-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-2xl transition-all inline-block">Try Free Demo ⚡</a>
      </section>

      {/* PRICING (SURE BENEFITS) */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-24 border-t border-white/5">
        <div className="text-center mb-16"><h3 className="text-4xl font-black">Professional Plans</h3><p className="text-slate-500 mt-2">Zero setup fees. Cancel anytime.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-slate-500 text-xs font-bold uppercase mb-6">Starter</h4>
              <div className="mb-8"><span className="text-5xl font-black">$49</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-300 space-y-4 mb-10 border-t border-white/5 pt-8">
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> 1 Business Location</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> 150 AI Replies / mo</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Smart QR Collector</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Email Crisis Alerts</li>
              </ul>
            </div>
            <button onClick={()=>handleCheckout(STRIPE_PRICES.starter, 'starter')} className="w-full bg-slate-800 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">{checkoutLoading === 'starter' ? '...' : 'Start 7-Day Trial'}</button>
          </div>
          {/* Pro */}
          <div className="bg-slate-900 border-2 border-blue-600 p-8 rounded-3xl flex flex-col justify-between relative scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase">Recommended</div>
            <div>
              <h4 className="text-blue-400 text-xs font-bold uppercase mb-6">Professional</h4>
              <div className="mb-8"><span className="text-5xl font-black">$99</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-100 space-y-4 mb-10 border-t border-white/5 pt-8">
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> 5 Business Locations</li>
                <li className="flex gap-2 font-bold"><Check size={16} className="text-blue-500"/> AI Autopilot Mode</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Bulk History Cleanup</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Real-time Email Alerts</li>
              </ul>
            </div>
            <button onClick={()=>handleCheckout(STRIPE_PRICES.pro, 'pro')} className="w-full bg-blue-600 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">{checkoutLoading === 'pro' ? '...' : 'Get Full Access'}</button>
          </div>
          {/* Agency */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-slate-500 text-xs font-bold uppercase mb-6">Agency</h4>
              <div className="mb-8"><span className="text-5xl font-black">$299</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-300 space-y-4 mb-10 border-t border-white/5 pt-8">
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Unlimited Locations</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Custom Brand Logos</li>
                <li className="flex gap-2 font-bold"><Check size={16} className="text-blue-500"/> White-Label Dashboard</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Priority Support</li>
              </ul>
            </div>
            <button onClick={()=>handleCheckout(STRIPE_PRICES.agency, 'agency')} className="w-full bg-slate-800 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest">{checkoutLoading === 'agency' ? '...' : 'Contact Sales'}</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        <p>© 2026 ReviewPulse AI • <a href="/privacy">Privacy</a> • <a href="/terms">Terms</a></p>
        <p className="mt-4 italic text-slate-800">No-Refund Policy. All subscriptions are final.</p>
      </footer>
    </div>
  );
}