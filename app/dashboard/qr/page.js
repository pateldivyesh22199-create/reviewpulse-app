"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { QrCode, Download, ExternalLink, ShieldCheck, Star, Save, Zap } from "lucide-react";

export default function QRGenerator() {
  const { user } = useUser();
  const [bizId, setBizId] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const [bizName, setBizName] = useState("");
  const [saving, setSaving] = useState(false);
  const [origin, setOrigin] = useState(""); // origin સાચવવા માટે નવું સ્ટેટ

  useEffect(() => {
    // આ લાઈનથી 'window is not defined' એરર જતી રહેશે
    setOrigin(window.location.origin);

    async function loadBiz() {
      const res = await fetch("/api/business");
      const data = await res.json();
      if (data) {
        setBizId(data.id);
        setGoogleLink(data.google_link || "");
        setBizName(data.name || "Your Business");
      }
    }
    if (user) loadBiz();
  }, [user]);

  const saveGoogleLink = async () => {
    setSaving(true);
    await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_link: googleLink }),
    });
    setSaving(false);
    alert("Linked!");
  };

  const reviewLink = bizId ? `${origin}/review/${bizId}` : "";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-black text-white">Smart Review Collector</h2>
          <p className="text-slate-500 mt-2">Promote 5-stars and filter negative feedback.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3">Google Review URL</label>
              <div className="flex gap-3">
                <input type="text" value={googleLink} onChange={(e) => setGoogleLink(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none" placeholder="Paste link here..." />
                <button onClick={saveGoogleLink} disabled={saving} className="bg-blue-600 px-6 rounded-2xl"><Save size={20} /></button>
              </div>
            </div>
            <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2.5rem] flex gap-6">
               <ShieldCheck className="text-blue-500" size={32} />
               <p className="text-sm text-slate-400">Crisis Shield™ is Active. High ratings go to Google, low ratings stay private.</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] flex flex-col items-center">
            <div className="bg-white p-6 rounded-[2rem]">
               {bizId ? (
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reviewLink)}`} alt="QR" className="w-48 h-48" />
               ) : (
                 <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs text-center">Loading Engine...</div>
               )}
            </div>
            <p className="mt-6 text-sm font-bold text-white">{bizName}</p>
            <div className="mt-10 w-full space-y-3">
               <button onClick={() => window.open(reviewLink)} className="w-full flex justify-center gap-2 bg-slate-800 py-4 rounded-2xl text-xs font-black uppercase">
                  <ExternalLink size={16} /> Preview Link
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}