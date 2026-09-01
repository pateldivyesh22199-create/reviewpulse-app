"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, History, Settings, Zap, Copy, Check, Star, Clock, ShieldCheck, 
  Sparkles, QrCode, ExternalLink, Download, Save, Smartphone, MessageSquare, Menu, X, 
  Wand2, TrendingUp, BarChart3, Search, CheckCircle2, User, RefreshCcw, Power 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("generate");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAutopilot, setIsAutopilot] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [stats, setStats] = useState({ id: "", creditsUsed: 0, plan: "free", googleLink: "" });
  const [history, setHistory] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [aiResponse, setAiResponse] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/business");
      const data = await res.json();
      if (data.businesses?.length > 0) {
        setBusinesses(data.businesses);
        setSelectedBiz(data.businesses[0]);
        setStats({ id: data.businesses[0].id, creditsUsed: data.credits_used, plan: data.plan, googleLink: data.businesses[0].google_link });
        loadHistory(data.businesses[0].id);
      }
    }
    if (user) loadData();
  }, [user]);

  const loadHistory = async (bizId) => {
    const res = await fetch(`/api/reviews?bizId=${bizId}`);
    const data = await res.json();
    setHistory(data);
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/business/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: selectedBiz.id, googleLink: stats.googleLink, autopilot: isAutopilot }),
      });
      alert("Sync Complete!");
      loadHistory(selectedBiz.id);
    } catch (err) { alert("Sync Error"); } finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewText, rating, businessId: selectedBiz.id }),
    });
    const data = await res.json();
    setAiResponse(data.response);
    loadHistory(selectedBiz.id);
    setLoading(false);
  };

  const NavItems = () => (
    <nav className="flex-1 px-6 space-y-2 mt-4">
      <button onClick={()=>setActiveTab("generate")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === "generate" ? "bg-blue-600 text-white shadow-xl" : "text-slate-500 hover:bg-white/5"}`}><LayoutDashboard size={20} /> <span className="text-sm font-bold">AI Agent</span></button>
      <button onClick={()=>setActiveTab("qr")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === "qr" ? "bg-blue-600 text-white shadow-xl" : "text-slate-500 hover:bg-white/5"}`}><QrCode size={20} /> <span className="text-sm font-bold">QR Collector</span></button>
      <button onClick={()=>setActiveTab("history")} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === "history" ? "bg-blue-600 text-white shadow-xl" : "text-slate-500 hover:bg-white/5"}`}><History size={20} /> <span className="text-sm font-bold">History</span></button>
      <button onClick={()=>window.location.href='/dashboard/settings'} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5"><Settings size={20} /> <span className="text-sm font-bold">Settings</span></button>
      <button onClick={()=>window.location.href='/dashboard/account'} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5"><User size={20} /> <span className="text-sm font-bold">Billing</span></button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30 font-sans">
      <aside className="w-72 border-r border-white/5 bg-[#030712] hidden md:flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-2xl">⚡</div><span className="text-xl font-black tracking-tighter">ReviewPulse<span className="text-blue-500">.AI</span></span></div>
        <NavItems />
        <div className="p-6 mt-auto">
          <div className="p-5 rounded-[2rem] bg-slate-900 border border-white/5 text-center">
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">{stats.plan} Account</p>
            <button onClick={()=>window.location.href='/dashboard/account'} className="w-full bg-white text-black text-[10px] font-black py-3 rounded-xl uppercase">Manage Plan</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#030712]/50 backdrop-blur-2xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button onClick={()=>setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-slate-900 rounded-xl"><Menu size={20} /></button>
             <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">{selectedBiz?.name || "Loading..."}</h2>
          </div>
          <UserButton />
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {activeTab === "generate" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-3xl">
                 <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${isAutopilot ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'} transition-colors shadow-inner`}><Power size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black">AI Autopilot Mode</h3>
                       <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Auto-Scan & Instant AI Response</p>
                    </div>
                 </div>
                 <button onClick={()=>setIsAutopilot(!isAutopilot)} className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isAutopilot ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-400'}`}>
                    {isAutopilot ? "Autopilot Active" : "Activate Autopilot"}
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-lg font-bold text-white flex items-center gap-3"><RefreshCcw className="text-blue-500" size={20} /> Manual Sync</h3>
                     <button onClick={handleSync} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-600/20">Fetch Reviews</button>
                  </div>
                  <textarea rows={5} value={reviewText} onChange={(e)=>setReviewText(e.target.value)} placeholder="Paste review content for manual AI generation..." className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-sm focus:border-blue-500 outline-none transition-all mb-6" />
                  <button onClick={handleGenerate} disabled={loading} className="w-full bg-slate-100 text-black font-black py-5 rounded-[1.5rem] uppercase tracking-widest text-xs">{loading ? "Agent Working..." : "Deploy AI Intelligence"}</button>
                </div>
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl flex flex-col justify-center text-center">
                   {aiResponse ? <p className="text-slate-300 text-sm leading-relaxed italic">"{aiResponse}"</p> : <div className="opacity-20 flex flex-col items-center"><Sparkles size={60} /><p className="text-[10px] uppercase font-black mt-4">Awaiting Signal</p></div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <div className="p-10 border-b border-white/5 bg-slate-900/20"><h3 className="text-xl font-black uppercase">Intelligence logs</h3></div>
               <div className="overflow-x-auto"><table className="w-full text-left"><tbody className="divide-y divide-white/5">
                {history.map((rev, idx)=>(
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors"><td className="px-10 py-6"><div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${rev.sentiment === 'negative' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div><p className="text-sm font-bold">{rev.reviewer_name}</p></div></td><td className="px-10 py-6 text-xs text-slate-500 italic max-w-xs truncate">"{rev.review_text}"</td><td className="px-10 py-6 text-right"><button onClick={()=>navigator.clipboard.writeText(rev.ai_response_text)} className="text-[9px] font-black text-blue-400 uppercase">Copy Intelligence</button></td></tr>
                ))}
               </tbody></table></div>
            </div>
          )}

          {activeTab === "qr" && (
             <div className="animate-in fade-in zoom-in-95 duration-500 max-w-sm mx-auto text-center">
                <div className="bg-white p-6 rounded-[3rem] shadow-3xl border-[12px] border-white mb-8">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`} alt="QR" className="w-full" />
                </div>
                <h3 className="text-xl font-black text-white">{selectedBiz?.name}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase mt-2 tracking-[0.3em]">Smart QR Collector</p>
                <button onClick={()=>window.print()} className="mt-10 w-full bg-slate-800 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Print Table Stand</button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}