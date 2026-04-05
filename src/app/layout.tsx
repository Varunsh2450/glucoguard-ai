import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MouseGlow from '@/components/MouseGlow';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GlucoGuard — Hypoglycemia Caregiver Alert System',
  description: 'Premium AI-powered hypoglycemia risk assessment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen selection:bg-brand-500/30 selection:text-brand-200 print:bg-white print:text-black`}>
        {/* Breathtaking Animated Aurora Background */}
        <div className="aurora-bg print:hidden" />
        
        {/* Grain overlay for composite texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[-5] print:hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <MouseGlow />

        <div className="print:hidden"><Navbar /></div>
        
        <main className="flex flex-col pt-32 pb-16 min-h-[calc(100vh-100px)] px-4 sm:px-6 print:pt-0 print:pb-0">
          {children}
        </main>
        
        <div className="print:hidden"><Footer /></div>
      </body>
    </html>
  );
}
