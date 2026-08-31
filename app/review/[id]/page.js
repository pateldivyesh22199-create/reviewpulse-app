"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, ShieldCheck, Zap, Phone } from "lucide-react";

export default function PublicReviewPage({ params }) {
  const [step, setStep] = useState(1); // 1: Rating, 2: Feedback, 3: Success
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [business, setBusiness] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // ૧. બિઝનેસની વિગતો મેળવવી (ID પરથી)
  useEffect(() => {
    async function getBiz() {
      const res = await fetch(`/api/business/public?id=${params.id}`);
      const data = await res.json();
      setBusiness(data);
    }
    getBiz();
  }, [params.id]);

  const handleRating = (val) => {
    setRating(val);
    if (val >= 4) {
      // જો ૪-૫ સ્ટાર હોય તો સીધું ગૂગલ પર મોકલો
      window.location.href = business?.google_link || "https://google.com";
    } else {
      // જો ૧-૩ સ્ટાર હોય તો પ્રાઇવેટ ફીડબેક સ્ટેપ પર જાઓ
      setStep(2);
    }
  };

  const submitFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessId: params.id, 
          rating, 
          feedback 
        }),
      });
      const data = await res.json();
      setAiResponse(data.response);
      setStep(3);
    } catch (err) {
      alert("Error sending feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (!business) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white italic">Loading experience...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl text-center">
        
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-xl shadow-blue-600/20">
          {business.name.charAt(0)}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-black text-white mb-2">How was your experience?</h2>
            <p className="text-slate-400 text-sm mb-8">At {business.name}, your voice matters.</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => handleRating(s)} className="group flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-amber-500 transition-all">
                    <Star size={24} className="text-slate-700 group-hover:text-amber-500 fill-transparent group-hover:fill-amber-500 transition-all" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{s}★</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <h2 className="text-xl font-bold text-white mb-2">We're sorry to hear that.</h2>
            <p className="text-slate-400 text-xs mb-6">How can we make it right? Your feedback goes directly to our management.</p>
            <textarea 
              rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what happened..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none transition resize-none mb-6"
            />
            <button onClick={submitFeedback} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? "Connecting..." : <><Send size={18} /> Submit to Manager</>}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in duration-500 text-left">
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4 bg-emerald-500/10 w-fit px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
              <ShieldCheck size={14} /> VIP Resolution Active
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6">
              <p className="text-slate-300 text-sm leading-relaxed italic">"{aiResponse}"</p>
            </div>
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">Thank you for helping us improve.</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-800 flex items-center justify-center gap-2 opacity-30">
          <Zap size={14} className="text-blue-500" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Protected by ReviewPulse AI</span>
        </div>
      </div>
    </div>
  );
}