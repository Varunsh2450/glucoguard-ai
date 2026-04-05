import RiskDashboard from '@/components/RiskDashboard';

export default function DashboardPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 animate-[fade-up_0.8s_ease-out_forwards] flex flex-col pt-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Live AI Assessment</h1>
        <p className="text-slate-400">Enter patient vitals below for real-time inference and caregiver notification.</p>
      </header>
      
      <RiskDashboard />
    </div>
  );
}
