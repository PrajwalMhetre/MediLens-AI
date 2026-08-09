'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
        <Activity className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 mb-8">
        The requested medical route or document could not be located in the system registry.
      </p>
      <Link href="/dashboard">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
}
