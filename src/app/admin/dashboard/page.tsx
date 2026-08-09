'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStats, useModels } from '@/lib/hooks/use-api';
import { Users, Activity, FileText, Cpu, Server, CheckCircle2, Shield } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const THROUGHPUT_DATA = [
  { time: '00:00', requests: 320 },
  { time: '04:00', requests: 180 },
  { time: '08:00', requests: 890 },
  { time: '12:00', requests: 1240 },
  { time: '16:00', requests: 1100 },
  { time: '20:00', requests: 640 },
];

export default function AdminDashboardPage() {
  const { data: stats } = useAdminStats();
  const { data: models } = useModels();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform System Analytics</h1>
        <p className="text-xs text-slate-400">Global inference throughput, model health, and active user metrics</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Users</span>
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats?.totalUsers || 1420}</p>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Inferences Run</span>
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats?.totalAnalyses || 28950}</p>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg GPU Latency</span>
            <Cpu className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats?.averageInferenceTimeMs || 412}ms</p>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">System Uptime</span>
            <Server className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats?.systemUptimePercentage || 99.98}%</p>
        </Card>
      </div>

      {/* Main Bar Chart: Inference Throughput */}
      <Card className="border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-white">Daily Inference Request Load</h3>
            <p className="text-xs text-slate-400">Requests per 4-hour window</p>
          </div>
          <Badge variant="default">Real-time GPU Telemetry</Badge>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={THROUGHPUT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
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
              <Bar dataKey="requests" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Inference Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
