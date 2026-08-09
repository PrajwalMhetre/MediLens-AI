'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { LandingFooter } from '@/components/layout/LandingFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Activity,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  Layers,
  FileText,
  Bot,
  Zap,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Cpu,
  Brain,
  Stethoscope,
} from 'lucide-react';
import { MOCK_CHEST_XRAY_SVG } from '@/lib/mocks/data';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'original' | 'heatmap' | 'overlay'>('overlay');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does MediLens AI generate heatmaps for medical images?',
      a: 'MediLens AI utilizes Grad-CAM (Gradient-weighted Class Activation Mapping) architectures to visualize spatial attention maps. This highlights exact pixels and regions that influenced the model prediction score.',
    },
    {
      q: 'Does MediLens AI replace radiologist diagnoses?',
      a: 'No. MediLens AI is designed strictly as a clinical decision-support and triage tool for radiologists, physicians, and medical researchers. Every output requires expert medical verification.',
    },
    {
      q: 'What imaging modalities are supported in the platform?',
      a: 'The system currently supports Chest Radiographs (X-Ray), Brain T1/T2/FLAIR MRIs, Knee Musculoskeletal MRIs, and Thyroid Ultrasounds.',
    },
    {
      q: 'How is patient medical data protected?',
      a: 'Data handling follows strict client-side encryption and synthetic data obfuscation protocols. All sample images in this demo are fully synthetic.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glowing Background Radial */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="accent" className="mb-6 px-4 py-1.5 text-xs gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Medical Imaging Intelligence</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Understand Medical Images with <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Explainable AI</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Accelerate clinical radiology workflows, extract quantitative neural heatmaps, and generate standardized diagnostic reports with confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/analysis/new">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Activity className="h-5 w-5" />
                <span>Analyze a Scan</span>
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <span>Explore Interactive Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Key Metrics Pill Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">96.4%</p>
              <p className="text-xs text-slate-400 font-medium">Model AUROC Accuracy</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400">&lt; 450ms</p>
              <p className="text-xs text-slate-400 font-medium">Inference Speed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">4 Modalities</p>
              <p className="text-xs text-slate-400 font-medium">X-Ray, MRI, CT, Echo</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Grad-CAM Explainability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold">Interactive Radiologist Workspace</h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">Real-time neural overlay, findings inspection, and decision support.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Viewer Left */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-cyan-400">Scan ID: PT-88392</span>
                  <span className="text-slate-500">•</span>
                  <span>Chest X-Ray</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('original')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === 'original' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === 'heatmap' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
                  >
                    Heatmap
                  </button>
                  <button
                    onClick={() => setActiveTab('overlay')}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === 'overlay' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
                  >
                    Overlay
                  </button>
                </div>
              </div>

              {/* Image Canvas Box */}
              <div className="relative h-80 sm:h-[420px] rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group">
                <img
                  src={MOCK_CHEST_XRAY_SVG}
                  alt="Medical Scan"
                  className="w-full h-full object-contain"
                />

                {/* Heatmap Overlay Simulation */}
                {(activeTab === 'heatmap' || activeTab === 'overlay') && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-gradient-to-r from-rose-500/60 via-amber-500/50 to-cyan-500/40 blur-xl animate-pulse-glow translate-x-20 translate-y-12" />
                  </div>
                )}
              </div>
            </div>

            {/* AI Findings Right Panel */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Primary Prediction</span>
                    <Badge variant="warning">91.4% Confidence</Badge>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm sm:text-base">Right Lower Lobe Focal Opacity</h4>
                  <p className="text-xs text-slate-400 mt-1">High spatial attention density corresponding to lower lobe consolidation.</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detailed Findings</span>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Focal Airway Consolidation</span>
                      <span className="text-amber-400 font-bold">Moderate</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Silhouetting of the right hemidiaphragm margin.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">Cardiothoracic Ratio</span>
                      <span className="text-emerald-400 font-bold">Normal</span>
                    </div>
                    <p className="text-[11px] text-slate-400">CTR measured at 0.46 (&lt;0.50).</p>
                  </div>
                </div>
              </div>

              <Link href="/analysis/scan-cxr-9021" className="block">
                <Button className="w-full gap-2">
                  <span>Open Full Analysis Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-3">Workflow</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold">How MediLens AI Works</h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">Four intuitive steps from image ingestion to finalized clinical reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload Image',
              desc: 'Drag & drop DICOM, JPG, PNG, or WEBP medical scans securely into the browser.',
              icon: Activity,
            },
            {
              step: '02',
              title: 'AI Neural Inference',
              desc: 'Deep convolutional networks evaluate spatial features and compute probability distributions.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Explainable Heatmaps',
              desc: 'Inspect Grad-CAM heatmaps, bounding boxes, and quantitative confidence scores.',
              icon: Eye,
            },
            {
              step: '04',
              title: 'Generate Clinical Report',
              desc: 'Export standardized, structured PDF summary reports ready for radiologist review.',
              icon: FileText,
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 relative border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-colors">
              <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-800 absolute top-4 right-4">{item.step}</span>
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-100 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm mt-2">Learn more about our architecture, privacy, and clinical decision support.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-semibold text-sm sm:text-base text-slate-200">
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4 text-cyan-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 relative overflow-hidden text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold">Ready to Explore MediLens AI?</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Experience our complete interview-ready application frontend directly in your browser.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                <span>Launch Demo Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
