'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, Cpu, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              MediLens <span className="text-cyan-400 font-extrabold">AI</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#explainability" className="hover:text-cyan-400 transition-colors">Explainable AI</a>
          <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
        </nav>

        {/* CTA & Theme toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="gap-2">
              <span>Launch Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
