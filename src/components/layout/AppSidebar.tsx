'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppUiStore } from '@/lib/hooks/use-api';
import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  Bot,
  Pill,
  Settings,
  User,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Scan', href: '/analysis/new', icon: Upload },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'AI Assistant', href: '/assistant', icon: Bot, badge: 'AI' },
  { name: 'Drug Scanner', href: '/drug-scanner', icon: Pill },
];

const SECONDARY_ITEMS = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin Console', href: '/admin/dashboard', icon: Shield },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppUiStore();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 z-30 h-screen sticky top-0',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md shadow-cyan-500/20 flex-shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          {sidebarOpen && (
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              MediLens <span className="text-cyan-400">AI</span>
            </span>
          )}
        </Link>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-6">
        <div>
          {sidebarOpen && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Main Navigation
            </p>
          )}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')} />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}

                  {item.badge && sidebarOpen && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {sidebarOpen && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Account & Admin
            </p>
          )}
          <nav className="space-y-1">
            {SECONDARY_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200')} />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile Mini Card */}
      {sidebarOpen && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
              DR
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">Dr. Elena Rostova</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Attending Radiologist</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
