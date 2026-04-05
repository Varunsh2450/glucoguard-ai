"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10 md:pt-20 px-4 relative z-10 animate-[fade-up_0.5s_ease-out_forwards]">
      <div className="glass-card p-8 md:p-10 text-white relative overflow-hidden">
        
        {/* Decorative background flare */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 mb-6 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
            <Activity className="text-brand-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-[fade-in_0.3s_ease-out]">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-sm font-medium text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2 group relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
              <Mail size={14} className="group-focus-within:text-brand-400 transition-colors" /> Email Address
            </label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input bg-slate-950/50"
              placeholder="demo@test.com"
            />
          </div>

          <div className="space-y-2 group relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
              <Lock size={14} className="group-focus-within:text-brand-400 transition-colors" /> Password
            </label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input bg-slate-950/50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-sm tracking-wider uppercase disabled:opacity-70 disabled:cursor-not-allowed group relative mt-4 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10 border-t border-slate-700/50 pt-8">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold hover:underline underline-offset-4 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
