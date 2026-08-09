'use client';

import React from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileNav } from '@/components/layout/MobileNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Desktop Navigation Sidebar */}
      <AppSidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Floating Bottom Bar */}
      <MobileNav />
    </div>
  );
}
