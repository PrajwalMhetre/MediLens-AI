'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useModels } from '@/lib/hooks/use-api';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminModelsPage() {
  const { data: models } = useModels();

  const handleRetrain = (modelName: string) => {
    toast.info(`Triggered synthetic dataset retraining cycle for ${modelName}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>AI Model Registry & Performance Metrics</span>
          </h1>
          <p className="text-xs text-slate-400">Deep learning model versions, AUROC evaluation, sensitivity & specificity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models?.map((model) => (
          <Card key={model.id} className="border-slate-800 bg-slate-900/90 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">{model.name}</h3>
                    <Badge variant="accent">{model.version}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Modality: <span className="text-cyan-400 font-semibold">{model.scanType}</span></p>
                </div>
                <Badge variant={model.status === 'Active' ? 'success' : 'warning'}>{model.status}</Badge>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
                  <p className="text-lg font-bold text-white mt-0.5">{model.accuracy}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sensitivity</span>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5">{model.sensitivity}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Specificity</span>
                  <p className="text-lg font-bold text-purple-400 mt-0.5">{model.specificity}%</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">AUROC</span>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">{model.auroc}</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <p>Total Inferences Executed: <strong className="text-white">{model.totalInferences.toLocaleString()}</strong></p>
                <p>Last Evaluation Benchmark: <strong className="text-slate-300">{model.lastUpdated}</strong></p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">TensorRT Floating-Point 16</span>
              <Button size="sm" variant="outline" onClick={() => handleRetrain(model.name)} className="gap-1 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Re-Benchmark</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
