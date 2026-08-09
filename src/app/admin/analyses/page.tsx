'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAnalyses } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import { Activity, Eye } from 'lucide-react';

export default function AdminAnalysesPage() {
  const { data: analyses } = useAnalyses();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white">System Scan Log</h1>
        <p className="text-xs text-slate-400">Complete platform-wide audit log of processed medical images</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Scan Title</th>
                <th className="p-3.5">Patient Reference</th>
                <th className="p-3.5">Modality</th>
                <th className="p-3.5">AI Confidence</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5 text-right">View Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {analyses?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span>{item.title}</span>
                  </td>
                  <td className="p-3.5 font-mono text-cyan-400">{item.patientId}</td>
                  <td className="p-3.5"><Badge variant="default">{item.scanType}</Badge></td>
                  <td className="p-3.5 font-bold text-emerald-400">{(item.overallConfidence * 100).toFixed(1)}%</td>
                  <td className="p-3.5 text-slate-400">{formatDate(item.createdAt)}</td>
                  <td className="p-3.5 text-right">
                    <Link href={`/analysis/${item.id}`}>
                      <Button size="sm" variant="outline" className="text-[11px] h-7 gap-1">
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </Button>
                    </Link>
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
