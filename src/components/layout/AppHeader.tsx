'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAppUiStore, useUserProfile } from '@/lib/hooks/use-api';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Shield,
  Upload,
  Activity,
  CheckCircle2,
  AlertCircle,
  Menu,
} from 'lucide-react';
import { SearchModal } from '@/components/layout/SearchModal';
import { toast } from 'sonner';

export function AppHeader() {
  const { theme, setTheme } = useTheme();
  const { setSearchModalOpen, toggleSidebar } = useAppUiStore();
  const { data: user } = useUserProfile();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Analysis Complete',
      desc: 'Chest Radiograph PT-88392 processed.',
      time: '5m ago',
      type: 'success',
    },
    {
      id: '2',
      title: 'Model Retrained',
      desc: 'MediVision-CXR updated to v2.4.1.',
      time: '1h ago',
      type: 'info',
    },
    {
      id: '3',
      title: 'System Health Good',
      desc: '99.98% uptime across inference nodes.',
      time: '3h ago',
      type: 'system',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-20 w-full h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        {/* Left Mobile Menu & Search trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-400 hover:border-slate-700 transition-colors text-xs w-48 sm:w-64"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left truncate">Search scans, reports...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Link href="/analysis/new">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all">
              <Upload className="h-3.5 w-3.5" />
              <span>New Scan</span>
            </button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors relative"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Notifications</span>
                  <span className="text-[10px] text-cyan-400">3 New</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{n.desc}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu Link */}
          <Link href="/profile" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 cursor-pointer">
              <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DR'}
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal />
    </>
  );
}
