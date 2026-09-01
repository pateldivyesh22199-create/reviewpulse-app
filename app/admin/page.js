"use client";

import { useState, useEffect } from "react";
import { Users, DollarSign, Building, ShieldCheck, ArrowLeft, BarChart3, Zap } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminData() {
      const res = await fetch("/api/admin/stats");
      const result = await res.json();
      setData(result);
      setLoading(false);
    }
    fetchAdminData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-bold tracking-widest uppercase italic">Accessing God Mode...</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex justify-between items-center border-b border-white/5 pb-8">
           <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin <span className="text-blue-500">Intelligence</span></h1>
              <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">Global Network Overview</p>
           </div>
           <button onClick={() => window.location.href='/dashboard'} className="p-3 bg-slate-900 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all">
              <ArrowLeft size={20} />
           </button>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Users size={24} /></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Clients</span>
              </div>
              <h3 className="text-4xl font-black text-white">{data?.totalUsers}</h3>
           </div>
           <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><ShieldCheck size={24} /></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pro Members</span>
              </div>
              <h3 className="text-4xl font-black text-white">{data?.proUsers}</h3>
           </div>
           <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl shadow-blue-600/20">
              <div className="flex items-center gap-4 mb-4 text-blue-100">
                 <DollarSign size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Est. Revenue</span>
              </div>
              <h3 className="text-4xl font-black text-white">${data?.totalRevenue}<span className="text-sm">/mo</span></h3>
           </div>
        </div>

        {/* USER TABLE */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
           <div className="p-10 border-b border-white/5 bg-slate-900/20">
              <h3 className="text-xl font-black text-white">Client Identity Logs</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-slate-600 border-b border-white/5">
                       <th className="px-10 py-6">User Email</th>
                       <th className="px-10 py-6">Plan Status</th>
                       <th className="px-10 py-6">Credits Used</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {data?.users?.map((u, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-10 py-6 text-sm font-bold text-slate-300">{u.email}</td>
                         <td className="px-10 py-6">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${u.plan !== 'free' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                               {u.plan}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-sm font-black text-white">{u.credits_used}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}