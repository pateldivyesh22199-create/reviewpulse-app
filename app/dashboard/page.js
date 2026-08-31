"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, History, Settings, Zap, Copy, Check, Star, 
  Clock, ShieldCheck, Sparkles, QrCode, ExternalLink, Download, 
  Save, Smartphone, MessageSquare, Menu, X, Wand2, TrendingUp, BarChart3, Search, MapPin
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("generate");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [origin, setOrigin] = useState("");
  const [stats, setStats] = useState({ id: "", creditsUsed: 0, plan: "free", businessName: "Lumina Dining Group", timeSaved: 0, googleLink: "" });
  
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [aiResponse, setAiResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const chartData = [
    { name: 'Mon', reviews: 4 }, { name: 'Tue', reviews: 7 }, { name: 'Wed', reviews: 5 },
    { name: 'Thu', reviews: 12 }, { name: 'Fri', reviews: 9 }, { name: 'Sat', reviews: 18 }, { name: 'Sun', reviews: 14 },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    async function loadData() {
      try {
        const [bizRes, historyRes] = await Promise.all([fetch("/api/business"), fetch("/api/reviews")]);
        const bizData = await bizRes.json();
        const historyData = await historyRes.json();
        if (bizData) setStats({
          id: bizData.id, creditsUsed: bizData.credits_used || 0, plan: bizData.plan || "free",
          businessName: bizData.name || "Lumina Dining Group", googleLink: bizData.google_link || "",
          timeSaved: Math.round(((bizData.credits_used || 0) * 6) / 60 * 10) / 10
        });
        if (Array.isArray(historyData)) setHistory(historyData);
      } catch (err) { console.error("Sync Error"); }
    }
    if (user) loadData();
  }, [user]);

  const handleGenerate = async () => {
    if (!reviewText) return;
    setLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewText, rating, reviewerName }),
      });
      if (res.status === 403) {
        alert("🚨 Credit limit reached! Please upgrade your plan.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.response) {
        setAiResponse(data.response);
        setStats(prev => ({ ...prev, creditsUsed: prev.creditsUsed + 1 }));
        setHistory([{ reviewer_name: reviewerName || "Valued Guest", rating, review_text: reviewText, ai_response_text: data.response, created_at: new Date().toISOString() }, ...history]);
      }
    } catch (err) { console.error("AI Error"); } finally { setLoading(false); }
  };

  const NavItems = () => (
    <nav className="flex-1 px-6 space-y-3 mt-4">
      <button onClick={() => {setActiveTab("generate"); setIsMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === "generate" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`}><LayoutDashboard size={20} /> <span className="text-sm font-bold">Generate Reply</span></button>
      <button onClick={() => window.location.href='/dashboard/cleanup'} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5 transition-all"><div className="flex items-center gap-3"><Wand2 size={20} className="text-purple-400" /> <span className="text-sm font-bold">Bulk Cleanup</span></div><span className="bg-purple-500/20 text-purple-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Pro</span></button>
      <button onClick={() => {setActiveTab("qr"); setIsMobileMenuOpen(false);}} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeTab === "qr" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`}><div className="flex items-center gap-3"><QrCode size={20} /> <span className="text-sm font-bold">QR Collector</span></div><span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span></button>
      <button onClick={() => {setActiveTab("history"); setIsMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === "history" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`}><History size={20} /> <span className="text-sm font-bold">Review History</span></button>
      <button onClick={() => window.location.href='/dashboard/settings'} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5 transition-all"><Settings size={20} /> <span className="text-sm font-bold">AI Settings</span></button>
    </nav>
  );

  const reviewLink = stats.id ? `${origin}/review/${stats.id}` : "";

  return (
    <div className="flex min-h-screen bg-[#030712] text-slate-200">
      
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 bg-[#030712] hidden md:flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-2xl">⚡</div><span className="text-xl font-black tracking-tighter text-white">ReviewPulse<span className="text-blue-500">.AI</span></span></div>
        <NavItems />
        <div className="p-6 mt-auto">
            <div className="p-5 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Plan: {stats.plan}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-blue-600 h-full" style={{ width: '100%' }}></div></div>
                <button onClick={() => window.location.href='/#pricing'} className="w-full mt-4 bg-white text-black text-[10px] font-black py-3 rounded-xl uppercase hover:bg-blue-50 transition-colors">Manage Subscription</button>
            </div>
        </div>
      </aside>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#030712] z-[100] flex flex-col md:hidden animate-in fade-in duration-300">
          <div className="p-6 flex justify-between items-center border-b border-white/5"><span className="text-xl font-black italic">ReviewPulse<span className="text-blue-500">.AI</span></span><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-900 rounded-xl"><X size={24} /></button></div>
          <div className="mt-6"><NavItems /></div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#030712]/50 backdrop-blur-2xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-slate-900 border border-white/5 rounded-xl"><Menu size={20} /></button>
             <div className="hidden md:block p-2 bg-blue-600/10 rounded-lg text-blue-500"><Sparkles size={18} /></div>
             <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest truncate max-w-[200px]">{stats.businessName}</h2>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          
          {activeTab === "generate" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                 {/* CHART CARD */}
                 <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                       <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp size={20} className="text-emerald-400" /> Reputation Intelligence</h3>
                          <p className="text-xs text-slate-500">Global review performance metrics</p>
                       </div>
                    </div>
                    <div className="h-[200px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                             <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                             <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                             <Area type="monotone" dataKey="reviews" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* MINI STATS */}
                 <div className="space-y-6">
                    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem]">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Clock size={20} /></div>
                          <div><p className="text-[10px] font-black text-slate-500 uppercase">Total Time Saved</p><h3 className="text-xl font-black text-white">{stats.timeSaved} Hours</h3></div>
                       </div>
                    </div>
                    <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[2rem]">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><ShieldCheck size={20} /></div>
                          <div><p className="text-[10px] font-black text-emerald-500 uppercase">Health Score</p><h3 className="text-xl font-black text-white">Excellent</h3></div>
                       </div>
                    </div>
                    <div className="bg-blue-600 p-6 rounded-[2rem] shadow-2xl shadow-blue-600/20">
                       <p className="text-[10px] font-bold text-blue-100 uppercase">Generation Capacity</p>
                       <h3 className="text-2xl font-black text-white mt-1">∞ Unlimited</h3>
                    </div>
                 </div>
              </div>

              {/* GENERATOR TOOLS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-3xl">
                  <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3"><MessageSquare className="text-blue-500" size={20} /> New Review</h3>
                  <div className="space-y-6">
                    <input type="text" value={reviewerName} onChange={(e)=>setReviewerName(e.target.value)} placeholder="Guest Name" className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all" />
                    <div className="flex gap-2">{[1, 2, 3, 4, 5].map((s) => ( <button key={s} onClick={() => setRating(s)} className={`flex-1 py-3 rounded-xl border transition-all flex flex-col items-center ${rating === s ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-950 border-white/5 text-slate-500"}`}><Star size={14} className={rating >= s ? "fill-amber-400 text-amber-400" : ""} /><span className="text-[9px] font-bold">{s}★</span></button> ))}</div>
                    <textarea rows={4} value={reviewText} onChange={(e)=>setReviewText(e.target.value)} placeholder="Paste review..." className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all resize-none" />
                    <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] transition-all disabled:opacity-50 uppercase tracking-widest text-xs">{loading ? "AI writing..." : "Generate Reply ⚡"}</button>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-3xl flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-8">AI Response</h3>
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-[1.5rem] p-6 md:p-8 relative">
                    {aiResponse ? ( <p className="text-slate-300 text-sm leading-relaxed italic">"{aiResponse}"</p> ) : ( <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20"><Zap size={48} /><p className="text-[10px] font-black uppercase mt-4">Awaiting Input</p></div> )}
                  </div>
                  {aiResponse && ( <button onClick={() => {navigator.clipboard.writeText(aiResponse); setCopied(true); setTimeout(()=>setCopied(false),2000)}} className="mt-8 flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all text-xs uppercase">{copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}{copied ? "Copied" : "Copy to Clipboard"}</button> )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "qr" && (
             <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-6">
                      <div className="bg-slate-900/40 border border-white/5 p-6 md:p-10 rounded-[3rem] shadow-2xl">
                         <h3 className="text-xl font-black mb-8 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">1</div> Global Search Integration</h3>
                         <div className="relative group mb-4">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                              type="text" 
                              value={searchQuery} 
                              onChange={(e) => setSearchQuery(e.target.value)} 
                              placeholder="Search your business name in Canada/USA..." 
                              className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-5 py-5 text-sm outline-none focus:border-blue-500 transition-all shadow-inner" 
                            />
                         </div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-8">* Our system will automatically fetch your Google Map ID and map it to your Crisis Shield.</p>

                         <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-1">Manual Direct Link</label>
                            <div className="flex gap-3">
                               <input type="text" value={stats.googleLink} onChange={(e) => setStats({...stats, googleLink: e.target.value})} placeholder="https://g.page/r/your-id/review" className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-xs outline-none focus:border-blue-500 transition-all italic text-slate-400" />
                               <button onClick={() => alert("Manual Link Saved!")} className="bg-slate-800 hover:bg-slate-700 px-6 rounded-2xl transition-all"><Save size={20} /></button>
                            </div>
                         </div>
                      </div>
                      <div className="bg-blue-600/5 border border-blue-500/10 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-6">
                         <ShieldCheck className="text-blue-500 hidden sm:block" size={32} />
                         <p className="text-xs text-slate-400">Public ratings are 100% protected. Crisis Shield™ intercepts negative feedback before it hits Google.</p>
                      </div>
                   </div>
                   <div className="bg-slate-900/40 border border-white/5 p-8 md:p-10 rounded-[3rem] flex flex-col items-center">
                      <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-3xl">
                         {stats.id ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(reviewLink)}`} alt="QR" className="w-40 h-40" /> : "Initializing..."}
                      </div>
                      <p className="mt-8 text-sm font-black text-center">{stats.businessName}</p>
                      <button onClick={() => window.open(reviewLink)} className="mt-10 w-full bg-slate-800 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Preview Experience</button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === "history" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-6 md:p-10 border-b border-white/5 bg-slate-900/20 flex justify-between items-center">
                     <h3 className="text-xl md:text-2xl font-black">Audit History</h3>
                     <div className="bg-blue-600/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">Secure Logs</div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <tbody className="divide-y divide-white/5">
                           {history.map((rev, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                 <td className="px-6 md:px-10 py-6">
                                    <div className="flex items-center gap-3">
                                       {/* SENTIMENT TAG (Green for 4-5, Red for 1-3) */}
                                       <div className={`w-2 h-2 rounded-full ${rev.rating >= 4 ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse'}`}></div>
                                       <div>
                                          <p className="text-sm font-bold text-slate-300">{rev.reviewer_name}</p>
                                          <div className="flex text-amber-500 mt-0.5">{Array.from({length: rev.rating}).map((_, i) => <Star key={i} size={10} className="fill-current" />)}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-6 text-xs text-slate-500 max-w-[150px] md:max-w-xs truncate italic">"{rev.review_text}"</td>
                                 <td className="px-6 py-6 text-right"><button onClick={() => {navigator.clipboard.writeText(rev.ai_response_text); alert("Reply Copied!")}} className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Copy Intelligence</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     {history.length === 0 && <div className="p-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">No data records found.</div>}
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}