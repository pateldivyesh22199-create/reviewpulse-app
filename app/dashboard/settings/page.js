"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { 
  Settings, Building2, MessageSquare, Phone, 
  Sparkles, Save, ArrowLeft, Info, Globe, ShieldCheck, Zap, Mail, BellRing, Smartphone, BrainCircuit 
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    aiTone: "Sophisticated & Professional",
    customInstructions: "",
    ownerEmail: "",
    emailAlerts: true,
    whatsappAlerts: false
  });

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      try {
        const res = await fetch("/api/business");
        const data = await res.json();
        if (data && data.name) {
          setFormData({
            name: data.name,
            category: data.category || "",
            description: data.description || "",
            phone: data.phone || "",
            aiTone: data.ai_tone || "Sophisticated & Professional",
            customInstructions: data.custom_instructions || "",
            ownerEmail: data.owner_email || "",
            emailAlerts: data.email_alerts !== false,
            whatsappAlerts: data.whatsapp_alerts || false
          });
        }
      } catch (err) {
        console.error("Sync Error");
      } finally {
        setLoading(false);
      }
    }
    fetchBusiness();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          phone: formData.phone,
          tone: formData.aiTone,
          customInstructions: formData.customInstructions,
          owner_email: formData.ownerEmail,
          email_alerts: formData.emailAlerts,
          whatsapp_alerts: formData.whatsappAlerts
        }),
      });

      if (res.ok) {
        setMessage("System configuration deployed successfully.");
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage("Deployment failed.");
      }
    } catch (err) {
      setMessage("Uplink error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest italic text-xs">
      <Zap size={40} className="animate-bounce mr-4" /> Synchronizing System Config...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200">
      
      {/* GLOBAL HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#030712]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href='/dashboard'} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl hover:border-blue-500/50 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Engine</h1>
            <p className="text-sm font-bold text-white">Global Config</p>
          </div>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="p-6 md:p-10 max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-4">
            AI Control Center <Sparkles className="text-blue-500" size={28} />
          </h2>
        </div>

        {message && (
          <div className="mb-10 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm font-bold flex items-center gap-4 animate-in fade-in zoom-in">
            <ShieldCheck size={20} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 pb-32">
          
          {/* 1. BRAND IDENTITY SECTION */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <Building2 className="text-blue-400" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Brand Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Business Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="e.g. Lumina Dining" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Industry Vertical</label>
                <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="e.g. Premium Hospitality" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Brand Narrative (AI Context)</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all resize-none" placeholder="Describe your business core values..." />
            </div>
          </div>

          {/* 2. AI STRATEGIC DIRECTIVES SECTION */}
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <MessageSquare className="text-purple-400" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">AI Strategic Directives</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Communication Voice</label>
                <select value={formData.aiTone} onChange={(e) => setFormData({ ...formData, aiTone: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none cursor-pointer appearance-none">
                  <option>Sophisticated & Professional</option>
                  <option>Warm & Welcoming</option>
                  <option>Empathetic & Solution-Oriented</option>
                  <option>Casual & Energetic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Crisis Resolution Line</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            {/* ADVANCED AI LOGIC BOX (RESTORED & FIXED) */}
            <div className="mt-8 space-y-2 border-t border-white/5 pt-8">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <BrainCircuit size={14} className="text-blue-500" /> Advanced AI Logic (Custom Rules)
              </label>
              <textarea 
                rows={4} value={formData.customInstructions} 
                onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })} 
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="e.g. Always mention our manager. Offer vouchers for slow service complaints..."
              />
            </div>
          </div>

          {/* 3. CRISIS NOTIFICATION ENGINE SECTION */}
          <div className="bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <BellRing className="text-emerald-400" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Crisis Notification Engine</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Manager Alert Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input type="email" value={formData.ownerEmail} onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })} className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="manager@yourbrand.com" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/5 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Mail size={16} /></div>
                      <span className="text-xs font-bold">Email Alerts</span>
                   </div>
                   <input type="checkbox" checked={formData.emailAlerts} onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/5 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Smartphone size={16} /></div>
                      <span className="text-xs font-bold text-slate-400">WhatsApp Alerts <span className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded ml-1 uppercase">Beta</span></span>
                   </div>
                   <input type="checkbox" checked={formData.whatsappAlerts} onChange={(e) => setFormData({ ...formData, whatsappAlerts: e.target.checked })} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center gap-3 transition-all">
              {saving ? "Deploying..." : <><Save size={20} /> Sync System Config</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}