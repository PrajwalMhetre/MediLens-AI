'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Shield,
  Users,
  Activity,
  Cpu,
  ArrowLeft,
  LayoutDashboard,
  Server,
  Sparkles,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Scan Analytics', href: '/admin/analyses', icon: Activity },
  { name: 'AI Model Registry', href: '/admin/models', icon: Cpu },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Admin Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to App</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-500 to-purple-600 p-0.5">
              <div className="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center text-rose-400">
                <Shield className="h-4 w-4" />
              </div>
            </div>
            <span className="font-extrabold text-base text-white">Admin Console</span>
            <Badge variant="destructive" className="text-[10px]">Restricted</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <Server className="h-4 w-4" />
          <span>Nodes Healthy (99.98%)</span>
        </div>
      </header>

      {/* Admin Nav Sub-bar */}
      <div className="border-b border-slate-800/80 bg-slate-950 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
