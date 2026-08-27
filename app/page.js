"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  // Stripe Checkout Handler (Pure JavaScript - No TS Types)
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handleCheckout = async (priceId) => {
    if (!priceId) {
      alert("Price ID configuration error!");
      return;
    }

    if (!isSignedIn) {
      alert("Please sign in to subscribe to a plan.");
      return;
    }

    setCheckoutLoading(priceId);

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
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Header Promo */}
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
            <a href="#demo" className="hover:text-blue-400 transition">Live Demo</a>
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
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-white leading-[1.08] tracking-tight">
          Automate Brand Reviews with <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Context-Aware AI Precision
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg mb-10 font-normal leading-relaxed">
          Instantly respond to Google, Trustpilot & Yelp reviews. Protect brand sentiment and boost rankings.
        </p>
      </section>

      {/* Live Demo Studio */}
      <section id="demo" className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800/60">
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
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg transition text-sm font-mono"
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
            </div>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER)}
              disabled={checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition"
            >
              {checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ? "Loading..." : "Start Free Trial"}
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
            </div>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO)}
              disabled={checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs transition"
            >
              {checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ? "Loading..." : "Start Free Trial"}
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
            </div>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY)}
              disabled={checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-xs transition"
            >
              {checkoutLoading === process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY ? "Loading..." : "Contact Sales"}
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