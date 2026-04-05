import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 pt-20 animate-[fade-up_0.8s_ease-out_forwards]">
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How GlucoGuard Works</h1>
        <p className="text-slate-400 text-lg">The science and technology bridging the gap between critical events and rapid response.</p>
      </header>

      <div className="space-y-12 relative z-10">
         <div className="glass-card p-10 flex flex-col md:flex-row gap-8 items-center group">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/20 text-brand-400 flex items-center justify-center text-2xl font-bold border border-brand-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Input Contextual Vitals</h3>
              <p className="text-slate-400 leading-relaxed">
                 Numbers standalone are not always enough. A 70mg/dL glucose reading after a meal is entirely different from a 70mg/dL reading after extreme cardiovascular exercise while alone. We consume all this data rapidly.
              </p>
            </div>
         </div>

         <div className="glass-card p-10 flex flex-col md:flex-row gap-8 items-center group">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold border border-purple-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Anthropic Claude Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                 Using state-of-the-art LLMs trained on medical logic, we feed your precise context vectors to analyze the likelihood of impending severe hypoglycemia, grading the exact threat level immediately and producing clinical intervention steps.
              </p>
            </div>
         </div>

         <div className="glass-card p-10 flex flex-col md:flex-row gap-8 items-center group">
            <div className="w-16 h-16 rounded-3xl bg-green-500/20 text-green-400 flex items-center justify-center text-2xl font-bold border border-green-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Automated SMS Care Alerts</h3>
              <p className="text-slate-400 leading-relaxed">
                 If the AI determines the risk is medium or high, it triggers our Twilio integration. Within milliseconds, predefined caregivers receive an SMS containing the risk severity, exactly what is happening, and the medical directive on what to do next.
              </p>
            </div>
         </div>
      </div>

      <div className="mt-20 text-center pb-20">
         <Link href="/dashboard" className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
           Try the Dashboard Free
         </Link>
      </div>
    </div>
  );
}
