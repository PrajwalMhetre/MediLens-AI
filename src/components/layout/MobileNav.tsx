'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  Bot,
  Pill,
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Scan', href: '/analysis/new', icon: Upload },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Assistant', href: '/assistant', icon: Bot },
  { name: 'Drug OCR', href: '/drug-scanner', icon: Pill },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors flex-1 text-center',
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Icon className={cn('h-5 w-5 mb-0.5', isActive ? 'text-cyan-400' : 'text-slate-400')} />
            <span className="text-[10px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
