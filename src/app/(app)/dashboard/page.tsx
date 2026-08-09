'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/badge';
import { useAnalyses, useReports, useUserProfile, useAdminStats } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import {
  Activity,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CHART_DATA = [
  { day: 'Mon', analyses: 24, reports: 18 },
  { day: 'Tue', analyses: 36, reports: 29 },
  { day: 'Wed', analyses: 42, reports: 35 },
  { day: 'Thu', analyses: 51, reports: 44 },
  { day: 'Fri', analyses: 68, reports: 59 },
  { day: 'Sat', analyses: 30, reports: 22 },
  { day: 'Sun', analyses: 28, reports: 24 },
];

export default function DashboardPage() {
  const { data: user } = useUserProfile();
  const { data: analyses, isLoading: loadingAnalyses } = useAnalyses();
  const { data: reports, isLoading: loadingReports } = useReports();
  const { data: adminStats } = useAdminStats();

  const completedCount = analyses?.filter((a) => a.status === 'Completed').length || 0;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="accent" className="gap-1.5 px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Imaging Suite Active</span>
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Dr. Elena Rostova'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              System operating with 99.98% uptime. 4 AI deep learning inference models ready for radiologist feature extraction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/analysis/new">
              <Button size="lg" className="gap-2 shadow-lg shadow-cyan-500/20">
                <Upload className="h-5 w-5" />
                <span>Analyze New Scan</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Scans Analyzed</span>
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{analyses?.length || 4}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18.4% from last week</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completed Reports</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{reports?.length || 2}</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Standardized PDF Ready</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Inference Speed</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{adminStats?.averageInferenceTimeMs || 412}ms</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
              <span>GPU TensorRT Accelerated</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Primary AI Accuracy</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">96.4%</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <span>AUROC 0.982 (CXR model)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Chart & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Area */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Weekly Analysis Activity</h3>
              <p className="text-xs text-slate-400">Volume of uploaded scans vs generated reports</p>
            </div>
            <Badge variant="default">7 Days</Badge>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Area type="monotone" dataKey="analyses" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorAnalyses)" name="Scans Uploaded" />
                <Area type="monotone" dataKey="reports" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" name="Reports Finalized" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Model Status Card */}
        <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <span>AI Model Pipeline</span>
              </h3>
              <Badge variant="success" className="text-[10px]">Operational</Badge>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { name: 'MediVision-CXR', type: 'Chest X-Ray', acc: '96.4%', status: 'Active' },
                { name: 'NeuroLens-MRI', type: 'Brain MRI', acc: '94.8%', status: 'Active' },
                { name: 'OrthoScan-AI', type: 'Knee MRI', acc: '93.2%', status: 'Active' },
                { name: 'UltraEcho-Thyroid', type: 'Ultrasound', acc: '91.5%', status: 'Beta' },
              ].map((m, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-cyan-400">{m.acc}</span>
                    <span className="block text-[9px] text-emerald-400">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/assistant" className="block pt-2">
            <Button variant="outline" className="w-full gap-2 text-xs">
              <Bot className="h-4 w-4 text-purple-400" />
              <span>Ask Medical Assistant</span>
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Analyses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Analyses</h2>
            <p className="text-xs text-slate-400">Latest medical scan interpretations</p>
          </div>
          <Link href="/history">
            <Button variant="ghost" className="text-xs gap-1">
              <span>View All History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {loadingAnalyses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses?.map((item) => (
              <Card key={item.id} className="border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 transition-colors p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={item.scanType === 'Chest X-Ray' ? 'default' : 'secondary'}>
                      {item.scanType}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="h-16 w-16 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-slate-100 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.patientId}</p>
                      <p className="text-[11px] text-cyan-400 font-semibold mt-1 truncate">
                        {(item.overallConfidence * 100).toFixed(1)}% confidence
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-3">
                  <span className="text-[11px] text-slate-400">{item.findings.length} findings</span>
                  <Link href={`/analysis/${item.id}`}>
                    <Button size="sm" variant="outline" className="text-xs py-1 h-7">
                      Open Workspace
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
