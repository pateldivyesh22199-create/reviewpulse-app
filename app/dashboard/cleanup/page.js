"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Sparkles, CheckCircle2, Zap, ArrowRight, History, Lock, Globe, ListChecks, Loader2, AlertCircle } from "lucide-react";

export default function ReputationCleanup() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Analysis, 2: Action, 3: Success
  const [bizData, setBizData] = useState(null);
  const [manualReviews, setManualReviews] = useState("");
  const [cleanedCount, setCleanedCount] = useState(0);

  // ૧. બિઝનેસ અને પ્લાનની વિગત લોડ કરવી
  useEffect(() => {
    async function loadBiz() {
      const res = await fetch("/api/business");
      const data = await res.json();
      if (data && data.businesses?.length > 0) {
        setBizData({
          id: data.businesses[0].id,
          plan: data.plan,
          googleLink: data.businesses[0].google_link,
          name: data.businesses[0].name
        });
      }
    }
    if (user) loadBiz();
  }, [user]);

  // ૨. અસલી બલ્ક ક્લીનઅપ શરૂ કરવું
  const handleStartCleanup = async () => {
    if (!bizData?.googleLink && bizData?.plan !== 'starter') {
      alert("Please link your Google Business profile in Settings first!");
      return;
    }

    setLoading(true);
    setStep(2);

    try {
      // અસલી API ને કોલ કરવો
      const res = await fetch("/api/business/cleanup-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessId: bizData.id, 
          googleLink: bizData.googleLink 
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCleanedCount(data.count);
        setStep(3);
      } else {
        alert("Sync failed: " + data.error);
        setStep(1);
      }
    } catch (err) {
      alert("Uplink Error.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
             <Sparkles size={14} className="text-purple-400" />
             <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Historical Intelligence</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Bulk Reputation Cleanup</h2>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">Analyze and respond to all your past unanswered reviews in one unified AI sweep.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: STATUS CARD */}
          <div className="space-y-6">
             <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><History size={40} /></div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Cleanup Status</h3>
                <p className="text-2xl font-bold text-white">{step === 3 ? "Complete" : "Ready to Scan"}</p>
                <p className="text-xs text-slate-500 mt-2">{bizData?.name || "Loading Entity..."}</p>
             </div>

             <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[2rem]">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-4">Why Cleanup?</h4>
                <ul className="space-y-4">
                   <li className="text-[11px] text-slate-400 flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500" /> Boost local SEO ranking.</li>
                   <li className="text-[11px] text-slate-400 flex items-start gap-3"><CheckCircle2 size={16} className="text-emerald-500" /> Build instant brand trust.</li>
                </ul>
             </div>
          </div>

          {/* RIGHT: MAIN ACTION AREA */}
          <div className="lg:col-span-2">
             <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-3xl min-h-[450px] flex flex-col justify-center">
                
                {step === 1 && (
                   <div className="text-center animate-in fade-in zoom-in duration-500">
                      {/* જો પ્લાન મોટો હોય તો - AUTOMATIC UI */}
                      {(bizData?.plan === "pro" || bizData?.plan === "agency") ? (
                        <>
                          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                             <Globe size={32} className="text-blue-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4">One-Click Auto Fetch</h3>
                          <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">Our AI Agent will scan your Google profile and prepare sophisticated responses for all unanswered reviews.</p>
                          <button onClick={handleStartCleanup} disabled={loading} className="bg-white text-black font-black px-12 py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-3 mx-auto active:scale-95">
                             {loading ? <Loader2 className="animate-spin" /> : <><Zap size={18} fill="currentColor" /> Sync & Deploy AI</>}
                          </button>
                        </>
                      ) : (
                        /* જો પ્લાન નાનો હોય તો - MANUAL UI */
                        <>
                          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                             <ListChecks size={32} className="text-amber-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Manual Bulk Entry</h3>
                          <p className="text-slate-400 text-xs mb-8 italic">Starter plan requires manual entry. Pro plan enables Auto-Sync.</p>
                          <textarea 
                            value={manualReviews}
                            onChange={(e) => setManualReviews(e.target.value)}
                            placeholder="Paste multiple reviews here (one per line)..."
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-sm focus:border-blue-500 outline-none transition mb-6 resize-none h-32"
                          />
                          <button onClick={handleStartCleanup} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center gap-3 mx-auto">
                             Process Manual List <ArrowRight size={18} />
                          </button>
                          <button onClick={() => window.location.href='/#pricing'} className="mt-6 text-[10px] text-blue-400 font-bold uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
                             <Lock size={12} /> Unlock Auto-Fetch with Pro
                          </button>
                        </>
                      )}
                   </div>
                )}

                {step === 2 && (
                   <div className="text-center py-10 animate-in fade-in duration-500">
                      <div className="relative w-24 h-24 mx-auto mb-10">
                         <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles size={30} className="text-purple-400 animate-pulse" />
                         </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">AI Engine Scouring Data...</h3>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Generating Enterprise-Grade Responses</p>
                      <div className="mt-10 w-full max-w-xs mx-auto bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                         <div className="bg-purple-600 h-full w-full animate-progress"></div>
                      </div>
                   </div>
                )}

                {step === 3 && (
                   <div className="text-center animate-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                         <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Cleanup Success!</h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                         The AI Agent has successfully drafted <strong>{cleanedCount}</strong> sophisticated responses. Your local reputation ranking is being updated.
                      </p>
                      <button onClick={() => window.location.href='/dashboard'} className="bg-slate-100 text-black font-black px-10 py-4 rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-[10px]">
                         Return to Interaction Logs
                      </button>
                   </div>
                )}

             </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
           <div className="flex items-center gap-2">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Sync</span>
           </div>
           <div className="flex items-center gap-2">
              <Zap size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Qwen-72B Intelligence</span>
           </div>
        </div>

      </div>
    </div>
  );
}