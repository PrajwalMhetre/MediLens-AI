export type ScanType = 'Chest X-Ray' | 'Brain MRI' | 'Knee MRI' | 'Thyroid Ultrasound' | 'Mammogram' | 'CT Scan';
export type BodyRegion = 'Chest' | 'Brain' | 'Knee' | 'Neck' | 'Breast' | 'Abdomen';
export type SeverityLevel = 'Normal' | 'Low' | 'Moderate' | 'High' | 'Critical';
export type AnalysisStatus = 'Uploading' | 'Processing' | 'Completed' | 'Failed';
export type ReportStatus = 'Draft' | 'Finalized' | 'Archived';

export interface Finding {
  id: string;
  name: string;
  confidence: number; // e.g. 0.914 = 91.4%
  severity: SeverityLevel;
  location: string;
  explanation: string;
  clinicalSignificance: string;
  boundingBox?: {
    x: number; // percentage 0-100
    y: number;
    width: number;
    height: number;
  };
}

export interface HeatmapData {
  hotspots: Array<{
    x: number; // percentage
    y: number;
    radius: number;
    intensity: number; // 0-1
    label: string;
  }>;
}

export interface AnalysisItem {
  id: string;
  title: string;
  patientId: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  scanType: ScanType;
  bodyRegion: BodyRegion;
  status: AnalysisStatus;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  thumbnailUrl: string;
  overallPrediction: string;
  overallConfidence: number;
  findings: Finding[];
  predictionDistribution: Array<{
    label: string;
    percentage: number;
  }>;
  heatmapData: HeatmapData;
  modelVersion: string;
  notes?: string;
  recommendations: string[];
}

export interface ReportItem {
  id: string;
  analysisId: string;
  title: string;
  patientId: string;
  scanType: ScanType;
  date: string;
  status: ReportStatus;
  radiologistName: string;
  summary: string;
  detailedFindings: string;
  impression: string;
  recommendations: string[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    title: string;
    url?: string;
    snippet: string;
  }>;
  relatedFindings?: string[];
}

export interface DrugInfo {
  id: string;
  name: string;
  genericName: string;
  category: string;
  imageUrl: string;
  commonUses: string[];
  dosageGuidelines: string;
  warnings: string[];
  sideEffects: string[];
  interactions: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Radiologist' | 'Physician' | 'Medical Student' | 'Administrator';
  hospital: string;
  avatarUrl: string;
  memberSince: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  totalReports: number;
  activeModels: number;
  averageInferenceTimeMs: number;
  systemUptimePercentage: number;
}

export interface ModelMetric {
  id: string;
  name: string;
  version: string;
  scanType: ScanType;
  status: 'Active' | 'Beta' | 'Deprecated';
  accuracy: number;
  sensitivity: number;
  specificity: number;
  auroc: number;
  totalInferences: number;
  lastUpdated: string;
}
