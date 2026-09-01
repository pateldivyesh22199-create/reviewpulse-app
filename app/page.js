"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { 
  Zap, Clock, ShieldCheck, Star, ArrowRight, BarChart3, 
  Globe, Smartphone, ShieldAlert, Sparkles, Lock, Check, Copy 
} from "lucide-react";

export default function Home() {
  const { isSignedIn } = useUser();

  const STRIPE_PRICES = {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
    agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY || "",
  };

  // --- States ---
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [monthlyReviews, setMonthlyReviews] = useState(150);
  const [activeFeature, setActiveFeature] = useState(0);
  const [demoReview, setDemoReview] = useState("");
  const [demoRating, setDemoRating] = useState(5);
  const [demoResponse, setDemoResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoCount, setDemoCount] = useState(0);

  // ROI Logic
  const hoursSaved = Math.round((monthlyReviews * 6) / 60);
  const moneySaved = hoursSaved * 25;

  // Features Data (No WhatsApp)
  const featureTabs = [
    {
      id: "autopilot",
      title: "🤖 24/7 Autopilot Engine",
      desc: "Connect Google Business. AI detects new reviews and responds automatically in seconds with brand-aligned context.",
      icon: <Zap size={20} />
    },
    {
      id: "sentiment",
      title: "🛡️ Sentiment & Crisis Control",
      desc: "Negative reviews are flagged instantly. AI drafts polite apologies and alerts management via professional email.",
      icon: <ShieldAlert size={20} />
    },
    {
      id: "multilang",
      title: "🌐 Native Multi-Language",
      desc: "Supports 50+ languages. Whether your client writes in French, Spanish, or Gujarati, AI replies natively.",
      icon: <Globe size={20} />
    },
    {
      id: "qraction",
      title: "📲 NFC & QR Review Collector",
      desc: "Boost 5-star volume by 3x. Use Smart QR cards or NFC 'Tap-to-Review' tags directly at your customer tables.",
      icon: <Smartphone size={20} />
    }
  ];

  const handleDemoGenerate = async () => {
    if (demoCount >= 3 && !isSignedIn) { alert("Free preview limit reached! Please sign up."); return; }
    if (!demoReview) return alert("Please enter a review content!");
    setIsGenerating(true);
    setDemoResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText: demoReview, rating: demoRating, tone: "Friendly & Warm" }),
      });
      const data = await res.json();
      setDemoResponse(data.response || "Something went wrong.");
      setDemoCount(prev => prev + 1);
    } catch (err) {
      alert("Error generating response.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckout = async (priceId, planKey) => {
    if (!isSignedIn) { alert("Please sign in to start trial."); return; }
    setCheckoutLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Checkout failed.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased scroll-smooth">
      
      <div className="bg-blue-600 text-white text-[11px] py-2 px-4 text-center font-bold tracking-widest uppercase border-b border-white/10">
        🚀 Special Launch Offer: Get 7 Days Free Trial on All Plans
      </div>

      <header className="border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">⚡</div>
            <h1 className="text-xl font-bold tracking-tighter">ReviewPulse<span className="text-blue-500">.AI</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#demo" className="hover:text-blue-400 transition">Live Demo</a>
            <a href="#roi" className="hover:text-blue-400 transition">Calculator</a>
            <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-lg shadow-blue-600/20">Get Started Free</button>
              </SignUpButton>
            ) : (
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-xs font-bold text-blue-400">Dashboard →</a>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
          Automate Google Reviews <br /> With <span className="text-blue-600">AI Precision.</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
          Enterprise-grade reputation engine. Protect brand sentiment, boost rankings, and save 40+ manual labor hours each month.
        </p>
        <div className="flex justify-center gap-6">
          <a href="#demo" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-full shadow-2xl transition-all flex items-center gap-2">Try Free Demo <Zap size={18} /></a>
        </div>
      </section>

      {/* 1. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Core Technology</span>
          <h3 className="text-3xl md:text-5xl font-black mt-2">Built for Local SEO Growth</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {featureTabs.map((tab, idx) => (
              <div key={tab.id} onMouseEnter={() => setActiveFeature(idx)} className={`p-6 rounded-2xl border transition cursor-default ${activeFeature === idx ? "bg-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/5" : "bg-transparent border-slate-800"}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={activeFeature === idx ? "text-blue-400" : "text-slate-500"}>{tab.icon}</div>
                  <h4 className="font-bold text-white text-base">{tab.title}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{tab.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 h-full flex flex-col justify-center shadow-2xl relative overflow-hidden">
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-blue-400 mb-8">
               ⚡ System: AI auto-detected new review & drafted response
             </div>
             <h4 className="text-2xl font-bold mb-4 text-white">{featureTabs[activeFeature].title}</h4>
             <p className="text-slate-400 leading-relaxed">{featureTabs[activeFeature].desc}</p>
          </div>
        </div>
      </section>

      {/* 2. LIVE DEMO SECTION */}
      <section id="demo" className="max-w-5xl mx-auto px-4 py-24 border-t border-slate-800/60">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-3xl">
          <div className="text-center mb-12">
             <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">Instant Preview</span>
             <h3 className="text-3xl font-bold mt-4">Experience the Magic in Real-Time</h3>
             <p className="text-xs text-slate-500 mt-2">Free Trial Uses: {demoCount}/3</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">1. Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setDemoRating(s)} className={`flex-1 py-3 rounded-xl border transition flex flex-col items-center gap-1 ${demoRating === s ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                      <Star size={14} className={demoRating >= s ? "fill-amber-400 text-amber-400" : "text-slate-600"} />
                      <span className="text-[10px] font-bold">{s}★</span>
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={demoReview} onChange={(e) => setDemoReview(e.target.value)} placeholder="Paste a customer review here..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition h-32 resize-none" />
              {demoCount < 3 || isSignedIn ? (
                <button onClick={handleDemoGenerate} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  {isGenerating ? "AI is writing..." : "Generate Free Reply"}
                </button>
              ) : (
                <SignUpButton mode="modal"><button className="w-full bg-white text-black font-bold py-4 rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2"><Lock size={16}/> Create Account to Continue</button></SignUpButton>
              )}
            </div>
            <div className="flex flex-col h-full min-h-[250px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">AI Response Result</label>
              <div className="flex-1 bg-black/40 border border-slate-800 rounded-2xl p-6 relative">
                {demoResponse ? (
                  <div className="flex flex-col h-full justify-between">
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{demoResponse}"</p>
                    {!isSignedIn && <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between"><p className="text-[10px] text-slate-500 flex items-center gap-2"><Lock size={12}/> Sign up to copy</p><SignUpButton mode="modal"><button className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Get Full Access</button></SignUpButton></div>}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20"><Zap size={40} /><p className="text-[10px] font-bold uppercase mt-4">Waiting for Input</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROI CALCULATOR SECTION */}
      <section id="roi" className="max-w-5xl mx-auto px-4 py-24 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3"><BarChart3 className="text-blue-500" size={32} /> Labor Savings Calculator</h3>
          <p className="text-slate-400">Estimate how much manual labor ReviewPulse eliminates annually.</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Monthly Review Volume: <span className="text-blue-400 text-2xl font-black ml-2">{monthlyReviews}</span></label>
            <input type="range" min="10" max="1000" step="10" value={monthlyReviews} onChange={(e) => setMonthlyReviews(Number(e.target.value))} className="w-full accent-blue-600 h-2 bg-slate-800 rounded-lg appearance-none" />
            <div className="mt-10 space-y-4">
               <div className="flex justify-between text-sm text-slate-400 border-b border-slate-800/50 pb-2"><span>Time per Manual Response</span><span className="font-bold text-white">6 Mins</span></div>
               <div className="flex justify-between text-sm text-slate-400 border-b border-slate-800/50 pb-2"><span>Avg. Staff Labor Cost</span><span className="font-bold text-white">$25/hr</span></div>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] text-center shadow-inner">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Hours Saved / Year</p>
               <p className="text-5xl font-black text-blue-500">{hoursSaved * 12} hrs</p>
            </div>
            <div className="bg-emerald-600 p-8 rounded-[2rem] text-center shadow-xl">
               <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-2">Annual Money Saved</p>
               <p className="text-5xl font-black text-white">${moneySaved * 12}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION (NEW PRICES - NO WHATSAPP) */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-800/60 text-center">
        <h3 className="text-3xl md:text-6xl font-black mb-6">Simple, Transparent Plans</h3>
        <p className="text-slate-400 mb-16 text-lg">Claim your <span className="text-white font-bold">7-day free trial</span>. Zero setup fees.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-between text-left hover:border-slate-700 transition">
            <div>
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Starter</h4>
              <div className="my-8"><span className="text-5xl font-black">$49</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-300 space-y-4 border-t border-slate-800 pt-8 mb-8">
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> 1 Business Location</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> 150 AI Replies / mo</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Smart QR Collector</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Email Crisis Alerts</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.starter, "starter")} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-[10px]">{checkoutLoading === 'starter' ? '...' : 'Start 7-Day Free Trial'}</button>
          </div>
          {/* Pro */}
          <div className="bg-slate-900 border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl scale-105 z-10 text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Recommended</div>
            <div>
              <h4 className="font-bold text-blue-400 uppercase text-[10px] tracking-widest">Professional</h4>
              <div className="my-8"><span className="text-5xl font-black">$99</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-100 space-y-4 border-t border-slate-800 pt-8 mb-8 font-medium">
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> 5 Business Locations</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> Full Autopilot Mode</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> Unlimited AI Replies</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> Bulk History Cleanup</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.pro, "pro")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl uppercase tracking-widest text-[10px]">{checkoutLoading === 'pro' ? '...' : 'Get Full Access Free'}</button>
          </div>
          {/* Agency */}
          <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex flex-col justify-between text-left hover:border-slate-700 transition">
            <div>
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Agency</h4>
              <div className="my-8"><span className="text-5xl font-black">$299</span><span className="text-slate-500 text-sm ml-2">/mo</span></div>
              <ul className="text-sm text-slate-300 space-y-4 border-t border-slate-800 pt-8 mb-8">
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Unlimited Locations</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Custom Brand Logos</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> NFC Tap-to-Review System</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Dedicated Account Manager</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.agency, "agency")} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-[10px]">Contact Sales</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-16 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <p>© 2026 ReviewPulse AI • <a href="/privacy" className="hover:text-blue-500">Privacy Policy</a> • <a href="/terms" className="hover:text-blue-500">Terms of Service</a></p>
        <p className="mt-4 text-slate-700 normal-case italic">No-Refund Policy. All subscriptions are final to cover immediate AI costs.</p>
      </footer>
    </div>
  );
}