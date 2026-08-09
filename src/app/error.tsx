'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCw, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">System Encountered an Error</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 mb-6">
        An unexpected application error occurred while processing requests.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
