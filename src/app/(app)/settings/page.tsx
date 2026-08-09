'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Moon, Bell, Lock, Shield, Eye, Smartphone, Laptop, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [reportNotifs, setReportNotifs] = useState(true);
  const [modelUpdates, setModelUpdates] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Security settings and password updated!');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure workspace appearance, alert preferences, and security</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-white">Appearance & Theme</h3>
              <p className="text-xs text-slate-400">Select default interface theme for medical workspace</p>
            </div>
            <Badge variant="default">System Default</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Moon className="h-6 w-6" />
              <span className="text-xs">Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sun className="h-6 w-6" />
              <span className="text-xs">Light Mode</span>
            </button>
          </div>
        </Card>

        {/* Notifications Settings */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Notifications & Alerts</h3>
            <p className="text-xs text-slate-400">Manage real-time inference completion dispatches</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">Email Analysis Alerts</p>
                <p className="text-slate-400">Receive instant email notifications upon completion of AI scan processing.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-950 border-slate-800 text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
              <div>
                <p className="font-semibold text-slate-200">Report Ready Summaries</p>
                <p className="text-slate-400">Send PDF summaries to patient chart dispatch queue.</p>
              </div>
              <input
                type="checkbox"
                checked={reportNotifs}
                onChange={(e) => setReportNotifs(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-950 border-slate-800 text-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
              <div>
                <p className="font-semibold text-slate-200">AI Model Registry Updates</p>
                <p className="text-slate-400">Notify when new model versions (e.g. Grad-CAM updates) are deployed.</p>
              </div>
              <input
                type="checkbox"
                checked={modelUpdates}
                onChange={(e) => setModelUpdates(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-950 border-slate-800 text-cyan-500"
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Security & Password</h3>
            <p className="text-xs text-slate-400">Update account password and active session tokens</p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="text-xs">
                Update Password
              </Button>
            </div>
          </form>

          {/* Active Sessions UI */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Active Device Sessions</h4>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="h-5 w-5 text-cyan-400" />
                <div>
                  <p className="font-semibold text-slate-200">macOS Sonoma • Chrome Browser</p>
                  <p className="text-[10px] text-slate-500">Current active session • IP 192.168.1.42</p>
                </div>
              </div>
              <Badge variant="success">Active Now</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
