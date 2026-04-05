import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/50 mt-20 relative z-10 w-full backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            GlucoGuard <span className="text-brand-400">+</span>
          </span>
          <p className="text-slate-500 text-sm max-w-sm">
            Empowering real-time medical risk assessment through AI and continuous caregiver connectivity.
          </p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-slate-400">
           <Link href="/" className="hover:text-brand-400 transition">Home</Link>
           <Link href="/about" className="hover:text-brand-400 transition">About</Link>
           <Link href="/dashboard" className="hover:text-brand-400 transition">App</Link>
        </div>

        <div className="text-sm text-slate-500 flex items-center gap-1.5">
          Built with <Heart size={14} className="text-red-500" /> for Healthcare.
        </div>
      </div>
    </footer>
  );
}
