'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreateAnalysis } from '@/lib/hooks/use-api';
import { ScanType, BodyRegion } from '@/types';
import {
  Upload,
  FileCheck,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Activity,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  MOCK_CHEST_XRAY_SVG,
  MOCK_BRAIN_MRI_SVG,
  MOCK_KNEE_MRI_SVG,
  MOCK_ULTRASOUND_SVG,
} from '@/lib/mocks/data';

export default function NewAnalysisPage() {
  const router = useRouter();
  const createAnalysisMutation = useCreateAnalysis();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('Chest X-Ray');
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<BodyRegion>('Chest');
  const [patientId, setPatientId] = useState(`PT-${Math.floor(10000 + Math.random() * 90000)}`);
  const [patientAge, setPatientAge] = useState<number>(54);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [imagePreview, setImagePreview] = useState<string>(MOCK_CHEST_XRAY_SVG);

  // Step 4 Simulation State
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('Uploading scan data...');

  // Sample Scans Picker
  const sampleScans = [
    { title: 'Chest Radiograph (X-Ray)', type: 'Chest X-Ray' as ScanType, region: 'Chest' as BodyRegion, img: MOCK_CHEST_XRAY_SVG },
    { title: 'Brain MRI (T2/FLAIR)', type: 'Brain MRI' as ScanType, region: 'Brain' as BodyRegion, img: MOCK_BRAIN_MRI_SVG },
    { title: 'Knee MRI (Sagittal)', type: 'Knee MRI' as ScanType, region: 'Knee' as BodyRegion, img: MOCK_KNEE_MRI_SVG },
    { title: 'Thyroid Ultrasound', type: 'Thyroid Ultrasound' as ScanType, region: 'Neck' as BodyRegion, img: MOCK_ULTRASOUND_SVG },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error('File size exceeds 25MB demo limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast.success(`Loaded file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleScan = (sample: typeof sampleScans[0]) => {
    setSelectedScanType(sample.type);
    setSelectedBodyRegion(sample.region);
    setImagePreview(sample.img);
    toast.info(`Selected ${sample.title} demo scan.`);
  };

  const startAnalysis = async () => {
    setStep(4);
    setProgress(15);
    setProcessingStage('Uploading image matrix...');

    setTimeout(() => {
      setProgress(40);
      setProcessingStage('Pre-processing normalization & contrast adjustment...');
    }, 800);

    setTimeout(() => {
      setProgress(70);
      setProcessingStage('Running MediVision CNN inference tensor pipeline...');
    }, 1600);

    setTimeout(() => {
      setProgress(90);
      setProcessingStage('Computing Grad-CAM explainability heatmaps...');
    }, 2400);

    setTimeout(async () => {
      setProgress(100);
      setProcessingStage('Finalizing findings & clinical summary...');

      const result = await createAnalysisMutation.mutateAsync({
        title: `${selectedScanType} Assessment`,
        patientId,
        patientAge,
        patientGender,
        scanType: selectedScanType,
        bodyRegion: selectedBodyRegion,
        imageUrl: imagePreview,
      });

      toast.success('AI Analysis Completed!');
      router.push(`/analysis/${result.id}`);
    }, 3200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      {/* Step Progress Tracker Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">New Medical Image Analysis</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 4 • AI Feature Extraction Workflow</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s
                  ? 'bg-cyan-500 text-white'
                  : step > s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload Image */}
      {step === 1 && (
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white">Select or Upload Medical Image</h3>
            <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP, DICOM demo viewer.</p>
          </div>

          {/* Drag and Drop Zone */}
          <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/40">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">Click to browse or drag image here</p>
            <p className="text-xs text-slate-500 mt-1">Maximum recommended resolution 4096x4096px (25MB)</p>
          </label>

          {/* Quick Preset Sample Scans */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or Select Preset Demo Scan</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sampleScans.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSampleScan(sample)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedScanType === sample.type
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="h-16 rounded-lg bg-slate-900 mb-2 overflow-hidden border border-slate-800">
                    <img src={sample.img} alt={sample.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold truncate">{sample.title}</p>
                  <p className="text-[10px] text-slate-500">{sample.region}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button onClick={() => setStep(2)} className="gap-2">
              <span>Next: Scan Information</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Scan Information */}
      {step === 2 && (
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white">Scan & Patient Information</h3>
            <p className="text-xs text-slate-400">Specify modality metadata for accurate model routing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Imaging Modality</label>
              <select
                value={selectedScanType}
                onChange={(e) => setSelectedScanType(e.target.value as ScanType)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Chest X-Ray">Chest X-Ray (Frontal/PA)</option>
                <option value="Brain MRI">Brain MRI (Axial T2/FLAIR)</option>
                <option value="Knee MRI">Knee MRI (Sagittal PD Fat-Sat)</option>
                <option value="Thyroid Ultrasound">Thyroid Ultrasound</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Target Body Region</label>
              <select
                value={selectedBodyRegion}
                onChange={(e) => setSelectedBodyRegion(e.target.value as BodyRegion)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Chest">Chest / Thorax</option>
                <option value="Brain">Brain / Head</option>
                <option value="Knee">Knee / Joint</option>
                <option value="Neck">Neck / Thyroid</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Patient Identifier Code</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Patient Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button onClick={() => setStep(3)} className="gap-2">
              <span>Review Scan Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Review */}
      {step === 3 && (
        <Card className="border-slate-800 bg-slate-900/90 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-white">Review Before AI Processing</h3>
            <p className="text-xs text-slate-400">Confirm image data and target inference pipeline parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
              <img src={imagePreview} alt="Selected Scan" className="w-full h-full object-contain" />
            </div>

            {/* Summary Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-slate-400">Modality: <strong className="text-white">{selectedScanType}</strong></p>
                <p className="text-slate-400">Region: <strong className="text-white">{selectedBodyRegion}</strong></p>
                <p className="text-slate-400">Patient ID: <strong className="text-white">{patientId}</strong></p>
                <p className="text-slate-400">Demographics: <strong className="text-white">{patientAge} yrs, {patientGender}</strong></p>
              </div>

              <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Target Pipeline Model
                </p>
                MediVision Deep Convolutional Ensemble (Grad-CAM Explainability Enabled).
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button onClick={startAnalysis} className="gap-2">
              <Cpu className="h-4 w-4" />
              <span>Run AI Analysis Now</span>
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Animated AI Processing */}
      {step === 4 && (
        <Card className="border-slate-800 bg-slate-900/90 p-8 text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="h-full w-full rounded-full flex items-center justify-center text-cyan-400">
              <Cpu className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-bold text-xl text-white">Processing Scan with AI</h3>
            <p className="text-xs text-cyan-400 font-semibold">{processingStage}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-1">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 text-right">{progress}%</p>
          </div>
        </Card>
      )}
    </div>
  );
}
