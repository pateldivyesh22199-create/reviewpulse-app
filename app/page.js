"use client";

import { useState, useEffect } from "react";
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
  
  // --- Demo Logic ---
  const [demoReview, setDemoReview] = useState("");
  const [demoRating, setDemoRating] = useState(5);
  const [demoResponse, setDemoResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoCount, setDemoCount] = useState(0);

  // ROI Logic
  const hoursSaved = Math.round((monthlyReviews * 6) / 60);
  const moneySaved = hoursSaved * 25;

  // Features Data
  const featureTabs = [
    {
      id: "autopilot",
      title: "🤖 24/7 Autopilot Engine",
      desc: "Connect Google Business Profile. AI detects incoming reviews in real-time and responds in under 3 seconds with brand-aligned context.",
      icon: <Zap size={20} />
    },
    {
      id: "sentiment",
      title: "🛡️ Smart Sentiment & Crisis Control",
      desc: "Negative reviews are flagged immediately. AI drafts polite apologies, provides resolution contacts, and alerts management instantly.",
      icon: <ShieldAlert size={20} />
    },
    {
      id: "multilang",
      title: "🌐 Native Multi-Language",
      desc: "Fluid support across 50+ languages. Whether your client writes in French, Spanish, or Gujarati, AI replies natively.",
      icon: <Globe size={20} />
    },
    {
      id: "qraction",
      title: "📲 On-Site QR & NFC Collector",
      desc: "Boost star volume by 3x. Use Smart QR cards or NFC 'Tap-to-Review' tags directly at your customer tables.",
      icon: <Smartphone size={20} />
    }
  ];

  const handleDemoGenerate = async () => {
    if (demoCount >= 3 && !isSignedIn) {
      alert("Free preview limit reached. Please sign up to continue!");
      return;
    }
    if (!demoReview) return alert("Please enter a review to test!");
    
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
    if (!priceId) return alert("Price ID missing.");
    if (!isSignedIn) return alert("Please sign in first.");
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
      alert("Error during checkout.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased scroll-smooth">
      
      <div className="bg-blue-600 text-white text-[11px] py-2 px-4 text-center font-bold tracking-widest uppercase border-b border-white/10">
        🚀 Special Launch Offer: Claim Your 7-Day Free Trial Now
      </div>

      <header className="border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">⚡</div>
            <h1 className="text-xl font-bold tracking-tighter">ReviewPulse<span className="text-blue-500">.AI</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
            <a href="#features" className="hover:text-blue-400">Features</a>
            <a href="#demo" className="hover:text-blue-400">Live Demo</a>
            <a href="#roi" className="hover:text-blue-400">ROI Calculator</a>
            <a href="#pricing" className="hover:text-blue-400">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-lg shadow-blue-600/20">Get Started Free</button>
              </SignUpButton>
            ) : (
              <div className="flex items-center gap-4">
                <a href="/dashboard" className="text-xs font-bold text-blue-400 underline underline-offset-4">Go to Dashboard →</a>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full mb-8">
          <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">Trusted by 500+ Businesses in Canada & USA</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
          Automate Google Reviews <br /> With <span className="text-blue-600">AI Precision.</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
          The only context-aware reputation engine that saves you 40+ manual hours every month while boosting your local SEO rankings.
        </p>
        <div className="flex justify-center gap-6">
          <a href="#demo" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-full shadow-2xl shadow-blue-600/40 transition flex items-center gap-2">Try Free Demo <Zap size={18} /></a>
        </div>
      </section>

      {/* LIVE DEMO SECTION */}
      <section id="demo" className="max-w-5xl mx-auto px-4 py-24 border-t border-slate-800/60">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-3xl">
          <div className="text-center mb-12">
             <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">Instant AI Preview</span>
             <h3 className="text-3xl font-bold mt-4">Experience the Magic in Real-Time</h3>
             {demoCount > 0 && <p className="text-xs text-slate-500 mt-2">Trial uses: {demoCount}/3</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">1. Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setDemoRating(s)} className={`flex-1 py-3 rounded-xl border transition flex flex-col items-center gap-1 ${demoRating === s ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-950 border-slate-800 text-slate-500"}`}>
                      <Star size={14} className={demoRating >= s ? "fill-amber-400 text-amber-400" : "text-slate-600"} />
                      <span className="text-[10px] font-bold">{s}★</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">2. Customer Review</label>
                <textarea value={demoReview} onChange={(e) => setDemoReview(e.target.value)} placeholder="e.g. Amazing service! Highly recommended..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 transition h-32 resize-none" />
              </div>
              
              {demoCount < 3 || isSignedIn ? (
                <button onClick={handleDemoGenerate} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  {isGenerating ? "AI is writing..." : <><Sparkles size={18} /> Generate Free Reply</>}
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="w-full bg-slate-100 text-black font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <Lock size={16} /> Unlock More Generations
                  </button>
                </SignUpButton>
              )}
            </div>

            <div className="flex flex-col h-full min-h-[280px]">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">AI Response Result</label>
              <div className="flex-1 bg-black/40 border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between">
                {demoResponse ? (
                  <>
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{demoResponse}"</p>
                    {!isSignedIn && (
                      <div className="pt-4 border-t border-slate-800 mt-6 flex items-center justify-between">
                         <p className="text-[10px] text-slate-500 flex items-center gap-2"><Lock size={12} /> Sign up to copy</p>
                         <SignUpButton mode="modal">
                           <button className="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg">Get Full Access</button>
                         </SignUpButton>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-500">
                    <Zap size={40} />
                    <p className="text-[10px] font-bold uppercase mt-4 tracking-widest">Waiting for Magic</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
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
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[10px] text-blue-400 mb-8">
               ⚡ System: AI auto-detected 1-star review & alerted manager
             </div>
             <h4 className="text-2xl font-bold mb-4">{featureTabs[activeFeature].title}</h4>
             <p className="text-slate-400 leading-relaxed">{featureTabs[activeFeature].desc}</p>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR (PREMIUM LOOK) */}
      <section id="roi" className="max-w-5xl mx-auto px-4 py-24 border-t border-slate-800/60">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
             <BarChart3 className="text-blue-500" size={32} /> Labor Savings Calculator
          </h3>
          <p className="text-slate-400">Estimate how much manual labor ReviewPulse eliminates.</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">
              Monthly Review Volume: <span className="text-blue-400 text-2xl font-black ml-2">{monthlyReviews}</span>
            </label>
            <input type="range" min="10" max="1000" step="10" value={monthlyReviews} onChange={(e) => setMonthlyReviews(Number(e.target.value))} className="w-full accent-blue-600 h-2 rounded-lg appearance-none bg-slate-800 cursor-pointer" />
            <div className="mt-10 space-y-4">
               <div className="flex justify-between text-sm text-slate-400 border-b border-slate-800/50 pb-2">
                 <span>Minutes per Manual Response</span>
                 <span className="font-bold text-white">6 Mins</span>
               </div>
               <div className="flex justify-between text-sm text-slate-400 border-b border-slate-800/50 pb-2">
                 <span>Avg. Staff Labor Cost / Hour</span>
                 <span className="font-bold text-white">$25.00</span>
               </div>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] text-center shadow-inner">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Total Hours Saved / Year</p>
               <p className="text-5xl font-black text-blue-500">{hoursSaved * 12} hrs</p>
            </div>
            <div className="bg-emerald-600 p-8 rounded-[2rem] text-center shadow-xl shadow-emerald-600/10">
               <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100 mb-2">Annual Money Saved</p>
               <p className="text-5xl font-black text-white">${moneySaved * 12}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-800/60 text-center">
        <h3 className="text-3xl md:text-6xl font-black mb-6">Simple, Transparent Plans</h3>
        <p className="text-slate-400 mb-16 text-lg">Claim your <span className="text-white font-bold">7-day free trial</span>. Zero setup fees. Cancel anytime.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="text-left">
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Starter</h4>
              <div className="my-8">
                <span className="text-5xl font-black">$49</span><span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-4 border-t border-slate-800 pt-8 mb-8">
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> 1 Business Location</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> 150 AI Replies / mo</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Smart QR Code Generator</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Standard Email Support</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.starter, "starter")} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition uppercase tracking-widest text-[10px]">{checkoutLoading === 'starter' ? 'Processing...' : 'Start 7-Day Free Trial'}</button>
          </div>
          
          {/* Pro */}
          <div className="bg-slate-900 border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between relative shadow-2xl shadow-blue-600/10 scale-105 z-10 text-left">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Most Recommended</div>
            <div>
              <h4 className="font-bold text-blue-400 uppercase text-[10px] tracking-widest">Professional</h4>
              <div className="my-8">
                <span className="text-5xl font-black">$99</span><span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>
              <ul className="text-sm text-slate-100 space-y-4 border-t border-slate-800 pt-8 mb-8 font-medium">
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> 5 Business Locations</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> Full Autopilot Mode</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> Unlimited AI Replies</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Smart Sentiment Analysis</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> SMS & WhatsApp Alerts</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.pro, "pro")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-blue-600/30 uppercase tracking-widest text-[10px]">{checkoutLoading === 'pro' ? 'Processing...' : 'Get Full Access Free'}</button>
          </div>

          {/* Agency */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition text-left">
            <div>
              <h4 className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Agency Partner</h4>
              <div className="my-8">
                <span className="text-5xl font-black">$299</span><span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-4 border-t border-slate-800 pt-8 mb-8">
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Unlimited Locations</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Custom Branding</li>
                <li className="flex items-center gap-2 font-bold text-white"><Check size={16} className="text-blue-500" /> NFC Tap-to-Review System</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Dedicated Account Manager</li>
              </ul>
            </div>
            <button onClick={() => handleCheckout(STRIPE_PRICES.agency, "agency")} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition uppercase tracking-widest text-[10px]">Contact Sales</button>
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