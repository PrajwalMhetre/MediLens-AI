'use client';

import Link from 'next/link';
import { Activity, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center"><Activity className="h-6 w-6 text-cyan-400" /></div>
        </div>
        <span className="font-bold text-2xl text-white tracking-tight">MediLens <span className="text-cyan-400">AI</span></span>
      </Link>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto"><MailCheck className="h-6 w-6" /></div>
          <CardTitle className="text-xl font-bold text-white">Verify Your Email</CardTitle>
          <CardDescription className="text-xs text-slate-400">We sent a verification link to your email address. Open it to activate your MediLens AI account.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-xs text-slate-500">After verification, you will be signed in and redirected to the dashboard.</CardContent>
        <CardFooter>
          <Link href="/login" className="w-full"><Button variant="outline" className="w-full">Return to Sign In</Button></Link>
        </CardFooter>
      </Card>
    </div>
  );
}
