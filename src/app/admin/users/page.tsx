'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const usersList = [
    { id: 'usr-901', name: 'Dr. Elena Rostova', email: 'elena.rostova@medilens.ai', role: 'Radiologist', hospital: 'Metropolitan Medical Center', status: 'Active' },
    { id: 'usr-902', name: 'Dr. Marcus Vance', email: 'm.vance@neuro.org', role: 'Neuroradiologist', hospital: 'St. Jude General Hospital', status: 'Active' },
    { id: 'usr-903', name: 'Dr. Sarah Jenkins', email: 's.jenkins@radiology.org', role: 'Attending Radiologist', hospital: 'Johns Hopkins Medical Center', status: 'Active' },
    { id: 'usr-904', name: 'Dr. Rahul Sharma', email: 'r.sharma@health.gov', role: 'Physician', hospital: 'AIIMS Research Hospital', status: 'Pending Review' },
  ];

  const filtered = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">User & Role Management</h1>
          <p className="text-xs text-slate-400">Review clinician credentials and permission roles</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Users Table */}
      <Card className="border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Institutional Email</th>
                <th className="p-3.5">Clinical Role</th>
                <th className="p-3.5">Hospital</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                      {u.name.slice(3, 5)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3.5 text-slate-400">{u.email}</td>
                  <td className="p-3.5"><Badge variant="accent">{u.role}</Badge></td>
                  <td className="p-3.5">{u.hospital}</td>
                  <td className="p-3.5"><Badge variant={u.status === 'Active' ? 'success' : 'warning'}>{u.status}</Badge></td>
                  <td className="p-3.5 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing user: ${u.name}`)} className="text-[11px] h-7">
                      Edit Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
