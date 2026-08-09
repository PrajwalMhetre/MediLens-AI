'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppUiStore, useAnalyses, useReports } from '@/lib/hooks/use-api';
import { Search, X, FileText, Activity, Bot, Upload, ChevronRight } from 'lucide-react';

export function SearchModal() {
  const router = useRouter();
  const { searchModalOpen, setSearchModalOpen } = useAppUiStore();
  const [query, setQuery] = useState('');
  const { data: analyses } = useAnalyses();
  const { data: reports } = useReports();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!searchModalOpen);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  if (!searchModalOpen) return null;

  const filteredAnalyses = (analyses || []).filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.patientId.toLowerCase().includes(query.toLowerCase()) ||
      a.scanType.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReports = (reports || []).filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.patientId.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (path: string) => {
    setSearchModalOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scans by patient ID, scan type, or title..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Links & Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Quick Commands</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('/analysis/new')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-cyan-500/10 hover:border-cyan-500/30 flex items-center gap-3 transition-colors text-left"
                >
                  <Upload className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-200">Upload New Scan</span>
                </button>

                <button
                  onClick={() => navigateTo('/assistant')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-500/10 hover:border-purple-500/30 flex items-center gap-3 transition-colors text-left"
                >
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-200">Ask AI Assistant</span>
                </button>
              </div>
            </div>
          )}

          {/* Analyses Section */}
          {filteredAnalyses.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Matching Scans</p>
              <div className="space-y-1">
                {filteredAnalyses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigateTo(`/analysis/${item.id}`)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="text-[10px] text-slate-400">{item.patientId} • {item.scanType}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Section */}
          {filteredReports.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Matching Reports</p>
              <div className="space-y-1">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => navigateTo(`/reports/${report.id}`)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{report.title}</p>
                        <p className="text-[10px] text-slate-400">{report.patientId} • {report.scanType}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
