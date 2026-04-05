"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeartPulse, Lock, Mail, User, ArrowRight, Activity } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // In a real app we'd POST to an API to save the user to a DB.
  // Since we use mock users, we just "log them in" generically.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock API delay for registration feel
    await new Promise(r => setTimeout(r, 1000));

    // Instantly log them in with what they typed
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!res?.error) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10 md:pt-20 px-4 relative z-10 animate-[fade-up_0.5s_ease-out_forwards]">
      <div className="glass-card p-8 md:p-10 text-white relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <HeartPulse className="text-indigo-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create an Account</h1>
          <p className="text-slate-400 text-sm">Sign up to keep your loved ones safe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2 group relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
              <User size={14} className="group-focus-within:text-indigo-400 transition-colors" /> Full Name
            </label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="premium-input bg-slate-950/50 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-2 group relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
              <Mail size={14} className="group-focus-within:text-indigo-400 transition-colors" /> Email Address
            </label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="premium-input bg-slate-950/50 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              placeholder="jane@example.com"
            />
          </div>

          <div className="space-y-2 group relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
              <Lock size={14} className="group-focus-within:text-indigo-400 transition-colors" /> Password
            </label>
            <input 
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="premium-input bg-slate-950/50 focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wider uppercase text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10 border-t border-slate-700/50 pt-8">
          <p className="text-sm text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline underline-offset-4 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
