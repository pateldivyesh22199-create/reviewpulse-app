"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  Settings, Building2, MessageSquare, Phone, Sparkles, Save, ArrowLeft, Info, 
  ShieldCheck, Zap, Mail, BellRing, BrainCircuit, PlusCircle, CheckCircle 
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [stats, setStats] = useState({ plan: "free", maxLocations: 1 });
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    name: "", category: "", description: "", phone: "",
    aiTone: "Sophisticated & Professional", customInstructions: "",
    ownerEmail: "", emailAlerts: true, logoUrl: ""
  });

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      try {
        const res = await fetch("/api/business");
        const data = await res.json();
        if (data) {
          setAllBusinesses(data.businesses || []);
          setStats({ plan: data.plan, maxLocations: data.max_locations });
          if (data.businesses?.length > 0) fillForm(data.businesses[0]);
        }
      } catch (err) { console.error("Sync Error"); }
      finally { setLoading(false); }
    }
    if (user) loadConfig();
  }, [user]);

  const fillForm = (biz) => {
    setSelectedId(biz.id);
    setFormData({
      name: biz.name || "", category: biz.category || "", description: biz.description || "",
      phone: biz.phone || "", aiTone: biz.ai_tone || "Sophisticated & Professional",
      customInstructions: biz.custom_instructions || "", ownerEmail: biz.owner_email || "",
      emailAlerts: biz.email_alerts !== false, logoUrl: biz.logo_url || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, ...formData, tone: formData.aiTone, owner_email: formData.ownerEmail, email_alerts: formData.emailAlerts, logo_url: formData.logoUrl }),
      });
      if (res.ok) {
        setMessage("Config Deployed Successfully.");
        const updated = await res.json();
        if (!selectedId) setAllBusinesses([...allBusinesses, updated]);
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (err) { alert("Error."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-blue-500 font-bold uppercase text-xs italic animate-pulse">Synchronizing...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#030712]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href='/dashboard'} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl hover:border-blue-500/50 transition-all"><ArrowLeft size={18} /></button>
          <h1 className="text-sm font-bold uppercase tracking-widest">AI Settings</h1>
        </div>
        <UserButton />
      </header>

      <main className="p-6 md:p-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
           <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Entities</h3>
              <div className="space-y-2">
                 {allBusinesses.map((biz) => (
                   <button key={biz.id} onClick={() => fillForm(biz)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedId === biz.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5"}`}>{biz.name}</button>
                 ))}
                 <button onClick={() => {setSelectedId(null); setFormData({name: "", category: "", description: "", phone: "", aiTone: "Sophisticated & Professional", customInstructions: "", ownerEmail: user?.primaryEmailAddress?.emailAddress, emailAlerts: true, logoUrl: ""})}} className="w-full mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-blue-400 transition-all text-[10px] font-black uppercase"><PlusCircle size={14}/> Add Entity</button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          {message && <div className="mb-10 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm font-bold flex items-center gap-4"><ShieldCheck size={20} /> {message}</div>}
          <form onSubmit={handleSubmit} className="space-y-8 pb-32">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
              <div className="flex items-center gap-4 mb-10"><Building2 className="text-blue-400"/><h3 className="text-sm font-bold uppercase tracking-widest">Identity</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</label><input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo URL</label><input type="text" value={formData.logoUrl} onChange={(e)=>setFormData({...formData, logoUrl:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500" /></div>
              </div>
              <div className="mt-8 space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Narrative</label><textarea rows={3} value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none resize-none" /></div>
            </div>
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
              <div className="flex items-center gap-4 mb-8"><MessageSquare className="text-purple-400"/><h3 className="text-sm font-bold uppercase tracking-widest">AI Strategy</h3></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Voice</label><select value={formData.aiTone} onChange={(e)=>setFormData({...formData, aiTone:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none"><option>Sophisticated & Professional</option><option>Warm & Welcoming</option><option>Empathetic & Solution-Oriented</option></select></div>
              <div className="mt-8 space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Advanced Rules</label><textarea rows={3} value={formData.customInstructions} onChange={(e)=>setFormData({...formData, customInstructions:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none resize-none" /></div>
            </div>
            <div className="bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] p-8 md:p-10">
               <div className="flex items-center gap-4 mb-8"><BellRing className="text-emerald-400"/><h3 className="text-sm font-bold uppercase tracking-widest">Crisis Alerts</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alert Email</label><input type="email" value={formData.ownerEmail} onChange={(e)=>setFormData({...formData, ownerEmail:e.target.value})} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500" /></div>
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl"><span className="text-xs font-bold uppercase text-slate-400">Email Notifications</span><input type="checkbox" checked={formData.emailAlerts} onChange={(e)=>setFormData({...formData, emailAlerts:e.target.checked})} className="w-5 h-5 accent-blue-600" /></div>
               </div>
            </div>
            <div className="flex justify-end pt-4"><button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl uppercase tracking-widest text-xs flex items-center gap-3">{saving ? "Deploying..." : "Sync Config"}</button></div>
          </form>
        </div>
      </main>
    </div>
  );
}