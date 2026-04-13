'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Target, Smartphone, Bot, Trophy, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col px-6 py-12 md:py-24 max-w-6xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          {/* Hero Text */}
          <div className="flex-1 space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Spot the fraud.<br />
              <span className="text-blue-600">Protect yourself.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
              Realistic simulations. Instant AI feedback. 
              The most effective way to learn online safety.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/training"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                id="start-training-btn"
              >
                <Target size={18} />
                Get Started
              </Link>
              
              <Link
                href="/leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          {/* Decorative Visual Element - Offset Cards */}
          <div className="flex-1 relative hidden lg:flex items-center justify-center p-8">
            <div className="relative group">
              {/* Glow background */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[3rem] opacity-20 blur-2xl transition duration-500 group-hover:opacity-30 group-hover:blur-3xl animate-pulse-gentle"></div>
              
              <div className="relative bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 transform -rotate-3 transition-transform duration-500 group-hover:rotate-0">
                <img 
                  src="/logo.png" 
                  alt="ScamShield Logo" 
                  className="w-full max-w-sm h-auto object-contain drop-shadow-xl" 
                />
              </div>

              {/* Decorative floating badges */}
              <div className="absolute -top-6 -right-6 h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 animate-bounce-slow">
                <ShieldCheck className="text-white" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Features as a staggered list */}
        <div className="mt-32 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 border-l-2 border-slate-100 pl-6 hover:border-blue-600 transition-colors py-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">01 / Scenarios</h3>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              We generate realistic text and email threads based on current fraud trends around the world.
            </p>
          </div>

          <div className="space-y-4 border-l-2 border-slate-100 pl-6 hover:border-amber-500 transition-colors py-2 md:translate-y-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">02 / AI Logic</h3>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              Every decision you make is analyzed by our model to teach you the "why" behind every red flag.
            </p>
          </div>

          <div className="space-y-4 border-l-2 border-slate-100 pl-6 hover:border-emerald-500 transition-colors py-2 lg:translate-y-16">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">03 / Progress</h3>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              Track your growth over time. The more you practice, the more intuitive detection becomes.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
