import Link from 'next/link';
import { Shield, Zap, Activity, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';
import CellularBackground from '@/components/CellularBackground';

export default function LandingPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 relative z-10">
      
      {/* Mayo Clinic inspired dynamic medical background */}
      <div className="fixed inset-0 w-screen h-screen bg-background -z-30"></div> {/* Covers the global layout aurora */}
      <CellularBackground />

      {/* HERO SECTION */}
      <section className="py-24 md:py-36 flex flex-col lg:flex-row items-center gap-16 relative perspective-1000">
        <div className="flex-1 space-y-10 z-10 text-center md:text-left animate-[fade-up_0.8s_ease-out_forwards]">
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 glass-card text-brand-300 text-sm font-bold uppercase tracking-widest rounded-full border border-brand-500/30 shadow-[0_0_30px_rgba(45,212,191,0.2)] mx-auto md:mx-0 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
            Live Health Tracking
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05]">
            Keeping you safe.<br/>
            <span className="text-gradient">Peace of mind.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light mx-auto md:mx-0 leading-relaxed mix-blend-plus-lighter">
            GlucoGuard analyzes your glucose, insulin, and lifestyle data in real time — detecting dangerous blood sugar drops before they happen and instantly alerting your loved ones.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start pt-4">
             <Link href="/dashboard" className="w-full sm:w-auto text-center font-bold text-lg px-10 py-5 bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-slate-950 rounded-full shadow-[0_0_40px_rgba(45,212,191,0.4)] hover:shadow-[0_0_60px_rgba(45,212,191,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3 group">
               Launch Interface
               <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
             </Link>
             <Link href="/about" className="w-full sm:w-auto text-center font-bold text-lg px-10 py-5 border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white rounded-full transition-all">
               Deep Dive AI
             </Link>
          </div>
        </div>

        <div className="flex-1 w-full relative z-10 animate-[fade-up_1s_ease-out_forwards]">
          <div className="relative w-full max-w-lg mx-auto aspect-square group">
            {/* 3D Floating App Abstract */}
            <div className="absolute inset-0 glass-card p-8 flex flex-col gap-6 animate-[float_8s_ease-in-out_infinite] border-brand-500/40 shadow-2xl transition-transform duration-700 group-hover:rotate-y-12 group-hover:rotate-x-12 transform-gpu">
               
               <div className="flex items-center justify-between border-b border-slate-700/50 pb-6">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(45,212,191,0.3)] border border-brand-400/30">
                      <HeartPulse className="text-brand-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" size={28} />
                   </div>
                   <div>
                     <div className="h-4 w-32 bg-slate-700 rounded-md mb-2"></div>
                     <div className="h-3 w-20 bg-slate-800 rounded-md"></div>
                   </div>
                 </div>
                 <div className="h-8 w-16 bg-slate-800 rounded-full border border-slate-700"></div>
               </div>

               <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center backdrop-blur-md shadow-inner">
                  {/* Glowing background inside the abstract */}
                  <div className="absolute inset-0 bg-red-500/20 blur-[60px]"></div>
                  <div className="text-center relative z-10">
                     <span className="text-6xl font-black text-red-500 block mb-3 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">99% RISK</span>
                     <span className="text-slate-300 text-sm font-bold uppercase tracking-[0.2em] px-3 py-1 bg-black/50 rounded-full border border-white/10">Inference Complete</span>
                  </div>
               </div>

               <div className="h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-900/40 border border-emerald-500/30 rounded-2xl flex items-center px-6 gap-4 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                 <div className="p-2 bg-emerald-500/20 rounded-full">
                    <CheckCircle2 className="text-emerald-400" size={22} />
                 </div>
                 <span className="text-emerald-300 text-sm font-bold tracking-wide uppercase">Emergency Dispatch Sent</span>
               </div>

            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

        <div className="text-center mb-24 animate-[fade-up_1s_ease-out_forwards]">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Incredibly <span className="text-brand-400">Accurate.</span></h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Combining your real-time health data with the power of advanced AI.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="glass-card p-10 group hover:bg-slate-800/40">
             <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
               <Activity className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-4">We Understand Your Day</h3>
             <p className="text-slate-400 leading-relaxed text-lg font-light">
               We look at more than just your blood sugar. By understanding what you eat, how much you exercise, and whether you're alone, our AI understands your true health status.
             </p>
          </div>
          
          <div className="glass-card p-10 group hover:bg-slate-800/40 border-brand-500/30 transform md:-translate-y-6">
             <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-50"></div>
             <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-500 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
               <Zap className="text-brand-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-4">Instant Help When You Need It</h3>
             <p className="text-slate-400 leading-relaxed text-lg font-light">
               If you're at risk, our system immediately alerts your loved ones with text messages so they can help you right away.
             </p>
          </div>
          
          <div className="glass-card p-10 group hover:bg-slate-800/40">
             <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
               <Shield className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" size={32} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-4">Unbreakable Reliability</h3>
             <p className="text-slate-400 leading-relaxed text-lg font-light">
               A secure, continuous connection between you and your caretakers, offering complete peace of mind no matter where you are.
             </p>
          </div>
        </div>
      </section>

    </div>
  );
}
