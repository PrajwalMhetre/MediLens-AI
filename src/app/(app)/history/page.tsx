'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/badge';
import { useAnalyses } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import { History, Search, Activity, Eye, FileText, Calendar } from 'lucide-react';

export default function HistoryPage() {
  const { data: analyses, isLoading } = useAnalyses();
  const [search, setSearch] = useState('');
  const [selectedScanType, setSelectedScanType] = useState('All');

  const filteredAnalyses = (analyses || []).filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.patientId.toLowerCase().includes(search.toLowerCase()) ||
      a.overallPrediction.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedScanType === 'All' || a.scanType === selectedScanType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analysis History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete archive of interpreted medical scans and predictions</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient ID, scan title, prediction..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedScanType}
          onChange={(e) => setSelectedScanType(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Modalities</option>
          <option value="Chest X-Ray">Chest X-Ray</option>
          <option value="Brain MRI">Brain MRI</option>
          <option value="Knee MRI">Knee MRI</option>
          <option value="Thyroid Ultrasound">Thyroid Ultrasound</option>
        </select>
      </div>

      {/* Timeline Table */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <Card className="p-12 text-center border-slate-800 bg-slate-900/60 space-y-3">
          <History className="h-10 w-10 text-slate-500 mx-auto" />
          <p className="font-semibold text-sm text-slate-300">No analysis history found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredAnalyses.map((item) => (
            <Card
              key={item.id}
              className="border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 transition-colors p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-100 truncate">{item.title}</h3>
                    <Badge variant={item.scanType === 'Chest X-Ray' ? 'default' : 'secondary'}>
                      {item.scanType}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">{item.overallPrediction}</p>
                  <p className="text-[10px] text-slate-500">
                    Patient ID: <span className="font-mono text-slate-400">{item.patientId}</span> • {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-bold text-cyan-400">
                  {(item.overallConfidence * 100).toFixed(1)}%
                </span>
                <Link href={`/analysis/${item.id}`}>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Workspace</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
