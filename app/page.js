"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  // Stripe Price IDs (Fallback safe mapping)
  const STRIPE_PRICES = {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
    agency: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY || "",
  };

  // Stripe Checkout Handler
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleCheckout = async (priceId, planKey) => {
    if (!priceId) {
      alert("Price ID missing! Please check your environment variables.");
      return;
    }

    if (!isSignedIn) {
      alert("Please sign in to subscribe to a plan.");
      return;
    }

    setCheckoutLoading(planKey);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initiate checkout session.");
      }
    } catch (err) {
      alert("Something went wrong during checkout.");
      console.error(err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  // 1. Live Generator State
  const [reviewText, setReviewText] = useState("The food was absolutely delicious and the service was top-notch! Will definitely visit again.");
  const [businessType, setBusinessType] = useState("Cafe & Restaurant");
  const [tone, setTone] = useState("Friendly & Warm");
  const [includeContact, setIncludeContact] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 2. Interactive ROI Calculator State
  const [monthlyReviews, setMonthlyReviews] = useState(150);

  // 3. Interactive Feature Showcase State
  const [activeFeature, setActiveFeature] = useState(0);

  // 4. Live Demo Star Preset State
  const [demoStar, setDemoStar] = useState(5);

  const handleGenerate = async () => {
    if (!reviewText) return alert("Please enter a customer review!");
    setLoading(true);
    setResponse("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText, businessType, tone, includeContact, contactInfo }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch (err) {
      alert("Error generating response.");
    } finally {
      setLoading(false);
    }
  };

  const setPresetReview = (star) => {
    setDemoStar(star);
    if (star === 5) {
      setReviewText("The food was absolutely delicious and the service was top-notch! Will definitely visit again.");
      setTone("Friendly & Warm");
    } else if (star === 4) {
      setReviewText("Great ambiance and good taste overall. The dessert took a bit extra time to arrive, but staff was polite.");
      setTone("Friendly & Warm");
    } else if (star === 3) {
      setReviewText("Average experience. Food quality was okay, but tables could have been cleaner.");
      setTone("Professional & Formal");
    } else if (star === 2) {
      setReviewText("Portions were quite small for the price charged. Not very satisfied with the overall experience.");
      setTone("Apologetic & Solution-Focused");
    } else if (star === 1) {
      setReviewText("Extremely disappointed. Food took 45 minutes to arrive and was served cold. Service was rude.");
      setTone("Apologetic & Solution-Focused");
    }
  };

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic ROI Calculations
  const hoursSaved = Math.round((monthlyReviews * 6) / 60);
  const moneySaved = hoursSaved * 25;

  // Feature Data
  const featureTabs = [
    {
      id: "autopilot",
      title: "🤖 24/7 Autopilot Engine",
      subtitle: "Instant hands-free responses",
      desc: "Connect Google Business Profile, Yelp or Trustpilot. AI detects incoming reviews in real-time and responds in under 3 seconds with brand-aligned context.",
      preview: "⚡ System Action: Responded to 5-star Google review in 1.4s"
    },
    {
      id: "sentiment",
      title: "🛡️ Smart Sentiment & Crisis Control",
      subtitle: "Turn 1-star complaints into loyal fans",
      desc: "Negative reviews are flagged immediately. AI drafts polite apologies, provides private resolution contacts, and pings your management via WhatsApp instantly.",
      preview: "🚨 Priority Flag: 1-Star Review detected. Manager notified via WhatsApp."
    },
    {
      id: "multilang",
      title: "🌐 Native Multi-Language Suite",
      subtitle: "Fluid support across 50+ languages",
      desc: "Whether your client writes in French, Spanish, German, Japanese, or Gujarati, ReviewPulse AI replies natively with cultural and tonal precision.",
      preview: "💬 Detected Language: Spanish ➔ Generated Native Spanish Reply"
    },
    {
      id: "qraction",
      title: "📲 On-Site QR Review Collector",
      subtitle: "Boost 5-star rating volume by 3x",
      desc: "Generate printable smart QR tent cards for tables and receipts. Customers scan and directly open your 5-star Google review portal.",
      preview: "📲 QR Scan Triggered: Customer landed on Google Review page"
    }
  ];

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Promo Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white text-xs py-2 px-4 text-center font-medium border-b border-white/10 flex items-center justify-center gap-2">
        <span className="bg-white/15 text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/20">
          PROMO
        </span>
        <span>Claim 7 Days Free Trial • Unlimited AI Generation Enabled</span>
        <a href="#pricing" className="underline font-bold ml-1 hover:text-blue-200">View Plans →</a>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/60 bg-[#070a11]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-base font-bold shadow-lg shadow-blue-500/25">
              ⚡
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">
              ReviewPulse<span className="text-blue-500">.AI</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-slate-400 font-mono">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#demo" className="hover:text-blue-400 transition">Live Demo</a>
            <a href="#roi" className="hover:text-blue-400 transition">Calculator</a>
            <a href="#pricing" className="hover:text-blue-400 transition">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-xs font-mono text-slate-300 hover:text-white px-3 py-2 transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md shadow-blue-600/30 border border-blue-400/30 font-mono">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            ) : (
              <>
                <a
                  href="#demo"
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold px-4 py-2 rounded-lg transition border border-blue-500/30 font-mono"
                >
                  Test Live AI ⚡
                </a>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-20 pb-20 text-center overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full mb-8 shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono tracking-wide text-slate-300">V3.0 Engine Connected • Ultra-Fast Inference</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-white leading-[1.08] tracking-tight">
          Automate Brand Reviews with <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Context-Aware AI Precision
          </span>
        </h2>

        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-10 font-normal leading-relaxed">
          Instantly respond to Google, Trustpilot & Yelp reviews. Protect brand sentiment, boost search rankings, and save 40+ manual labor hours each month.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
          <a
            href="#demo"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-blue-600/25 border border-blue-400/20 font-mono"
          >
            Run Live AI Test ⚡
          </a>
          <a
            href="#pricing"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm px-7 py-3.5 rounded-xl transition"
          >
            View Pricing Plans
          </a>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-800/60">
        <div className="text-center mb-14">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md inline-block mb-3">
            System Core Features
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold">Built for High-Growth Reputation Management</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            {featureTabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(idx)}
                className={`w-full text-left p-5 rounded-xl border transition-all ${
                  activeFeature === idx
                    ? "bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10"
                    : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="font-semibold text-base text-slate-100">{tab.title}</div>
                <div className="text-xs text-slate-400 mt-1">{tab.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                Feature Overview
              </span>
              <h4 className="text-xl font-bold text-white mt-4 mb-2">{featureTabs[activeFeature].title}</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{featureTabs[activeFeature].desc}</p>
            </div>
            <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 font-mono text-xs text-blue-300">
              {featureTabs[activeFeature].preview}
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800/60">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md inline-block mb-3">
            Interactive Live Preview Studio
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold">Try The AI Engine Live</h3>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Select Preset Star Rating:</span>
            <div className="flex flex-wrap gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setPresetReview(star)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
                    demoStar === star
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {star} ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Business Industry</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none"
              >
                <option>☕ Cafe & Restaurant</option>
                <option>🛒 E-Commerce & Retail</option>
                <option>🩺 Healthcare & Clinics</option>
                <option>🏨 Hotel & Hospitality</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Tone Strategy</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none"
              >
                <option>🤝 Friendly & Warm</option>
                <option>👔 Professional & Formal</option>
                <option>🙏 Apologetic & Solution-Focused</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Review Content</label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-slate-200 text-sm focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg transition text-sm font-mono disabled:opacity-50"
          >
            {loading ? "Generating Output..." : "Generate AI Response ⚡"}
          </button>

          {response && (
            <div className="mt-6 p-5 bg-slate-950 border border-blue-500/40 rounded-xl relative shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono text-blue-400 uppercase">AI Output</span>
                <button
                  onClick={copyToClipboard}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1 rounded border border-slate-700 transition"
                >
                  {copied ? "Copied! ✓" : "Copy Response"}
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{response}</p>
            </div>
          )}
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi" className="max-w-5xl mx-auto px-4 py-20 border-t border-slate-800/60">
        <div className="text-center mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md inline-block mb-3">
            ROI Estimator
          </span>
          <h3 className="text-3xl font-bold">Calculate Your Saved Labor & Cost</h3>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <label className="block text-xs font-mono uppercase text-slate-400 mb-3">
              Monthly Reviews Volume: <span className="text-blue-400 font-bold text-base">{monthlyReviews}</span>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={monthlyReviews}
              onChange={(e) => setMonthlyReviews(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-3">
              *Calculated based on standard 6 minutes required per manual customer response.
            </p>
          </div>

          <div className="md:col-span-5 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-4">
            <div>
              <div className="text-xs font-mono uppercase text-slate-400">Hours Saved / Month</div>
              <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{hoursSaved} hrs</div>
            </div>
            <div className="border-t border-slate-800 pt-3">
              <div className="text-xs font-mono uppercase text-slate-400">Estimated Monthly Savings</div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">${moneySaved}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-800/60">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Simple Pricing Plans</h3>
          <p className="text-slate-400 text-xs mb-4">7-day free trial on all subscriptions. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Starter</span>
              <h4 className="text-xl font-bold mt-1">Single Location</h4>
              <div className="my-5 font-mono">
                <span className="text-4xl font-extrabold">$29</span>
                <span className="text-slate-400 text-xs">/mo</span>
              </div>

              <ul className="text-xs text-slate-300 space-y-3 mb-8 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">✓ 1 Business Location</li>
                <li className="flex items-center gap-2">✓ Up to 200 AI Responses/mo</li>
                <li className="flex items-center gap-2">✓ Google & Yelp Integration</li>
                <li className="flex items-center gap-2">✓ Standard Support</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(STRIPE_PRICES.starter, "starter")}
              disabled={checkoutLoading === "starter"}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition font-mono disabled:opacity-50"
            >
              {checkoutLoading === "starter" ? "Loading..." : "Start Free Trial"}
            </button>
          </div>

          {/* Pro */}
          <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl p-7 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono text-blue-400">Professional</span>
              <h4 className="text-xl font-bold mt-1">Growth Business</h4>
              <div className="my-5 font-mono">
                <span className="text-4xl font-extrabold">$79</span>
                <span className="text-slate-400 text-xs">/mo</span>
              </div>

              <ul className="text-xs text-slate-200 space-y-3 mb-8 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">✓ Up to 5 Business Locations</li>
                <li className="flex items-center gap-2">✓ Unlimited AI Responses</li>
                <li className="flex items-center gap-2">✓ All Platforms (Google, Yelp, Trustpilot)</li>
                <li className="flex items-center gap-2">✓ Smart Sentiment & Crisis Alerts</li>
                <li className="flex items-center gap-2">✓ Priority Email & Chat Support</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(STRIPE_PRICES.pro, "pro")}
              disabled={checkoutLoading === "pro"}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs transition font-mono disabled:opacity-50"
            >
              {checkoutLoading === "pro" ? "Loading..." : "Start Free Trial"}
            </button>
          </div>

          {/* Agency */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Enterprise</span>
              <h4 className="text-xl font-bold mt-1">Agency Partner</h4>
              <div className="my-5 font-mono">
                <span className="text-4xl font-extrabold">$199</span>
                <span className="text-slate-400 text-xs">/mo</span>
              </div>

              <ul className="text-xs text-slate-300 space-y-3 mb-8 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">✓ Unlimited Business Locations</li>
                <li className="flex items-center gap-2">✓ Unlimited AI Responses</li>
                <li className="flex items-center gap-2">✓ Custom Branding & White-labeling</li>
                <li className="flex items-center gap-2">✓ Dedicated Account Manager</li>
                <li className="flex items-center gap-2">✓ 24/7 VIP Support & API Access</li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout(STRIPE_PRICES.agency, "agency")}
              disabled={checkoutLoading === "agency"}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition font-mono disabled:opacity-50"
            >
              {checkoutLoading === "agency" ? "Loading..." : "Contact Sales"}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500 font-mono bg-[#070a11]">
        <p>© 2026 ReviewPulse AI • Context-Aware Business Reputation Engine</p>
      </footer>
    </div>
  );
}