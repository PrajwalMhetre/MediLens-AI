'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Laptop, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reportNotifs, setReportNotifs] = useState(true);
  const [modelUpdates, setModelUpdates] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) return toast.error(error.message);
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure workspace appearance, alert preferences, and security</p>
      </div>

      <div className="space-y-6">
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div><h3 className="font-bold text-base text-white">Appearance & Theme</h3><p className="text-xs text-slate-400">Select default interface theme</p></div>
            <Badge variant="default">UI</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold' : 'border-slate-800 bg-slate-950/60 text-slate-400'}`}><Moon className="h-6 w-6" /><span className="text-xs">Dark Mode</span></button>
            <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold' : 'border-slate-800 bg-slate-950/60 text-slate-400'}`}><Sun className="h-6 w-6" /><span className="text-xs">Light Mode</span></button>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3"><h3 className="font-bold text-base text-white">Notifications & Alerts</h3></div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between"><p className="font-semibold text-slate-200">Email Analysis Alerts</p><input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} /></div>
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3"><p className="font-semibold text-slate-200">Report Ready Summaries</p><input type="checkbox" checked={reportNotifs} onChange={(e) => setReportNotifs(e.target.checked)} /></div>
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3"><p className="font-semibold text-slate-200">AI Model Registry Updates</p><input type="checkbox" checked={modelUpdates} onChange={(e) => setModelUpdates(e.target.checked)} /></div>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3"><h3 className="font-bold text-base text-white flex items-center gap-2"><Lock className="h-4 w-4 text-cyan-400" />Security & Password</h3><p className="text-xs text-slate-400">Update the current authenticated user's password</p></div>
          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="font-semibold text-slate-300">New Password</label><input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" /></div>
              <div className="space-y-1"><label className="font-semibold text-slate-300">Confirm Password</label><input type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" /></div>
            </div>
            <div className="flex justify-end pt-2"><Button type="submit" size="sm" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</Button></div>
          </form>
          <div className="pt-4 border-t border-slate-800"><div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs"><Laptop className="h-5 w-5 text-cyan-400" /><div><p className="font-semibold text-slate-200">Current authenticated browser</p><p className="text-[10px] text-slate-500">Session managed by Supabase Auth cookies</p></div><Badge variant="success" className="ml-auto">Active</Badge></div></div>
        </Card>
      </div>
    </div>
  );
}
