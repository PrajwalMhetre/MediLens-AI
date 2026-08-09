'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/lib/hooks/use-api';
import { User, Mail, Shield, Building, Calendar, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: user } = useUserProfile();

  const [name, setName] = useState(user?.name || 'Dr. Elena Rostova');
  const [role, setRole] = useState(user?.role || 'Radiologist');
  const [hospital, setHospital] = useState(user?.hospital || 'Metropolitan University Medical Center');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile details updated successfully!');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Profile & Account</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage professional credentials and institutional affiliations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Avatar Card */}
        <Card className="border-slate-800 bg-slate-900/90 p-6 text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-1 mx-auto shadow-xl">
            <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400 font-extrabold text-2xl">
              DR
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white">{name}</h3>
            <Badge variant="accent">{role}</Badge>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-400" />
              <span className="truncate">{user?.email || 'elena.rostova@medilens.ai'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-400" />
              <span className="truncate">{hospital}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Member since {user?.memberSince || 'January 2025'}</span>
            </div>
          </div>
        </Card>

        {/* Right Form Card */}
        <Card className="md:col-span-2 border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">Edit Professional Details</h3>
            <p className="text-xs text-slate-400">Update how your name appears on generated clinical reports.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Full Name & Credentials</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Primary Role / Title</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Radiologist">Attending Radiologist</option>
                <option value="Physician">Clinical Physician</option>
                <option value="Medical Student">Resident / Fellow</option>
                <option value="Administrator">Department Chair</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Hospital / Institutional Affiliation</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button type="submit" disabled={saving} className="gap-2 text-xs">
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
