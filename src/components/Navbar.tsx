import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500/20 p-2 rounded-xl group-hover:bg-brand-500/40 transition">
            <Activity className="text-brand-400 group-hover:text-brand-300 transition" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-50 transition">
            GlucoGuard <span className="text-brand-400">+</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition">Home</Link>
          <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">How it Works</Link>
          <Link href="/dashboard" className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full transition shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40">
            Launch Platform
          </Link>
        </div>
      </div>
    </nav>
  );
}
