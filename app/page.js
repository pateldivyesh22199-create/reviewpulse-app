"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

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
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic ROI Calculations
  const hoursSaved = Math.round((monthlyReviews * 6) / 60);
  const moneySaved = hoursSaved * 25;

  // Interactive Tab Feature Showcase Data
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
      
      {/* 1. Sleek Announcement Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white text-xs py-2 px-4 text-center font-medium border-b border-white/10 flex items-center justify-center gap-2">
        <span className="bg-white/15 text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/20">
          PROMO
        </span>
        <span>Claim 7 Days Free Trial • Unlimited AI Generation Enabled</span>
        <a href="#pricing" className="underline font-bold ml-1 hover:text-blue-200">View Plans →</a>
      </div>

      {/* 2. Glassmorphism Navigation with Clerk Auth Integrations */}
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
            <a href="#faq" className="hover:text-blue-400 transition">FAQ</a>
          </nav>

          {/* Clerk Auth Integration Buttons */}
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

      {/* 3. Dark Mode Hero Section */}
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

        {/* Live Counter & Trust Glass Module */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,420,000+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Reviews Automated</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">99.9%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Uptime Guaranteed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 3 Secs</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Response Speed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">4.9 / 5</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Client Rating</p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Live Preview Studio */}
      <section id="demo" className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800/60">
        <div className="text-center mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md inline-block mb-3">
            Interactive Live Preview Studio
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold">Try The AI Engine Live</h3>
          <p className="text-slate-400 text-sm mt-1">Select rating presets or test custom scenarios in real-time</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* Interactive Star Rating Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Select Preset Star Rating:</span>
            <div className="flex flex-wrap gap-1.5">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setPresetReview(star)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition ${
                    demoStar === star
                      ? star === 5 || star === 4
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold"
                        : star === 3
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400 font-bold"
                        : "bg-red-500/20 border-red-500/50 text-red-400 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {star} ★ {star === 5 ? "(Praise)" : star === 1 ? "(Complaint)" : ""}
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
              >
                <option>☕ Cafe & Restaurant</option>
                <option>🛒 E-Commerce & Retail</option>
                <option>🩺 Healthcare & Clinics</option>
                <option>🏨 Hotel & Hospitality</option>
                <option>🏢 B2B Services & Agency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Tone Strategy</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition"
              >
                <option>🤝 Friendly & Warm</option>
                <option>👔 Professional & Formal</option>
                <option>🙏 Apologetic & Solution-Focused</option>
                <option>⚡ Concise & Direct</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Review Content</label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste customer review here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition placeholder-slate-600"
            />
          </div>

          <div className="mb-6 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includeContact}
                onChange={(e) => setIncludeContact(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              Include Private Support Info (Recommended for 1-Star)
            </label>
            {includeContact && (
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. support@brand.com or +1 (800) 123-4567"
                className="mt-2.5 w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg transition shadow-lg shadow-blue-600/30 disabled:opacity-50 text-sm flex items-center justify-center gap-2 font-mono"
          >
            {loading ? "Generating Output..." : "Generate AI Response ⚡"}
          </button>

          {response && (
            <div className="mt-6 p-5 bg-slate-950 border border-blue-500/40 rounded-xl relative shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                  AI Generated Output
                </span>
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

      {/* 5. Interactive Tabbed Features Showcase */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-800/60">
        <div className="text-center mb-12">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded inline-block mb-3">
            Interactive Showcase
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Core Product Capabilities</h3>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Click tabs below to explore our enterprise-grade features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-2.5">
            {featureTabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeature(idx)}
                className={`w-full text-left p-4.5 rounded-xl transition-all border ${
                  activeFeature === idx
                    ? "bg-slate-900 border-blue-500/60 shadow-md shadow-blue-500/10"
                    : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/40"
                }`}
              >
                <h4 className="text-sm font-bold text-white mb-0.5">{tab.title}</h4>
                <p className="text-xs text-slate-400">{tab.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl min-h-[280px] flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 mb-2 block">
                Feature Deep Dive
              </span>
              <h4 className="text-xl font-bold mb-3">{featureTabs[activeFeature].title}</h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {featureTabs[activeFeature].desc}
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Live Engine Monitor</span>
              <p className="text-xs font-mono text-emerald-400">{featureTabs[activeFeature].preview}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Live Calculator (ROI / Time Saved) */}
      <section id="roi" className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800/60">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded inline-block mb-3">
            Financial Impact Calculator
          </span>
          <h3 className="text-2xl font-bold mb-2">Estimate Your Monthly ROI</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto mb-8">
            Adjust your monthly review volume to calculate automated time & money savings
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400">Monthly Review Volume:</span>
              <span className="text-blue-400 font-bold">{monthlyReviews} Reviews</span>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={monthlyReviews}
              onChange={(e) => setMonthlyReviews(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>20</span>
              <span>500</span>
              <span>1000+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
              <p className="text-[10px] uppercase font-mono text-slate-400 mb-1">Time Saved / Month</p>
              <p className="text-3xl font-extrabold text-blue-400 font-mono">{hoursSaved} Hours</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
              <p className="text-[10px] uppercase font-mono text-slate-400 mb-1">Estimated Cost Savings</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono">${moneySaved} / mo</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing & Seamless Global Payments Integration */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-800/60">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Simple Pricing Plans</h3>
          <p className="text-slate-400 text-xs mb-4">7-day free trial on all subscriptions. Cancel anytime.</p>
          
          {/* Seamless Global Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full w-fit mx-auto">
            <span>Accepted Payments:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">Stripe</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">PayPal</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">Apple Pay</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white border border-slate-700">UPI / PhonePe</span>
          </div>
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
              <ul className="space-y-3 text-xs text-slate-300 mb-6 font-medium">
                <li>✓ 7 Days Free Trial</li>
                <li>✓ 50 AI Replies / mo</li>
                <li>✓ 1 Location Workspace</li>
                <li>✓ Standard Email Support</li>
              </ul>
            </div>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition">
              Start Free Trial
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
              <ul className="space-y-3 text-xs text-slate-300 mb-6 font-medium">
                <li>✓ 7 Days Free Trial</li>
                <li>✓ 500 AI Replies / mo</li>
                <li>✓ Google & Yelp Integrations</li>
                <li>✓ Instant WhatsApp Alerts</li>
              </ul>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-lg shadow-blue-600/30">
              Start Free Trial
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
              <ul className="space-y-3 text-xs text-slate-300 mb-6 font-medium">
                <li>✓ 7 Days Free Trial</li>
                <li>✓ Unlimited AI Replies</li>
                <li>✓ 20 Client Workspaces</li>
                <li>✓ White-label PDF Reports</li>
              </ul>
            </div>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* 8. Modern Minimal Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500 font-mono bg-[#070a11]">
        <p>© 2026 ReviewPulse AI • Context-Aware Business Reputation Engine</p>
      </footer>
    </div>
  );
}