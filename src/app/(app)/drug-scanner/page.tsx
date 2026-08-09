'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDrugs, useScanDrug } from '@/lib/hooks/use-api';
import { DrugInfo } from '@/types';
import { Pill, Upload, Scan, AlertTriangle, ShieldCheck, CheckCircle2, Sparkles, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function DrugScannerPage() {
  const { data: drugs } = useDrugs();
  const scanDrugMutation = useScanDrug();

  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(drugs ? drugs[0] : null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleSimulateScan = async (drugPreset?: DrugInfo) => {
    setScanning(true);
    setScanProgress(20);

    setTimeout(() => setScanProgress(55), 400);
    setTimeout(() => setScanProgress(85), 800);

    setTimeout(() => {
      setScanProgress(100);
      setScanning(false);
      const matched = drugPreset || (drugs ? drugs[Math.floor(Math.random() * drugs.length)] : null);
      setSelectedDrug(matched);
      toast.success(`OCR Scan Complete: Detected ${matched?.name || 'Medication'}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Pill className="h-6 w-6 text-cyan-400" />
          <span>Pharmaceutical OCR & Drug Scanner</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Extract medicine labels, dosage guidelines, warnings, and drug-drug interaction profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Uploader & Presets */}
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Scan className="h-4 w-4 text-cyan-400" />
              <span>Scan Medicine Label</span>
            </h3>

            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/40">
              <Upload className="h-8 w-8 text-cyan-400 mb-2" />
              <p className="text-xs font-semibold text-white">Upload Pill Bottle / Packaging Image</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Automated OCR extraction</p>
              <input type="file" accept="image/*" onChange={() => handleSimulateScan()} className="hidden" />
            </label>

            {scanning && (
              <div className="space-y-2 text-center pt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 font-semibold">
                  <Scan className="h-4 w-4 animate-spin" />
                  <span>OCR Scanning Label Text... ({scanProgress}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}
          </Card>

          {/* Quick Presets List */}
          <Card className="border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Pharmaceutical Database</h4>
            <div className="space-y-2">
              {drugs?.map((drug) => (
                <div
                  key={drug.id}
                  onClick={() => handleSimulateScan(drug)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDrug?.id === drug.id
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs">{drug.name}</p>
                  <p className="text-[10px] text-slate-500">{drug.genericName} • {drug.category}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Detected Drug Information Display */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDrug ? (
            <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-6">
              {/* Drug Title Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-white">{selectedDrug.name}</h2>
                    <Badge variant="accent">{selectedDrug.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Generic Name: <span className="text-cyan-400 font-semibold">{selectedDrug.genericName}</span></p>
                </div>
              </div>

              {/* Dosage Guidelines */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-1">
                <h4 className="font-bold text-xs text-cyan-400 uppercase tracking-wider">Standard Clinical Dosage</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedDrug.dosageGuidelines}</p>
              </div>

              {/* Common Uses */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Primary Clinical Indications</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedDrug.commonUses.map((use, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings Box */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Clinical Black-Box Warnings</h4>
                <div className="space-y-2">
                  {selectedDrug.warnings.map((warn, i) => (
                    <div key={i} className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 leading-relaxed flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Effects & Interactions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Side Effects */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Common Adverse Effects</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedDrug.sideEffects.map((effect, i) => (
                      <li key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        • {effect}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactions */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-rose-400 uppercase tracking-wider">Drug-Drug Interactions</h4>
                  <ul className="space-y-1.5 text-xs text-rose-300/90">
                    {selectedDrug.interactions.map((inter, i) => (
                      <li key={i} className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/30">
                        ⚠️ {inter}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center border-slate-800 bg-slate-900/60 space-y-3">
              <Pill className="h-10 w-10 text-slate-500 mx-auto" />
              <p className="font-semibold text-sm text-slate-300">No Medication Selected</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
