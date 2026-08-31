"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Sparkles, CheckCircle2, Zap, ArrowRight, History, Lock, Globe, ListChecks, Loader2 } from "lucide-react";

export default function ReputationCleanup() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Analysis, 2: Action, 3: Success
  const [userPlan, setUserPlan] = useState("free");
  const [manualReviews, setManualReviews] = useState("");

  // ૧. યુઝરનો સાચો પ્લાન ચેક કરવો
  useEffect(() => {
    async function getPlan() {
      const res = await fetch("/api/business");
      const data = await res.json();
      if (data) setUserPlan(data.plan || "free");
    }
    if (user) getPlan();
  }, [user]);

  const handleStartCleanup = () => {
    setLoading(true);
    // અહીં પ્રોસેસિંગ એનિમેશન બતાવવા માટે
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
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
                <p className="text-2xl font-bold text-white">Pending Scan</p>
                <p className="text-xs text-slate-500 mt-2">150+ reviews detected from previous years.</p>
             </div>

             <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[2rem]">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Why Cleanup?</h4>
                <ul className="space-y-3">
                   <li className="text-[11px] text-slate-400 flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> Boosts local Google SEO ranking.</li>
                   <li className="text-[11px] text-slate-400 flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> Shows customers you care.</li>
                </ul>
             </div>
          </div>

          {/* RIGHT: MAIN ACTION AREA */}
          <div className="lg:col-span-2">
             <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-3xl min-h-[450px] flex flex-col">
                
                {step === 1 && (
                   <div className="flex-1 flex flex-col justify-center text-center animate-in fade-in zoom-in duration-500">
                      {/* જો પ્લાન મોટો હોય તો - AUTOMATIC UI */}
                      {(userPlan === "pro" || userPlan === "agency") ? (
                        <>
                          <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                             <Globe size={32} className="text-blue-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4">One-Click Auto Connect</h3>
                          <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">Your Pro account allows direct integration with Google Business. We'll fetch all old reviews automatically.</p>
                          <button onClick={handleStartCleanup} disabled={loading} className="bg-white text-black font-black px-10 py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center gap-3 mx-auto">
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
                          <p className="text-slate-400 text-xs mb-8">Starter plan requires manual review entry. Upgrade to Pro for Auto-Fetch.</p>
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

                {step === 3 && (
                   <div className="flex-1 flex flex-col justify-center text-center animate-in zoom-in duration-500">
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                         <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Cleanup Strategy Drafted!</h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                         The AI Agent has prepared sophisticated responses for all detected reviews. You can find them in your history logs.
                      </p>
                      <button onClick={() => window.location.href='/dashboard'} className="bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-[10px]">
                         Return to Dashboard
                      </button>
                   </div>
                )}

             </div>
          </div>
        </div>

      </div>
    </div>
  );
}