import React from 'react';
import Link from 'next/link';
import { Activity, ShieldAlert, Heart, Globe, Share2, ExternalLink } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
                <div className="h-full w-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Activity className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">MediLens AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Next-generation medical image analysis & quantitative health intelligence platform powered by explainable deep learning models.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors" title="Global Network">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors" title="Share">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors" title="Portal">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard Overview</Link></li>
              <li><Link href="/analysis/new" className="hover:text-cyan-400 transition-colors">New Image Scan</Link></li>
              <li><Link href="/reports" className="hover:text-cyan-400 transition-colors">Clinical Reports</Link></li>
              <li><Link href="/assistant" className="hover:text-cyan-400 transition-colors">AI Knowledge Assistant</Link></li>
              <li><Link href="/drug-scanner" className="hover:text-cyan-400 transition-colors">Pharmaceutical Label OCR</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 mb-4">Supported Modalities</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-400">Chest Radiographs (X-Ray)</span></li>
              <li><span className="text-slate-400">Brain T1/T2/FLAIR MRI</span></li>
              <li><span className="text-slate-400">Knee Articular MRI</span></li>
              <li><span className="text-slate-400">Thyroid Ultrasound</span></li>
              <li><span className="text-slate-400">Mammography Screening</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-200 mb-4">Admin & Governance</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/admin/dashboard" className="hover:text-cyan-400 transition-colors">Admin Console</Link></li>
              <li><Link href="/admin/models" className="hover:text-cyan-400 transition-colors">Model Metrics & AUROC</Link></li>
              <li><Link href="/settings" className="hover:text-cyan-400 transition-colors">Data Privacy Guidelines</Link></li>
              <li><Link href="/settings" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start gap-3 mb-8">
          <ShieldAlert className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/90 leading-relaxed">
            <strong>Portfolio & Demonstration Disclaimer:</strong> MediLens AI is an artificial intelligence prototype designed for technical demonstration, portfolio showcasing, and decision-support simulation. It does NOT provide certified medical diagnoses and must not replace professional clinical evaluation.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediLens AI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted for high performance & clean UX.
          </p>
        </div>
      </div>
    </footer>
  );
}
