"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  Settings, Building2, MessageSquare, Phone, 
  Sparkles, Save, ArrowLeft, Info, Globe, ShieldCheck, Zap, Mail, BellRing, Smartphone, BrainCircuit, PlusCircle, CheckCircle, Image as ImageIcon
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
    name: "",
    category: "",
    description: "",
    phone: "",
    aiTone: "Sophisticated & Professional",
    customInstructions: "",
    ownerEmail: "",
    emailAlerts: true,
    whatsappAlerts: false,
    logoUrl: "" // નવું લોગો ખાનું
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
          if (data.businesses && data.businesses.length > 0) {
            fillForm(data.businesses[0]);
          }
        }
      } catch (err) { console.error("Sync Error"); }
      finally { setLoading(false); }
    }
    if (user) loadConfig();
  }, [user]);

  const fillForm = (biz) => {
    setSelectedId(biz.id);
    setFormData({
      name: biz.name || "",
      category: biz.category || "",
      description: biz.description || "",
      phone: biz.phone || "",
      aiTone: biz.ai_tone || "Sophisticated & Professional",
      customInstructions: biz.custom_instructions || "",
      ownerEmail: biz.owner_email || "",
      emailAlerts: biz.email_alerts !== false,
      whatsappAlerts: biz.whatsapp_alerts || false,
      logoUrl: biz.logo_url || ""
    });
  };

  const handleAddNew = () => {
    if (allBusinesses.length >= stats.maxLocations) {
      alert(`Limit Reached! Your ${stats.plan} plan supports only ${stats.maxLocations} location.`);
      return;
    }
    setSelectedId(null);
    setFormData({
      name: "", category: "", description: "", phone: "",
      aiTone: "Sophisticated & Professional", customInstructions: "",
      ownerEmail: user?.primaryEmailAddress?.emailAddress || "",
      emailAlerts: true, whatsappAlerts: false, logoUrl: ""
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
        body: JSON.stringify({
          id: selectedId,
          ...formData,
          tone: formData.aiTone,
          owner_email: formData.ownerEmail,
          email_alerts: formData.emailAlerts,
          whatsapp_alerts: formData.whatsappAlerts,
          logo_url: formData.logoUrl
        }),
      });

      if (res.ok) {
        const updatedBiz = await res.json();
        setMessage("Brand configuration deployed.");
        if (!selectedId) {
            setAllBusinesses([...allBusinesses, updatedBiz]);
            setSelectedId(updatedBiz.id);
        }
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (err) { alert("Error saving."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest text-xs italic"><Zap size={40} className="animate-bounce mr-4" /> Updating System Config...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#030712]/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href='/dashboard'} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl hover:border-blue-500/50 transition-all"><ArrowLeft size={18} /></button>
          <h1 className="text-sm font-bold text-white uppercase tracking-widest">Master AI Settings</h1>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="p-6 md:p-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 shadow-2xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-2">Managed Entities</h3>
              <div className="space-y-2">
                 {allBusinesses.map((biz) => (
                   <button key={biz.id} onClick={() => fillForm(biz)} className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${selectedId === biz.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5"}`}>
                      <span className="text-xs font-bold truncate">{biz.name}</span>
                      {selectedId === biz.id && <CheckCircle size={14} />}
                   </button>
                 ))}
                 <button onClick={handleAddNew} className="w-full mt-4 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-blue-400 transition-all">
                    <PlusCircle size={16} /> <span className="text-[10px] font-black uppercase">Add Entity</span>
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          {message && <div className="mb-10 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm font-bold flex items-center gap-4 animate-in fade-in zoom-in"><ShieldCheck size={20} /> {message}</div>}

          <form onSubmit={handleSubmit} className="space-y-8 pb-32">
            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
              <div className="flex items-center gap-4 mb-10"><Building2 className="text-blue-400" /><h3 className="text-sm font-bold text-white uppercase tracking-widest">Brand Identity</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Business Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Logo URL</label><input type="text" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="https://logo-link.com/img.png" /></div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry</label><input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Crisis Resolution Line</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" /></div>
              </div>
              <div className="mt-8 space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Narrative</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all resize-none" /></div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
              <div className="flex items-center gap-4 mb-8">
                <MessageSquare className="text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Strategic Directives</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Communication Voice</label>
                <select value={formData.aiTone} onChange={(e) => setFormData({ ...formData, aiTone: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none cursor-pointer appearance-none"><option>Sophisticated & Professional</option><option>Warm & Welcoming</option><option>Empathetic & Solution-Oriented</option></select>
              </div>
              <div className="mt-8 space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><BrainCircuit size={14} className="text-blue-500" /> Advanced AI Logic</label><textarea rows={3} value={formData.customInstructions} onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all resize-none" /></div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
               <div className="flex items-center gap-4 mb-10"><BellRing className="text-emerald-400" /><h3 className="text-sm font-bold text-white uppercase tracking-widest">Crisis Alerts</h3></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alert Email</label><input type="email" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" /></div>
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/5 rounded-2xl"><span className="text-xs font-bold text-slate-400">Email Notifications</span><input type="checkbox" checked={formData.emailAlerts} onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })} className="w-5 h-5 accent-blue-600" /></div>
                     <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/5 rounded-2xl"><span className="text-xs font-bold text-slate-400">WhatsApp Beta</span><input type="checkbox" checked={formData.whatsappAlerts} onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })} className="w-5 h-5 accent-emerald-600" /></div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4"><button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center gap-3">{saving ? "Syncing..." : <><Save size={20} /> Sync System Config</>}</button></div>
          </form>
        </div>
      </main>
    </div>
  );
}