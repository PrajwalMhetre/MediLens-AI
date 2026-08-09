'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/badge';
import { useReport, useAnalysis } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import {
  Printer,
  Share2,
  ArrowLeft,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: report, isLoading, isError } = useReport(resolvedParams.id);
  const { data: analysis } = useAnalysis(report?.analysisId || '');

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <Link href="/reports">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Reports List</span>
          </Button>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Report secure link copied to clipboard.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <Link href="/reports">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>All Reports</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {report.analysisId && (
            <Link href={`/analysis/${report.analysisId}`}>
              <Button variant="outline" size="sm" className="text-xs">
                View Scan Workspace
              </Button>
            </Link>
          )}

          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>

          <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Standardized Printable Clinical Document Box */}
      <Card className="border-slate-800 bg-slate-900/90 p-8 space-y-6 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Header Institution Brand */}
        <div className="flex items-center justify-between border-b border-slate-800 print:border-black pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
              <div className="h-full w-full bg-slate-950 print:bg-white rounded-[10px] flex items-center justify-center">
                <Activity className="h-6 w-6 text-cyan-400 print:text-black" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white print:text-black">Metropolitan University Health</h2>
              <p className="text-xs text-slate-400 print:text-slate-700">Department of Diagnostic Radiology & AI Intelligence</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="success" className="mb-1">{report.status}</Badge>
            <p className="text-[10px] text-slate-400 print:text-slate-600 font-mono">ID: {report.id}</p>
          </div>
        </div>

        {/* Patient & Exam Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 print:text-slate-700">Patient Reference</span>
            <p className="font-bold text-white print:text-black font-mono">{report.patientId}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 print:text-slate-700">Modality</span>
            <p className="font-semibold text-cyan-400 print:text-black">{report.scanType}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 print:text-slate-700">Exam Date</span>
            <p className="font-medium text-slate-200 print:text-black">{formatDate(report.date)}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 print:text-slate-700">Attending Radiologist</span>
            <p className="font-medium text-slate-200 print:text-black">{report.radiologistName}</p>
          </div>
        </div>

        {/* Summary Executive Overview */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-cyan-400 print:text-black uppercase tracking-wider">Clinical Summary</h3>
          <p className="text-xs leading-relaxed text-slate-200 print:text-black">{report.summary}</p>
        </div>

        {/* Diagnostic Impression */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 print:bg-slate-100 print:border-slate-300 space-y-1">
          <h3 className="font-bold text-xs text-cyan-400 print:text-black uppercase tracking-wider">Diagnostic Impression</h3>
          <p className="text-sm font-bold text-white print:text-black">{report.impression}</p>
        </div>

        {/* Detailed Findings Paragraphs */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-300 print:text-black uppercase tracking-wider">Detailed Anatomic Observations</h3>
          <pre className="text-xs font-sans text-slate-300 print:text-black leading-relaxed whitespace-pre-wrap">
            {report.detailedFindings}
          </pre>
        </div>

        {/* Recommendations List */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-300 print:text-black uppercase tracking-wider">Clinical Recommendations</h3>
          <ul className="list-disc list-inside text-xs text-slate-300 print:text-black space-y-1">
            {report.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Image Thumbnail Preview if available */}
        {analysis && (
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center gap-4">
            <div className="h-24 w-24 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
              <img src={analysis.imageUrl} alt="Scan Preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-slate-200 print:text-black">Attached AI Heatmap Snapshot</p>
              <p className="text-[11px] text-slate-400 print:text-slate-700">Model: {analysis.modelVersion}</p>
              <p className="text-[11px] text-cyan-400 print:text-black font-semibold">
                Grad-CAM Confidence Score: {(analysis.overallConfidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {/* Signature Block */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 flex justify-between items-end">
          <div className="space-y-1 text-xs text-slate-400 print:text-slate-700">
            <p>Signed electronically by:</p>
            <p className="font-bold text-white print:text-black">{report.radiologistName}</p>
            <p className="text-[10px] font-mono">{new Date(report.date).toUTCString()}</p>
          </div>
          <div className="h-12 w-32 border-b border-slate-700 print:border-black flex items-center justify-center">
            <span className="font-serif italic text-cyan-400 print:text-black text-sm">S. Jenkins MD</span>
          </div>
        </div>

        {/* Non-Diagnostic Disclaimer */}
        <p className="text-[9px] text-slate-500 print:text-slate-600 pt-4 text-center">
          {report.disclaimer}
        </p>
      </Card>
    </div>
  );
}
