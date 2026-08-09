'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/badge';
import { useAnalysis, useGenerateReport } from '@/lib/hooks/use-api';
import { formatDate } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Sliders,
  Eye,
  Layers,
  FileText,
  Bot,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowLeft,
  Share2,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalysisResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: analysis, isLoading, isError } = useAnalysis(resolvedParams.id);
  const generateReportMutation = useGenerateReport();

  // Viewer State
  const [tab, setTab] = useState<'original' | 'heatmap' | 'overlay'>('overlay');
  const [zoom, setZoom] = useState(1);
  const [opacity, setOpacity] = useState(70);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Scan Not Found</h2>
        <p className="text-xs text-slate-400">The requested analysis ID could not be loaded.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    );
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetViewer = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(100);
    setOpacity(70);
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const report = await generateReportMutation.mutateAsync(analysis.id);
      toast.success('Clinical report generated successfully!');
      router.push(`/reports/${report.id}`);
    } catch (err) {
      toast.error('Failed to generate report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-slate-400">
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{analysis.title}</h1>
            <Badge variant={analysis.scanType === 'Chest X-Ray' ? 'default' : 'secondary'}>
              {analysis.scanType}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Patient: <span className="text-white font-mono">{analysis.patientId}</span> • Analyzed {formatDate(analysis.createdAt)} • Pipeline: {analysis.modelVersion}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="gap-2 text-xs"
          >
            <FileText className="h-4 w-4 text-purple-400" />
            <span>{generatingReport ? 'Generating Report...' : 'Generate Report'}</span>
          </Button>

          <Link href="/assistant">
            <Button size="sm" className="gap-2 text-xs">
              <Bot className="h-4 w-4" />
              <span>Ask Assistant</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Workspace Grid: Left Viewer, Right Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Interactive Medical Imaging Viewer */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-950 p-4 space-y-4 flex flex-col justify-between">
          {/* Viewer Toolbar Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setTab('original')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${tab === 'original' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              >
                Original
              </button>
              <button
                onClick={() => setTab('heatmap')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${tab === 'heatmap' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              >
                AI Heatmap
              </button>
              <button
                onClick={() => setTab('overlay')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${tab === 'overlay' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
              >
                Overlay
              </button>
            </div>

            {/* Canvas Zoom & Pan Actions */}
            <div className="flex items-center gap-1 text-slate-400">
              <button onClick={handleZoomIn} className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button onClick={handleZoomOut} className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button onClick={handleResetViewer} className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="Reset Viewer">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="Fullscreen">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interactive Image Canvas Box */}
          <div
            className={`relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
              isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 border-cyan-500/50' : 'h-[460px]'
            }`}
          >
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoom})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            >
              <img
                src={analysis.imageUrl}
                alt="Medical Image"
                className="max-h-[440px] w-auto object-contain select-none"
              />

              {/* Heatmap Layer */}
              {(tab === 'heatmap' || tab === 'overlay') && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: opacity / 100 }}
                >
                  {analysis.heatmapData.hotspots.map((spot, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-gradient-to-r from-rose-500/80 via-amber-500/60 to-cyan-500/50 blur-lg animate-pulse-glow"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        width: `${spot.radius * 1.8}px`,
                        height: `${spot.radius * 1.8}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Bounding Box Highlights */}
              {showBoxes &&
                analysis.findings.map(
                  (f) =>
                    f.boundingBox && (
                      <div
                        key={f.id}
                        className="absolute border-2 border-amber-400 bg-amber-400/10 rounded-md pointer-events-none transition-all"
                        style={{
                          left: `${f.boundingBox.x}%`,
                          top: `${f.boundingBox.y}%`,
                          width: `${f.boundingBox.width}%`,
                          height: `${f.boundingBox.height}%`,
                        }}
                      >
                        <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[9px] whitespace-nowrap shadow">
                          {f.name} ({(f.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )
                )}
            </div>

            {/* Exit Fullscreen button if active */}
            {isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 z-50 bg-slate-900"
              >
                Exit Fullscreen
              </Button>
            )}
          </div>

          {/* Viewer Slider Controls (Opacity, Brightness, Contrast) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Heatmap Opacity</span>
                <span className="text-cyan-400 font-semibold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Brightness</span>
                <span className="text-slate-200 font-semibold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Contrast</span>
                <span className="text-slate-200 font-semibold">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </Card>

        {/* RIGHT COLUMN: AI Findings & Explainability Panel */}
        <div className="space-y-6">
          {/* Primary Summary Box */}
          <Card className="border-amber-500/30 bg-slate-900/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Overall AI Assessment</span>
              <Badge variant="warning">
                {(analysis.overallConfidence * 100).toFixed(1)}% Confidence
              </Badge>
            </div>
            <h3 className="text-base font-extrabold text-white">{analysis.overallPrediction}</h3>

            {/* Prediction Probability Distribution */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400">Probability Distribution</span>
              {analysis.predictionDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-cyan-400 font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Finding Cards List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Clinical Findings</h4>
            {analysis.findings.map((f) => (
              <Card key={f.id} className="border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-slate-100">{f.name}</h5>
                  <Badge
                    variant={
                      f.severity === 'Normal'
                        ? 'success'
                        : f.severity === 'Moderate'
                        ? 'warning'
                        : 'destructive'
                    }
                  >
                    {f.severity}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 font-medium">Location: {f.location}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{f.explanation}</p>
                <p className="text-[11px] text-cyan-300/90 pt-1 border-t border-slate-800/60">
                  <strong>Clinical Significance:</strong> {f.clinicalSignificance}
                </p>
              </Card>
            ))}
          </div>

          {/* Explainable AI Note */}
          <Card className="border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
            <h5 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              How this prediction was generated
            </h5>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Spatial feature maps extracted from the final convolutional layer of <span className="font-mono text-purple-300">{analysis.modelVersion}</span> using Grad-CAM. High intensity pixels correlate to increased diagnostic probability.
            </p>
          </Card>

          {/* Non-Diagnostic Disclaimer */}
          <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-2 text-[10px] text-amber-300/80 leading-relaxed">
            <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>This AI-assisted result is for decision support/demonstration purposes and does NOT replace licensed medical radiologist diagnosis.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
