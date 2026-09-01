"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  User, Mail, CreditCard, ShieldCheck, Zap, 
  ArrowLeft, ExternalLink, Crown, Clock, CheckCircle2 
} from "lucide-react";

export default function AccountPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({ plan: "free", creditsUsed: 0 });
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/business");
        const data = await res.json();
        if (data) setStats({ plan: data.plan, creditsUsed: data.credits_used });
      } catch (err) { console.error("Error loading stats"); }
    }
    loadStats();
  }, []);

  const openStripePortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Billing portal is not ready. Please make a payment first.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href='/dashboard'} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl hover:border-blue-500/50 transition-all">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-widest">Account Intelligence</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* USER INFO */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
               <div className="w-20 h-20 rounded-full border-4 border-white/5 mx-auto mb-6 overflow-hidden bg-slate-800">
                  {user?.imageUrl && <img src={user.imageUrl} alt="Profile" />}
               </div>
               <h3 className="font-bold text-white text-lg">{user?.fullName || "User"}</h3>
               <p className="text-xs text-slate-500 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-blue-600 shadow-xl shadow-blue-600/20">
               <h4 className="text-[10px] font-black text-blue-100 uppercase mb-4 tracking-widest text-center">Status: {stats.plan}</h4>
               <p className="text-sm font-bold text-white text-center italic">"Managing Reputation with AI"</p>
            </div>
          </div>

          {/* BILLING INFO */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-3xl">
               <h3 className="text-lg font-bold text-white mb-10 flex items-center gap-2"><CreditCard className="text-blue-500" /> Subscription Control</h3>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-950 border border-white/5 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-600 uppercase mb-2">AI Usage</p>
                     <h4 className="text-xl font-black text-white">
                        {stats.plan === 'free' ? `${10 - stats.creditsUsed} Credits` : "∞ Unlimited"}
                     </h4>
                  </div>
                  <div className="p-6 bg-slate-950 border border-white/5 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Cycle</p>
                     <h4 className="text-lg font-bold text-white">Monthly</h4>
                  </div>
               </div>

               <button 
                  onClick={openStripePortal}
                  disabled={loadingPortal}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-5 rounded-2xl transition-all border border-white/5 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
               >
                  {loadingPortal ? "Connecting..." : <><ExternalLink size={18} /> Manage Billing & Invoices</>}
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}