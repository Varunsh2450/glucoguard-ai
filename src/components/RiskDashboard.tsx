"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Heart, Info, Phone, AlertTriangle, CheckCircle2, Clock, Droplet, User, ActivitySquare, Printer, XCircle, Mail } from 'lucide-react';

export default function RiskDashboard() {
  const [formData, setFormData] = useState({
    patientName: '',
    glucoseLevel: '',
    lastMealTime: '',
    insulinTaken: 'no',
    activityLevel: 'medium',
    isAlone: 'no',
    caregiverEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const demoData = {
    patientName: 'Jane Smith',
    glucoseLevel: '52',
    lastMealTime: '4 hours ago',
    insulinTaken: 'yes',
    activityLevel: 'high',
    isAlone: 'yes',
    caregiverEmail: 'caregiver@example.com'
  };

  const handleFillDemo = () => {
    setFormData(demoData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const resData = await res.json();
      if (resData.success) {
        const analysisData = resData.data;
        setResult(analysisData);
        if (analysisData.riskLevel === 'high') {
          setSosActive(true);
          setSosCountdown(10);
        }
        // ── Read email status from Resend API response ──
        setEmailSent(analysisData.emailSent || false);
        setEmailError(analysisData.emailError || null);
      } else {
        setErrorMsg(resData.error || "Error analyzing risk.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosActive && sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => setSosCountdown(sosCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [sosActive, sosCountdown]);

  return (
    <>
      {sosActive && (
        <div className="fixed inset-0 z-[100] bg-red-950/95 backdrop-blur-2xl flex flex-col items-center justify-center text-white animate-[fade-in_0.5s_ease-out_forwards] print:hidden">
          <div className="absolute inset-0 bg-red-600/10 mix-blend-overlay animate-[pulse-glow_3s_ease-in-out_infinite]"></div>
          <AlertTriangle className="text-red-500 mb-8 animate-bounce drop-shadow-[0_0_50px_rgba(239,68,68,0.8)]" size={140} />
          
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-red-50 uppercase drop-shadow-2xl text-center">
            Critical Risk Detected
          </h1>
          <p className="text-xl md:text-2xl text-red-200/80 mb-12 font-medium text-center max-w-2xl px-6">
            Severe hypoglycemia requires immediate action. Automatic emergency dispatch to your Caregiver SMS network is in progress.
          </p>
          
          <div className="relative flex items-center justify-center w-64 h-64 mb-16">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="128" cy="128" r="116" stroke="rgba(239,68,68,0.2)" strokeWidth="12" fill="none" />
              <circle 
                cx="128" 
                cy="128" 
                r="116" 
                stroke="#ef4444" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={728} 
                strokeDashoffset={728 - (728 * (10 - (sosCountdown || 0))) / 10} 
                className="transition-all duration-1000 ease-linear drop-shadow-[0_0_20px_#ef4444]" 
                strokeLinecap="round"
              />
            </svg>
            <span className="text-7xl font-black font-mono tracking-tighter text-red-100 drop-shadow-[0_0_20px_rgba(239,68,68,1)] p-4 bg-red-900/50 rounded-full border border-red-500/30 backdrop-blur-md w-40 h-40 flex items-center justify-center shadow-inner">
              {sosCountdown}
            </span>
          </div>

          {sosCountdown === 0 ? (
            <div className={`text-3xl font-black ${result?.twilioError ? 'text-red-400' : 'text-emerald-400'} animate-[fade-in_0.5s_ease-out_forwards] flex flex-col items-center gap-4 z-10`}>
              {result?.twilioError ? (
                 <>
                   <XCircle size={64} className="drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                   <div className="text-center">
                     DISPATCH FAILED
                     <div className="text-base font-normal text-red-300 mt-4 max-w-lg mx-auto leading-relaxed border border-red-500/30 bg-red-950/50 p-4 rounded-xl">
                       {result?.twilioError}
                     </div>
                   </div>
                 </>
              ) : (
                 <>
                <CheckCircle2 size={64} className="drop-shadow-[0_0_30px_rgba(52,211,153,0.8)] animate-pulse" />
                EMAIL DISPATCHED ✓
              </>
              )}
              <button onClick={() => setSosActive(false)} className="mt-8 px-8 py-3 text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold uppercase tracking-widest transition-all">
                Dismiss Overlay
              </button>
            </div>
          ) : (
            <button onClick={() => setSosActive(false)} className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-white rounded-full font-bold uppercase tracking-widest flex items-center gap-3 transition-all z-10 shadow-2xl">
               <XCircle size={24} className="text-slate-400" /> Cancel Dispatch
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10 w-full animate-[fade-in_1s_ease-out_forwards] print:flex print:flex-col">
      
      {/* LEFT COL: FORM */}
      <div className="xl:col-span-7 glass-card p-8 md:p-10 text-white flex flex-col justify-between print:hidden">
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
              <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-400/30">
                <Activity className="text-brand-400" size={24} />
              </div>
              Vitals Intake
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-sm">Enter comprehensive telemetric parameters for Claude AI risk deduction.</p>
          </div>
          <button 
            type="button"
            title="Auto-fill with demo data"
            onClick={handleFillDemo}
            className="text-xs font-semibold uppercase tracking-wider bg-slate-800/80 hover:bg-brand-600 hover:text-white transition-all px-4 py-2 rounded-full border border-slate-600/50 hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            Load Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Patient Name
              </label>
              <input 
                required
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="premium-input"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2 group relative">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <Heart size={14} className="text-brand-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> 
                Current Glucose <span className="text-slate-500 text-xs font-normal">(mg/dL)</span>
              </label>
              <input 
                required
                type="number"
                name="glucoseLevel"
                value={formData.glucoseLevel}
                onChange={handleChange}
                className="premium-input text-lg font-semibold tracking-wider font-mono placeholder:font-sans"
                placeholder="e.g. 85"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
             <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <Clock size={14} className="text-slate-400" /> Last Meal
              </label>
              <input 
                required
                name="lastMealTime"
                value={formData.lastMealTime}
                onChange={handleChange}
                className="premium-input"
                placeholder="e.g. 2 hours ago"
              />
            </div>
             <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <Mail size={14} className="text-brand-400" /> Caregiver Email
              </label>
              <input 
                required
                type="email"
                name="caregiverEmail"
                value={formData.caregiverEmail}
                onChange={handleChange}
                className="premium-input"
                placeholder="caregiver@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <Droplet size={14} className="text-slate-400" /> Insulin?
              </label>
              <div className="relative">
                <select name="insulinTaken" value={formData.insulinTaken} onChange={handleChange} className="premium-input appearance-none w-full cursor-pointer">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
             <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                 <ActivitySquare size={14} className="text-slate-400" /> Activity
              </label>
              <div className="relative">
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="premium-input appearance-none w-full cursor-pointer bg-transparent">
                  <option className="bg-slate-900" value="low">Low</option>
                  <option className="bg-slate-900" value="medium">Medium</option>
                  <option className="bg-slate-900" value="high">High</option>
                </select>
              </div>
            </div>
             <div className="space-y-2 group">
              <label className="text-sm font-medium text-slate-300 ml-1 flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Alone?
              </label>
              <div className="relative">
                <select name="isAlone" value={formData.isAlone} onChange={handleChange} className="premium-input appearance-none w-full cursor-pointer bg-transparent">
                  <option className="bg-slate-900" value="yes">Yes</option>
                  <option className="bg-slate-900" value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-4 border-t border-slate-700/50">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full text-lg py-4 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
                  Requesting AI Inference
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Launch Neurological Analysis 
                  <Activity size={20} className="group-hover:animate-pulse" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COL: RESULT DASHBOARD */}
      <div className="xl:col-span-5 flex flex-col gap-6 print:w-full">
        
        {errorMsg && (
          <div className="glass-card flex-1 p-12 text-white flex flex-col justify-center items-center text-center glow-danger bg-red-950/20 border-red-500/50">
             <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                <AlertTriangle size={36} className="text-red-400" />
             </div>
             <h3 className="text-xl font-bold text-red-400 tracking-tight">Inference Failed</h3>
             <p className="text-red-300 mt-3 text-sm leading-relaxed max-w-sm">
                {errorMsg}
             </p>
          </div>
        )}

        {!result && !loading && !errorMsg && (
          <div className="glass-card flex-1 p-12 text-white flex flex-col justify-center items-center text-center opacity-80 border-dashed border-2 border-slate-600/30">
             <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
                <Activity size={40} className="text-slate-500" />
             </div>
             <h3 className="text-2xl font-semibold text-slate-300 tracking-tight">System Standby</h3>
             <p className="text-slate-500 max-w-sm mt-3 leading-relaxed">
                Connect your telemetry or manually enter vitals to initiate secure caregiver risk analysis.
             </p>
          </div>
        )}

        {loading && (
          <div className="glass-card flex-1 p-12 text-white flex flex-col justify-center items-center text-center">
             <div className="relative mb-8">
               <div className="w-24 h-24 border-4 border-brand-500/20 rounded-full"></div>
               <div className="w-24 h-24 border-4 border-transparent border-t-brand-400 rounded-full animate-spin absolute inset-0 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Activity size={28} className="text-brand-300 animate-pulse" />
               </div>
             </div>
             <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-100 animate-pulse">Processing Context...</h3>
             <p className="text-brand-500/60 mt-2 text-sm font-mono uppercase tracking-[0.2em]">Claude 3.5 Active</p>
          </div>
        )}

        {result && (
          <div className={`glass-card flex-1 p-8 md:p-10 text-white relative overflow-hidden transition-all duration-700 ${
            result.riskLevel === 'high' ? 'glow-danger bg-red-950/20' : 
            result.riskLevel === 'medium' ? 'glow-warning bg-orange-950/20' : 
            'glow-success bg-green-950/20'
          }`}>
             {/* Dynamic background pulse */}
             <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full mix-blend-screen opacity-40 pointer-events-none ${
                result.riskLevel === 'high' ? 'bg-red-500' :
                result.riskLevel === 'medium' ? 'bg-orange-500' :
                'bg-emerald-500'
             }`}></div>

             <div className="flex justify-between items-start mb-8 relative z-10">
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Automated Assessment</h3>
                  <div className="flex items-center gap-3">
                    {result.riskLevel === 'high' && <AlertTriangle className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" size={36} />}
                    {result.riskLevel === 'medium' && <Activity className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" size={36} />}
                    {result.riskLevel === 'low' && <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" size={36} />}
                    <span className={`text-5xl font-black uppercase tracking-tighter ${
                      result.riskLevel === 'high' ? 'text-red-500' : 
                      result.riskLevel === 'medium' ? 'text-orange-500' : 
                      'text-emerald-400'
                    }`}>
                      {result.riskLevel}
                    </span>
                  </div>
               </div>
               {emailSent && (
                 <div className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                   <Mail size={12} className="animate-pulse" /> EMAIL SENT ✓
                 </div>
               )}
               {emailError && (
                 <div className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-red-500/10 text-red-300 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]" title={emailError}>
                   <Mail size={12} /> EMAIL FAILED
                 </div>
               )}
             </div>

             <div className="space-y-6 relative z-10">
                <div className="p-5 rounded-2xl bg-black/20 border-l-4 border-slate-600/50 backdrop-blur-md">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                    <Activity size={14} className="text-brand-500" /> Current Condition
                  </h4>
                  <p className="text-slate-100 text-lg font-medium leading-relaxed">
                    {result.happening}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-2xl ${
                  result.riskLevel === 'high' ? 'bg-red-500/10 border-red-500/50' : 
                  result.riskLevel === 'medium' ? 'bg-orange-500/10 border-orange-500/50' : 
                  'bg-emerald-500/10 border-emerald-500/50'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
                     result.riskLevel === 'high' ? 'text-red-400' : 
                     result.riskLevel === 'medium' ? 'text-orange-400' : 
                     'text-emerald-400'
                  }`}>
                    <AlertTriangle size={14} /> Caregiver Directive
                  </h4>
                  <p className={`text-xl font-bold leading-snug drop-shadow-sm ${
                    result.riskLevel === 'high' ? 'text-red-100' : 
                    result.riskLevel === 'medium' ? 'text-orange-100' : 
                    'text-emerald-100'
                  }`}>
                    {result.caregiverAction}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                    <Info size={14} /> Profile Context Used
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-mono">
                    {result.context}
                  </p>
                </div>

                {result.detailedPatientSummary && (
                  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-md print:break-inside-avoid print:bg-slate-50 print:border-slate-300">
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-400 mb-2 flex items-center gap-2 print:text-slate-800">
                      <User size={14} /> Detailed Clinical Assessment
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed font-sans print:text-slate-900">
                      {result.detailedPatientSummary}
                    </p>
                  </div>
                )}

                 <button onClick={() => window.print()} className="mt-8 w-full btn-primary !bg-gradient-to-r !from-slate-800 !to-slate-900 border-slate-700 hover:border-brand-500 py-4 flex items-center justify-center gap-3 font-semibold uppercase tracking-wider text-sm rounded-xl print:hidden shadow-xl hover:shadow-brand-500/20 group">
                   <Printer size={20} className="group-hover:animate-bounce" /> Print Official Medical Report
                 </button>
             </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
