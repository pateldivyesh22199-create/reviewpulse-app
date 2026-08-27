'use client';

import { useState } from 'react';

export default function Home() {
  const [reviewText, setReviewText] = useState('');
  const [businessType, setBusinessType] = useState('Cafe & Restaurant');
  const [tone, setTone] = useState('Friendly & Warm');
  const [includeContact, setIncludeContact] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!reviewText.trim()) return;
    setLoading(true);
    setResponse('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText,
          businessType,
          tone,
          includeContact,
          contactInfo,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse('Error: ' + (data.error || 'Failed to generate reply'));
      }
    } catch (err) {
      setResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans space-y-16">
      
      {/* 1. Generator Section */}
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-blue-400">ReviewPulse AI</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Global Business Suite — Instant AI Response & Reputation Autopilot
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-xl space-y-6 border border-slate-700">
          
          {/* Business Category & Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Business Category
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Cafe & Restaurant">☕ Cafe & Restaurant</option>
                <option value="E-Commerce & Retail">🛒 E-Commerce & Retail</option>
                <option value="Healthcare & Clinics">🩺 Healthcare & Clinics</option>
                <option value="Hotel & Hospitality">🏨 Hotel & Hospitality</option>
                <option value="Digital Agency & B2B Services">🏢 Digital Agency & B2B Services</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                Response Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Friendly & Warm">🤝 Friendly & Warm</option>
                <option value="Professional & Formal">👔 Professional & Formal</option>
                <option value="Apologetic & Solution-Focused">🙏 Apologetic & Solution-Focused</option>
                <option value="Short & Direct">⚡ Short & Direct</option>
              </select>
            </div>
          </div>

          {/* Review Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">
              Customer Review
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste customer review here..."
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Contact Checkbox */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeContact}
                onChange={(e) => setIncludeContact(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-sm text-slate-300">Include Support Contact in Response</span>
            </label>

            {includeContact && (
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g., support@yourbrand.com or +1 800-123-4567"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !reviewText.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Generating AI Response...' : 'Generate Response'}
          </button>
        </div>

        {/* Output Box */}
        {response && (
          <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-blue-400">Generated AI Response</h2>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded text-slate-200 border border-slate-600 transition"
              >
                {copied ? '✓ Copied!' : '📋 1-Click Copy'}
              </button>
            </div>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {response}
            </p>
          </div>
        )}

      </div>

      {/* 2. Global Pricing & Autopilot Plans Section */}
      <div className="max-w-6xl mx-auto space-y-10 pt-10 border-t border-slate-800">
        
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100">
            Automate Your Customer Reviews
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            Choose a plan to enable 24/7 Autopilot Response, Google Business Sync, and Negative Review Alerts.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-6 hover:border-slate-600 transition">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Small Business</span>
              <h3 className="text-2xl font-bold">Starter Autopilot</h3>
              <div className="text-4xl font-extrabold">$29<span className="text-base font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center">✓ <strong>50 Auto-Replies</strong> / month</li>
                <li className="flex items-center">✓ 1 Google Business Profile</li>
                <li className="flex items-center">✓ Full Auto-Pilot Mode</li>
                <li className="flex items-center">✓ 5 Industry Tone Presets</li>
                <li className="flex items-center">✓ Email Support</li>
              </ul>
            </div>
            <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">
              Get Started
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-slate-800 p-8 rounded-2xl border-2 border-blue-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Growing Brands</span>
              <h3 className="text-2xl font-bold">Pro Autopilot</h3>
              <div className="text-4xl font-extrabold">$79<span className="text-base font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center">✓ <strong>500 Auto-Replies</strong> / month</li>
                <li className="flex items-center">✓ Up to 3 Integrations (Google/Amazon)</li>
                <li className="flex items-center">✓ Auto-Pilot & Approval Modes</li>
                <li className="flex items-center">✓ Instant <strong>WhatsApp / SMS Alerts</strong> for 1-Star</li>
                <li className="flex items-center">✓ Printable QR Code Generator</li>
              </ul>
            </div>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition">
              Start Free Trial
            </button>
          </div>

          {/* Agency Plan */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-6 hover:border-slate-600 transition">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Agencies & Chain</span>
              <h3 className="text-2xl font-bold">Agency White-Label</h3>
              <div className="text-4xl font-extrabold">$199<span className="text-base font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center">✓ <strong>Unlimited Auto-Replies</strong></li>
                <li className="flex items-center">✓ Up to 20 Client Workspaces</li>
                <li className="flex items-center">✓ Full White-Label Branding</li>
                <li className="flex items-center">✓ Custom API Access</li>
                <li className="flex items-center">✓ 24/7 Priority Support</li>
              </ul>
            </div>
            <button className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">
              Contact Sales
            </button>
          </div>

        </div>
      </div>

    </main>
  );
}