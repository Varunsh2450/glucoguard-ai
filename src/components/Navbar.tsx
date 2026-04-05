"use client";

import Link from 'next/link';
import { Activity, LogOut, User } from 'lucide-react';
import ScrollProgress from '@/components/ScrollProgress';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { i18n, t } = useTranslation();

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0 border-white/10">
      <ScrollProgress />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500/20 p-2 rounded-xl group-hover:bg-brand-500/40 transition">
            <Activity className="text-brand-400 group-hover:text-brand-300 transition" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-50 transition">
            {t('app_name', 'GlucoGuard')} <span className="text-brand-400">+</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition">Home</Link>
          <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-brand-400 transition">How it Works</Link>
          
          <div className="flex border border-slate-700/50 rounded-md overflow-hidden bg-slate-900/50">
            <button onClick={() => changeLang('en')} className={`px-2 py-1 text-xs font-bold transition ${i18n.language === 'en' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>🇬🇧 EN</button>
            <button onClick={() => changeLang('hi')} className={`px-2 py-1 text-xs font-bold border-l border-r border-slate-700/50 transition ${i18n.language === 'hi' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>🇮🇳 हिं</button>
            <button onClick={() => changeLang('kn')} className={`px-2 py-1 text-xs font-bold transition ${i18n.language === 'kn' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>🇮🇳 ಕನ್ನಡ</button>
          </div>

          {status === "loading" ? (
             <div className="h-10 w-32 bg-white/5 rounded-full animate-pulse"></div>
          ) : session ? (
             <div className="flex items-center gap-6 border-l border-white/10 pl-6">
                <Link href="/dashboard" className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full transition shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700">
                     <User size={14} className="text-slate-400" />
                  </div>
                  <span className="text-sm font-bold truncate max-w-[100px]">{session.user?.name}</span>
                </div>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-slate-400 hover:text-red-400 transition ml-2" title="Sign Out">
                   <LogOut size={18} />
                </button>
             </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-white px-5 py-2.5 rounded-full transition">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-full transition shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
