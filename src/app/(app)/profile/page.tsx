'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/lib/hooks/use-api';
import { Mail, Building, Calendar, Save } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/lib/api/services';

export default function ProfilePage() {
  const { data: user, refetch } = useUserProfile();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Radiologist' | 'Physician' | 'Medical Student' | 'Administrator'>('Physician');
  const [hospital, setHospital] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setRole(user.role);
    setHospital(user.hospital);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.updateUserProfile({ name, role, hospital });
      await refetch();
      toast.success('Profile details updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = name ? name.slice(0, 2).toUpperCase() : 'DR';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Profile & Account</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage professional credentials and institutional affiliations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900/90 p-6 text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-1 mx-auto shadow-xl">
            <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400 font-extrabold text-2xl">{initials}</div>
          </div>
          <div className="space-y-1"><h3 className="font-bold text-lg text-white">{name || 'Authenticated User'}</h3><Badge variant="accent">{role}</Badge></div>
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2 text-left">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-400" /><span className="truncate">{user?.email || ''}</span></div>
            <div className="flex items-center gap-2"><Building className="h-4 w-4 text-purple-400" /><span className="truncate">{hospital || 'Not set'}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-400" /><span>Member since {user?.memberSince || ''}</span></div>
          </div>
        </Card>

        <Card className="md:col-span-2 border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="space-y-1"><h3 className="font-bold text-base text-white">Edit Professional Details</h3><p className="text-xs text-slate-400">Changes are saved to your Supabase Auth user metadata.</p></div>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1"><label className="font-semibold text-slate-300">Full Name & Credentials</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" /></div>
            <div className="space-y-1"><label className="font-semibold text-slate-300">Primary Role / Title</label><select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white"><option value="Radiologist">Attending Radiologist</option><option value="Physician">Clinical Physician</option><option value="Medical Student">Resident / Fellow</option><option value="Administrator">Department Chair</option></select></div>
            <div className="space-y-1"><label className="font-semibold text-slate-300">Hospital / Institutional Affiliation</label><input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white" /></div>
            <div className="flex justify-end pt-4 border-t border-slate-800"><Button type="submit" disabled={saving} className="gap-2 text-xs"><Save className="h-4 w-4" />{saving ? 'Saving Changes...' : 'Save Profile'}</Button></div>
          </form>
        </Card>
      </div>
    </div>
  );
}
