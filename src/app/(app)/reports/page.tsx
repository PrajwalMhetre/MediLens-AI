'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/badge';
import { useReports } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import { FileText, Search, Download, Eye, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [scanFilter, setScanFilter] = useState<string>('All');

  const filteredReports = (reports || []).filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.radiologistName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesScan = scanFilter === 'All' || r.scanType === scanFilter;
    return matchesSearch && matchesStatus && matchesScan;
  });

  const handleDownload = (id: string, title: string) => {
    toast.success(`Preparing PDF download for report: ${title}`);
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Clinical Reports</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search, review, and export standardized diagnostic summaries</p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, patient ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Scan Type Filter */}
        <select
          value={scanFilter}
          onChange={(e) => setScanFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Scan Modalities</option>
          <option value="Chest X-Ray">Chest X-Ray</option>
          <option value="Brain MRI">Brain MRI</option>
          <option value="Knee MRI">Knee MRI</option>
          <option value="Thyroid Ultrasound">Thyroid Ultrasound</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Report Statuses</option>
          <option value="Finalized">Finalized</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Reports Listing Table / Card Grid */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filteredReports.length === 0 ? (
        <Card className="p-12 text-center border-slate-800 bg-slate-900/60 space-y-3">
          <FileText className="h-10 w-10 text-slate-500 mx-auto" />
          <p className="font-semibold text-sm text-slate-300">No matching reports found</p>
          <p className="text-xs text-slate-500">Try clearing search filters or generate a report from any scan analysis.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 transition-colors p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-slate-100 truncate">{report.title}</h3>
                    <Badge variant={report.status === 'Finalized' ? 'success' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{report.summary}</p>
                  <p className="text-[10px] text-slate-500">
                    Patient: <span className="font-mono text-slate-300">{report.patientId}</span> • {report.scanType} • {formatDate(report.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                <Link href={`/reports/${report.id}`}>
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Report</span>
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleDownload(report.id, report.title)}
                  className="gap-1 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
