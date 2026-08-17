'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const updatePassword = async (event: FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Password updated successfully.');
    router.replace('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5">
          <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
        <span className="font-bold text-2xl text-white tracking-tight">MediLens <span className="text-cyan-400">AI</span></span>
      </Link>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">Set New Password</CardTitle>
          <CardDescription className="text-xs text-slate-400">Choose a new password for your account.</CardDescription>
        </CardHeader>
        <form onSubmit={updatePassword}>
          <CardContent className="space-y-4">
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              <input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Updating...' : 'Update Password'}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
