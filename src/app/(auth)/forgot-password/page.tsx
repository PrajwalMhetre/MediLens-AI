'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
    toast.success('Password reset email sent.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        <span className="font-bold text-2xl text-white tracking-tight">MediLens <span className="text-cyan-400">AI</span></span>
      </Link>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-xs text-slate-400">Enter your institutional email to receive reset instructions</CardDescription>
        </CardHeader>

        {submitted ? (
          <CardContent className="space-y-4 text-center py-6">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">If an account exists for <span className="text-cyan-400 font-semibold">{email}</span>, you will receive a secure password reset link.</p>
            <Link href="/login" className="block pt-4">
              <Button variant="outline" className="w-full gap-2"><ArrowLeft className="h-4 w-4" /><span>Return to Sign In</span></Button>
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hospital.org" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending Request...' : 'Send Recovery Email'}</Button>
              <Link href="/login" className="text-xs text-center text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1"><ArrowLeft className="h-3.5 w-3.5" /><span>Back to Sign In</span></Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
