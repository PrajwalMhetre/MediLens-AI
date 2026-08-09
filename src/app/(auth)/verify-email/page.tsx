'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Activity, MailCheck, ArrowRight, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance focus
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      toast.success('Email verified successfully!');
      router.push('/dashboard');
    }, 600);
  };

  const handleResend = () => {
    toast.info('New verification code sent to your email.');
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
        <span className="font-bold text-2xl text-white tracking-tight">
          MediLens <span className="text-cyan-400">AI</span>
        </span>
      </Link>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-1">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-2">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold text-white">Verify Your Email</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Enter the 6-digit security code sent to your registered inbox
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleVerify}>
          <CardContent className="space-y-6 pt-2">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
              ))}
            </div>

            <p className="text-xs text-center text-slate-500">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                <RotateCw className="h-3 w-3" />
                <span>Resend Code</span>
              </button>
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={verifying} className="w-full gap-2">
              {verifying ? 'Verifying Code...' : 'Complete Verification'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
